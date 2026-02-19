import React, { useMemo, useState } from 'react';
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

import { Colors, Sizes, FontSize, useThemeColors } from '../../styles';
import { Fonts } from '../../constants';
import { logo } from '../../assets/images';
import { BaseView, Input } from '../../components';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import useAuthStore from '../../store/useAuthStore';
import LinearGradient from 'react-native-linear-gradient';
import useThemeStore from '../../store/useThemeStore';

function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore(state => state.user);
  const colors = useThemeColors();
  const theme = useThemeStore(state => state.theme);
  const isDark = theme === 'dark';
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const [photo, setPhoto] = useState(user?.photoURL || null);
  const [propertyName, setPropertyName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(
    user?.phoneNumber ? user.phoneNumber.replace(/^\+62/, '') : '',
  );
  const [whatsapp, setWhatsapp] = useState(
    user?.whatsapp ? user.whatsapp.replace(/^\+62/, '') : phone,
  );
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
    if (!propertyName) {
      Alert.alert('Oops', 'Nama properti harus diisi.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Oops', 'Nomor telepon wajib diisi.');
      return;
    }

    const formattedPhone = `+62${phone.replace(/[^0-9]/g, '')}`;
    const formattedWa = whatsapp.trim()
      ? `+62${whatsapp.replace(/[^0-9]/g, '')}`
      : '';

    try {
      await updateUserDataWithPhoto(user.uid, {
        displayName: propertyName,
        photoURL: photo,
        phoneNumber: formattedPhone,
        whatsapp: formattedWa,
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
      title="Edit Profil"
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
            resizeMode="cover"
          />
          <View style={styles.changePhotoContainer}>
            <MaterialDesignIcons
              name="camera"
              size={Sizes.SIZE_30}
              color={Colors.WHITE}
            />
          </View>
        </TouchableOpacity>

        {/* Property Name Input */}
        <Input
          label="Nama Properti"
          placeholder="Masukkan nama properti"
          iconName="home-outline"
          value={propertyName}
          onChangeText={setPropertyName}
        />

        {/* Phone */}
        <Input
          label="Nomor Telepon"
          placeholder="812xxxxxxx"
          iconName="phone-outline"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          prefix="+62"
        />

        {/* WhatsApp */}
        <Input
          label="Nomor WhatsApp"
          placeholder="812xxxxxxx"
          iconName="whatsapp"
          keyboardType="phone-pad"
          value={whatsapp}
          onChangeText={setWhatsapp}
          prefix="+62"
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

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
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
      borderColor: colors.WHITE_80,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: -15,
      backgroundColor: colors.PRIMARY,
      shadowColor: colors.BLACK,
      shadowOpacity: isDark ? 0.25 : 0.15,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    image: {
      width: Sizes.CUSTOM_SIZE(200),
      height: Sizes.CUSTOM_SIZE(200),
      borderRadius: Sizes.CUSTOM_SIZE(100),
      borderWidth: 3,
      borderColor: colors.WHITE_80,
      backgroundColor: colors.CARD,
    },
    saveButton: {
      width: '100%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      overflow: 'hidden',
      shadowColor: colors.BLACK,
      shadowOpacity: isDark ? 0.25 : 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
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
      color: colors.WHITE,
      fontFamily: Fonts.fontSemiBold,
      fontSize: FontSize.FONT_SIZE_16,
    },
  });

export default EditProfileScreen;
