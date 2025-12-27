import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, Image } from 'react-native';
import { BaseView, Text } from '../../components';
import { Colors, FontSize, Sizes } from '../../styles';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import { logotransparent } from '../../assets/images';

export default function AboutAppScreen({ navigation: { pop } }) {
  const navigation = useNavigation();
  return (
    <BaseView
      onBackPress={pop}
      noshadow
      isScrollable
      title='Tentang Aplikasi Makelar'
      containerStyle={styles.container}
    >
      <StatusBar translucent backgroundColor='transparent' />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={logotransparent} style={styles.heroLogo} resizeMode='contain' />
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>Makelar</Text>
            <Text style={styles.heroSubtitle}>
              Platform untuk mengelola, mencari, dan memasarkan properti dengan pengalaman modern.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tentang Makelar</Text>
          <Text style={styles.text}>
            Makelar dirancang untuk profesional properti: menghubungkan, mengelola aset, dan berbagi
            wawasan. Semua fitur dibuat agar Anda bisa fokus pada bisnis, bukan kerumitan teknis.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Fitur Utama</Text>
          {[
            'Manajemen Data Properti lengkap (lokasi, harga, status, foto, riwayat).',
            'Pencarian & filter canggih untuk menemukan listing yang relevan.',
            'Forum komunitas untuk berbagi tips dan diskusi real estate.',
            'Galeri visual berkualitas untuk portofolio properti Anda.',
            'Artikel & panduan eksklusif tentang pasar, strategi, dan investasi.',
            'Peta interaktif untuk menemukan properti berdasarkan zona & fasilitas sekitar.',
          ].map((item, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardRow}>
          <View style={styles.miniCard}>
            <Text style={styles.sectionTitle}>Visi</Text>
            <Text style={styles.text}>
              Menjadi platform global terkemuka yang memperkuat komunitas real estate.
            </Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.sectionTitle}>Misi</Text>
            <Text style={styles.text}>
              Menyediakan alat inovatif yang ramah pengguna dan komunitas yang suportif untuk
              memajukan bisnis properti.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dukungan & Umpan Balik</Text>
          <Text style={styles.text}>
            Ada pertanyaan atau saran? Hubungi tim dukungan melalui menu kontak di aplikasi.
            Kami terus memperbaiki Makelar agar pengalaman Anda semakin baik.
          </Text>
        </View>
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f4f8',
  },
  content: {
    padding: 16,
    gap: 14,
  },
  hero: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fdfdfd',
    borderWidth: 1,
    borderColor: '#e4e8f0',
  },
  heroLogo: {
    width: 72,
    height: 72,
  },
  heroTextWrap: {
    flex: 1,
    gap: 6,
  },
  heroTitle: {
    fontFamily: Fonts.fontBold,
    fontSize: FontSize.FONT_SIZE_18,
    color: Colors.TEXT,
  },
  heroSubtitle: {
    fontFamily: Fonts.fontRegular,
    fontSize: FontSize.FONT_SIZE_14,
    color: Colors.GRAY_DARK,
    opacity: 0.9,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e8f0',
    shadowColor: '#0d1b2a',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.WHITE_20,
  },
  sectionTitle: {
    color: Colors.TEXT,
    fontSize: FontSize.FONT_SIZE_16,
    fontFamily: Fonts.fontSemiBold,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.TEXT,
    fontSize: FontSize.FONT_SIZE_16,
    fontFamily: Fonts.fontSemiBold,
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    color: Colors.GRAY_DARK,
    fontSize: FontSize.FONT_SIZE_14,
    fontFamily: Fonts.fontRegular,
    lineHeight: 22,
    opacity: 0.95,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bulletDot: {
    color: '#2b5cff',
    fontSize: 18,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    color: Colors.GRAY_DARK,
    fontSize: FontSize.FONT_SIZE_14,
    fontFamily: Fonts.fontRegular,
    lineHeight: 20,
    opacity: 0.95,
  },
});
