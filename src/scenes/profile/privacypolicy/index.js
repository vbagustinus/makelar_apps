import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { BaseView, Text } from '../../../components';
import { Colors, FontSize, Sizes } from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';

export default function PrivacyScreen({ navigation: { pop } }) {
  const navigation = useNavigation();

  return (
    <BaseView
      onBackPress={pop}
      noshadow
      isScrollable
      title="Kebijakan Privasi Makelar"
      containerStyle={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Kebijakan Privasi Makelar</Text>
          <Text style={styles.heroSubtitle}>Diperbarui: 1 Januari 2025</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ringkasan</Text>
          <Text style={styles.text}>
            Kami mengumpulkan data untuk memberikan layanan terbaik: manajemen
            properti, pencarian, dan komunitas. Data Anda aman, hanya digunakan
            untuk fitur aplikasi, dan tidak dijual ke pihak lain.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data yang Kami Kumpulkan</Text>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Data yang Anda berikan: nama, email, nomor kontak, dan detail
              properti (nama, lokasi, harga, tipe, deskripsi).
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Data otomatis: info perangkat, alamat IP, statistik penggunaan
              aplikasi, dan log crash.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Cara Kami Menggunakan Data</Text>
          {[
            'Menjalankan dan meningkatkan fitur aplikasi.',
            'Memersonalisasi pengalaman (profil, daftar properti).',
            'Mengirim notifikasi penting dan dukungan.',
            'Menganalisis penggunaan untuk perbaikan layanan.',
          ].map((item, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pihak Ketiga</Text>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Firebase (auth, database, analytics).
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Google Sign-In (login aman).</Text>
          </View>
          <Text style={styles.text}>
            Data Anda mungkin diproses lintas negara sesuai kebijakan privasi
            layanan tersebut.
          </Text>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.miniCard}>
            <Text style={styles.sectionTitle}>Keamanan</Text>
            <Text style={styles.text}>
              Kami menerapkan langkah teknis & organisasi untuk melindungi data.
              Tidak ada sistem yang 100% aman, jadi tetap bijak berbagi
              informasi.
            </Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.sectionTitle}>Hak Anda</Text>
            <Text style={styles.text}>
              Minta akses, perbarui, atau hapus data Anda. Tarik persetujuan
              jika perlu. Jika berada di wilayah dengan regulasi khusus, hak
              Anda mengikuti ketentuan setempat.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Regulasi</Text>
          <Text style={styles.text}>
            Pengguna EEA (GDPR): akses, koreksi, atau hapus data; ajukan
            keberatan ke otoritas setempat jika perlu.
          </Text>
          <Text style={styles.text}>
            Pengguna California (CCPA): ketahui kategori data yang
            dikumpulkan/diungkap; minta penghapusan; kami tidak menjual data
            Anda.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Privasi Anak</Text>
          <Text style={styles.text}>
            Aplikasi tidak ditujukan untuk anak di bawah 13 tahun. Jika ada data
            anak, kami akan menghapusnya segera.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Perubahan Kebijakan</Text>
          <Text style={styles.text}>
            Kebijakan dapat diperbarui. Versi terbaru akan ditampilkan di
            aplikasi dengan tanggal efektif terbaru.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kontak</Text>
          <Text style={styles.text}>📧 atahdeveloper@gmail.com</Text>
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
    gap: 12,
  },
  hero: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e8f0',
    shadowColor: '#0d1b2a',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  heroTitle: {
    color: Colors.TEXT,
    fontSize: FontSize.FONT_SIZE_18,
    fontFamily: Fonts.fontSemiBold,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: Colors.GRAY_DARK,
    fontSize: FontSize.FONT_SIZE_12,
    fontFamily: Fonts.fontRegular,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e4e8f0',
    shadowColor: '#0d1b2a',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardRow: {
    flexDirection: 'row',
    gap: 10,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e4e8f0',
    shadowColor: '#0d1b2a',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    color: Colors.TEXT,
    fontSize: FontSize.FONT_SIZE_16,
    fontFamily: Fonts.fontSemiBold,
    marginBottom: 6,
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
