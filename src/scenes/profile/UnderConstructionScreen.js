import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { BaseView, View, Text } from '../../components';
import { Colors } from '../../styles';
import { Fonts } from '../../constants';
import { logo, logopigeon, logotransparent } from '../../assets/images';
import { useNavigation } from '@react-navigation/native';

const UnderConstructionScreen = () => {
  const navigation = useNavigation();
  return (
    <BaseView title='Sedang Dalam Pengembangan' onBackPress={navigation.pop}>
      <View unflex centering style={styles.container}>
        <Image source={logotransparent} style={styles.logo} />
        <Text style={styles.title}>Halaman Belum Tersedia</Text>
        <Text style={styles.subtitle}>
          Fitur ini sedang kami kembangkan. Tunggu update selanjutnya ya!
        </Text>
      </View>
    </BaseView>
  );
};

export default UnderConstructionScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  logo: {
    width: 150,
    height: 150,
    marginVertical: 30,
    resizeMode: 'contain',
    borderRadius: 75,
    tintColor: Colors.WHITE,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.WHITE,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.WHITE,
    textAlign: 'center',
    fontFamily: Fonts.fontRegular,
    lineHeight: 24,
  },
});
