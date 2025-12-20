import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

const showSettingsAlert = (title, message) => {
  Alert.alert(title, message, [
    { text: 'Batal', style: 'cancel' },
    {
      text: 'Buka Pengaturan',
      onPress: () => Linking.openSettings(),
    },
  ]);
};

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Izin Lokasi Dibutuhkan',
          message:
            'Aplikasi ini memerlukan akses lokasi untuk menampilkan posisi Anda di peta.',
          buttonPositive: 'Izinkan',
          buttonNegative: 'Tolak',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;

      showSettingsAlert(
        'Izin Lokasi Ditolak',
        'Silakan aktifkan izin lokasi di pengaturan aplikasi.',
      );
    } catch (err) {
      console.warn(err);
    }
  }
  return false;
};

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Izin Kamera Dibutuhkan',
          message: 'Aplikasi ini memerlukan akses kamera.',
          buttonPositive: 'Izinkan',
          buttonNegative: 'Tolak',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;

      showSettingsAlert(
        'Izin Kamera Ditolak',
        'Silakan aktifkan izin kamera di pengaturan aplikasi.',
      );
    } catch (err) {
      console.warn(err);
    }
  }
  return false;
};

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Izin Penyimpanan Dibutuhkan',
          message: 'Aplikasi ini memerlukan akses ke penyimpanan perangkat.',
          buttonPositive: 'Izinkan',
          buttonNegative: 'Tolak',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;

      showSettingsAlert(
        'Izin Penyimpanan Ditolak',
        'Silakan aktifkan izin penyimpanan di pengaturan aplikasi.',
      );
    } catch (err) {
      console.warn(err);
    }
  }
  return false;
};
