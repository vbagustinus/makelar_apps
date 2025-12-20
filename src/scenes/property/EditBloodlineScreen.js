import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  BaseView,
  DropdownSearchable,
  DropdownSearchableDefault,
  Input,
  InputDefault,
  RadioButton,
  Text,
} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Colors, FontSize, Sizes } from '../../styles';
import {
  birdColors,
  eyeColorOptions,
  Fonts,
  genderOptions,
  pigeonTypes,
} from '../../constants';
import { DatePicker } from '../../components/DatePicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useInterstitialAd } from '../ads';
import useAuthStore from '../../store/useAuthStore';
import useBloodlineStore from '../../store/usePropertyStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from '@d11/react-native-fast-image';
import Animated, { FadeInUp } from 'react-native-reanimated';

dayjs.locale('en'); // Set language to English

const EditBloodlineScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route?.params || {};
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  const updatePigeonData = useBloodlineStore(state => state.updatePigeonData);
  const fetchPigeons = useBloodlineStore(state => state.fetchPigeons);
  const resetFlags = useBloodlineStore(state => state.resetFlags);
  const globalLoading = useBloodlineStore(state => state.globalLoading);
  const listPigeonError = useBloodlineStore(state => state.listPigeonError);
  const updatePigeonSuccess = useBloodlineStore(
    state => state.updatePigeonSuccess,
  );
  const listPigeonMale = useBloodlineStore(state => state.listPigeonMale);
  const listPigeonFemale = useBloodlineStore(state => state.listPigeonFemale);

  const [images, setImages] = useState([]);
  const [pigeonType, setPigeonType] = useState(null);
  const [name, setName] = useState(item?.name || '');
  const [color, setColor] = useState(null);
  const [gender, setGender] = useState(null);
  const [eyeColor, setEyeColor] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [selectedRBDateOfBirth, setSelectedRBDateOfBirth] = useState(
    'Select Date of Birth',
  );
  const [ringName, setRingName] = useState('');
  const [selectedRBBloodlineMale, setSelectedRBBloodlineMale] =
    useState('Choose From Saved');
  const [selectedBloodlineMale, setSelectedBloodlineMale] = useState(null);
  const [selectedRBBloodlineFemale, setSelectedRBBloodlineFemale] =
    useState('Choose From Saved');
  const [selectedBloodlineFemale, setSelectedBloodlineFemale] = useState(null);
  const [maleLineage, setMaleLineage] = useState('');
  const [femaleLineage, setFemaleLineage] = useState('');
  const [notes, setNotes] = useState('');
  // State 'image' lama tidak digunakan lagi untuk multi-image
  // const [image, setImage] = useState(null);

  const filteredListPigeonMale = useMemo(
    () => listPigeonMale,
    [listPigeonMale],
  );
  const filteredListPigeonFemale = useMemo(
    () => listPigeonFemale,
    [listPigeonFemale],
  );

  useEffect(() => {
    setName(item?.name);
    setDateOfBirth(item?.dateOfBirth);
    setSelectedRBDateOfBirth(
      item?.dateOfBirth ? 'Select Date of Birth' : 'Unknown',
    );
    setRingName(item?.ringName);

    if (item?.selectedRBBloodlineMale === 'Enter Manually') {
      setMaleLineage(item?.maleLineage);
    } else {
      setSelectedBloodlineMale(item?.maleLineageId);
    }

    if (item?.selectedRBBloodlineFemale === 'Enter Manually') {
      setFemaleLineage(item?.femaleLineage);
    } else {
      setSelectedBloodlineFemale(item?.femaleLineageId);
    }

    if (item?.imageUrls && Array.isArray(item.imageUrls)) {
      setImages(item.imageUrls);
    }

    setSelectedRBBloodlineMale(item?.selectedRBBloodlineMale);
    setSelectedRBBloodlineFemale(item?.selectedRBBloodlineFemale);
    setNotes(item?.notes);
    // setImage(item?.imageUrl); // Dihapus karena menggunakan array
  }, []);

  useEffect(() => {
    if (item?.pigeonTypeId) {
      setPigeonType(pigeonTypes.find(p => p.id === item.pigeonTypeId));
    }
  }, [item?.pigeonTypeId]);

  useEffect(() => {
    if (item?.colorId) {
      setColor(birdColors.find(c => c.id === item.colorId));
    }
  }, [item?.colorId]);

  useEffect(() => {
    if (item?.genderId) {
      setGender(genderOptions.find(g => g.id === item.genderId));
    }
  }, [item?.genderId]);

  useEffect(() => {
    if (item?.eyeColorId) {
      setEyeColor(eyeColorOptions.find(e => e.id === item.eyeColorId));
    }
  }, [item?.eyeColorId]);

  useEffect(() => {
    if (item?.maleLineageId) {
      setSelectedBloodlineMale(
        listPigeonMale?.find(e => e.id === item.maleLineageId),
      );
    }
  }, [item?.maleLineageId]);

  useEffect(() => {
    if (item?.femaleLineageId) {
      setSelectedBloodlineFemale(
        listPigeonFemale?.find(e => e.id === item.femaleLineageId),
      );
    }
  }, [item?.femaleLineageId]);

  const isFormComplete =
    pigeonType &&
    name &&
    color &&
    gender &&
    eyeColor &&
    (selectedRBDateOfBirth === 'Select Date of Birth' ? dateOfBirth : true) &&
    (selectedRBBloodlineMale === 'Enter Manually'
      ? maleLineage.trim() !== ''
      : selectedBloodlineMale?.id) &&
    (selectedRBBloodlineFemale === 'Enter Manually'
      ? femaleLineage.trim() !== ''
      : selectedBloodlineFemale?.id) &&
    images.length >= 1;

  const { showAd } = useInterstitialAd(() => {
    resetFlags();
    navigation.goBack();
  });

  const handleSubmit = () => {
    if (!isFormComplete) {
      Alert.alert('Warning', 'Please complete all required fields.');
      return;
    }
    if (name.trim().length < 3) {
      Alert.alert('Warning', 'Pigeon name must be at least 3 characters long.');
      return;
    }

    // 🔥 Pengecekan Kuantitas Gambar (3 - 5)
    if (images.length < 1) {
      Alert.alert('Warning', 'You must upload at least 3 photos (max 5).');
      return;
    }

    // 🔥 PERBAIKAN KRUSIAL: Cek format hanya untuk URI file LOKAL/BARU
    const isValidImageFormat = images.every(uri => {
      // Jika URI dimulai dengan 'http', anggap itu adalah URL lama yang valid.
      if (uri.startsWith('http')) {
        return true;
      }
      // Jika tidak, itu adalah URI lokal baru, harus dicocokkan dengan regex.
      return uri && uri.match(/\.(jpe?g|png)$/i);
    });

    if (!isValidImageFormat) {
      Alert.alert(
        'Warning',
        'All newly uploaded files must be JPG, JPEG, or PNG format.',
      );
      return;
    }

    // 1. Ambil URL lama
    const oldImageUrls = item.imageUrls || [];

    // 2. Identifikasi URL yang Dihapus (URL di item.imageUrls TAPI TIDAK ADA di state images)
    const deletedImageUrls = oldImageUrls.filter(url => !images.includes(url));

    // 3. Panggil updatePigeonData
    updatePigeonData({
      pigeonId: item.id,
      pigeonTypeId: pigeonType?.id,
      name,
      colorId: color?.id,
      genderId: gender?.id,
      eyeColorId: eyeColor?.id,
      dateOfBirth:
        selectedRBDateOfBirth === 'Select Date of Birth' ? dateOfBirth : null,
      ringName,
      selectedRBBloodlineMale,
      maleLineage:
        selectedRBBloodlineMale === 'Enter Manually' ? maleLineage : '',
      maleLineageId:
        selectedRBBloodlineMale === 'Enter Manually'
          ? null
          : selectedBloodlineMale?.id,
      selectedRBBloodlineFemale,
      femaleLineage:
        selectedRBBloodlineFemale === 'Enter Manually' ? femaleLineage : '',
      femaleLineageId:
        selectedRBBloodlineFemale === 'Enter Manually'
          ? null
          : selectedBloodlineFemale?.id,
      notes,

      // 🔥 Kirim array URI/URL campuran (lama + baru) ke store
      finalImageArray: images,

      // 🔥 Kirim array URL lama yang HARUS DIHAPUS oleh store
      deletedImageUrls: deletedImageUrls,
      uid: token,

      // Hapus data lama yang tidak relevan dengan multi-image
      // oldImageUrl: item.imageUrl, // Dihapus
      // images: images, // Dihapus, diganti finalImageArray

      owner: {
        displayName: user?.displayName || null,
        photoURL: user?.photoURL || null,
        city: user?.city || null,
        country: user?.country || null,
      },
    });
  };

  // const handleImageUpload = image => { // Dihapus karena menggunakan handleSelectImage
  //   setImage(image?.uri);
  // };

  const resetFields = () => {
    setPigeonType(null);
    setName('');
    setColor(null);
    setGender(null);
    setEyeColor(null);
    setDateOfBirth(null);
    setRingName('');
    setMaleLineage('');
    setFemaleLineage('');
    setNotes('');
    setImages([]); // Reset ke array kosong
    setSelectedRBBloodlineMale('Choose From Saved');
    setSelectedBloodlineMale(null);
    setSelectedRBBloodlineFemale('Choose From Saved');
    setSelectedBloodlineFemale(null);
  };

  useEffect(() => {
    if (listPigeonError) {
      Alert.alert('Error', listPigeonError);
    }
  }, [listPigeonError]);

  useEffect(() => {
    if (updatePigeonSuccess) {
      resetFields();
      fetchPigeons();
      showAd();
    }
  }, [updatePigeonSuccess]);

  const handleSelectImage = async () => {
    const maxImages = 5;
    const remainingSlots = maxImages - images.length;

    if (remainingSlots <= 0) {
      Alert.alert('Warning', 'You can upload a maximum of 5 photos.');
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

  return (
    <BaseView
      title={'Edit Pigeon'}
      isScrollable={false}
      loading={globalLoading}
      onBackPress={() => navigation.pop()}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={100}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={Colors.GRADIENT_ROYAL}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.screen}
        >
          {/* Pigeon Photos */}
          <Animated.View
            entering={FadeInUp.delay(200)}
            style={styles.imageWrapper}
          >
            <Text
              style={[styles.label, { marginHorizontal: 20, marginTop: 15 }]}
            >
              Pigeon Photos (1–5)
            </Text>

            {images.length === 0 ? (
              <TouchableOpacity
                style={styles.singleAddContainer}
                onPress={handleSelectImage}
                activeOpacity={0.8}
              >
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderIcon}>📸</Text>
                  <Text style={styles.placeholderText}>
                    Upload Photo (Min. 1)
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.photoGrid}>
                {/* Main Photo (index 0) */}
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
                      color={Colors.WHITE}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.sideGrid}>
                  {/* Side Photos (index 1 sampai 4) */}
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
                          color={Colors.WHITE}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Add Slot */}
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
                        color={Colors.WHITE}
                      />
                      <Text style={styles.addText}>Add</Text>
                    </TouchableOpacity>
                  )}

                  {/* Slot kosong untuk menjaga layout tetap rapi jika jumlah gambar 1, 2, 3, atau 4 */}
                  {/* Logika ini menjaga layout agar slot Add tetap berada di posisi yang benar */}
                  {[...Array(5 - images.length)].map(
                    (_, i) =>
                      i < 1 - images.length && ( // Hanya tampilkan slot kosong yang diperlukan
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
          <DropdownSearchable
            label='Type'
            placeholder='Select Pigeon Type'
            iconName='male-female-outline'
            options={pigeonTypes}
            value={pigeonType}
            onSelect={setPigeonType}
          />
          <Input
            label='Name'
            placeholder='Enter Pigeon Name'
            iconName='sparkles-outline'
            value={name}
            onChangeText={setName}
          />
          <DropdownSearchable
            label='Color'
            placeholder='Select Color'
            iconName='color-palette-outline'
            value={color}
            options={birdColors}
            onSelect={setColor}
          />
          <DropdownSearchable
            label='Gender'
            placeholder='Select Gender'
            iconName='male-female-outline'
            options={genderOptions}
            value={gender}
            onSelect={setGender}
          />
          <DropdownSearchable
            label='Eye Color'
            placeholder='Select Eye Color'
            iconName='eye-outline'
            options={eyeColorOptions}
            value={eyeColor}
            onSelect={setEyeColor}
          />
          <View style={styles.containerRadioButtonInput}>
            <Text style={styles.titleRadioButton}>Date of Birth</Text>
            <RadioButton
              style={styles.radioButton}
              options={['Select Date of Birth', 'Unknown']}
              selectedOption={selectedRBDateOfBirth}
              onSelect={setSelectedRBDateOfBirth}
            />
            {selectedRBDateOfBirth === 'Select Date of Birth' && (
              <DatePicker
                placeholder='Select Date of Birth'
                iconName='calendar-outline'
                defaultDate={dateOfBirth}
                onSelect={({ date }) => setDateOfBirth(date)}
              />
            )}
          </View>
          <Input
            label='Band / Ring / ID'
            placeholder='Ring Name (leave blank if none)'
            iconName='disc-outline'
            value={ringName}
            onChangeText={setRingName}
          />
          <View style={styles.containerRadioButtonInput}>
            <Text style={styles.titleRadioButton}>Male Lineage</Text>
            <RadioButton
              style={styles.radioButton}
              options={['Choose From Saved', 'Enter Manually']}
              selectedOption={selectedRBBloodlineMale}
              onSelect={setSelectedRBBloodlineMale}
            />
            {selectedRBBloodlineMale === 'Choose From Saved' ? (
              <DropdownSearchableDefault
                label='Father'
                placeholder='Select Father'
                iconName='male-outline'
                options={filteredListPigeonMale}
                onSelect={setSelectedBloodlineMale}
                value={selectedBloodlineMale}
              />
            ) : (
              <InputDefault
                label='Male Lineage'
                placeholder='Enter Male Lineage'
                iconName='male-outline'
                value={maleLineage}
                onChangeText={setMaleLineage}
              />
            )}
          </View>
          <View style={styles.containerRadioButtonInput}>
            <Text style={styles.titleRadioButton}>Female Lineage</Text>
            <RadioButton
              style={styles.radioButton}
              options={['Choose From Saved', 'Enter Manually']}
              selectedOption={selectedRBBloodlineFemale}
              onSelect={setSelectedRBBloodlineFemale}
            />
            {selectedRBBloodlineFemale === 'Choose From Saved' ? (
              <DropdownSearchableDefault
                label='Mother'
                placeholder='Select Mother'
                iconName='female-outline'
                options={filteredListPigeonFemale}
                onSelect={setSelectedBloodlineFemale}
                value={selectedBloodlineFemale}
              />
            ) : (
              <InputDefault
                label='Female Lineage'
                placeholder='Enter Female Lineage'
                iconName='female-outline'
                value={femaleLineage}
                onChangeText={setFemaleLineage}
              />
            )}
          </View>
          <Input
            label='Additional Information'
            placeholder='Enter additional notes or details'
            iconName='book-outline'
            value={notes}
            onChangeText={setNotes}
            multiline
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormComplete}
            style={[styles.submitButton, { opacity: isFormComplete ? 1 : 0.5 }]}
          >
            <LinearGradient
              colors={Colors.GRADIENT_ROYAL}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.submitText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAwareScrollView>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  submitButton: {
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonGradient: {
    width: '100%',
    padding: 10,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  radioButton: {
    marginTop: 10,
  },
  titleRadioButton: {
    fontSize: 12,
    color: '#ffffff70',
    marginBottom: 4,
    fontFamily: Fonts.fontRegular,
  },
  imageWrapper: {
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: Colors.WHITE_20,
    borderWidth: 1,
    borderColor: Colors.WHITE_20,
  },
  singleAddContainer: {
    width: '90%',
    aspectRatio: 1.5,
    borderRadius: 15,
    backgroundColor: Colors.WHITE_20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15,
    borderWidth: 2,
    borderColor: Colors.WHITE_50,
    borderStyle: 'dashed',
  },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderIcon: { fontSize: 40, color: Colors.WHITE },
  placeholderText: {
    color: Colors.WHITE,
    marginTop: 5,
    fontFamily: Fonts.fontRegular,
  },
  photoGrid: { justifyContent: 'center', alignItems: 'center', flex: 1 },
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
    color: Colors.WHITE,
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
    color: Colors.WHITE,
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

export default EditBloodlineScreen;
