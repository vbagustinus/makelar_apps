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
    return new Promise(async resolve => {
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

    set({ locationLoading: true, locationError: null, listCities: [], listDistricts: [], listVillages: [] });
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
    console.log('provinceId', provinceId);

    if (!provinceId) {
      set({ listCities: [] });
      return;
    }
    set({ locationLoading: true, locationError: null, listCities: [], listDistricts: [], listVillages: [] });
    try {
      // Endpoint: /regencies/{provinceId}.json
      const response = await fetch(`${API_BASE}/regencies/${provinceId}.json`);
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
    if (!cityId) {
      set({ listDistricts: [] });
      return;
    }
    set({ locationLoading: true, locationError: null, listDistricts: [], listVillages: [] });
    try {
      // Endpoint: /districts/{cityId}.json
      const response = await fetch(`${API_BASE}/districts/${cityId}.json`);
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
    if (!districtId) {
      set({ listVillages: [] });
      return;
    }
    set({ locationLoading: true, locationError: null, listVillages: [] });
    try {
      // Endpoint: /villages/{districtId}.json
      const response = await fetch(`${API_BASE}/villages/${districtId}.json`);
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
        id: doc.id,
        ...doc.data(),
      }));

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
  fetchGlobalProperties: async ({ propertyTypeId = null }) => {
    // <-- TAMBAHKAN PARAMETER
    set({
      listGlobalPropertiesLoading: true,
      listGlobalPropertiesError: null,
      globalHasMore: true,
      globalLastVisible: null,
    });

    try {
      let query = firestore().collection(COLLECTION_NAME);

      // 1. APLIKASIKAN FILTER .WHERE()
      if (propertyTypeId !== null) {
        console.log('propertyTypeId', propertyTypeId);
        // Pastikan 'propertyTypeId' di Firestore adalah number jika Anda menggunakan perbandingan number
        // Jika Anda menyimpannya sebagai string, gunakan string di sini.
        // Saya asumsikan Anda menyimpannya sebagai number (atau string yang sama dengan ID di database).
        query = query.where('propertyTypeId', '==', propertyTypeId);
      }

      // 2. APLIKASIKAN PENGURUTAN DAN BATAS
      const snapshot = await query
        .orderBy('createdAt', 'desc')
        .limit(PAGE_SIZE)
        .get();

      const properties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const newHasMore = properties.length === PAGE_SIZE;
      const newLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

      set({
        listGlobalProperties: properties,
        globalHasMore: newHasMore,
        globalLastVisible: newLastVisible,
      });

      console.log('Fetched global properties (first 10):', properties);
    } catch (error) {
      console.error('Error fetching global properties:', error);
      set({ listGlobalPropertiesError: error.message });
    } finally {
      set({ listGlobalPropertiesLoading: false });
    }
  },

  fetchMoreGlobalProperties: async ({ propertyTypeId = null }) => {
    // <-- TAMBAHKAN PARAMETER
    const {
      globalHasMore,
      globalIsFetchingMore,
      globalLastVisible,
      listGlobalProperties,
    } = get();

    if (!globalHasMore || globalIsFetchingMore) return;

    set({ globalIsFetchingMore: true });
    try {
      let query = firestore().collection(COLLECTION_NAME);

      // 1. APLIKASIKAN FILTER .WHERE()
      if (propertyTypeId !== null) {
        console.log('propertyTypeId', propertyTypeId);

        query = query.where('propertyTypeId', '==', propertyTypeId);
      }

      // 2. APLIKASIKAN PENGURUTAN, START AFTER, DAN BATAS
      const snapshot = await query
        .orderBy('createdAt', 'desc')
        .startAfter(globalLastVisible)
        .limit(PAGE_SIZE)
        .get();

      const newProperties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

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
    let allImageUrls = [];

    try {
      const requiredFields = [
        'propertyTypeId',
        'propertyName',
        'statusId',
        'certificateTypeId',
        'selectedRBSeller',
        'selectedRBPurchaser',
        'images',
        'uid',
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
      await firestore()
        .collection(COLLECTION_NAME)
        .add({
          ...dataToSave,
          imageUrls: allImageUrls,
          imageUrl: primaryImageUrl,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

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

  updatePropertyData: async data => {
    set({ updatePropertySuccess: false, globalLoading: true });

    const {
      deletedImageUrls,
      finalImageArray,
      propertyId,
      images,
      ...restOfData
    } = data;

    let newlyUploadedUrls = [];
    let retainedImageUrls = [];
    let finalImageUrls = [];

    try {
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

  deletePropertyData: async (propertyId, allImageUrls) => {
    set({ deletePropertySuccess: false, globalLoading: true });

    try {
      // 1. Hapus File dari Storage
      if (Array.isArray(allImageUrls) && allImageUrls.length > 0) {
        await deleteImagesFromStorage(allImageUrls);
      } else {
        console.log(
          'Tidak ada URL gambar properti yang ditemukan untuk dihapus.',
        );
      }

      // 2. Hapus Dokumen dari Firestore
      await firestore().collection(COLLECTION_NAME).doc(propertyId).delete();

      set({ deletePropertySuccess: true });
      Alert.alert('Success', 'Property data deleted successfully.');
    } catch (error) {
      console.error('Error deleting property data:', error);
      set({ listPropertyError: error.message });
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
      hasMoreProperty: true,
      lastVisible: null,
    });
    try {
      let query = firestore()
        .collection(COLLECTION_NAME)
        .where('uid', '==', user.uid)
        .orderBy('propertyName')
        .limit(PAGE_SIZE);

      const snapshot = await query.get();

      const properties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const newHasMore = properties.length === PAGE_SIZE;
      const newLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

      // Filter berdasarkan Status Properti (statusId)
      set({
        listProperty: properties,
        listPropertyForSale: properties.filter(p => p.statusId === 1),
        listPropertyForRent: properties.filter(p => p.statusId === 2),
        hasMoreProperty: newHasMore,
        lastVisible: newLastVisible,
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      set({ listPropertyError: error.message });
    } finally {
      set({ listPropertyLoading: false });
    }
  },

  fetchMoreProperties: async () => {
    const { hasMoreProperty, isFetchingMore, lastVisible, listProperty } =
      get();
    const user = auth().currentUser;

    if (!hasMoreProperty || isFetchingMore || !user) {
      return;
    }

    set({ isFetchingMore: true });
    try {
      let query = firestore()
        .collection(COLLECTION_NAME)
        .where('uid', '==', user.uid)
        .orderBy('propertyName')
        .startAfter(lastVisible)
        .limit(PAGE_SIZE);

      const snapshot = await query.get();

      const newProperties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const combinedProperties = [...listProperty, ...newProperties];

      const newHasMore = newProperties.length === PAGE_SIZE;
      const newLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

      set({
        listProperty: combinedProperties,
        listPropertyForSale: combinedProperties.filter(p => p.statusId === 1),
        listPropertyForRent: combinedProperties.filter(p => p.statusId === 2),
        hasMoreProperty: newHasMore,
        lastVisible: newLastVisible,
      });
    } catch (error) {
      console.error('Error fetching more properties:', error);
      set({ listPropertyError: error.message });
    } finally {
      set({ isFetchingMore: false });
    }
  },

  getPropertyById: async id => {
    try {
      const doc = await firestore().collection(COLLECTION_NAME).doc(id).get();
      if (!doc.exists) return null;
      console.log('Property data:', doc.data());

      return { id: doc.id, ...doc.data() };
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
      // Total semua properti
      const totalSnap = await firestore()
        .collection(COLLECTION_NAME)
        .where('uid', '==', user.uid)
        .get();

      // Total properti Dijual (statusId = 1)
      const forSaleSnap = await firestore()
        .collection(COLLECTION_NAME)
        .where('uid', '==', user.uid)
        .where('statusId', '==', 1)
        .get();

      // Total properti Disewa (statusId = 2)
      const forRentSnap = await firestore()
        .collection(COLLECTION_NAME)
        .where('uid', '==', user.uid)
        .where('statusId', '==', 2)
        .get();

      set({
        totalProperties: totalSnap.size,
        totalForSale: forSaleSnap.size,
        totalForRent: forRentSnap.size,
      });

      console.log(
        'Total Properties:',
        totalSnap.size,
        'For Sale:',
        forSaleSnap.size,
        'For Rent:',
        forRentSnap.size,
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
        .get();

      const latest = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

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
