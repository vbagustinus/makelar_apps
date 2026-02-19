import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { BaseView, View, Text } from '../../components';
import { Colors } from '../../styles';
import { Fonts } from '../../constants';
import { logotransparent } from '../../assets/images';
import { useNavigation } from '@react-navigation/native';

const UnderConstructionScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <BaseView
      title="Sedang Dalam Pengembangan"
      onBackPress={navigation.pop}
      containerStyle={{ flex: 1, backgroundColor: Colors.PRIMARY }}
      backgroundColor={Colors.PRIMARY}
    >
      <View
        colors={['#2b5cff', '#3b7bff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            alignContent: 'center',
          }}
        >
          <Image source={logotransparent} style={styles.logo} />
          <View style={styles.textWrap}>
            <Text style={styles.title}>Halaman Belum Tersedia</Text>
            <Text style={styles.subtitle}>
              Fitur ini sedang kami kembangkan. Tunggu update selanjutnya ya!
            </Text>
          </View>
        </View>
      </View>
    </BaseView>
  );
};

export default UnderConstructionScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  textWrap: { flex: 1, gap: 8, marginTop: 20, alignItems: 'center' },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.WHITE,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.WHITE,
    fontFamily: Fonts.fontRegular,
    lineHeight: 20,
    textAlign: 'center',
  },
});
