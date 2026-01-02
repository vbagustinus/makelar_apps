import React, { useMemo } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { BaseView, Text } from '../../../components';
import { FontSize } from '../../../styles';
import { useThemeColors } from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../../constants';
import useThemeStore from '../../../store/useThemeStore';

export default function PrivacyScreen({ navigation: { pop } }) {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const theme = useThemeStore(state => state.theme);
  const isDark = theme === 'dark';
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.BACKGROUND,
    },
    content: {
      padding: 16,
      gap: 12,
    },
    hero: {
      backgroundColor: colors.CARD,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      shadowColor: colors.BLACK,
      shadowOpacity: isDark ? 0.25 : 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    heroTitle: {
      color: colors.TEXT,
      fontSize: FontSize.FONT_SIZE_18,
      fontFamily: Fonts.fontSemiBold,
      marginBottom: 6,
    },
    heroSubtitle: {
      color: colors.GREY,
      fontSize: FontSize.FONT_SIZE_12,
      fontFamily: Fonts.fontRegular,
    },
    card: {
      backgroundColor: colors.CARD,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      shadowColor: colors.BLACK,
      shadowOpacity: isDark ? 0.25 : 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    cardRow: {
      flexDirection: 'row',
      gap: 10,
    },
    miniCard: {
      flex: 1,
      backgroundColor: colors.CARD,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      shadowColor: colors.BLACK,
      shadowOpacity: isDark ? 0.25 : 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    sectionTitle: {
      color: colors.TEXT,
      fontSize: FontSize.FONT_SIZE_16,
      fontFamily: Fonts.fontSemiBold,
      marginBottom: 6,
    },
    subtitle: {
      color: colors.TEXT,
      fontSize: FontSize.FONT_SIZE_16,
      fontFamily: Fonts.fontSemiBold,
      marginTop: 20,
      marginBottom: 8,
    },
    text: {
      color: colors.GREY,
      fontSize: FontSize.FONT_SIZE_14,
      fontFamily: Fonts.fontRegular,
      lineHeight: 22,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginBottom: 6,
    },
    bulletDot: {
      color: colors.PRIMARY,
      fontSize: 18,
      lineHeight: 20,
    },
    bulletText: {
      flex: 1,
      color: colors.GREY,
      fontSize: FontSize.FONT_SIZE_14,
      fontFamily: Fonts.fontRegular,
      lineHeight: 20,
    },
  });
