import { useNavigation, useRoute } from '@react-navigation/native';

const hookUseSmartBloodlineNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const goToBloodlineDetail = id => {
    if (route.name === 'GlobalDetailBloodlineScreen') {
      // Sudah di halaman detail, tambahkan stack baru
      navigation.push('GlobalDetailBloodlineScreen', { id });
    } else {
      // Belum di halaman detail, navigasi biasa
      navigation.navigate('GlobalDetailBloodlineScreen', { id });
    }
  };

  return {
    goToBloodlineDetail,
  };
};

export default hookUseSmartBloodlineNavigation;
