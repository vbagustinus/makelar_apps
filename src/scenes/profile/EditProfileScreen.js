import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Colors, Sizes, FontSize } from '../../styles';
import { Fonts } from '../../constants';
import { logo } from '../../assets/images';
import { BaseView, Input } from '../../components';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import useAuthStore from '../../store/useAuthStore';
import LinearGradient from 'react-native-linear-gradient';

function EditProfileScreen() {
  const navigation = useNavigation();
  const user = useAuthStore(state => state.user);
  const [photo, setPhoto] = useState(user?.photoURL || null);
  const [propertyName, setPropertyName] = useState(user?.displayName || '');
  const [city, setCity] = useState(user?.city || '');
  const { updateUserDataWithPhoto, userLoading, fetchUserData } =
    useAuthStore();

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo' });
      if (result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const handleSave = async () => {
    if (!propertyName || !city) {
      Alert.alert('Oops', 'Nama properti dan kota harus diisi.');
      return;
    }

    try {
      await updateUserDataWithPhoto(user.uid, {
        displayName: propertyName,
        photoURL: photo,
        city,
      });
      fetchUserData(user.uid);
      navigation.goBack();
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Oops', 'Terjadi kesalahan saat memperbarui profil Anda.');
    }
  };

  return (
    <BaseView
      onBackPress={navigation.pop}
      title='Edit Profil'
      containerStyle={styles.container}
      loading={userLoading}
    >
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={80}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: Sizes.SIZE_20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo */}
        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
          <Image
            source={photo ? { uri: photo } : logo}
            style={styles.image}
            resizeMode='cover'
          />
          <View style={styles.changePhotoContainer}>
            <MaterialDesignIcons
              name='camera'
              size={Sizes.SIZE_30}
              color={Colors.WHITE}
            />
          </View>
        </TouchableOpacity>

        {/* Property Name Input */}
        <Input
          label='Nama Properti'
          placeholder='Masukkan nama properti'
          iconName='home-outline'
          value={propertyName}
          onChangeText={setPropertyName}
        />

        {/* City Input */}
        <Input
          label='Kota Asal'
          placeholder='Masukkan nama kota'
          iconName='map-marker-outline'
          value={city}
          onChangeText={setCity}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={Colors.GRADIENT_ROYAL}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.saveText}>Simpan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageWrapper: {
    alignItems: 'center',
    marginVertical: Sizes.SIZE_30,
  },
  changePhotoContainer: {
    borderRadius: 50,
    width: 100,
    height: 50,
    borderWidth: 2,
    borderColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -15,
    backgroundColor: Colors.PRIMARY,
  },
  image: {
    width: Sizes.CUSTOM_SIZE(200),
    height: Sizes.CUSTOM_SIZE(200),
    borderRadius: Sizes.CUSTOM_SIZE(100),
    borderWidth: 3,
    borderColor: Colors.WHITE,
  },
  saveButton: {
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
  saveText: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
    fontSize: FontSize.FONT_SIZE_16,
  },
});

export default EditProfileScreen;
