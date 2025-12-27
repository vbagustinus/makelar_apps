import { useNavigation, useRoute } from '@react-navigation/native';

const hookUseSmartBloodlineNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const goToBloodlineDetail = id => {
    if (route.name === 'GlobalDetailPropertyScreen') {
      // Sudah di halaman detail, tambahkan stack baru
      navigation.push('GlobalDetailPropertyScreen', { id });
    } else {
      // Belum di halaman detail, navigasi biasa
      navigation.navigate('GlobalDetailPropertyScreen', { id });
    }
  };

  return {
    goToBloodlineDetail,
  };
};

export default hookUseSmartBloodlineNavigation;
