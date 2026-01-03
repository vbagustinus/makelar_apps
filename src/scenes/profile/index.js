import * as React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  TouchableOpacity as TouchableOpacityDefault,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import auth from '@react-native-firebase/auth';
import FastImage from '@d11/react-native-fast-image';
import { View, Text, TouchableOpacity } from '../../components';
import { Colors, Sizes, FontSize } from '../../styles';
import { Fonts } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import useAuthStore from '../../store/useAuthStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LinearGradient from 'react-native-linear-gradient';
import { zustandMMKVStorage } from '../../helpers';
import usePropertyStore from '../../store/usePropertyStore';
import useThemeStore from '../../store/useThemeStore';

function ProfileScreen() {
  const navigation = useNavigation();
  const fetchUserData = useAuthStore(state => state.fetchUserData);
  const user = useAuthStore(state => state.user);
  const clearToken = useAuthStore(state => state.clearToken);
  const resetAllData = usePropertyStore(state => state.resetAllData);
  const theme = useThemeStore(state => state.theme);
  const isDark = theme === 'dark';
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

  const confirmLogout = () => {
    Alert.alert(
      'Keluar Akun',
      'Yakin ingin keluar dari aplikasi?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: doLogout },
      ],
      { cancelable: true },
    );
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

  const displayName = user?.displayName || 'Nama Pengguna';
  const emailOrContact = user?.email || user?.phoneNumber || 'Kontak';
  const phoneNumber = user?.phoneNumber || '';
  const whatsappNumber = user?.whatsapp || user?.phoneNumber || '';
  const profileInitial = (displayName || emailOrContact || 'U')
    .charAt(0)
    .toUpperCase();
  const versionCardStyle = React.useMemo(
    () => ({
      backgroundColor: isDark ? Colors.WHITE_20 : Colors.WHITE,
      borderColor: isDark ? Colors.WHITE_20 : Colors.GRAY_LIGHT,
    }),
    [isDark],
  );

  return (
    <LinearGradient
      colors={Colors.GRADIENT_ROYAL}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.mainContainer}
    >
      <StatusBar
        barStyle={'light-content'}
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarStack}>
            <LinearGradient
              colors={Colors.GRADIENT_SKY}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarHalo}
            >
              <TouchableOpacity
                onPress={() => {
                  if (user?.photoURL) {
                    global.showImagePreview([{ url: user.photoURL }]);
                  }
                }}
                unflex
                style={styles.avatarContainer}
              >
                {user?.photoURL ? (
                  <FastImage
                    style={styles.avatarImage}
                    source={{ uri: user.photoURL }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <Text style={styles.avatarInitial}>{profileInitial}</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacityDefault
              onPress={() => {
                navigation.push('EditProfileScreen');
              }}
              style={styles.editButton}
              activeOpacity={0.85}
            >
              <Ionicons
                name="pencil"
                size={FontSize.FONT_SIZE_18}
                color={Colors.WHITE}
              />
            </TouchableOpacityDefault>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{emailOrContact}</Text>
          <View style={styles.contactRow}>
            {phoneNumber ? (
              <LinearGradient
                colors={Colors.GRADIENT_EMERALD}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.contactChip}
              >
                <Ionicons
                  name="call"
                  size={FontSize.FONT_SIZE_18}
                  color={Colors.SUCCESS}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{phoneNumber}</Text>
              </LinearGradient>
            ) : null}
            {whatsappNumber ? (
              <LinearGradient
                colors={Colors.GRADIENT_PURPLE_HAZE}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.contactChip}
              >
                <Ionicons
                  name="logo-whatsapp"
                  size={FontSize.FONT_SIZE_18}
                  color={Colors.SUCCESS}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>WA: {whatsappNumber}</Text>
              </LinearGradient>
            ) : null}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <SettingItem
            icon="color-palette-outline"
            label="Pengaturan Tema"
            onPress={() => navigation.push('SettingsScreen')}
            gradient={Colors.GRADIENT_ROYAL90}
            iconGradient={Colors.GRADIENT_SKY}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            label="Kebijakan Privasi"
            onPress={() => navigation.push('PrivacyScreen')}
            gradient={Colors.GRADIENT_EMERALD}
            iconGradient={Colors.GRADIENT_EMERALD}
          />
          <SettingItem
            icon="gift-outline"
            label="Dukungan"
            onPress={() => navigation.push('DonationScreen')}
            gradient={Colors.GRADIENT_PURPLE_HAZE}
            iconGradient={Colors.GRADIENT_PURPLE_HAZE}
          />
          <SettingItem
            icon="information-circle-outline"
            label="Tentang Aplikasi"
            onPress={() => navigation.push('AboutAppScreen')}
            gradient={Colors.GRADIENT_SKY}
            iconGradient={Colors.GRADIENT_SKY}
          />
          <SettingItem
            icon="log-out-outline"
            label="Keluar"
            onPress={confirmLogout}
            gradient={Colors.GRADIENT_SUNSET}
            iconGradient={Colors.GRADIENT_SUNSET}
            textColor={Colors.WHITE}
          />
          <View style={[styles.versionCard, versionCardStyle]}>
            <Text style={[styles.label, !isDark && styles.labelLight]}>
              Versi
            </Text>
            <Text style={[styles.value, !isDark && styles.valueLight]}>
              {deviceInfo.appVersion}
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const SettingItem = ({
  icon,
  label,
  onPress,
  gradient,
  iconGradient,
  textColor = Colors.WHITE,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.9}
    style={styles.settingWrapper}
  >
    <LinearGradient
      colors={gradient || Colors.GRADIENT_ROYAL90}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.settingItem}
    >
      <LinearGradient
        colors={iconGradient || Colors.GRADIENT_SKY}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.settingIcon}
      >
        <Ionicons
          name={icon}
          size={FontSize.FONT_SIZE_20}
          color={Colors.WHITE}
        />
      </LinearGradient>
      <Text style={[styles.settingLabel, { color: textColor }]}>{label}</Text>
      <Ionicons
        name="chevron-forward-outline"
        size={FontSize.FONT_SIZE_18}
        color={Colors.WHITE_80}
      />
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Sizes.SIZE_40,
    paddingHorizontal: Sizes.SIZE_20,
    paddingBottom: Sizes.SIZE_40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Sizes.SIZE_30,
  },
  avatarStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHalo: {
    width: Sizes.CUSTOM_SIZE(160),
    height: Sizes.CUSTOM_SIZE(160),
    borderRadius: Sizes.CUSTOM_SIZE(80),
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.SIZE_5,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
  },
  avatarContainer: {
    width: Sizes.CUSTOM_SIZE(148),
    height: Sizes.CUSTOM_SIZE(148),
    borderRadius: Sizes.CUSTOM_SIZE(74),
    backgroundColor: Colors.WHITE_20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.WHITE_50,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: FontSize.FONT_SIZE_30,
    color: Colors.WHITE,
    fontFamily: Fonts.fontBold,
  },
  editButton: {
    position: 'absolute',
    right: Sizes.SIZE_5,
    bottom: Sizes.SIZE_5,
    backgroundColor: Colors.WHITE_20,
    borderRadius: Sizes.SIZE_15,
    padding: Sizes.SIZE_10,
    borderWidth: 1,
    borderColor: Colors.WHITE_20,
  },
  userName: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontBold,
    fontSize: FontSize.FONT_SIZE_25,
    textAlign: 'center',
    marginTop: Sizes.SIZE_20,
  },
  userEmail: {
    color: Colors.WHITE_80,
    fontFamily: Fonts.fontRegular,
    fontSize: FontSize.FONT_SIZE_16,
    marginTop: Sizes.SIZE_5,
    textAlign: 'center',
  },
  contactRow: {
    marginTop: Sizes.SIZE_15,
    alignItems: 'center',
    width: '100%',
  },
  contactChip: {
    width: '90%',
    borderRadius: Sizes.CUSTOM_SIZE(30),
    paddingVertical: Sizes.SIZE_10,
    paddingHorizontal: Sizes.SIZE_15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizes.SIZE_10,
    borderWidth: 1,
    borderColor: Colors.WHITE_20,
  },
  contactIcon: {
    marginRight: Sizes.SIZE_10,
  },
  contactText: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
    fontSize: FontSize.FONT_SIZE_16,
  },
  sectionContainer: {
    marginTop: Sizes.SIZE_10,
  },
  settingWrapper: {
    marginBottom: Sizes.SIZE_15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.SIZE_15,
    borderRadius: Sizes.SIZE_15,
    borderWidth: 1,
    borderColor: Colors.WHITE_20,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 6,
  },
  settingIcon: {
    width: Sizes.CUSTOM_SIZE(50),
    height: Sizes.CUSTOM_SIZE(50),
    borderRadius: Sizes.CUSTOM_SIZE(25),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizes.SIZE_15,
    borderWidth: 1,
    borderColor: Colors.WHITE_20,
  },
  settingLabel: {
    flex: 1,
    fontFamily: Fonts.fontSemiBold,
    fontSize: FontSize.FONT_SIZE_18,
  },
  versionCard: {
    backgroundColor: Colors.WHITE_20,
    borderRadius: Sizes.SIZE_15,
    padding: Sizes.SIZE_15,
    borderWidth: 1,
    borderColor: Colors.WHITE_20,
    marginTop: Sizes.SIZE_10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: FontSize.FONT_SIZE_14,
    color: Colors.WHITE_80,
    fontFamily: Fonts.fontRegular,
  },
  labelLight: {
    color: Colors.GRAY_DARK,
  },
  value: {
    fontSize: FontSize.FONT_SIZE_16,
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
  },
  valueLight: {
    color: Colors.TEXT,
  },
});

export default ProfileScreen;
