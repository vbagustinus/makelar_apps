import { create } from 'zustand';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage, { listAll } from '@react-native-firebase/storage';
import { Alert, Platform } from 'react-native';
import ImageResizer from 'react-native-image-resizer';

const API_BASE = 'https://www.emsifa.com/api-wilayah-indonesia/api';

const PAGE_SIZE = 10;
const COLLECTION_NAME = 'properties'; // Nama koleksi di Firestore
// DIUBAH: Nama Koleksi Lokasi (Asumsi)
const LOCATION_COLLECTION = 'locations';

const initialState = {
  // --- List Properti User ---
  listProperty: [],
  listPropertyForSale: [],
  listPropertyForRent: [],
  listPropertyLoading: false,
  isFetchingMore: false,
  hasMoreProperty: true,
  lastVisible: null,

  // --- Status Global ---
  globalLoading: false,
  listPropertyError: null,
  savePropertySuccess: false,
  updatePropertySuccess: false,
  deletePropertySuccess: false,

  // --- Counts ---
  totalProperties: 0,
  totalForSale: 0,
  totalForRent: 0,
  totalPropertyError: null,
  totalPropertyLoading: false,
  latestProperties: [],
  latestPropertiesError: null,
  latestPropertiesLoading: false,
  listAllProperties: [],
  listAllPropertiesLoading: false,
  listAllPropertiesError: null,

  // --- Global Pagination States (Semua Properti) ---
  listGlobalProperties: [],
  listGlobalPropertiesLoading: false,
  listGlobalPropertiesError: null,
  globalHasMore: true,
  globalIsFetchingMore: false,
  globalLastVisible: null,

  // --- STATE BARU: Data Lokasi ---
  listProvinces: [],
  listCities: [],
  listDistricts: [],
  listVillages: [],
  locationLoading: false,
  locationError: null,
};

// Fungsi pembantu untuk mengompres dan mengunggah satu gambar
const uploadAndResizeImage = async imageUri => {
  const cleanedPath =
    Platform.OS === 'android' ? imageUri.replace('file://', '') : imageUri;

  // Kompresi Gambar
  const compressedImage = await ImageResizer.createResizedImage(
    cleanedPath,
    1000, // Lebar Maks
    1000, // Tinggi Maks
    'JPEG',
    80, // Kualitas
    0, // Rotasi
  );

  const fileName = `${Date.now()}_${compressedImage.uri.split('/').pop()}`;
  const storagePath = `properties/${fileName}`; // DIUBAH: Koleksi storage
  const reference = storage().ref(storagePath);

  // Unggah File
  await reference.putFile(compressedImage.uri.replace('file://', ''));

  // Dapatkan URL Unduh
  const downloadUrl = await reference.getDownloadURL();
  return downloadUrl;
};

// --- FUNGSI HELPER (deleteImagesFromStorage) ---
const deleteImagesFromStorage = async urls => {
  if (!urls || urls.length === 0) return;

  console.log('Attempting cleanup: deleting uploaded images.');

  const deletePromises = urls.map(url => {
    return new Promise<void>(async resolve => {
      try {
        const imageRef = storage().refFromURL(url);
        await imageRef.delete();
        console.log(`Cleanup success: ${url}`);
        resolve();
      } catch (error) {
        console.warn(`Cleanup failed for ${url}:`, error.message);
        resolve();
      }
    });
  });

  await Promise.all(deletePromises);
  console.log('Image cleanup completed.');
};

const sleep = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

const isDocExists = snapshot => {
  if (!snapshot) return false;
  if (typeof snapshot.exists === 'function') {
    return Boolean(snapshot.exists());
  }
  return Boolean(snapshot.exists);
};

const isSamePropertyId = (item, deletedDocId, requestedId) => {
  const normalize = value => String(value ?? '').trim();
  const itemIds = [
    normalize(item?.id),
    normalize(item?.firestoreId),
    normalize(item?.propertyId),
  ];
  const targets = [normalize(deletedDocId), normalize(requestedId)];
  return itemIds.some(id => id && targets.includes(id));
};

