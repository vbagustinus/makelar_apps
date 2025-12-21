import React, { use, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import {
  BaseView,
  DropdownSearchable,
  Input,
  InputMaps,
  Text,
} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { launchImageLibrary } from 'react-native-image-picker';
import { Colors, FontSize, Sizes } from '../../styles';
import {
  propertyCategories,
  propertyStatuses,
  certificateTypes,
  Fonts,
} from '../../constants';
import { DatePicker } from '../../components/DatePicker';
import { useNavigation } from '@react-navigation/native';
import { useInterstitialAd } from '../ads';
import usePropertyStore from '../../store/usePropertyStore';
import useAuthStore from '../../store/useAuthStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from '@d11/react-native-fast-image';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

// ===============================================
// Komponen Layar Tambah Properti
// ===============================================

const AddPropertyScreen = () => {
  const navigation = useNavigation();
  // Mengasumsikan Anda memiliki Store Properti yang sesuai
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  const savePropertyData = usePropertyStore(state => state.savePropertyData);
  const fetchProperties = usePropertyStore(state => state.fetchProperties);
  const resetFlags = usePropertyStore(state => state.resetFlags);
  const globalLoading = usePropertyStore(state => state.globalLoading);
  const listPropertyError = usePropertyStore(state => state.listPropertyError);
  const savePropertySuccess = usePropertyStore(
    state => state.savePropertySuccess,
  );
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

  // Data Master yang MUNGKIN diperlukan (Contoh: Daftar pemilik sebelumnya/developer/agen)
  const listDevelopers = usePropertyStore(state => state.listDevelopers); // Contoh data master
  const listAgents = usePropertyStore(state => state.listAgents); // Contoh data master

  // --- STATE LOKAL UNTUK FORM PROPERTI ---
  const [images, setImages] = useState([]);
  const [propertyType, setPropertyType] = useState(null);
  const [propertyName, setPropertyName] = useState('');
  const [status, setStatus] = useState(null);
  const [certificateType, setCertificateType] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [selectedRBPurchaseDate, setSelectedRBPurchaseDate] = useState(
    'Select Purchase Date',
  );
  const [certificateNumber, setCertificateNumber] = useState('');
  const [address, setAddress] = useState('');

  const [notes, setNotes] = useState('');

  // State untuk Data Keuangan/Harga
  const [price, setPrice] = useState('');

  // State untuk Detail Tambahan (misalnya, Luas)
  const [landArea, setLandArea] = useState('');
  const [buildingArea, setBuildingArea] = useState('');

  // State untuk Pihak Terkait (Mengganti Silsilah Jantan/Betina)
  const [selectedRBPurchaser, setSelectedRBPurchaser] =
    useState('Enter Manually');
  const [selectedPurchaser, setSelectedPurchaser] = useState(null);
  const [purchaserName, setPurchaserName] = useState('');

  const [selectedRBSeller, setSelectedRBSeller] = useState('Enter Manually');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerName, setSellerName] = useState('');

  // --- FIELDS RUMAH (HOUSE) ---
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [floors, setFloors] = useState('');
  const [garage, setGarage] = useState('');
  const [builtYear, setBuiltYear] = useState('');
  const [electricPower, setElectricPower] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [facing, setFacing] = useState('');
  const [furnished, setFurnished] = useState(null);
  const [roadWidth, setRoadWidth] = useState('');
  const [carAccess, setCarAccess] = useState('');
  const [environmentType, setEnvironmentType] = useState('');
  const [condition, setCondition] = useState('');
  const [renovationYear, setRenovationYear] = useState('');
  const [legalOwnerName, setLegalOwnerName] = useState('');
  const [imbNumber, setImbNumber] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');

  // --- FIELDS APARTEMEN ---
  const [tower, setTower] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [unitType, setUnitType] = useState(null);
  const [maintenanceFee, setMaintenanceFee] = useState('');
  const [balcony, setBalcony] = useState('');
  const [apartmentFacilities, setApartmentFacilities] = useState('');

  // --- FIELDS TANAH (LAND) ---
  const [landShape, setLandShape] = useState('');
  const [frontageWidth, setFrontageWidth] = useState('');
  const [zoning, setZoning] = useState('');
  const [contour, setContour] = useState('');
  const [roadType, setRoadType] = useState('');

  // --- FIELDS RUKO ---
  const [buildingWidth, setBuildingWidth] = useState('');
  const [buildingLength, setBuildingLength] = useState('');
  const [parkingSpace, setParkingSpace] = useState('');
  const [restroomCount, setRestroomCount] = useState('');
  const [electricityType, setElectricityType] = useState('');
  const [businessSuitableFor, setBusinessSuitableFor] = useState('');

  // --- FIELDS KANTOR (OFFICE) ---
  const [officeType, setOfficeType] = useState('');
  const [meetingRoomCount, setMeetingRoomCount] = useState('');
  const [workspaceCapacity, setWorkspaceCapacity] = useState('');
  const [pantry, setPantry] = useState('');
  const [toiletType, setToiletType] = useState('');

  // --- FIELDS KOS/KONTRAKAN ---
  const [totalRooms, setTotalRooms] = useState('');
  const [occupiedRooms, setOccupiedRooms] = useState('');
  const [roomFacilities, setRoomFacilities] = useState('');
  const [bathroomInside, setBathroomInside] = useState('');
  const [incomePerMonth, setIncomePerMonth] = useState('');
  const [rules, setRules] = useState('');

  // --- FIELDS INDUSTRI/GUDANG ---
  const [ceilingHeight, setCeilingHeight] = useState('');
  const [loadingDock, setLoadingDock] = useState('');
  const [truckAccess, setTruckAccess] = useState('');
  const [powerCapacity, setPowerCapacity] = useState('');
  const [floorStrength, setFloorStrength] = useState('');

  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);

  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [village, setVillage] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: {
      address: '',
      latitude: null,
      longitude: null,
      province: null,
      city: null,
      district: null,
      village: null,
    },
    price: '',
    images: [],
    // RUMAH
    landSize: '', // luas tanah
    buildingSize: '', // luas bangunan
    bedrooms: '',
    bathrooms: '',
    garage: '',
    floors: '',
    certificate: '', // SHM/HGB/dll
    builtYear: '', // tahun bangun
    category: 'Rumah',
    // APARTEMENT
    tower: '',
    floorNumber: '',
    unitNumber: '',
    unitType: '', // (Studio / 1BR / 2BR / 3BR / Penthouse)
    maintenanceFee: '', // (IPL)
    furnished: '',
    balcony: '', // (boolean)
    apartmentFacilities: '', // (Gym, Pool, 24h Security, dll)
    // TANAH
    landShape: '', // (Kotak / Tidak Beraturan)
    frontageWidth: '', // (Lebar muka)
    zoning: '', // (Permukiman / Komersial / Industri)
    contour: '', // (Datar / Miring)
    roadType: '', // (Aspal / Beton / Tanah)
    // RUKO
    floors: '',
    buildingWidth: '',
    buildingLength: '',
    parkingSpace: '',
    restroomCount: '',
    electricityType: '', // (Listrik industri/toko)
    businessSuitableFor: '', // (opsional)
    // KANTOR
    floorNumber: '',
    officeType: '', // (Bare / Semi Furnished / Full Furnished)
    meetingRoomCount: '',
    workspaceCapacity: '',
    pantry: '', // (boolean)
    toiletType: '', // (Internal / Shared)
    // KOS/KONTRAKAN
    totalRooms: '',
    occupiedRooms: '',
    roomFacilities: '', // (AC, KM Dalam, WiFi)
    bathroomInside: '', // (boolean)
    incomePerMonth: '', // (estimasi pemasukan)
    rules: '', // (bebas/putra/putri)
    // INDUSTRI / GUDANG
    ceilingHeight: '', // (tinggi gudang)
    loadingDock: '', // (boolean)
    truckAccess: '', // (Tronton / Kontainer)
    powerCapacity: '', // (Daya listrik industri)
    buildingLength: '',
    buildingWidth: '',
    floorStrength: '', // (berapa ton/m²)
  });

  // Cek apakah semua form wajib telah terisi
  const isFormComplete =
    propertyType?.id &&
    propertyName.trim() !== '' &&
    status?.id &&
    certificateType?.id &&
    (selectedRBPurchaseDate === 'Select Purchase Date' ? purchaseDate : true) &&
    address.trim() !== '' &&
    price.trim() !== '' &&
    landArea.trim() !== '' &&
    buildingArea.trim() !== '' &&
    bedrooms.trim() !== '' &&
    bathrooms.trim() !== '' &&
    floors.trim() !== '' &&
    builtYear.trim() !== '' &&
    (selectedRBPurchaser === 'Enter Manually'
      ? purchaserName.trim() !== ''
      : selectedPurchaser?.id) &&
    (selectedRBSeller === 'Enter Manually'
      ? sellerName.trim() !== ''
      : selectedSeller?.id) &&
    images.length >= 1 &&
    province?.id && // WAJIB LOKASI
    city?.id &&
    district?.id &&
    village?.id;

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

  // ===============================================
  // HOOKS PENGAMBILAN DATA LOKASI
  // ===============================================

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    console.log('province', province);

    if (province) {
      // Reset state kota, kecamatan, kelurahan saat provinsi berubah
      setCity(null);
      setDistrict(null);
      setVillage(null);
      fetchCitiesByProvince(province.id);
    }
  }, [province]);

  useEffect(() => {
    if (city) {
      // Reset state kecamatan, kelurahan saat kota berubah
      setDistrict(null);
      setVillage(null);
      fetchDistrictsByCity(city.id);
    }
  }, [city]);

  useEffect(() => {
    if (district) {
      // Reset state kelurahan saat kecamatan berubah
      setVillage(null);
      fetchVillagesByDistrict(district.id);
    }
  }, [district]);

  useEffect(() => {
    console.log('locationError', locationError);
  }, [locationError]);

  const { showAd } = useInterstitialAd(() => {
    resetFlags();
    navigation.goBack();
  });

  const handleSubmit = () => {
    if (!isFormComplete) {
      Alert.alert('Peringatan', 'Mohon lengkapi semua kolom yang wajib diisi.');
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
      return uri && uri.match(/\.(jpe?g|png)$/i);
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

    savePropertyData({
      propertyTypeId: propertyType?.id,
      propertyTypeName: propertyType?.name,
      propertyName,
      statusId: status?.id,
      certificateTypeId: certificateType?.id,
      purchaseDate:
        selectedRBPurchaseDate === 'Select Purchase Date' ? purchaseDate : null,
      certificateNumber,
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
      furnished: furnished?.name,
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
      unitType: unitType?.name,
      maintenanceFee,
      balcony,
      apartmentFacilities,
      // TANAH
      landShape: landShape?.name,
      frontageWidth,
      zoning: zoning?.name,
      contour: contour?.name,
      roadType: roadType?.name,
      // RUKO
      buildingWidth,
      buildingLength,
      parkingSpace,
      restroomCount,
      electricityType: electricityType?.name,
      businessSuitableFor,
      // KANTOR
      officeType: officeType?.name,
      meetingRoomCount,
      workspaceCapacity,
      pantry,
      toiletType: toiletType?.name,
      // KOS/KONTRAKAN
      totalRooms,
      occupiedRooms,
      roomFacilities,
      bathroomInside: bathroomInside?.name,
      incomePerMonth,
      rules: rules?.name,
      // INDUSTRI/GUDANG
      ceilingHeight,
      loadingDock: loadingDock?.name,
      truckAccess: truckAccess?.name,
      powerCapacity,
      floorStrength,
      // Data Pihak Terkait (Pembeli)
      selectedRBPurchaser,
      purchaserName:
        selectedRBPurchaser === 'Enter Manually' ? purchaserName : '',
      purchaserId:
        selectedRBPurchaser === 'Enter Manually' ? null : selectedPurchaser?.id,
      // Data Pihak Terkait (Penjual)
      selectedRBSeller,
      sellerName: selectedRBSeller === 'Enter Manually' ? sellerName : '',
      sellerId:
        selectedRBSeller === 'Enter Manually' ? null : selectedSeller?.id,
      notes,
      images: images,
      uid: token,
      // LOKASI
      province: province?.name,
      city: city?.name,
      district: district?.name,
      village: village?.name,
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
    setPurchaseDate(new Date());
    setCertificateNumber('');
    setAddress('');
    setNotes('');
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
    setSelectedRBPurchaseDate('Select Purchase Date');
    setSelectedRBPurchaser('Enter Manually');
    setSelectedPurchaser(null);
    setSelectedRBSeller('Enter Manually');
    setSelectedSeller(null);
    setPurchaserName('');
    setSellerName('');
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
    if (savePropertySuccess) {
      resetFields();
      fetchProperties();
      showAd();
    }
  }, [savePropertySuccess]);

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
            label='Luas Tanah (m²)'
            placeholder='Contoh: 120'
            iconName='ruler-square'
            keyboardType='numeric'
            value={landArea}
            onChangeText={setLandArea}
          />

          <Input
            label='Luas Bangunan (m²)'
            placeholder='Contoh: 90'
            iconName='home-floor-1'
            keyboardType='numeric'
            value={buildingArea}
            onChangeText={setBuildingArea}
          />

          <Input
            label='Jumlah Kamar Tidur'
            placeholder='Contoh: 3'
            iconName='bed-double-outline'
            keyboardType='numeric'
            value={bedrooms}
            onChangeText={setBedrooms}
          />

          <Input
            label='Jumlah Kamar Mandi'
            placeholder='Contoh: 2'
            iconName='shower-head'
            keyboardType='numeric'
            value={bathrooms}
            onChangeText={setBathrooms}
          />

          <Input
            label='Jumlah Lantai'
            placeholder='Contoh: 2'
            iconName='stairs'
            keyboardType='numeric'
            value={floors}
            onChangeText={setFloors}
          />

          <Input
            label='Garasi / Carport (kapasitas)'
            placeholder='Contoh: 1 Mobil'
            iconName='car'
            value={garage}
            onChangeText={setGarage}
          />

          <Input
            label='Tahun Dibangun'
            placeholder='Contoh: 2018'
            iconName='calendar-range'
            keyboardType='numeric'
            value={builtYear}
            onChangeText={setBuiltYear}
          />

          {/* ======= INPUT TAMBAHAN (Kelengkapan & Lingkungan) ======= */}
          <Input
            label='Daya Listrik (Watt)'
            placeholder='Contoh: 1300'
            iconName='flash'
            keyboardType='numeric'
            value={electricPower}
            onChangeText={setElectricPower}
          />

          <Input
            label='Sumber Air'
            placeholder='Contoh: PDAM / Sumur'
            iconName='water'
            value={waterSource}
            onChangeText={setWaterSource}
          />

          <Input
            label='Arah Hadap'
            placeholder='Contoh: Timur'
            iconName='compass'
            value={facing}
            onChangeText={setFacing}
          />

          <DropdownSearchable
            label='Status Furnitur'
            placeholder='Pilih Status Furnitur'
            iconName='sofa'
            options={[
              { id: 1, name: 'Unfurnished' },
              { id: 2, name: 'Semi Furnished' },
              { id: 3, name: 'Full Furnished' }
            ]}
            value={furnished}
            onSelect={setFurnished}
          />

          <Input
            label='Lebar Jalan (m)'
            placeholder='Contoh: 6'
            iconName='road-variant'
            keyboardType='numeric'
            value={roadWidth}
            onChangeText={setRoadWidth}
          />

          <Input
            label='Akses Kendaraan'
            placeholder='Contoh: Mobil / Motor only'
            iconName='truck'
            value={carAccess}
            onChangeText={setCarAccess}
          />

          <Input
            label='Tipe Lingkungan'
            placeholder='Contoh: Perumahan / Cluster / Kampung'
            iconName='domain'
            value={environmentType}
            onChangeText={setEnvironmentType}
          />

          <Input
            label='Kondisi Rumah'
            placeholder='Contoh: Baru / Bekas / Direnovasi'
            iconName='tools'
            value={condition}
            onChangeText={setCondition}
          />

          <Input
            label='Tahun Renovasi (jika ada)'
            placeholder='Contoh: 2022'
            iconName='calendar-edit'
            keyboardType='numeric'
            value={renovationYear}
            onChangeText={setRenovationYear}
          />

          <Input
            label='Nama Pemilik Sertifikat'
            placeholder='Nama di sertifikat'
            iconName='account'
            value={legalOwnerName}
            onChangeText={setLegalOwnerName}
          />

          <Input
            label='Nomor IMB / Izin'
            placeholder='Jika ada'
            iconName='file-document'
            value={imbNumber}
            onChangeText={setImbNumber}
          />

          <Input
            label='Iuran Bulanan / Security (Rp)'
            placeholder='Contoh: 50000'
            iconName='cash'
            keyboardType='numeric'
            value={monthlyFee}
            onChangeText={setMonthlyFee}
          />
      </>
    )
  };

  const renderApartmentForm = () => {
    return (
      <>
        {/* ======= INPUT APARTEMEN ======= */}
        <Input
          label='Luas Unit (m²)'
          placeholder='Contoh: 90'
          iconName='home-floor-1'
          keyboardType='numeric'
          value={buildingArea}
          onChangeText={setBuildingArea}
        />

        <Input
          label='Tower / Blok'
          placeholder='Contoh: Melati, A, Tower 1'
          iconName='building'
          value={tower}
          onChangeText={setTower}
        />

        <Input
          label='Lantai'
          placeholder='Contoh: 2'
          iconName='layers'
          keyboardType='numeric'
          value={floorNumber}
          onChangeText={setFloorNumber}
        />

        <Input
          label='Nomor Unit'
          placeholder='Contoh: 201'
          iconName='door'
          value={unitNumber}
          onChangeText={setUnitNumber}
        />

        <DropdownSearchable
          label='Tipe Unit'
          placeholder='Pilih Tipe Unit'
          iconName='sofa'
          options={[
            { id: 1, name: 'Studio' },
            { id: 2, name: '1 Kamar Tidur' },
            { id: 3, name: '2 Kamar Tidur' },
            { id: 4, name: '3 Kamar Tidur' },
            { id: 5, name: 'Penthouse' },
            { id: 6, name: 'Lainnya' }
          ]}
          value={unitType}
          onSelect={setUnitType}
        />

        <Input
          label='Biaya IPL/Maintenance (Rp)'
          placeholder='Contoh: 500000'
          iconName='cash'
          keyboardType='numeric'
          value={maintenanceFee}
          onChangeText={setMaintenanceFee}
        />

        <DropdownSearchable
          label='Status Furnitur'
          placeholder='Pilih Status Furnitur'
          iconName='sofa'
          options={[
            { id: 1, name: 'Unfurnished' },
            { id: 2, name: 'Semi Furnished' },
            { id: 3, name: 'Full Furnished' }
          ]}
          value={furnished}
          onSelect={setFurnished}
        />

        <Input
          label='Balkon'
          placeholder='Contoh: Ada / Tidak Ada'
          iconName='window-open'
          value={balcony}
          onChangeText={setBalcony}
        />

        <Input
          label='Fasilitas'
          placeholder='Contoh: Gym, Pool, Security 24h, Lift'
          iconName='star'
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
          label='Luas Tanah (m²)'
          placeholder='Contoh: 500'
          iconName='ruler-square'
          keyboardType='numeric'
          value={landArea}
          onChangeText={setLandArea}
        />

        <DropdownSearchable
          label='Bentuk Tanah'
          placeholder='Pilih Bentuk Tanah'
          iconName='shape'
          options={[
            { id: 1, name: 'Kotak / Persegi' },
            { id: 2, name: 'Segitiga' },
            { id: 3, name: 'Trapesium' },
            { id: 4, name: 'Tidak Beraturan' }
          ]}
          value={landShape}
          onSelect={setLandShape}
        />

        <Input
          label='Lebar Muka Tanah (m)'
          placeholder='Contoh: 20'
          iconName='ruler'
          keyboardType='numeric'
          value={frontageWidth}
          onChangeText={setFrontageWidth}
        />

        <DropdownSearchable
          label='Zona / Tujuan Lahan'
          placeholder='Pilih Zona'
          iconName='map'
          options={[
            { id: 1, name: 'Permukiman' },
            { id: 2, name: 'Komersial' },
            { id: 3, name: 'Industri' },
            { id: 4, name: 'Pertanian' },
            { id: 5, name: 'Campuran' }
          ]}
          value={zoning}
          onSelect={setZoning}
        />

        <DropdownSearchable
          label='Kontur Tanah'
          placeholder='Pilih Kontur'
          iconName='terrain'
          options={[
            { id: 1, name: 'Datar' },
            { id: 2, name: 'Miring Ringan' },
            { id: 3, name: 'Miring Sedang' },
            { id: 4, name: 'Miring Curam' }
          ]}
          value={contour}
          onSelect={setContour}
        />

        <DropdownSearchable
          label='Jenis Jalan'
          placeholder='Pilih Jenis Jalan'
          iconName='road'
          options={[
            { id: 1, name: 'Aspal' },
            { id: 2, name: 'Beton' },
            { id: 3, name: 'Tanah' },
            { id: 4, name: 'Macadam' }
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
          label='Luas Tanah (m²)'
          placeholder='Contoh: 120'
          iconName='ruler-square'
          keyboardType='numeric'
          value={landArea}
          onChangeText={setLandArea}
        />

        <Input
          label='Luas Bangunan (m²)'
          placeholder='Contoh: 80'
          iconName='home-floor-1'
          keyboardType='numeric'
          value={buildingArea}
          onChangeText={setBuildingArea}
        />

        <Input
          label='Jumlah Lantai'
          placeholder='Contoh: 2'
          iconName='layers'
          keyboardType='numeric'
          value={floors}
          onChangeText={setFloors}
        />

        <Input
          label='Lebar Bangunan (m)'
          placeholder='Contoh: 6'
          iconName='ruler'
          keyboardType='numeric'
          value={buildingWidth}
          onChangeText={setBuildingWidth}
        />

        <Input
          label='Panjang Bangunan (m)'
          placeholder='Contoh: 20'
          iconName='ruler'
          keyboardType='numeric'
          value={buildingLength}
          onChangeText={setBuildingLength}
        />

        <Input
          label='Tempat Parkir'
          placeholder='Contoh: 2 Mobil'
          iconName='parking'
          value={parkingSpace}
          onChangeText={setParkingSpace}
        />

        <Input
          label='Jumlah Kamar Mandi'
          placeholder='Contoh: 2'
          iconName='shower-head'
          keyboardType='numeric'
          value={restroomCount}
          onChangeText={setRestroomCount}
        />

        <DropdownSearchable
          label='Jenis Listrik'
          placeholder='Pilih Jenis Listrik'
          iconName='flash'
          options={[
            { id: 1, name: 'Toko (900 VA)' },
            { id: 2, name: 'Toko Besar (1300 VA)' },
            { id: 3, name: 'Industri' }
          ]}
          value={electricityType}
          onSelect={setElectricityType}
        />

        <Input
          label='Cocok Untuk Bisnis'
          placeholder='Contoh: Toko, Salon, Warung'
          iconName='briefcase'
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
          label='Luas Bangunan (m²)'
          placeholder='Contoh: 500'
          iconName='home-floor-1'
          keyboardType='numeric'
          value={buildingArea}
          onChangeText={setBuildingArea}
        />

        <Input
          label='Lantai / Floor'
          placeholder='Contoh: 5'
          iconName='layers'
          keyboardType='numeric'
          value={floorNumber}
          onChangeText={setFloorNumber}
        />

        <DropdownSearchable
          label='Tipe Kantor'
          placeholder='Pilih Tipe Kantor'
          iconName='briefcase'
          options={[
            { id: 1, name: 'Bare (Kosong)' },
            { id: 2, name: 'Semi Furnished' },
            { id: 3, name: 'Full Furnished' }
          ]}
          value={officeType}
          onSelect={setOfficeType}
        />

        <Input
          label='Jumlah Ruang Rapat'
          placeholder='Contoh: 3'
          iconName='door-multiple'
          keyboardType='numeric'
          value={meetingRoomCount}
          onChangeText={setMeetingRoomCount}
        />

        <Input
          label='Kapasitas Workspace'
          placeholder='Contoh: 50 orang'
          iconName='seat'
          value={workspaceCapacity}
          onChangeText={setWorkspaceCapacity}
        />

        <Input
          label='Pantry / Dapur'
          placeholder='Contoh: Ada / Tidak Ada'
          iconName='food'
          value={pantry}
          onChangeText={setPantry}
        />

        <DropdownSearchable
          label='Jenis Toilet'
          placeholder='Pilih Jenis Toilet'
          iconName='toilet'
          options={[
            { id: 1, name: 'Internal (Dalam Unit)' },
            { id: 2, name: 'Shared (Bersama)' }
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
          label='Total Kamar'
          placeholder='Contoh: 10'
          iconName='door-multiple'
          keyboardType='numeric'
          value={totalRooms}
          onChangeText={setTotalRooms}
        />

        <Input
          label='Kamar Terisi'
          placeholder='Contoh: 8'
          iconName='door-open'
          keyboardType='numeric'
          value={occupiedRooms}
          onChangeText={setOccupiedRooms}
        />

        <Input
          label='Fasilitas Kamar'
          placeholder='Contoh: AC, WiFi, KM Dalam'
          iconName='star'
          value={roomFacilities}
          onChangeText={setRoomFacilities}
        />

        <DropdownSearchable
          label='Kamar Mandi'
          placeholder='Pilih Tipe KM'
          iconName='shower-head'
          options={[
            { id: 1, name: 'Dalam Kamar' },
            { id: 2, name: 'Bersama' },
            { id: 3, name: 'Campuran' }
          ]}
          value={bathroomInside}
          onSelect={setBathroomInside}
        />

        <Input
          label='Pendapatan Per Bulan (Rp)'
          placeholder='Contoh: 4000000'
          iconName='cash'
          keyboardType='numeric'
          value={incomePerMonth}
          onChangeText={setIncomePerMonth}
        />

        <DropdownSearchable
          label='Aturan Penghuni'
          placeholder='Pilih Aturan'
          iconName='file-document'
          options={[
            { id: 1, name: 'Bebas (Putra/Putri)' },
            { id: 2, name: 'Putra Saja' },
            { id: 3, name: 'Putri Saja' }
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
          label='Luas Bangunan (m²)'
          placeholder='Contoh: 1000'
          iconName='home-floor-1'
          keyboardType='numeric'
          value={buildingArea}
          onChangeText={setBuildingArea}
        />

        <Input
          label='Lebar Bangunan (m)'
          placeholder='Contoh: 30'
          iconName='ruler'
          keyboardType='numeric'
          value={buildingWidth}
          onChangeText={setBuildingWidth}
        />

        <Input
          label='Panjang Bangunan (m)'
          placeholder='Contoh: 50'
          iconName='ruler'
          keyboardType='numeric'
          value={buildingLength}
          onChangeText={setBuildingLength}
        />

        <Input
          label='Tinggi Ruangan (m)'
          placeholder='Contoh: 6'
          iconName='layers'
          keyboardType='numeric'
          value={ceilingHeight}
          onChangeText={setCeilingHeight}
        />

        <DropdownSearchable
          label='Loading Dock'
          placeholder='Pilih Ketersediaan'
          iconName='truck-loading'
          options={[
            { id: 1, name: 'Ada' },
            { id: 2, name: 'Tidak Ada' }
          ]}
          value={loadingDock}
          onSelect={setLoadingDock}
        />

        <DropdownSearchable
          label='Akses Kendaraan'
          placeholder='Pilih Tipe Akses'
          iconName='truck'
          options={[
            { id: 1, name: 'Tronton' },
            { id: 2, name: 'Kontainer' },
            { id: 3, name: 'Keduanya' }
          ]}
          value={truckAccess}
          onSelect={setTruckAccess}
        />

        <Input
          label='Kapasitas Listrik (kVA)'
          placeholder='Contoh: 100'
          iconName='flash'
          keyboardType='numeric'
          value={powerCapacity}
          onChangeText={setPowerCapacity}
        />

        <Input
          label='Daya Tampung Lantai (Ton/m²)'
          placeholder='Contoh: 5'
          iconName='weight'
          keyboardType='numeric'
          value={floorStrength}
          onChangeText={setFloorStrength}
        />
      </>
    );
  };

  return (
    <BaseView
      title='Tambah Properti Baru'
      isScrollable={false}
      loading={globalLoading || locationLoading}
      onBackPress={() => navigation.pop()}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={100}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screen}>
          {/* INPUT: Nama/Judul Properti */}
          <Input
            label='Nama / Judul Properti'
            placeholder='Contoh: Rumah Minimalis Jakarta, Tanah Kavling Blok B'
            iconName='bookmark-multiple-outline'
            value={propertyName}
            onChangeText={setPropertyName}
          />
          {/* INPUT: Tipe Properti */}
          <DropdownSearchable
            label='Tipe Properti'
            placeholder='Pilih Tipe Properti (Rumah/Tanah/Toko)'
            iconName='home-city-outline'
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
                      name='close'
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
                          name='close'
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
                        name='plus'
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
            label='Lokasi Properti di Peta'
            placeholder='Pilih titik di peta'
            iconName='map-outline'
            onPress={() =>
              navigation.navigate('MapPickerScreen', {
                onSelectLocation: ({ latitude, longitude }) => {
                  const latNum = latitude;
                  const lngNum = longitude;
                  setLatitude(latNum);
                  setLongitude(lngNum);
                  setForm({
                    ...form.location,
                    latitude: latNum,
                    longitude: lngNum,
                  });
                  console.log('????', latNum, lngNum);
                },
              })
            }
            lat={latitude}
            lng={longitude}
          />

          {/* INPUT: Provinsi */}
          <DropdownSearchable
            key={`province-dropdown-${formattedProvinces.length}`}
            label='Provinsi'
            placeholder='Pilih Provinsi'
            iconName='map-marker-radius' // Ikon diperbarui
            options={formattedProvinces} // Menggunakan data yang diformat
            value={province} // State provinsi
            onSelect={setProvince}
            loading={locationLoading} // Tambahkan indikator loading
          />
          {/* INPUT: Kota */}
          <DropdownSearchable
            key={`city-dropdown-${formattedCities.length}`}
            label='Kota/Kabupaten'
            placeholder={
              province
                ? 'Pilih Kota/Kabupaten'
                : 'Pilih Provinsi terlebih dahulu'
            }
            iconName='city-variant-outline' // Ikon diperbarui
            options={formattedCities} // Menggunakan data yang diformat
            value={city} // State kota
            onSelect={setCity}
            disabled={!province || formattedCities.length === 0} // Nonaktif jika provinsi belum dipilih
            loading={locationLoading}
          />
          {/* INPUT: Kecamatan */}
          <DropdownSearchable
            key={`districts-dropdown-${formattedDistricts.length}`}
            label='Kecamatan'
            placeholder={
              city ? 'Pilih Kecamatan' : 'Pilih Kota/Kabupaten terlebih dahulu'
            }
            iconName='map-marker-path' // Ikon diperbarui
            options={formattedDistricts} // Menggunakan data yang diformat
            value={district} // State kecamatan
            onSelect={setDistrict}
            disabled={!city || formattedDistricts.length === 0} // Nonaktif jika kota belum dipilih
            loading={locationLoading}
          />
          {/* INPUT: Kelurahan */}
          <DropdownSearchable
            key={`subdistricts-dropdown-${formattedVillages.length}`}
            label='Kelurahan / Desa'
            placeholder={
              district
                ? 'Pilih Kelurahan/Desa'
                : 'Pilih Kecamatan terlebih dahulu'
            }
            iconName='map-marker-outline' // Ikon diperbarui
            options={formattedVillages} // Menggunakan data yang diformat
            value={village} // State kelurahan
            onSelect={setVillage}
            disabled={!district || formattedVillages.length === 0} // Nonaktif jika kecamatan belum dipilih
            loading={locationLoading}
          />

          {/* INPUT: Alamat Lengkap */}
          <Input
            label='Alamat Lengkap (Jalan, Nomor)'
            placeholder='Masukkan Alamat Properti'
            iconName='map-marker-outline'
            value={address}
            onChangeText={setAddress}
            multiline
          />

          {/* INPUT: Status Properti */}
          <DropdownSearchable
            label='Status Properti'
            placeholder='Pilih Status (Dijual/Disewa/Milik Sendiri)'
            iconName='account-check-outline'
            options={propertyStatuses}
            value={status} // Tambahkan value
            onSelect={setStatus}
          />
          {/* INPUT: Jenis Sertifikat */}
          <DropdownSearchable
            label='Jenis Sertifikat'
            placeholder='Pilih Jenis Sertifikat (SHM/HGB/AJB)'
            iconName='file-certificate-outline'
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

          {/* TOMBOL SIMPAN */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormComplete}
            style={[styles.submitButton, { opacity: isFormComplete ? 1 : 0.8 }]}
          >
            <Text style={styles.submitText}>Simpan Aset</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </BaseView>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: Colors.WHITE },
  scrollContainer: { paddingBottom: 40, flexGrow: 1 },
  submitButton: {
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
  },
  buttonGradient: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY,
  },
  submitText: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
    fontSize: FontSize.MEDIUM,
  },
  containerRadioButtonInput: {
    backgroundColor: '#ffffff30',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  radioButton: { marginTop: 10 },
  titleRadioButton: {
    fontSize: 12,
    color: Colors.GRAY_DARK,
    marginBottom: 4,
    fontFamily: Fonts.fontRegular,
  },
  imageWrapper: {
    alignItems: 'center',
    borderRadius: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT, // lebih soft
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.WHITE,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  singleAddContainer: {
    width: '90%',
    aspectRatio: 1.5,
    borderRadius: 15,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15,
    borderWidth: 2,
    borderColor: Colors.GRAY_DARK,
    borderStyle: 'dashed',
  },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderIcon: { fontSize: 40, color: Colors.GRAY_DARK },
  placeholderText: {
    color: Colors.GRAY_DARK,
    marginTop: 5,
    fontFamily: Fonts.fontRegular,
  },
  photoGrid: { justifyContent: 'center', alignItems: 'center', flex: 1, },
  mainPhotoContainer: {
    width: '100%',
    aspectRatio: 1.5,
    borderWidth: 1,
    borderColor: Colors.WHITE_20,
    overflow: 'hidden',
    backgroundColor: Colors.BLACK_20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  mainPhoto: { width: '100%', height: '100%' },
  label: {
    fontSize: 12,
    color: Colors.GRAY_DARK,
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
    backgroundColor: Colors.WHITE_20,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  sidePhoto: { width: '100%', height: '100%', borderRadius: 12 },
  addSlotContainer: {
    backgroundColor: Colors.WHITE_20,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  addText: {
    color: Colors.GRAY_DARK,
    fontFamily: Fonts.fontRegular,
    fontSize: 13,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.BLACK_50,
    borderBottomLeftRadius: 15,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default AddPropertyScreen;
