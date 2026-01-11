import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import {
  BaseView,
  DropdownSearchable,
  Input,
  InputMaps,
  Text,
} from '../../components';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { launchImageLibrary } from 'react-native-image-picker';
import { Colors, FontSize, Sizes, useThemeColors } from '../../styles';
import {
  propertyCategories,
  propertyStatuses,
  certificateTypes,
  Fonts,
} from '../../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useInterstitialAd } from '../ads';
import usePropertyStore from '../../store/usePropertyStore';
import useAuthStore from '../../store/useAuthStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from '@d11/react-native-fast-image';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ===============================================
// Komponen Layar Tambah Properti
// ===============================================

const EditPropertyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params || {};
  const originalImagesRef = useRef(item?.imageUrls || []);
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);

  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  const userPhone = user?.phoneNumber;
  const userWa = user?.whatsapp;
  const updatePropertyData = usePropertyStore(
    state => state.updatePropertyData,
  );
  const fetchProperties = usePropertyStore(state => state.fetchProperties);
  const resetFlags = usePropertyStore(state => state.resetFlags);
  const globalLoading = usePropertyStore(state => state.globalLoading);
  const listPropertyError = usePropertyStore(state => state.listPropertyError);
  const updatePropertySuccess = usePropertyStore(
    state => state.updatePropertySuccess,
  );
  console.log('item', item);

  const {
    fetchProvinces,
    fetchCitiesByProvince,
    fetchDistrictsByCity,
    fetchVillagesByDistrict,
    listProvinces,
    listCities,
    listDistricts,
    listVillages,
    locationLoading,
    locationError,
  } = usePropertyStore();

  // --- STATE LOKAL UNTUK FORM PROPERTI ---
  const [images, setImages] = useState(item?.imageUrls || []);
  const [propertyType, setPropertyType] = useState(null);
  const [propertyName, setPropertyName] = useState(item?.propertyName || '');
  const [status, setStatus] = useState(null);
  const [certificateType, setCertificateType] = useState(null);
  const [address, setAddress] = useState(item?.address || '');
  const [contactNumber, setContactNumber] = useState(
    item?.contactNumber || userPhone || userWa || '',
  );

  // State untuk Data Keuangan/Harga
  const [price, setPrice] = useState(item?.price ? String(item.price) : '');

  // State untuk Detail Tambahan (misalnya, Luas)
  const [landArea, setLandArea] = useState(
    item?.landArea ? String(item.landArea) : '',
  );
  const [buildingArea, setBuildingArea] = useState(
    item?.buildingArea ? String(item.buildingArea) : '',
  );

  // State untuk Pihak Terkait (Mengganti Silsilah Jantan/Betina)
  // (saat ini tidak digunakan di UI)

  // --- FIELDS RUMAH (HOUSE) ---
  const [bedrooms, setBedrooms] = useState(
    item?.bedrooms ? String(item.bedrooms) : '',
  );
  const [bathrooms, setBathrooms] = useState(
    item?.bathrooms ? String(item.bathrooms) : '',
  );
  const [floors, setFloors] = useState(item?.floors ? String(item.floors) : '');
  const [garage, setGarage] = useState(item?.garage || '');
  const [builtYear, setBuiltYear] = useState(
    item?.builtYear ? String(item.builtYear) : '',
  );
  const [electricPower, setElectricPower] = useState(
    item?.electricPower ? String(item.electricPower) : '',
  );
  const [waterSource, setWaterSource] = useState(
    item?.waterSource ? { id: item.waterSource, name: item.waterSource } : '',
  );
  const [facing, setFacing] = useState(
    item?.facing ? { id: item.facing, name: item.facing } : '',
  );
  const [furnished, setFurnished] = useState(
    item?.furnished ? { id: item.furnished, name: item.furnished } : null,
  );
  const [roadWidth, setRoadWidth] = useState(
    item?.roadWidth ? String(item.roadWidth) : '',
  );
  const [carAccess, setCarAccess] = useState(
    item?.carAccess ? { id: item.carAccess, name: item.carAccess } : '',
  );
  const [environmentType, setEnvironmentType] = useState(
    item?.environmentType
      ? { id: item.environmentType, name: item.environmentType }
      : '',
  );
  const [condition, setCondition] = useState(
    item?.condition ? { id: item.condition, name: item.condition } : '',
  );
  const [renovationYear, setRenovationYear] = useState(
    item?.renovationYear ? String(item.renovationYear) : '',
  );
  const [legalOwnerName, setLegalOwnerName] = useState(
    item?.legalOwnerName || '',
  );
  const [imbNumber, setImbNumber] = useState(item?.imbNumber || '');
  const [monthlyFee, setMonthlyFee] = useState(
    item?.monthlyFee ? String(item.monthlyFee) : '',
  );

  // --- FIELDS APARTEMEN ---
  const [tower, setTower] = useState(
    item?.tower 
      ? (typeof item.tower === 'object' ? item.tower.name || item.tower.value || '' : String(item.tower))
      : ''
  );
  const [floorNumber, setFloorNumber] = useState(
    item?.floorNumber 
      ? (typeof item.floorNumber === 'object' ? String(item.floorNumber.name || item.floorNumber.value || '') : String(item.floorNumber))
      : ''
  );
  const [unitNumber, setUnitNumber] = useState(
    item?.unitNumber 
      ? (typeof item.unitNumber === 'object' ? item.unitNumber.name || item.unitNumber.value || '' : String(item.unitNumber))
      : ''
  );
  const [unitType, setUnitType] = useState(
    item?.unitType 
      ? (typeof item.unitType === 'object' && item.unitType.id 
          ? item.unitType 
          : { id: item.unitType, name: item.unitType })
      : null
  );
  const [maintenanceFee, setMaintenanceFee] = useState(
    item?.maintenanceFee ? String(item.maintenanceFee) : '',
  );
  const [balcony, setBalcony] = useState(
    item?.balcony 
      ? (typeof item.balcony === 'object' && item.balcony.id 
          ? item.balcony 
          : { id: item.balcony, name: item.balcony })
      : null
  );
  const [apartmentFacilities, setApartmentFacilities] = useState(
    item?.apartmentFacilities || '',
  );

  // --- FIELDS TANAH (LAND) ---
  const [landShape, setLandShape] = useState(
    item?.landShape ? { id: item.landShape, name: item.landShape } : '',
  );
  const [frontageWidth, setFrontageWidth] = useState(
    item?.frontageWidth ? String(item.frontageWidth) : '',
  );
  const [zoning, setZoning] = useState(
    item?.zoning ? { id: item.zoning, name: item.zoning } : '',
  );
  const [contour, setContour] = useState(
    item?.contour ? { id: item.contour, name: item.contour } : '',
  );
  const [roadType, setRoadType] = useState(
    item?.roadType ? { id: item.roadType, name: item.roadType } : '',
  );

  // --- FIELDS RUKO ---
  const [buildingWidth, setBuildingWidth] = useState(
    item?.buildingWidth ? String(item.buildingWidth) : '',
  );
  const [buildingLength, setBuildingLength] = useState(
    item?.buildingLength ? String(item.buildingLength) : '',
  );
  const [parkingSpace, setParkingSpace] = useState(
    item?.parkingSpace ? String(item.parkingSpace) : '',
  );
  const [restroomCount, setRestroomCount] = useState(
    item?.restroomCount ? String(item.restroomCount) : '',
  );
  const [electricityType, setElectricityType] = useState(
    item?.electricityType
      ? { id: item.electricityType, name: item.electricityType }
      : '',
  );
  const [businessSuitableFor, setBusinessSuitableFor] = useState(
    item?.businessSuitableFor || '',
  );

  // --- FIELDS KANTOR (OFFICE) ---
  const [officeType, setOfficeType] = useState(
    item?.officeType ? { id: item.officeType, name: item.officeType } : '',
  );
  const [meetingRoomCount, setMeetingRoomCount] = useState(
    item?.meetingRoomCount ? String(item.meetingRoomCount) : '',
  );
  const [workspaceCapacity, setWorkspaceCapacity] = useState(
    item?.workspaceCapacity ? String(item.workspaceCapacity) : '',
  );
  const [pantry, setPantry] = useState(
    item?.pantry ? { id: item.pantry, name: item.pantry } : '',
  );
  const [toiletType, setToiletType] = useState(
    item?.toiletType ? { id: item.toiletType, name: item.toiletType } : '',
  );

  // --- FIELDS KOS/KONTRAKAN ---
  const [totalRooms, setTotalRooms] = useState(
    item?.totalRooms ? String(item.totalRooms) : '',
  );
  const [occupiedRooms, setOccupiedRooms] = useState(
    item?.occupiedRooms ? String(item.occupiedRooms) : '',
  );
  const [roomFacilities, setRoomFacilities] = useState(
    item?.roomFacilities || '',
  );
  const [bathroomInside, setBathroomInside] = useState(
    item?.bathroomInside
      ? { id: item.bathroomInside, name: item.bathroomInside }
      : '',
  );
  const [incomePerMonth, setIncomePerMonth] = useState(
    item?.incomePerMonth ? String(item.incomePerMonth) : '',
  );
  const [rules, setRules] = useState(
    item?.rules ? { id: item.rules, name: item.rules } : '',
  );

  // --- FIELDS INDUSTRI/GUDANG ---
  const [ceilingHeight, setCeilingHeight] = useState(
    item?.ceilingHeight ? String(item.ceilingHeight) : '',
  );
  const [loadingDock, setLoadingDock] = useState(
    item?.loadingDock ? { id: item.loadingDock, name: item.loadingDock } : '',
  );
  const [truckAccess, setTruckAccess] = useState(
    item?.truckAccess ? { id: item.truckAccess, name: item.truckAccess } : '',
  );
  const [powerCapacity, setPowerCapacity] = useState(
    item?.powerCapacity ? String(item.powerCapacity) : '',
  );
  const [floorStrength, setFloorStrength] = useState(
    item?.floorStrength ? String(item.floorStrength) : '',
  );

  const [longitude, setLongitude] = useState(item?.longitude || 0);
  const [latitude, setLatitude] = useState(item?.latitude || 0);

  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [village, setVillage] = useState(null);
  const hasPrefilledProvince = useRef(false);
  const hasPrefilledCity = useRef(false);
  const hasPrefilledDistrict = useRef(false);
  const hasPrefilledVillage = useRef(false);

  const checkTypeSpecificFields = () => {
    switch (propertyType?.name) {
      case 'Rumah':
        return (
          landArea.trim() !== '' &&
          buildingArea.trim() !== '' &&
          bedrooms.trim() !== '' &&
          bathrooms.trim() !== ''
        );
      case 'Apartemen':
        console.log('=== Apartment Validation Debug ===');
        console.log('buildingArea:', buildingArea, 'valid:', buildingArea.trim() !== '');
        console.log('bedrooms:', bedrooms, 'valid:', bedrooms.trim() !== '');
        console.log('bathrooms:', bathrooms);
        console.log('floorNumber:', floorNumber);
        console.log('unitNumber:', unitNumber);
        console.log('unitType:', unitType);
        // For apartment, only buildingArea and bedrooms are required
        // Other fields like floorNumber, unitNumber, unitType are optional
        const isValid = (
          buildingArea.trim() !== '' &&
          bedrooms.trim() !== ''
        );
        console.log('Overall apartment validation:', isValid);
        return isValid;
      case 'Tanah':
        return (
          landArea.trim() !== ''
        );
      case 'Ruko':
        return (
          landArea.trim() !== '' &&
          buildingArea.trim() !== ''
        );
      case 'Kantor':
        return (
          buildingArea.trim() !== ''
        );
      case 'Kos/Kontrakan':
        return (
          totalRooms.trim() !== '' &&
          roomFacilities.trim() !== ''
        );
      case 'Industri/Gudang':
        return (
          buildingArea.trim() !== ''
        );
      default:
        return false;
    }
  };

  // Cek apakah semua form wajib telah terisi sesuai tipe properti
  const isFormComplete =
    propertyType?.id &&
    propertyName.trim() !== '' &&
    status?.id &&
    certificateType?.id &&
    address.trim() !== '' &&
    price.trim() !== '' &&
    images.length >= 1 &&
    province?.id &&
    city?.id &&
    district?.id &&
    village?.id &&
    (contactNumber.trim() !== '' || userPhone || userWa) &&
    checkTypeSpecificFields();

  // ===============================================
  // HOOKS FORMATTING DATA LOKASI (Solusi Anda)
  // ===============================================

  const formattedProvinces = useMemo(() => {
    if (listProvinces) {
      // Mengubah format data menjadi { value: id, label: name }
      return listProvinces.map(item => ({
        value: item.id,
        label: item.name,
        ...item,
      }));
    }
    return [];
  }, [listProvinces]);

  const formattedCities = useMemo(() => {
    if (listCities) {
      // Mengubah format data menjadi { value: id, label: name }
      return listCities.map(item => ({
        value: item.id,
        label: item.name,
        ...item,
      }));
    }
    return [];
  }, [listCities]);

  const formattedDistricts = useMemo(() => {
    console.log('formattedDistricts', listDistricts);

    if (listDistricts) {
      // Mengubah format data menjadi { value: id, label: name }
      return listDistricts.map(item => ({
        value: item.id,
        label: item.name,
        ...item,
      }));
    }
    return [];
  }, [listDistricts]);

  const formattedVillages = useMemo(() => {
    if (listVillages) {
      // Mengubah format data menjadi { value: id, label: name }
      return listVillages.map(item => ({
        value: item.id,
        label: item.name,
        ...item,
      }));
    }
    return [];
  }, [listVillages]);

  const getOptionName = option => (option && option.name ? option.name : null);
  const getOptionId = option =>
    option?.id || option?.value || (typeof option === 'string' ? option : null);

  // ===============================================
  // HOOKS PENGAMBILAN DATA LOKASI
  // ===============================================

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  // Prefetch data kota/kecamatan/kelurahan berdasarkan lokasi item agar opsi siap saat layar dibuka
  useEffect(() => {
    const provinceId =
      item?.province?.id || item?.province?.value || item?.province;
    const cityId = item?.city?.id || item?.city?.value || item?.city;
    const districtId =
      item?.district?.id || item?.district?.value || item?.district;

    if (provinceId) {
      fetchCitiesByProvince(provinceId);
    }
    if (cityId) {
      fetchDistrictsByCity(cityId);
    }
    if (districtId) {
      fetchVillagesByDistrict(districtId);
    }
  }, [
    item?.province,
    item?.city,
    item?.district,
    fetchCitiesByProvince,
    fetchDistrictsByCity,
    fetchVillagesByDistrict,
  ]);

  // Prefill pilihan ketika data list sudah siap
  useEffect(() => {
    if (
      !hasPrefilledProvince.current &&
      item?.province &&
      listProvinces?.length > 0
    ) {
      const match = listProvinces.find(
        p => `${p.id}` === `${item.province?.id}`,
      );
      if (match) {
        setProvince({ ...match, value: match.id, label: match.name });
        hasPrefilledProvince.current = true;
      }
    }
  }, [listProvinces, item?.province]);

  useEffect(() => {
    if (!hasPrefilledCity.current && item?.city && listCities?.length > 0) {
      const match = listCities.find(c => `${c.id}` === `${item.city?.id}`);
      if (match) {
        setCity({ ...match, value: match.id, label: match.name });
        hasPrefilledCity.current = true;
      }
    }
  }, [listCities, item?.city]);

  useEffect(() => {
    if (
      !hasPrefilledDistrict.current &&
      item?.district &&
      listDistricts?.length > 0
    ) {
      const match = listDistricts.find(
        d => `${d.id}` === `${item.district?.id}`,
      );
      if (match) {
        setDistrict({ ...match, value: match.id, label: match.name });
        hasPrefilledDistrict.current = true;
      }
    }
  }, [listDistricts, item?.district]);

  useEffect(() => {
    if (
      !hasPrefilledVillage.current &&
      item?.village &&
      listVillages?.length > 0
    ) {
      const match = listVillages.find(v => `${v.id}` === `${item.village?.id}`);
      if (match) {
        setVillage({ ...match, value: match.id, label: match.name });
        hasPrefilledVillage.current = true;
      }
    }
  }, [listVillages, item?.village]);

  useEffect(() => {
    const provinceId = getOptionId(province);
    if (provinceId) {
      setCity(null);
      setDistrict(null);
      setVillage(null);
      fetchCitiesByProvince(provinceId);
    }
  }, [province, fetchCitiesByProvince]);

  useEffect(() => {
    const cityId = getOptionId(city);
    if (cityId) {
      setDistrict(null);
      setVillage(null);
      fetchDistrictsByCity(cityId);
    }
  }, [city, fetchDistrictsByCity]);

  useEffect(() => {
    const districtId = getOptionId(district);
    if (districtId) {
      setVillage(null);
      fetchVillagesByDistrict(districtId);
    }
  }, [district, fetchVillagesByDistrict]);

  useEffect(() => {
    console.log('locationError', locationError);
  }, [locationError]);

  const { showAd } = useInterstitialAd(() => {
    resetFlags();
    navigation.goBack();
  });

  useEffect(() => {
    const ptId = item?.propertyTypeId || item?.propertyType?.id;
    if (ptId) {
      const match = propertyCategories.find(p => p.id === ptId);
      if (match) setPropertyType(match);
    }
    const sId = item?.statusId || item?.status?.id;
    if (sId) {
      const match = propertyStatuses.find(p => p.id === sId);
      if (match) setStatus(match);
    }
    const ctId = item?.certificateTypeId || item?.certificateType?.id;
    if (ctId) {
      const match = certificateTypes.find(p => p.id === ctId);
      if (match) setCertificateType(match);
    }
    if (item?.province) {
      const provinceId =
        item.province?.id || item.province?.value || item.province;
      setProvince({
        id: provinceId,
        name: item.province?.name,
        label: item.province?.label,
        value: item.province?.value || provinceId,
      });
    }
    if (item?.city) {
      const cityId = item.city?.id || item.city?.value || item.city;
      setCity({
        id: cityId,
        name: item.city?.name,
        label: item.city?.label,
        value: item.city?.value || cityId,
      });
    }
    if (item?.district) {
      const districtId =
        item.district?.id || item.district?.value || item.district;
      setDistrict({
        id: districtId,
        name: item.district?.name,
        label: item.district?.label,
        value: item.district?.value || districtId,
      });
    }
    if (item?.village) {
      const villageId = item.village?.id || item.village?.value || item.village;
      setVillage({
        id: villageId,
        name: item.village?.name,
        label: item.village?.label,
        value: item.village?.value || villageId,
      });
    }
  }, [item]);

  useEffect(() => {
    if (updatePropertySuccess) {
      fetchProperties();
      showAd();
      // Navigate back after a short delay to ensure ad is shown
      setTimeout(() => {
        resetFlags();
        navigation.goBack();
      }, 500);
    }
  }, [updatePropertySuccess, fetchProperties, showAd, navigation, resetFlags]);

  useEffect(() => {
    if (!userPhone && !userWa) {
      Alert.alert(
        'Lengkapi Kontak',
        'Nomor HP atau WhatsApp Anda belum diisi. Lengkapi dulu di Edit Profil.',
        [
          { text: 'Nanti', style: 'cancel' },
          {
            text: 'Ke Edit Profil',
            onPress: () =>
              navigation.navigate('Profil', { screen: 'EditProfileScreen' }),
          },
        ],
      );
    }
  }, [userPhone, userWa, navigation]);

  const handleSubmit = () => {
    if (!isFormComplete) {
      Alert.alert('Peringatan', 'Mohon lengkapi semua kolom yang wajib diisi.');
      return;
    }
    if (!contactNumber.trim() && !userPhone && !userWa) {
      Alert.alert(
        'Lengkapi Kontak',
        'Isi dulu nomor kontak pengiklan atau lengkapi nomor HP/WA di Edit Profil sebelum mengubah properti.',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Ke Edit Profil',
            onPress: () =>
              navigation.navigate('Profil', { screen: 'EditProfileScreen' }),
          },
        ],
      );
      return;
    }
    if (propertyName.trim().length < 5) {
      Alert.alert(
        'Peringatan',
        'Nama/Judul Properti minimal harus 5 karakter.',
      );
      return;
    }
    // Pengecekan Kuantitas Gambar (1 - 5)
    if (images.length < 1) {
      Alert.alert(
        'Peringatan',
        'Anda harus mengunggah minimal 1 foto (maks 5).',
      );
      return;
    }

    // VALIDASI format Gambar

    const isValidImageFormat = images.every(uri => {
      return uri && (uri.startsWith('http') || uri.match(/\.(jpe?g|png)$/i));
    });

    if (!isValidImageFormat) {
      Alert.alert(
        'Peringatan',

        'Semua file yang diunggah harus dalam format JPG, JPEG, atau PNG.',
      );
      return;
    }

    // Konversi nilai numerik (jika diperlukan untuk backend)

    const formattedPrice = price.replace(/[^0-9]/g, '');

    const formattedLandArea = landArea.replace(/[^0-9]/g, '');

    const formattedBuildingArea = buildingArea.replace(/[^0-9]/g, '');

    // Panggil fungsi simpan data properti

    const deletedImageUrls =
      originalImagesRef.current.filter(url => !images.includes(url)) || [];

    updatePropertyData({
      propertyId: item?.id,
      phoneNumber: user?.phoneNumber || null,
      whatsapp: user?.whatsapp || null,
      contactNumber: contactNumber.trim() || user?.phoneNumber || user?.whatsapp,
      propertyTypeId: propertyType?.id,
      propertyTypeName: propertyType?.name,
      propertyName,
      statusId: status?.id,
      certificateTypeId: certificateType?.id,
      address,
      price: formattedPrice,
      landArea: formattedLandArea,
      buildingArea: formattedBuildingArea,
      // RUMAH - spesifikasi utama
      bedrooms,
      bathrooms,
      floors,
      garage,
      builtYear,
      // RUMAH - tambahan
      electricPower,
      waterSource,
      facing,
      furnished: getOptionName(furnished),
      roadWidth,
      carAccess,
      environmentType,
      condition,
      renovationYear,
      legalOwnerName,
      imbNumber,
      monthlyFee,
      // APARTEMEN
      tower,
      floorNumber,
      unitNumber,
      unitType: getOptionName(unitType),
      maintenanceFee,
      balcony,
      apartmentFacilities,
      // TANAH
      landShape: getOptionName(landShape),
      frontageWidth,
      zoning: getOptionName(zoning),
      contour: getOptionName(contour),
      roadType: getOptionName(roadType),
      // RUKO
      buildingWidth,
      buildingLength,
      parkingSpace,
      restroomCount,
      electricityType: getOptionName(electricityType),
      businessSuitableFor,
      // KANTOR
      officeType: getOptionName(officeType),
      meetingRoomCount,
      workspaceCapacity,
      pantry,
      toiletType: getOptionName(toiletType),
      // KOS/KONTRAKAN
      totalRooms,
      occupiedRooms,
      roomFacilities,
      bathroomInside: getOptionName(bathroomInside),
      incomePerMonth,
      rules: getOptionName(rules),
      // INDUSTRI/GUDANG
      ceilingHeight,
      loadingDock: getOptionName(loadingDock),
      truckAccess: getOptionName(truckAccess),
      powerCapacity,
      floorStrength,
      finalImageArray: images,
      deletedImageUrls,
      uid: token,
      // LOKASI
      province: province,
      city: city,
      district: district,
      village: village,
      latitude,
      longitude,
      owner: {
        displayName: user?.displayName || null,
        photoURL: user?.photoURL || null,
        city: user?.city || null,
        country: user?.country || null,
      },
    });
  };

  const resetFields = () => {
    setPropertyType(null);
    setPropertyName('');
    setStatus(null);
    setCertificateType(null);
    setAddress('');
    setContactNumber(userPhone || userWa || '');
    setImages([]);
    setPrice('');
    setLandArea('');
    setBuildingArea('');
    // reset RUMAH fields
    setBedrooms('');
    setBathrooms('');
    setFloors('');
    setGarage('');
    setBuiltYear('');
    setElectricPower('');
    setWaterSource('');
    setFacing('');
    setFurnished('');
    setRoadWidth('');
    setCarAccess('');
    setEnvironmentType('');
    setCondition('');
    setRenovationYear('');
    setLegalOwnerName('');
    setImbNumber('');
    setMonthlyFee('');
    // reset APARTEMEN fields
    setTower('');
    setFloorNumber('');
    setUnitNumber('');
    setUnitType(null);
    setMaintenanceFee('');
    setBalcony('');
    setApartmentFacilities('');
    // reset TANAH fields
    setLandShape('');
    setFrontageWidth('');
    setZoning('');
    setContour('');
    setRoadType('');
    // reset RUKO fields
    setBuildingWidth('');
    setBuildingLength('');
    setParkingSpace('');
    setRestroomCount('');
    setElectricityType('');
    setBusinessSuitableFor('');
    // reset KANTOR fields
    setOfficeType('');
    setMeetingRoomCount('');
    setWorkspaceCapacity('');
    setPantry('');
    setToiletType('');
    // reset KOS fields
    setTotalRooms('');
    setOccupiedRooms('');
    setRoomFacilities('');
    setBathroomInside('');
    setIncomePerMonth('');
    setRules('');
    // reset GUDANG fields
    setCeilingHeight('');
    setLoadingDock('');
    setTruckAccess('');
    setPowerCapacity('');
    setFloorStrength('');
    // reset location
    setProvince(null);
    setCity(null);
    setDistrict(null);
    setVillage(null);
  };

  useEffect(() => {
    if (listPropertyError) {
      Alert.alert('Error', listPropertyError);
    }
  }, [listPropertyError]);

  useEffect(() => {
    if (furnished) {
      console.log('Furnished status changed:', furnished?.name || furnished);
    }
  }, [furnished]);

  useEffect(() => {
    if (propertyType) {
      console.log('Property type selected:', propertyType?.name);
    }
  }, [propertyType]);

  // FUNGSI MEMILIH GAMBAR (Sama seperti sebelumnya)

  const handleSelectImage = async () => {
    const maxImages = 5;

    const remainingSlots = maxImages - images.length;

    if (remainingSlots <= 0) {
      Alert.alert('Peringatan', 'Anda dapat mengunggah maksimal 5 foto.');
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',

      selectionLimit: remainingSlots,

      quality: 0.8,
    });

    if (result.assets) {
      const newImageUris = result.assets
        .filter(asset => asset.uri)
        .map(asset => asset.uri);
      setImages(prevImages => [...prevImages, ...newImageUris]);
    }
  };

  const removeImage = index => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const renderHomeForm = () => {
    return (
      <>
        {/* ======= INPUT TAMBAHAN (Spesifikasi Rumah) ======= */}
        <Input
          label="Luas Tanah (m²)"
          placeholder="Contoh: 120"
          iconName="ruler-square"
          keyboardType="numeric"
          value={landArea}
          onChangeText={setLandArea}
        />

        <Input
          label="Luas Bangunan (m²)"
          placeholder="Contoh: 90"
          iconName="home-floor-1"
          keyboardType="numeric"
          value={buildingArea}
          onChangeText={setBuildingArea}
        />

        <Input
          label="Jumlah Kamar Tidur"
          placeholder="Contoh: 3"
          iconName="bed-double-outline"
          keyboardType="numeric"
          value={bedrooms}
          onChangeText={setBedrooms}
        />

        <Input
          label="Jumlah Kamar Mandi"
          placeholder="Contoh: 2"
          iconName="shower-head"
          keyboardType="numeric"
          value={bathrooms}
          onChangeText={setBathrooms}
        />

        <Input
          label="Jumlah Lantai"
          placeholder="Contoh: 2"
          iconName="stairs"
          keyboardType="numeric"
          value={floors}
          onChangeText={setFloors}
        />

        <Input
          label="Garasi / Carport (kapasitas)"
          placeholder="Contoh: 1 Mobil"
          iconName="car"
          value={garage}
          onChangeText={setGarage}
        />

        <Input
          label="Tahun Dibangun"
          placeholder="Contoh: 2018"
          iconName="calendar-range"
          keyboardType="numeric"
          value={builtYear}
          onChangeText={setBuiltYear}
        />

        {/* ======= INPUT TAMBAHAN (Kelengkapan & Lingkungan) ======= */}
        <Input
          label="Daya Listrik (Watt)"
          placeholder="Contoh: 1300"
          iconName="flash"
          keyboardType="numeric"
          value={electricPower}
          onChangeText={setElectricPower}
        />

        <Input
          label="Sumber Air"
          placeholder="Contoh: PDAM / Sumur"
          iconName="water"
          value={waterSource}
          onChangeText={setWaterSource}
        />

        <Input
          label="Arah Hadap"
          placeholder="Contoh: Timur"
          iconName="compass"
          value={facing}
          onChangeText={setFacing}
        />

        <DropdownSearchable
          label="Status Furnitur"
          placeholder="Pilih Status Furnitur"
          iconName="sofa"
          options={[
            { id: 1, name: 'Unfurnished' },
            { id: 2, name: 'Semi Furnished' },
            { id: 3, name: 'Full Furnished' },
          ]}
          value={furnished}
          onSelect={setFurnished}
        />

        <Input
          label="Lebar Jalan (m)"
          placeholder="Contoh: 6"
          iconName="road-variant"
          keyboardType="numeric"
          value={roadWidth}
          onChangeText={setRoadWidth}
        />

        <Input
          label="Akses Kendaraan"
          placeholder="Contoh: Mobil / Motor only"
          iconName="truck"
          value={carAccess}
          onChangeText={setCarAccess}
        />

        <Input
          label="Tipe Lingkungan"
          placeholder="Contoh: Perumahan / Cluster / Kampung"
          iconName="domain"
          value={environmentType}
          onChangeText={setEnvironmentType}
        />

        <Input
          label="Kondisi Rumah"
          placeholder="Contoh: Baru / Bekas / Direnovasi"
          iconName="tools"
          value={condition}
          onChangeText={setCondition}
        />

        <Input
          label="Tahun Renovasi (jika ada)"
          placeholder="Contoh: 2022"
          iconName="calendar-edit"
          keyboardType="numeric"
          value={renovationYear}
          onChangeText={setRenovationYear}
        />

        <Input
          label="Nama Pemilik Sertifikat"
          placeholder="Nama di sertifikat"
          iconName="account"
          value={legalOwnerName}
          onChangeText={setLegalOwnerName}
        />

        <Input
          label="Nomor IMB / Izin"
          placeholder="Jika ada"
          iconName="file-document"
          value={imbNumber}
          onChangeText={setImbNumber}
        />

        <Input
          label="Iuran Bulanan / Security (Rp)"
          placeholder="Contoh: 50000"
          iconName="cash"
          keyboardType="numeric"
          value={monthlyFee}
          onChangeText={setMonthlyFee}
        />
      </>
    );
  };

  const renderApartmentForm = () => {
    return (
      <>
        {/* ======= INPUT APARTEMEN ======= */}
        <Input
          label="Luas Unit (m²)"
          placeholder="Contoh: 90"
          iconName="home-floor-1"
          keyboardType="numeric"
          value={buildingArea}
          onChangeText={setBuildingArea}
        />

        <Input
          label="Jumlah Kamar Tidur"
          placeholder="Contoh: 2"
          iconName="bed-double-outline"
          keyboardType="numeric"
          value={bedrooms}
          onChangeText={setBedrooms}
        />

        <Input
          label="Tower / Blok"
          placeholder="Contoh: Melati, A, Tower 1"
          iconName="building"
          value={tower}
          onChangeText={setTower}
        />

        <Input
          label="Lantai"
          placeholder="Contoh: 2"
          iconName="layers"
          keyboardType="numeric"
          value={floorNumber}
          onChangeText={setFloorNumber}
        />

        <Input
          label="Nomor Unit"
          placeholder="Contoh: 201"
          iconName="door"
          value={unitNumber}
          onChangeText={setUnitNumber}
        />

        <DropdownSearchable
          label="Tipe Unit"
          placeholder="Pilih Tipe Unit"
          iconName="sofa"
          options={[
            { id: 1, name: 'Studio' },
            { id: 2, name: '1 Kamar Tidur' },
            { id: 3, name: '2 Kamar Tidur' },
            { id: 4, name: '3 Kamar Tidur' },
            { id: 5, name: 'Penthouse' },
            { id: 6, name: 'Lainnya' },
          ]}
          value={unitType}
          onSelect={setUnitType}
        />

        <Input
          label="Biaya IPL/Maintenance (Rp)"
          placeholder="Contoh: 500000"
          iconName="cash"
          keyboardType="numeric"
          value={maintenanceFee}
          onChangeText={setMaintenanceFee}
        />

        <DropdownSearchable
          label="Status Furnitur"
          placeholder="Pilih Status Furnitur"
          iconName="sofa"
          options={[
            { id: 1, name: 'Unfurnished' },
            { id: 2, name: 'Semi Furnished' },
            { id: 3, name: 'Full Furnished' },
          ]}
          value={furnished}
          onSelect={setFurnished}
        />

        <Input
          label="Balkon"
          placeholder="Contoh: Ada / Tidak Ada"
          iconName="window-open"
          value={balcony}
          onChangeText={setBalcony}
        />

        <Input
          label="Fasilitas"
          placeholder="Contoh: Gym, Pool, Security 24h, Lift"
          iconName="star"
          value={apartmentFacilities}
          onChangeText={setApartmentFacilities}
        />
      </>
    );
  };

  const renderLandForm = () => {
    return (
      <>
        {/* ======= INPUT TANAH ======= */}
        <Input
          label="Luas Tanah (m²)"
          placeholder="Contoh: 500"
          iconName="ruler-square"
          keyboardType="numeric"
          value={landArea}
          onChangeText={setLandArea}
        />

        <DropdownSearchable
          label="Bentuk Tanah"
          placeholder="Pilih Bentuk Tanah"
          iconName="shape"
          options={[
            { id: 1, name: 'Kotak / Persegi' },
            { id: 2, name: 'Segitiga' },
            { id: 3, name: 'Trapesium' },
            { id: 4, name: 'Tidak Beraturan' },
          ]}
          value={landShape}
          onSelect={setLandShape}
        />

        <Input
          label="Lebar Muka Tanah (m)"
          placeholder="Contoh: 20"
          iconName="ruler"
          keyboardType="numeric"
          value={frontageWidth}
          onChangeText={setFrontageWidth}
        />

        <DropdownSearchable
          label="Zona / Tujuan Lahan"
          placeholder="Pilih Zona"
          iconName="map"
          options={[
            { id: 1, name: 'Permukiman' },
            { id: 2, name: 'Komersial' },
            { id: 3, name: 'Industri' },
            { id: 4, name: 'Pertanian' },
            { id: 5, name: 'Campuran' },
          ]}
          value={zoning}
          onSelect={setZoning}
        />

        <DropdownSearchable
          label="Kontur Tanah"
          placeholder="Pilih Kontur"
          iconName="terrain"
          options={[
            { id: 1, name: 'Datar' },
            { id: 2, name: 'Miring Ringan' },
            { id: 3, name: 'Miring Sedang' },
            { id: 4, name: 'Miring Curam' },
          ]}
          value={contour}
          onSelect={setContour}
        />

        <DropdownSearchable
          label="Jenis Jalan"
          placeholder="Pilih Jenis Jalan"
          iconName="road"
          options={[
            { id: 1, name: 'Aspal' },
            { id: 2, name: 'Beton' },
            { id: 3, name: 'Tanah' },
            { id: 4, name: 'Macadam' },
          ]}
          value={roadType}
          onSelect={setRoadType}
        />
      </>
    );
  };

  const renderRukoForm = () => {
    return (
      <>
        {/* ======= INPUT RUKO ======= */}
        <Input
          label="Luas Tanah (m²)"
          placeholder="Contoh: 120"
          iconName="ruler-square"
          keyboardType="numeric"
          value={landArea}
          onChangeText={setLandArea}
        />

        <Input
          label="Luas Bangunan (m²)"
          placeholder="Contoh: 80"
          iconName="home-floor-1"
          keyboardType="numeric"
          value={buildingArea}
          onChangeText={setBuildingArea}
        />

        <Input
          label="Jumlah Lantai"
          placeholder="Contoh: 2"
          iconName="layers"
          keyboardType="numeric"
          value={floors}
          onChangeText={setFloors}
        />

        <Input
          label="Lebar Bangunan (m)"
          placeholder="Contoh: 6"
          iconName="ruler"
          keyboardType="numeric"
          value={buildingWidth}
          onChangeText={setBuildingWidth}
        />

        <Input
          label="Panjang Bangunan (m)"
          placeholder="Contoh: 20"
          iconName="ruler"
          keyboardType="numeric"
          value={buildingLength}
          onChangeText={setBuildingLength}
        />

        <Input
          label="Tempat Parkir"
          placeholder="Contoh: 2 Mobil"
          iconName="parking"
          value={parkingSpace}
          onChangeText={setParkingSpace}
        />

        <Input
          label="Jumlah Kamar Mandi"
          placeholder="Contoh: 2"
          iconName="shower-head"
          keyboardType="numeric"
          value={restroomCount}
          onChangeText={setRestroomCount}
        />

        <DropdownSearchable
          label="Jenis Listrik"
          placeholder="Pilih Jenis Listrik"
          iconName="flash"
          options={[
            { id: 1, name: 'Toko (900 VA)' },
            { id: 2, name: 'Toko Besar (1300 VA)' },
            { id: 3, name: 'Industri' },
          ]}
          value={electricityType}
          onSelect={setElectricityType}
        />

        <Input
          label="Cocok Untuk Bisnis"
          placeholder="Contoh: Toko, Salon, Warung"
          iconName="briefcase"
          value={businessSuitableFor}
          onChangeText={setBusinessSuitableFor}
        />
      </>
    );
  };

  const renderOfficeForm = () => {
    return (
      <>
        {/* ======= INPUT KANTOR ======= */}
        <Input
          label="Luas Bangunan (m²)"
          placeholder="Contoh: 500"
          iconName="home-floor-1"
          keyboardType="numeric"
          value={buildingArea}
          onChangeText={setBuildingArea}
        />

        <Input
          label="Lantai / Floor"
          placeholder="Contoh: 5"
          iconName="layers"
          keyboardType="numeric"
          value={floorNumber}
          onChangeText={setFloorNumber}
        />

        <DropdownSearchable
          label="Tipe Kantor"
          placeholder="Pilih Tipe Kantor"
          iconName="briefcase"
          options={[
            { id: 1, name: 'Bare (Kosong)' },
            { id: 2, name: 'Semi Furnished' },
            { id: 3, name: 'Full Furnished' },
          ]}
          value={officeType}
          onSelect={setOfficeType}
        />

        <Input
          label="Jumlah Ruang Rapat"
          placeholder="Contoh: 3"
          iconName="door-multiple"
          keyboardType="numeric"
          value={meetingRoomCount}
          onChangeText={setMeetingRoomCount}
        />

        <Input
          label="Kapasitas Workspace"
          placeholder="Contoh: 50 orang"
          iconName="seat"
          value={workspaceCapacity}
          onChangeText={setWorkspaceCapacity}
        />

        <Input
          label="Pantry / Dapur"
          placeholder="Contoh: Ada / Tidak Ada"
          iconName="food"
          value={pantry}
          onChangeText={setPantry}
        />

        <DropdownSearchable
          label="Jenis Toilet"
          placeholder="Pilih Jenis Toilet"
          iconName="toilet"
          options={[
            { id: 1, name: 'Internal (Dalam Unit)' },
            { id: 2, name: 'Shared (Bersama)' },
          ]}
          value={toiletType}
          onSelect={setToiletType}
        />
      </>
    );
  };

  const renderKosForm = () => {
    return (
      <>
        {/* ======= INPUT KOS/KONTRAKAN ======= */}
        <Input
          label="Total Kamar"
          placeholder="Contoh: 10"
          iconName="door-multiple"
          keyboardType="numeric"
          value={totalRooms}
          onChangeText={setTotalRooms}
        />

        <Input
          label="Kamar Terisi"
          placeholder="Contoh: 8"
          iconName="door-open"
          keyboardType="numeric"
          value={occupiedRooms}
          onChangeText={setOccupiedRooms}
        />

        <Input
          label="Fasilitas Kamar"
          placeholder="Contoh: AC, WiFi, KM Dalam"
          iconName="star"
          value={roomFacilities}
          onChangeText={setRoomFacilities}
        />

        <DropdownSearchable
          label="Kamar Mandi"
          placeholder="Pilih Tipe KM"
          iconName="shower-head"
          options={[
            { id: 1, name: 'Dalam Kamar' },
            { id: 2, name: 'Bersama' },
            { id: 3, name: 'Campuran' },
          ]}
          value={bathroomInside}
          onSelect={setBathroomInside}
        />

        <Input
          label="Pendapatan Per Bulan (Rp)"
          placeholder="Contoh: 4000000"
          iconName="cash"
          keyboardType="numeric"
          value={incomePerMonth}
          onChangeText={setIncomePerMonth}
        />

        <DropdownSearchable
          label="Aturan Penghuni"
          placeholder="Pilih Aturan"
          iconName="file-document"
          options={[
            { id: 1, name: 'Bebas (Putra/Putri)' },
            { id: 2, name: 'Putra Saja' },
            { id: 3, name: 'Putri Saja' },
          ]}
          value={rules}
          onSelect={setRules}
        />
      </>
    );
  };

  const renderWarehouseForm = () => {
    return (
      <>
        {/* ======= INPUT INDUSTRI/GUDANG ======= */}
        <Input
          label="Luas Bangunan (m²)"
          placeholder="Contoh: 1000"
          iconName="home-floor-1"
          keyboardType="numeric"
          value={buildingArea}
          onChangeText={setBuildingArea}
        />

        <Input
          label="Lebar Bangunan (m)"
          placeholder="Contoh: 30"
          iconName="ruler"
          keyboardType="numeric"
          value={buildingWidth}
          onChangeText={setBuildingWidth}
        />

        <Input
          label="Panjang Bangunan (m)"
          placeholder="Contoh: 50"
          iconName="ruler"
          keyboardType="numeric"
          value={buildingLength}
          onChangeText={setBuildingLength}
        />

        <Input
          label="Tinggi Ruangan (m)"
          placeholder="Contoh: 6"
          iconName="layers"
          keyboardType="numeric"
          value={ceilingHeight}
          onChangeText={setCeilingHeight}
        />

        <DropdownSearchable
          label="Loading Dock"
          placeholder="Pilih Ketersediaan"
          iconName="truck"
          options={[
            { id: 1, name: 'Ada' },
            { id: 2, name: 'Tidak Ada' },
          ]}
          value={loadingDock}
          onSelect={setLoadingDock}
        />

        <DropdownSearchable
          label="Akses Kendaraan"
          placeholder="Pilih Tipe Akses"
          iconName="truck"
          options={[
            { id: 1, name: 'Tronton' },
            { id: 2, name: 'Kontainer' },
            { id: 3, name: 'Keduanya' },
          ]}
          value={truckAccess}
          onSelect={setTruckAccess}
        />

        <Input
          label="Kapasitas Listrik (kVA)"
          placeholder="Contoh: 100"
          iconName="flash"
          keyboardType="numeric"
          value={powerCapacity}
          onChangeText={setPowerCapacity}
        />

        <Input
          label="Daya Tampung Lantai (Ton/m²)"
          placeholder="Contoh: 5"
          iconName="weight"
          keyboardType="numeric"
          value={floorStrength}
          onChangeText={setFloorStrength}
        />
      </>
    );
  };

  return (
    <BaseView
      title="Ubah Properti"
      isScrollable={false}
      loading={globalLoading || locationLoading}
      onBackPress={() => navigation.pop()}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={100}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screen}>
          {/* INPUT: Nama/Judul Properti */}
          <Input
            label="Nama / Judul Properti"
            placeholder="Contoh: Rumah Minimalis Jakarta, Tanah Kavling Blok B"
            iconName="bookmark-multiple-outline"
            value={propertyName}
            onChangeText={setPropertyName}
          />
          {/* INPUT: Tipe Properti */}
          <DropdownSearchable
            label="Tipe Properti"
            placeholder="Pilih Tipe Properti (Rumah/Tanah/Toko)"
            iconName="home-city-outline"
            options={propertyCategories}
            value={propertyType}
            onSelect={setPropertyType}
          />
          {/* Foto Properti */}

          <Animated.View
            entering={FadeInUp.delay(200)}
            style={styles.imageWrapper}
          >
            <Text
              style={[styles.label, { marginHorizontal: 20, marginTop: 15 }]}
            >
              Foto Properti (1–5)
            </Text>

            {/* Bagian Grid Foto Tetap Sama */}

            {images.length === 0 ? (
              <TouchableOpacity
                style={styles.singleAddContainer}
                onPress={handleSelectImage}
                activeOpacity={0.8}
              >
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderIcon}>📸</Text>

                  <Text style={styles.placeholderText}>
                    Unggah Foto (Min. 1)
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.photoGrid}>
                {/* ... (Main Photo dan Side Photos logic remain) ... */}

                <TouchableOpacity style={styles.mainPhotoContainer} disabled>
                  <FastImage
                    source={{ uri: images[0] }}
                    style={styles.mainPhoto}
                  />

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(0)}
                  >
                    <MaterialDesignIcons
                      name="close"
                      size={15}
                      color={Colors.GRAY_DARK}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.sideGrid}>
                  {images.slice(1).map((uri, index) => (
                    <View key={index} style={styles.sidePhotoContainer}>
                      <FastImage source={{ uri }} style={styles.sidePhoto} />

                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeImage(index + 1)}
                      >
                        <MaterialDesignIcons
                          name="close"
                          size={15}
                          color={Colors.GRAY_DARK}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {images.length < 5 && (
                    <TouchableOpacity
                      style={[
                        styles.sidePhotoContainer,

                        styles.addSlotContainer,
                      ]}
                      onPress={handleSelectImage}
                    >
                      <MaterialDesignIcons
                        name="plus"
                        size={25}
                        color={Colors.GRAY_DARK}
                      />

                      <Text style={styles.addText}>Tambah</Text>
                    </TouchableOpacity>
                  )}

                  {[...Array(5 - images.length)].map(
                    (_, i) =>
                      i < 1 &&
                      i > 0 && (
                        <View
                          key={`empty-${i}`}
                          style={styles.sidePhotoContainer}
                        />
                      ),
                  )}
                </View>
              </View>
            )}
          </Animated.View>

          <InputMaps
            label="Lokasi Properti di Peta"
            placeholder="Pilih titik di peta"
            iconName="map-outline"
            onPress={() =>
              navigation.navigate('MapPickerScreen', {
                onSelectLocation: ({ latitude, longitude }) => {
                  const latNum = latitude;
                  const lngNum = longitude;
                  setLatitude(latNum);
                  setLongitude(lngNum);
                },
              })
            }
            lat={latitude}
            lng={longitude}
          />

          {/* INPUT: Provinsi */}
          <DropdownSearchable
            key={`province-dropdown-${formattedProvinces.length}`}
            label="Provinsi"
            placeholder="Pilih Provinsi"
            iconName="map-marker-radius" // Ikon diperbarui
            options={formattedProvinces} // Menggunakan data yang diformat
            value={province} // State provinsi
            onSelect={setProvince}
            loading={locationLoading} // Tambahkan indikator loading
          />
          {/* INPUT: Kota */}
          <DropdownSearchable
            key={`city-dropdown-${formattedCities.length}`}
            label="Kota/Kabupaten"
            placeholder={
              province
                ? 'Pilih Kota/Kabupaten'
                : 'Pilih Provinsi terlebih dahulu'
            }
            iconName="city-variant-outline" // Ikon diperbarui
            options={formattedCities} // Menggunakan data yang diformat
            value={city} // State kota
            onSelect={setCity}
            disabled={!province || formattedCities.length === 0} // Nonaktif jika provinsi belum dipilih
            loading={locationLoading}
          />
          {/* INPUT: Kecamatan */}
          <DropdownSearchable
            key={`districts-dropdown-${formattedDistricts.length}`}
            label="Kecamatan"
            placeholder={
              city ? 'Pilih Kecamatan' : 'Pilih Kota/Kabupaten terlebih dahulu'
            }
            iconName="map-marker-path" // Ikon diperbarui
            options={formattedDistricts} // Menggunakan data yang diformat
            value={district} // State kecamatan
            onSelect={setDistrict}
            disabled={!city || formattedDistricts.length === 0} // Nonaktif jika kota belum dipilih
            loading={locationLoading}
          />
          {/* INPUT: Kelurahan */}
          <DropdownSearchable
            key={`subdistricts-dropdown-${formattedVillages.length}`}
            label="Kelurahan / Desa"
            placeholder={
              district
                ? 'Pilih Kelurahan/Desa'
                : 'Pilih Kecamatan terlebih dahulu'
            }
            iconName="map-marker-outline" // Ikon diperbarui
            options={formattedVillages} // Menggunakan data yang diformat
            value={village} // State kelurahan
            onSelect={setVillage}
            disabled={!district || formattedVillages.length === 0} // Nonaktif jika kecamatan belum dipilih
            loading={locationLoading}
          />

          <Input
            label="Kontak Pengiklan (opsional)"
            placeholder="Nomor telepon/WA yang bisa dihubungi"
            iconName="phone"
            keyboardType="phone-pad"
            value={contactNumber}
            onChangeText={setContactNumber}
          />

          {/* INPUT: Alamat Lengkap */}
          <Input
            label="Alamat Lengkap (Jalan, Nomor)"
            placeholder="Masukkan Alamat Properti"
            iconName="map-marker-outline"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          {/* INPUT: Status Properti */}
          <DropdownSearchable
            label="Status Properti"
            placeholder="Pilih Status (Dijual/Disewa/Milik Sendiri)"
            iconName="account-check-outline"
            options={propertyStatuses}
            value={status} // Tambahkan value
            onSelect={setStatus}
          />
          {/* INPUT: Harga */}
          <Input
            label="Harga (Rp)"
            placeholder="Contoh: 500000000"
            iconName="cash-multiple"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          {/* INPUT: Jenis Sertifikat */}
          <DropdownSearchable
            label="Jenis Sertifikat"
            placeholder="Pilih Jenis Sertifikat (SHM/HGB/AJB)"
            iconName="file-certificate-outline"
            options={certificateTypes}
            value={certificateType} // Tambahkan value
            onSelect={setCertificateType}
          />

          {propertyType?.name === 'Rumah' && renderHomeForm()}
          {propertyType?.name === 'Apartemen' && renderApartmentForm()}
          {propertyType?.name === 'Tanah' && renderLandForm()}
          {propertyType?.name === 'Ruko' && renderRukoForm()}
          {propertyType?.name === 'Kantor' && renderOfficeForm()}
          {propertyType?.name === 'Kos/Kontrakan' && renderKosForm()}
          {propertyType?.name === 'Industri/Gudang' && renderWarehouseForm()}

          {/* TOMBOL UPDATE */}
          <View
            style={[
              styles.submitButtonWrapper,
              { paddingBottom: insets.bottom + 40 },
            ]}
          >
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isFormComplete}
              style={[
                styles.submitButton,
                { opacity: isFormComplete ? 1 : 0.5 },
              ]}
              activeOpacity={0.9}
            >
              <Text style={styles.submitText}>Update Aset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </BaseView>
  );
};
const createStyles = (colors, insets) =>
  StyleSheet.create({
    screen: { padding: 20, backgroundColor: colors.BACKGROUND },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: insets.bottom + 80,
    },
    submitButton: {
      width: '100%',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.PRIMARY,
      paddingVertical: 16,
      shadowColor: colors.PRIMARY,
      shadowOpacity: 0.25,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    submitButtonWrapper: {
      marginTop: 20,
      borderRadius: 16,
      backgroundColor: colors.CARD,
      padding: 10,
      shadowColor: colors.BLACK,
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    buttonGradient: {
      width: '100%',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.PRIMARY,
    },
    submitText: {
      color: colors.WHITE,
      fontFamily: Fonts.fontSemiBold,
      fontSize: FontSize.MEDIUM,
    },
    containerRadioButtonInput: {
      backgroundColor: colors.CARD,
      borderRadius: 12,
      padding: 12,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    radioButton: { marginTop: 10 },
    titleRadioButton: {
      fontSize: 12,
      color: colors.TEXT,
      marginBottom: 4,
      fontFamily: Fonts.fontRegular,
    },
    imageWrapper: {
      alignItems: 'center',
      borderRadius: 14,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: colors.CARD,
      shadowColor: colors.BLACK,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    singleAddContainer: {
      width: '90%',
      aspectRatio: 1.5,
      borderRadius: 15,
      backgroundColor: colors.CARD,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginVertical: 15,
      borderWidth: 2,
      borderColor: colors.GRAY_LIGHT,
      borderStyle: 'dashed',
    },
    placeholder: { justifyContent: 'center', alignItems: 'center' },
    placeholderIcon: { fontSize: 40, color: colors.GREY },
    placeholderText: {
      color: colors.GREY,
      marginTop: 5,
      fontFamily: Fonts.fontRegular,
    },
    photoGrid: { justifyContent: 'center', alignItems: 'center', flex: 1 },
    mainPhotoContainer: {
      width: '100%',
      aspectRatio: 1.5,
      borderWidth: 1,
      borderColor: colors.WHITE_20,
      overflow: 'hidden',
      backgroundColor: colors.HAZE,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    mainPhoto: { width: '100%', height: '100%' },
    label: {
      fontSize: 12,
      color: colors.GRAY_DARK,
      marginBottom: 4,
      fontFamily: Fonts.fontRegular,
    },
    sideGrid: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    sidePhotoContainer: {
      width: Sizes.widthScreen / 5.5,
      height: Sizes.widthScreen / 5.5,
      borderRadius: 12,
      backgroundColor: colors.WHITE_20,
      margin: 5,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
    },
    sidePhoto: { width: '100%', height: '100%', borderRadius: 12 },
    addSlotContainer: {
      backgroundColor: colors.WHITE_20,
      borderWidth: 1,
      borderColor: colors.WHITE_50,
    },
    addText: {
      color: colors.TEXT,
      fontFamily: Fonts.fontRegular,
      fontSize: 13,
    },
    removeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: colors.BLACK_50,
      borderBottomLeftRadius: 15,
      padding: 3,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
  });

export default EditPropertyScreen;
