import * as React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity as TouchableOpacityDefault,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import auth from '@react-native-firebase/auth';
import FastImage from '@d11/react-native-fast-image';
import { View, Text, TouchableOpacity, Button } from '../../components';
import { Colors, Sizes, FontSize } from '../../styles';
import { emptyimage, logo } from '../../assets/images';
import { Fonts } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import useAuthStore from '../../store/useAuthStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LinearGradient from 'react-native-linear-gradient';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { zustandMMKVStorage } from '../../helpers';
import usePropertyStore from '../../store/usePropertyStore';

function ProfileScreen() {
  const navigation = useNavigation();
  const fetchUserData = useAuthStore(state => state.fetchUserData);
  const user = useAuthStore(state => state.user);
  const clearToken = useAuthStore(state => state.clearToken);
  const resetAllData = usePropertyStore(state => state.resetAllData);
  const [deviceInfo, setDeviceInfo] = React.useState({
    appName: '',
    appVersion: '',
    deviceId: '',
    systemName: '',
    systemVersion: '',
  });

  console.log('user', user);

  const doLogout = async () => {
    try {
      await auth().signOut();
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (googleError) {
        console.log('Google logout skipped or failed:', googleError.message);
      }
      clearToken();
      resetAllData();
      Alert.alert('Sampai Jumpa 👋', 'Anda berhasil keluar dari aplikasi.');
    } catch (error) {
      clearToken();
      resetAllData();
      console.error('Logout failed:', error.message);
      Alert.alert('Sampai Jumpa 👋', 'Anda berhasil keluar dari aplikasi.');
    }
  };

  React.useEffect(() => {
    const fetchDeviceInfo = async () => {
      setDeviceInfo({
        appName: DeviceInfo.getApplicationName(),
        appVersion: DeviceInfo.getVersion(),
        deviceId: DeviceInfo.getUniqueId(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
      });
    };
    fetchDeviceInfo();
  }, []);

  React.useEffect(() => {
    const fetchUserInfo = async () => {
      const tokenuid = zustandMMKVStorage.getItem('token');
      const existingUserData = await fetchUserData(tokenuid);
      console.log('existingUserData', existingUserData);
      // displayName: "John Doe"
      // email : "john@gmail.com"
      // phoneNumber:"+6285157212193"
      // photoURL : ''
    };
    !user && fetchUserInfo();
  }, []);

  return (
    <LinearGradient
      colors={Colors.GRADIENT_ROYAL}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.mainContainer}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.WHITE} />

      {/* Header */}
      <View unflex style={styles.profileInfo}>
        <TouchableOpacityDefault
          onPress={() => {
            navigation.push('EditProfileScreen');
          }}
          style={{
            flexDirection: 'row',
            padding: 5,
            paddingHorizontal: 10,
            backgroundColor: Colors.WHITE_20,
            marginTop: 20,
            borderRadius: 10,
            position: 'absolute',
            right: 20,
            top: 40,
            zIndex: 99,
            alignItems: 'center',
          }}
        >
          <MaterialDesignIcons
            name='account-box-edit-outline'
            size={25}
            color={Colors.WHITE}
          />
          <Text style={styles.userEdit}>{'Edit'}</Text>
        </TouchableOpacityDefault>
        <ImageBackground
          blurRadius={10}
          source={(user?.photoURL && { uri: user.photoURL }) || logo}
          style={styles.headerContainer}
          resizeMode='cover'
        >
          {/* Profile Image */}
          <TouchableOpacity
            onPress={() => {
              global.showImagePreview([{ url: user?.photoURL }]);
            }}
            unflex
            style={styles.profileImageContainer}
          >
            <FastImage
              style={styles.profileImage}
              source={(user?.photoURL && { uri: user.photoURL }) || logo}
              resizeMode={FastImage.resizeMode.stretch}
            />
          </TouchableOpacity>
          {/* User Name and Email */}
          <LinearGradient
            pointerEvents='box-none'
            colors={Colors.GRADIENT_ROYAL90}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              padding: Sizes.SIZE_15,
              paddingHorizontal: 40,
              borderRadius: 20,
              marginTop: 20,
            }}
          >
            <Text style={styles.userName}>
              {user?.displayName || 'Nama Pengguna'}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || user?.phoneNumber || 'Kontak'}
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          {/* Account Settings */}
          <SettingItem
            icon='settings-outline'
            label='Pengaturan Akun'
            onPress={() => navigation.push('UnderConstructionScreen')}
          />
          <SettingItem
            icon='shield-outline'
            label='Kebijakan Privasi'
            onPress={() => navigation.push('PrivacyScreen')}
          />
          <SettingItem
            icon='gift-outline'
            label='Dukungan'
            onPress={() => navigation.push('DonationScreen')}
          />
          <SettingItem
            icon='information-circle-outline'
            label='Tentang Aplikasi'
            onPress={() => navigation.push('AboutAppScreen')}
          />
          <SettingItem
            icon='log-out-outline'
            label='Keluar'
            color={Colors.RED}
            onPress={doLogout}
            backgroundColor={Colors.BLACK_50}
          />
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Versi</Text>
              <Text style={styles.value}>{deviceInfo.appVersion}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const SettingItem = ({
  icon,
  label,
  color = Colors.WHITE,
  onPress,
  backgroundColor = Colors.WHITE_20,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.settingItem, { backgroundColor }]}
  >
    <Ionicons
      name={icon}
      size={FontSize.FONT_SIZE_20}
      color={color}
      style={{ marginRight: Sizes.SIZE_15 }}
    />
    <Text style={[styles.settingLabel, { color }]}>{label}</Text>
    <Ionicons
      name='chevron-forward-outline'
      size={FontSize.FONT_SIZE_16}
      color={Colors.WHITE}
      style={{ marginLeft: 'auto' }}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingVertical: Sizes.SIZE_30,
    paddingHorizontal: Sizes.SIZE_20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Sizes.widthScreen - 100,
    width: Sizes.widthScreen,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: Sizes.SIZE_40,
    borderBottomRightRadius: Sizes.SIZE_40,
    borderColor: Colors.WHITE_20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Sizes.SIZE_20,
    borderBottomLeftRadius: Sizes.SIZE_40,
    borderBottomRightRadius: Sizes.SIZE_40,
    borderColor: Colors.WHITE_20,
  },
  profileImageContainer: {
    width: Sizes.CUSTOM_SIZE(120),
    height: Sizes.CUSTOM_SIZE(120),
    borderRadius: Sizes.CUSTOM_SIZE(60),
    backgroundColor: Colors.LIGHT_GRAY,
    borderWidth: 4,
    borderColor: Colors.WHITE_50,
    overflow: 'hidden',
    zIndex: 999,
  },
  profileImage: {
    width: Sizes.CUSTOM_SIZE(120),
    height: Sizes.CUSTOM_SIZE(120),
    borderRadius: Sizes.CUSTOM_SIZE(60),
  },
  userName: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontBold,
    fontSize: FontSize.FONT_SIZE_25,
    textAlign: 'center',
  },
  userEdit: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontRegular,
    fontSize: FontSize.FONT_SIZE_14,
    textAlign: 'center',
    marginLeft: 5,
  },
  userEmail: {
    color: Colors.WARNING,
    fontFamily: Fonts.fontItalic,
    fontSize: FontSize.FONT_SIZE_14,
    marginTop: 10,
    textAlign: 'center',
  },
  scrollContent: {
    paddingTop: Sizes.widthScreen - 100,
    paddingBottom: Sizes.SIZE_20,
  },
  sectionContainer: {
    marginHorizontal: Sizes.SIZE_20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE_20,
    padding: Sizes.SIZE_15,
    borderRadius: Sizes.SIZE_10,
    marginBottom: Sizes.SIZE_10,
  },
  settingLabel: {
    fontFamily: Fonts.fontRegular,
    fontSize: FontSize.FONT_SIZE_16,
    color: Colors.WHITE,
  },
  card: {
    backgroundColor: Colors.WHITE_20,
    borderRadius: 12,
    padding: 16,
    marginTop: Sizes.SIZE_10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: FontSize.FONT_SIZE_14,
    color: Colors.WHITE,
    fontFamily: Fonts.fontRegular,
  },
  value: {
    fontSize: FontSize.FONT_SIZE_14,
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
  },
});

export default ProfileScreen;