// =================================================================
// STORE UTAMA: usePropertyStore
// =================================================================
const usePropertyStore = create((set, get) => ({
  ...initialState,

  // =================================================================
  // --- ACTIONS BARU: FETCH DATA LOKASI ---
  // =================================================================

  // Mengambil daftar semua provinsi
  fetchProvinces: async () => {
    console.log('TERPANNGIL');

    set({
      locationLoading: true,
      locationError: null,
      listCities: [],
      listDistricts: [],
      listVillages: [],
    });
    try {
      const response = await fetch(`${API_BASE}/provinces.json`);
      console.log('response', response);

      if (!response.ok) throw new Error('Gagal mengambil data Provinsi.');

      const data = await response.json();

      const provinces = data.map(item => ({
        id: item.id,
        name: item.name,
        label: item.name,
        value: item.id, // ID Provinsi
      }));
      console.log('provinces', provinces);
      set({ listProvinces: provinces });
      console.log('Fetched provinces from Emsifa API.');
    } catch (error) {
      console.error('Error fetching provinces:', error);
      set({ locationError: error.message || 'Koneksi ke API Lokasi gagal.' });
    } finally {
      set({ locationLoading: false });
    }
  },

  // Mengambil daftar kota/kabupaten berdasarkan ID provinsi
  fetchCitiesByProvince: async provinceId => {
    const resolvedProvinceId =
      provinceId && typeof provinceId === 'object'
        ? provinceId.id || provinceId.value
        : provinceId;
    console.log('provinceId', resolvedProvinceId);

    if (!resolvedProvinceId) {
      set({ listCities: [] });
      return;
    }
    set({
      locationLoading: true,
      locationError: null,
      listCities: [],
      listDistricts: [],
      listVillages: [],
    });
    try {
      // Endpoint: /regencies/{provinceId}.json
      const response = await fetch(
        `${API_BASE}/regencies/${resolvedProvinceId}.json`,
      );
      if (!response.ok) throw new Error('Gagal mengambil data Kota/Kabupaten.');

      const data = await response.json();

      const cities = data.map(item => ({
        id: item.id,
        name: item.name,
        label: item.name,
        value: item.id, // ID Kota/Kabupaten
        province_id: item.province_id,
      }));
      console.log('cities', cities);

      set({ listCities: cities });
    } catch (error) {
      console.error('Error fetching cities:', error);
      set({ locationError: error.message || 'Koneksi ke API Lokasi gagal.' });
    } finally {
      set({ locationLoading: false });
    }
  },

  // Mengambil daftar kecamatan berdasarkan ID kota/kabupaten
  fetchDistrictsByCity: async cityId => {
    const resolvedCityId =
      cityId && typeof cityId === 'object' ? cityId.id || cityId.value : cityId;
    if (!resolvedCityId) {
      set({ listDistricts: [] });
      return;
    }
    set({
      locationLoading: true,
      locationError: null,
      listDistricts: [],
      listVillages: [],
    });
    try {
      // Endpoint: /districts/{cityId}.json
      const response = await fetch(
        `${API_BASE}/districts/${resolvedCityId}.json`,
      );
      if (!response.ok) throw new Error('Gagal mengambil data Kecamatan.');

      const data = await response.json();

      const districts = data.map(item => ({
        id: item.id,
        name: item.name,
        label: item.name,
        value: item.id, // ID Kecamatan
        regency_id: item.regency_id,
      }));

      console.log('listDistricts', districts);

      set({ listDistricts: districts });
    } catch (error) {
      console.error('Error fetching districts:', error);
      set({ locationError: error.message || 'Koneksi ke API Lokasi gagal.' });
    } finally {
      set({ locationLoading: false });
    }
  },

  // Mengambil daftar kelurahan/desa berdasarkan ID kecamatan
  fetchVillagesByDistrict: async districtId => {
    const resolvedDistrictId =
      districtId && typeof districtId === 'object'
        ? districtId.id || districtId.value
        : districtId;
    if (!resolvedDistrictId) {
      set({ listVillages: [] });
      return;
    }
    set({ locationLoading: true, locationError: null, listVillages: [] });
    try {
      // Endpoint: /villages/{districtId}.json
      const response = await fetch(
        `${API_BASE}/villages/${resolvedDistrictId}.json`,
      );
      if (!response.ok) throw new Error('Gagal mengambil data Kelurahan/Desa.');

      const data = await response.json();

      const villages = data.map(item => ({
        id: item.id,
        name: item.name,
        label: item.name,
        value: item.id, // ID Kelurahan/Desa
        district_id: item.district_id,
      }));

      set({ listVillages: villages });
    } catch (error) {
      console.error('Error fetching villages:', error);
      set({ locationError: error.message || 'Koneksi ke API Lokasi gagal.' });
    } finally {
      set({ locationLoading: false });
    }
  },

  // =================================================================
  // --- ACTIONS GLOBAL (SEMUA PROPERTI) ---
  // =================================================================

  fetchAllProperties: async (retryCount = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000 * Math.pow(2, retryCount);

    set({ listAllPropertiesLoading: true });
    try {
      const snapshot = await firestore()
        .collection(COLLECTION_NAME)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();

      const properties = snapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
        id: doc.id,
      })).filter(item => !item?.isDeleted);

      set({ listAllProperties: properties });
      console.log('Fetched all properties (5 global):', properties);
    } catch (error) {
      console.error('Error fetching all properties:', error);

      if (error.code === 'firestore/unavailable' && retryCount < MAX_RETRIES) {
        console.log(`Retrying fetchAllProperties... attempt ${retryCount + 1}`);
        setTimeout(() => get().fetchAllProperties(retryCount + 1), RETRY_DELAY);
      } else {
        set({ listAllPropertiesError: error.message });
      }
    } finally {
      set({ listAllPropertiesLoading: false });
    }
  },

  // fetchGlobalProperties, fetchMoreGlobalProperties
  // 🔥 Global pagination function (ambil semua properti, bukan hanya user)
  fetchGlobalProperties: async ({
    propertyTypeId = null,
    locationFilters = null,
  }) => {
    set({
      listGlobalPropertiesLoading: true,
      listGlobalPropertiesError: null,
      globalHasMore: true,
      globalLastVisible: null,
    });

    try {
      let query = firestore().collection(COLLECTION_NAME);

      if (propertyTypeId !== null) {
        query = query.where('propertyTypeId', '==', propertyTypeId);
      }

      if (locationFilters) {
        if (locationFilters.village?.id) {
          query = query.where('village.id', '==', locationFilters.village.id);
        } else if (locationFilters.district?.id) {
          query = query.where('district.id', '==', locationFilters.district.id);
        } else if (locationFilters.city?.id) {
          query = query.where('city.id', '==', locationFilters.city.id);
        } else if (locationFilters.province?.id) {
          query = query.where('province.id', '==', locationFilters.province.id);
        }
      }

      const snapshot = await query
        .orderBy('createdAt', 'desc')
        .limit(PAGE_SIZE)
        .get();

      const properties = snapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
        id: doc.id,
      })).filter(item => !item?.isDeleted);

      const newHasMore = properties.length === PAGE_SIZE;
      const newLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

      set({
        listGlobalProperties: properties,
        globalHasMore: newHasMore,
        globalLastVisible: newLastVisible,
      });
      console.log('Fetched global properties:', properties.length);
    } catch (error) {
      console.error('Error fetching global properties:', error);
      set({ listGlobalPropertiesError: error.message });
    } finally {
      set({ listGlobalPropertiesLoading: false });
    }
  },

  fetchMoreGlobalProperties: async ({
    propertyTypeId = null,
    locationFilters = null,
  }) => {
    const {
      globalHasMore,
      globalIsFetchingMore,
      globalLastVisible,
      listGlobalProperties,
    } = get();

    if (!globalHasMore || globalIsFetchingMore || !globalLastVisible) return;

    set({ globalIsFetchingMore: true });
    try {
      let query = firestore().collection(COLLECTION_NAME);

      if (propertyTypeId !== null) {
        query = query.where('propertyTypeId', '==', propertyTypeId);
      }

      if (locationFilters) {
        if (locationFilters.village?.id) {
          console.log('Filtering by village:', locationFilters.village.name);
          query = query.where('village.id', '==', locationFilters.village.id);
        } else if (locationFilters.district?.id) {
          console.log('Filtering by district:', locationFilters.district.name);
          query = query.where('district.id', '==', locationFilters.district.id);
        } else if (locationFilters.city?.id) {
          console.log('Filtering by city:', locationFilters.city.name);
          query = query.where('city.id', '==', locationFilters.city.id);
        } else if (locationFilters.province?.id) {
          console.log('Filtering by province:', locationFilters.province.name);
          query = query.where('province.id', '==', locationFilters.province.id);
        }
      }

      const snapshot = await query
        .orderBy('createdAt', 'desc')
        .startAfter(globalLastVisible)
        .limit(PAGE_SIZE)
        .get();

      const newProperties = snapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
        id: doc.id,
      })).filter(item => !item?.isDeleted);

      const combined = [...listGlobalProperties, ...newProperties];
      const newHasMore = newProperties.length === PAGE_SIZE;
      const newLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

      set({
        listGlobalProperties: combined,
        globalHasMore: newHasMore,
        globalLastVisible: newLastVisible,
      });

      console.log('Fetched more global properties:', newProperties);
    } catch (error) {
      console.error('Error fetching more global properties:', error);
      set({ listGlobalPropertiesError: error.message });
    } finally {
      set({ globalIsFetchingMore: false });
    }
  },

  // --- ACTIONS CRUD (USER TERTENTU) ---

  savePropertyData: async data => {
    console.log('Property data to save:', data);

    set({ savePropertySuccess: false, globalLoading: true });
    let allImageUrls: string[] = [];

    try {
      const authUid = auth().currentUser?.uid || null;
      const requiredFields = [
        'propertyTypeId',
        'propertyName',
        'statusId',
        'certificateTypeId',
        'images',
      ];

      const missingField = requiredFields.find(field => !data[field]);
      if (missingField) {
        set({ listPropertyError: `Field ${missingField} is required.` });
        return;
      }

      if (!Array.isArray(data.images) || data.images.length === 0) {
        set({ listPropertyError: 'Image array cannot be empty.' });
        return;
      }

      // 1. UNGGAH SEMUA GAMBAR
      const uploadPromises = data.images.map(imageUri =>
        uploadAndResizeImage(imageUri),
      );
      allImageUrls = await Promise.all(uploadPromises);
      const primaryImageUrl = allImageUrls[0];

      const dataToSave = { ...data };
      delete dataToSave.images;

      // 2. SIMPAN KE FIRESTORE
      const docRef = await firestore().collection(COLLECTION_NAME).add({
        ...dataToSave,
        uid: authUid || data.uid || null,
        propertyId: null,
        isDeleted: false,
        imageUrls: allImageUrls,
        imageUrl: primaryImageUrl,
        phoneNumber: data.phoneNumber || null,
        whatsapp: data.whatsapp || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      await docRef.update({ propertyId: docRef.id });

      set({ savePropertySuccess: true });
    } catch (error) {
      console.error('Error saving property data:', error);

      // ROLLBACK
      if (allImageUrls.length > 0) {
        console.log('Transaction failed. Initiating image cleanup...');
        await deleteImagesFromStorage(allImageUrls);
      }

      set({
        listPropertyError: error.message || 'Failed to save property data.',
      });
    } finally {
      set({ globalLoading: false });
    }
  },

  createDummyPropertyData: async () => {
    set({
      savePropertySuccess: false,
      globalLoading: true,
      listPropertyError: null,
    });

    try {
      const user = auth().currentUser;
      if (!user?.uid) {
        throw new Error('User belum login. Dummy data tidak bisa dibuat.');
      }

      const timestamp = Date.now();
      const dummyPayload = {
        uid: user.uid,
        propertyId: null,
        isDeleted: false,
        source: 'dummy-test',
        propertyTypeId: 1,
        propertyTypeName: 'Rumah',
        propertyName: `Dummy Properti ${timestamp}`,
        statusId: 1,
        certificateTypeId: 1,
        certificateTypeName: 'SHM',
        price: 1250000000,
        address: `Jl. Uji Simpan No. ${String(timestamp).slice(-4)}`,
        province: { id: '31', name: 'DKI Jakarta' },
        city: { id: '3171', name: 'Kota Jakarta Selatan' },
        district: { id: '3171020', name: 'Kebayoran Baru' },
        village: { id: '3171020001', name: 'Selong' },
        landArea: 120,
        buildingArea: 90,
        bedroom: 3,
        bathroom: 2,
        phoneNumber: user.phoneNumber || null,
        whatsapp: user.phoneNumber || null,
        imageUrls: [],
        imageUrl: null,
        description:
          'Data dummy untuk verifikasi insert Firestore dari aplikasi.',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await firestore().collection(COLLECTION_NAME).add(dummyPayload);
      await docRef.update({ propertyId: docRef.id });

      set({ savePropertySuccess: true });
      Alert.alert(
        'Dummy tersimpan',
        `Data dummy berhasil dibuat.\nDoc ID: ${docRef.id}`,
      );

      await get().fetchProperties();
      await get().fetchPropertyCounts();
    } catch (error) {
      console.error('Error creating dummy property:', error);
      const message = error?.message || 'Gagal membuat dummy property.';
      set({ listPropertyError: message });
      Alert.alert('Gagal', message);
    } finally {
      set({ globalLoading: false });
    }
  },

  updatePropertyData: async data => {
    set({ updatePropertySuccess: false, globalLoading: true });

    const {
      deletedImageUrls,
      finalImageArray,
      propertyId,
      images,
      ...restOfData
    } = data;

    let newlyUploadedUrls: string[] = [];
    let retainedImageUrls: string[] = [];
    let finalImageUrls: string[] = [];

    try {
      if (!propertyId) {
        throw new Error('Property ID tidak valid untuk proses update.');
      }

      // 1. PISAHKAN & UPLOAD GAMBAR BARU
      const newImageUris = finalImageArray.filter(
        uri => !uri.startsWith('http'),
      );
      retainedImageUrls = finalImageArray.filter(url => url.startsWith('http'));

      if (newImageUris.length > 0) {
        const uploadPromises = newImageUris.map(uri =>
          uploadAndResizeImage(uri),
        );
        newlyUploadedUrls = await Promise.all(uploadPromises);
        finalImageUrls = [...retainedImageUrls, ...newlyUploadedUrls];
      } else {
        finalImageUrls = retainedImageUrls;
      }

      // 2. HAPUS GAMBAR LAMA YANG DIBUANG (Cleanup)
      if (deletedImageUrls && deletedImageUrls.length > 0) {
        await deleteImagesFromStorage(deletedImageUrls);
      }

      // 3. UPDATE FIRESTORE
      await firestore()
        .collection(COLLECTION_NAME)
        .doc(propertyId)
        .update({
          ...restOfData,
          uid: auth().currentUser?.uid || data.uid || null,
          propertyId,
          isDeleted: false,
          phoneNumber: data.phoneNumber || null,
          whatsapp: data.whatsapp || null,
          imageUrls: finalImageUrls,
          imageUrl: finalImageUrls[0] || null,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      set({ updatePropertySuccess: true });
    } catch (error) {
      console.error('Error updating property data:', error);

      if (newlyUploadedUrls.length > 0) {
        console.log('Transaction failed. Initiating cleanup of NEW uploads...');
        await deleteImagesFromStorage(newlyUploadedUrls);
      }

      set({
        listPropertyError: error.message || 'Failed to update property data.',
      });
    } finally {
      set({ globalLoading: false });
    }
  },

  setPropertyStatus: async (propertyId, statusId) => {
    set({ updatePropertySuccess: false, globalLoading: true });

    try {
      await firestore().collection(COLLECTION_NAME).doc(propertyId).update({
        statusId: statusId,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      set({ updatePropertySuccess: true });
    } catch (error) {
      console.error('Error setting property status:', error);
      set({
        listPropertyError: error.message || 'Failed to update status.',
      });
    } finally {
      set({ globalLoading: false });
    }
  },

  deletePropertyData: async (propertyId, allImageUrls, propertyMeta = null) => {
    set({ deletePropertySuccess: false, globalLoading: true });

    try {
      const docId = String(propertyId || '').trim();
      if (!docId) {
        throw new Error('Property ID tidak valid untuk proses hapus.');
      }
      const userUid = String(auth().currentUser?.uid || propertyMeta?.uid || '').trim();
      if (!userUid) {
        throw new Error('User tidak valid untuk proses hapus.');
      }

      // 1. Hapus dokumen target berdasarkan doc ID (deterministik)
      const collectionRef = firestore().collection(COLLECTION_NAME);
      let deletedByDocId = false;
      const targetRef = collectionRef.doc(docId);
      const targetDoc = await targetRef.get({ source: 'server' as any });
      if (isDocExists(targetDoc)) {
        const ownerUid = String(targetDoc.data()?.uid || '').trim();
        if (ownerUid && ownerUid !== userUid) {
          throw new Error('Dokumen bukan milik user saat ini.');
        }
        await targetRef.delete();
        deletedByDocId = true;
      } else {
        // Fallback legacy data: cari berdasarkan field propertyId + uid
        const legacySnapshot = await collectionRef
          .where('uid', '==', userUid)
          .where('propertyId', '==', docId)
          .get({ source: 'server' as any });
        if (legacySnapshot.empty) {
          throw new Error('Dokumen target tidak ditemukan.');
        }
        await Promise.allSettled(legacySnapshot.docs.map(doc => doc.ref.delete()));
      }

      // Verifikasi + cleanup tambahan agar tidak ada dokumen sisa (termasuk duplikat legacy)
      if (deletedByDocId) {
        await sleep(300);
        const verifyDoc = await collectionRef
          .doc(docId)
          .get({ source: 'server' as any });

        if (isDocExists(verifyDoc)) {
          console.warn(
            '[deletePropertyData] Dokumen masih terlihat setelah delete pertama, retry sekali:',
            docId,
          );
          await collectionRef.doc(docId).delete();
        }
      } else {
        // Untuk jalur legacy, lakukan best-effort retry untuk dokumen yang masih tersisa
        const legacyVerify = await collectionRef
          .where('uid', '==', userUid)
          .where('propertyId', '==', docId)
          .get({ source: 'server' as any });

        if (!legacyVerify.empty) {
          console.warn(
            '[deletePropertyData] Ditemukan dokumen legacy tersisa, retry delete:',
            legacyVerify.size,
          );
          await Promise.allSettled(
            legacyVerify.docs.map(doc => doc.ref.delete()),
          );
        }
      }

      // Selalu cleanup kemungkinan duplikat dengan propertyId yang sama
      const duplicateCleanup = await collectionRef
        .where('uid', '==', userUid)
        .where('propertyId', '==', docId)
        .get({ source: 'server' as any });
      if (!duplicateCleanup.empty) {
        await Promise.allSettled(
          duplicateCleanup.docs.map(doc => doc.ref.delete()),
        );
      }

      // Verifikasi final yang ketat
      await sleep(300);
      const finalDoc = await collectionRef
        .doc(docId)
        .get({ source: 'server' as any });
      const finalLegacy = await collectionRef
        .where('uid', '==', userUid)
        .where('propertyId', '==', docId)
        .get({ source: 'server' as any });
      const finalDocExists = isDocExists(finalDoc);
      if (finalDocExists || !finalLegacy.empty) {
        throw new Error(
          `Dokumen masih ada di Firestore setelah delete (docId=${docId}, finalDoc=${String(
            finalDocExists,
          )}, finalLegacyCount=${finalLegacy.size}).`,
        );
      }

      // 2. Hapus File dari Storage setelah Firestore sukses dihapus
      if (Array.isArray(allImageUrls) && allImageUrls.length > 0) {
        await deleteImagesFromStorage(allImageUrls);
      } else {
        console.log(
          'Tidak ada URL gambar properti yang ditemukan untuk dihapus.',
        );
      }

      // 3. Sinkronkan list lokal agar item langsung hilang dari UI
      set(state => ({
        listProperty: state.listProperty.filter(
          item => {
            const sameId = isSamePropertyId(item, docId, docId);
            return !sameId;
          },
        ),
        listPropertyForSale: state.listPropertyForSale.filter(
          item => {
            const sameId = isSamePropertyId(item, docId, docId);
            return !sameId;
          },
        ),
        listPropertyForRent: state.listPropertyForRent.filter(
          item => {
            const sameId = isSamePropertyId(item, docId, docId);
            return !sameId;
          },
        ),
      }));

      set({ deletePropertySuccess: true });
      Alert.alert('Success', 'Property data deleted successfully.');

      // 4. Paksa sinkron ulang dari server agar UI tidak menampilkan cache lama
      await get().fetchProperties();
      await get().fetchPropertyCounts();
    } catch (error) {
      console.error('Error deleting property data:', error);
      const message = error?.message || 'Failed to delete property.';
      set({ listPropertyError: message });
      Alert.alert('Gagal menghapus', message);
    } finally {
      set({ globalLoading: false });
    }
  },

  // --- ACTIONS FETCHING & PAGINATION (USER TERTENTU) ---

  fetchProperties: async () => {
    const user = auth().currentUser;
    if (!user) {
      set({ listPropertyError: 'User not authenticated.' });
      return;
    }

    set({
      listPropertyLoading: true,
      hasMoreProperty: false,
      lastVisible: null,
    });
    try {
      const snapshot = await firestore()
        .collection(COLLECTION_NAME)
        .where('uid', '==', user.uid)
        .get({ source: 'server' as any });

      const properties = snapshot.docs
        .map(doc => ({
          ...doc.data(),
          firestoreId: doc.id,
          id: doc.id,
        }))
        .filter(item => !item?.isDeleted)
        .sort((a, b) => {
          const aTime = a.createdAt?.toDate
            ? a.createdAt.toDate().getTime()
            : 0;
          const bTime = b.createdAt?.toDate
            ? b.createdAt.toDate().getTime()
            : 0;
          if (aTime !== bTime) return bTime - aTime;
          return (a.propertyName || '').localeCompare(b.propertyName || '');
        });

      set({
        listProperty: properties,
        listPropertyForSale: properties.filter(p => p.statusId === 1),
        listPropertyForRent: properties.filter(p => p.statusId === 2),
        hasMoreProperty: false,
        lastVisible: null,
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      set({ listPropertyError: error.message });
    } finally {
      set({ listPropertyLoading: false });
    }
  },

  fetchMoreProperties: async () => {
    const { hasMoreProperty } = get();
    if (!hasMoreProperty) return;
  },

  getPropertyById: async id => {
    try {
      const doc = await firestore().collection(COLLECTION_NAME).doc(id).get();
      if (!isDocExists(doc)) return null;
      console.log('Property data:', doc.data());

      return { ...doc.data(), firestoreId: doc.id, id: doc.id };
    } catch (error) {
      console.error('Error fetching property by id:', error);
      return null;
    }
  },

  fetchPropertyCounts: async () => {
    const user = auth().currentUser;
    if (!user) {
      set({ listPropertyError: 'User not authenticated.' });
      return;
    }

    set({ totalPropertyLoading: true, totalPropertyError: null });

    try {
      const totalSnap = await firestore()
        .collection(COLLECTION_NAME)
        .where('uid', '==', user.uid)
        .get({ source: 'server' as any });

      const activeDocs = totalSnap.docs
        .map(doc => doc.data())
        .filter(item => !item?.isDeleted);
      const forSaleCount = activeDocs.filter(item => item?.statusId === 1).length;
      const forRentCount = activeDocs.filter(item => item?.statusId === 2).length;

      set({
        totalProperties: activeDocs.length,
        totalForSale: forSaleCount,
        totalForRent: forRentCount,
      });

      console.log(
        'Total Properties:',
        activeDocs.length,
        'For Sale:',
        forSaleCount,
        'For Rent:',
        forRentCount,
      );
    } catch (error) {
      console.error('Error fetching property counts:', error);
      set({ totalPropertyError: error.message });
    } finally {
      set({ totalPropertyLoading: false });
    }
  },

  fetchLatestProperties: async () => {
    const user = auth().currentUser;
    if (!user) {
      set({ listPropertyError: 'User not authenticated.' });
      return;
    }

    set({ latestPropertiesLoading: true, latestPropertiesError: null });
    try {
      const snapshot = await firestore()
        .collection(COLLECTION_NAME)
        .where('uid', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get({ source: 'server' as any });

      const latest = snapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
        id: doc.id,
      })).filter(item => !item?.isDeleted);

      set({ latestProperties: latest });

      console.log('Latest properties:', latest);
    } catch (error) {
      console.error('Error fetching latest properties:', error);
      set({ latestPropertiesError: error.message });
    } finally {
      set({ latestPropertiesLoading: false });
    }
  },

  // --- UTILITY ACTIONS ---
  resetAllData: () => {
    const {
      listAllProperties,
      listAllPropertiesLoading,
      listAllPropertiesError,
    } = get();

    set({
      ...initialState,
      listAllProperties,
      listAllPropertiesLoading,
      listAllPropertiesError,
    });
  },
  resetFlags: () => {
    set({
      savePropertySuccess: false,
      updatePropertySuccess: false,
      deletePropertySuccess: false,
    });
  },

  setGlobalLoading: loading => set({ globalLoading: loading }),
  setLoading: loading => set({ listPropertyLoading: loading }),
  setError: error => set({ listPropertyError: error }),
}));

export default usePropertyStore;
