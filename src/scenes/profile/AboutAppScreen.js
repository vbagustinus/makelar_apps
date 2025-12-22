import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { BaseView, Text } from '../../components';
import { Colors, FontSize, Sizes } from '../../styles';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../constants';

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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Tentang Aplikasi Makelar</Text>

        <Text style={styles.text}>
          Selamat datang di{' '}
          <Text style={{ fontFamily: Fonts.fontSemiBold }}>Makelar</Text>, aplikasi yang dirancang untuk menghubungkan dan memberdayakan para profesional properti di seluruh dunia.
          Kami percaya bahwa bisnis properti lebih dari sekadar transaksi—ini adalah tentang
          kepercayaan, pengetahuan, dan komunitas. Makelar hadir untuk mendukung semua itu,
          dari mengelola data properti Anda hingga membantu Anda terhubung dengan
          para profesional real estate di seluruh dunia.
        </Text>

        <Text style={styles.subtitle}>Fitur Utama:</Text>
        <Text style={styles.bulletText}>
          1. **Manajemen Data Properti**: Dengan mudah menyimpan dan mengelola data penting
          untuk setiap properti Anda, termasuk lokasi, harga, tipe, dan riwayat penjualan.
          Aplikasi membantu Anda memantau portofolio properti Anda secara detail.
        </Text>
        <Text style={styles.bulletText}>
          2. **Penelusuran & Filter Lanjutan**: Tetap terdepan dengan fitur pencarian canggih
          yang memungkinkan Anda menemukan properti berdasarkan lokasi, harga, tipe, dan kriteria lainnya.
        </Text>
        <Text style={styles.bulletText}>
          3. **Forum Komunitas**: Berinteraksi dengan profesional real estate secara global,
          bagikan tips dan pengalaman, serta diskusikan segala hal terkait properti.
        </Text>
        <Text style={styles.bulletText}>
          4. **Galeri Properti**: Unggah dan bagikan foto berkualitas tinggi dari properti Anda
          kepada komunitas. Galeri juga berfungsi sebagai portofolio visual untuk bisnis Anda.
        </Text>
        <Text style={styles.bulletText}>
          5. **Artikel & Panduan**: Akses perpustakaan artikel eksklusif dan panduan ahli tentang
          tren pasar properti, strategi penjualan, dan tips investasi dari para profesional berpengalaman.
        </Text>
        <Text style={styles.bulletText}>
          6. **Fitur Lokasi Interaktif**: Temukan properti berdasarkan karakteristik spesifik seperti
          lokasi geografis, fasilitas sekitar, dan zona, membantu Anda menemukan informasi yang relevan dengan cepat.
        </Text>

        <Text style={styles.subtitle}>Visi & Misi Kami:</Text>
        <Text style={styles.text}>
          Visi kami adalah membuat{' '}
          <Text style={{ fontFamily: Fonts.fontSemiBold }}>Makelar</Text>
          menjadi platform global terkemuka yang mendukung dan mengembangkan komunitas real estate.
          Misi kami adalah menyediakan alat yang inovatif dan user-friendly sambil memupuk komunitas
          global yang aktif, suportif, dan bersemangat dalam bisnis properti.
        </Text>

        <Text style={styles.subtitle}>Dukungan Pengguna:</Text>
        <Text style={styles.text}>
          Kami selalu terbuka terhadap umpan balik dan saran. Jika Anda memiliki pertanyaan
          atau memerlukan bantuan, silakan hubungi tim dukungan kami melalui fitur kontak di aplikasi.
          Kami berkomitmen untuk terus meningkatkan
          <Text style={{ fontFamily: Fonts.fontSemiBold }}> Makelar</Text>
          untuk memberikan pengalaman terbaik bagi Anda.
        </Text>
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f010',
  },
  content: {
    padding: 20 * Sizes.ratioWidthScreen,
  },
  sectionTitle: {
    color: Colors.WHITE,
    fontSize: FontSize.FONT_SIZE_16,
    fontFamily: Fonts.fontSemiBold,
    marginBottom: 10,
  },
  subtitle: {
    color: Colors.WHITE,
    fontSize: FontSize.FONT_SIZE_16,
    fontFamily: Fonts.fontSemiBold,
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    color: Colors.WHITE,
    fontSize: FontSize.FONT_SIZE_14,
    fontFamily: Fonts.fontRegular,
    lineHeight: 22,
    textAlign: 'justify',
  },
  bulletText: {
    color: Colors.WHITE,
    fontSize: FontSize.FONT_SIZE_14,
    fontFamily: Fonts.fontRegular,
    marginLeft: 10,
    lineHeight: 22,
    textAlign: 'justify',
  },
});
