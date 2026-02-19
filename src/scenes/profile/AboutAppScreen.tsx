import React, { useMemo } from 'react';
import { ScrollView, StatusBar, StyleSheet, View, Image } from 'react-native';
import { BaseView, Text } from '../../components';
import { FontSize } from '../../styles';
import { useThemeColors } from '../../styles';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../constants';
import { logotransparent } from '../../assets/images';
import useThemeStore from '../../store/useThemeStore';

export default function AboutAppScreen({ navigation: { pop } }) {
  const navigation = useNavigation<any>();
  const colors = useThemeColors();
  const theme = useThemeStore(state => state.theme);
  const styles = useMemo(
    () => createStyles(colors, theme === 'dark'),
    [colors, theme],
  );
  return (
    <BaseView
      onBackPress={pop}
      noshadow
      isScrollable
      title="Tentang Aplikasi Makelar"
      containerStyle={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image
            source={logotransparent}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>Makelar</Text>
            <Text style={styles.heroSubtitle}>
              Platform untuk mengelola, mencari, dan memasarkan properti dengan
              pengalaman modern.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tentang Makelar</Text>
          <Text style={styles.text}>
            Makelar dirancang untuk profesional properti: menghubungkan,
            mengelola aset, dan berbagi wawasan. Semua fitur dibuat agar Anda
            bisa fokus pada bisnis, bukan kerumitan teknis.
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
              Menjadi platform global terkemuka yang memperkuat komunitas real
              estate.
            </Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.sectionTitle}>Misi</Text>
            <Text style={styles.text}>
              Menyediakan alat inovatif yang ramah pengguna dan komunitas yang
              suportif untuk memajukan bisnis properti.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dukungan & Umpan Balik</Text>
          <Text style={styles.text}>
            Ada pertanyaan atau saran? Hubungi tim dukungan melalui menu kontak
            di aplikasi. Kami terus memperbaiki Makelar agar pengalaman Anda
            semakin baik.
          </Text>
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
      gap: 14,
    },
    hero: {
      borderRadius: 20,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.CARD,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      shadowColor: colors.BLACK,
      shadowOpacity: isDark ? 0.25 : 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
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
      color: colors.TEXT,
    },
    heroSubtitle: {
      fontFamily: Fonts.fontRegular,
      fontSize: FontSize.FONT_SIZE_14,
      color: colors.GREY,
      lineHeight: 20,
    },
    card: {
      backgroundColor: colors.CARD,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      shadowColor: colors.BLACK,
      shadowOpacity: isDark ? 0.25 : 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    cardRow: {
      flexDirection: 'row',
      gap: 12,
    },
    miniCard: {
      flex: 1,
      backgroundColor: colors.CARD,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    sectionTitle: {
      color: colors.TEXT,
      fontSize: FontSize.FONT_SIZE_16,
      fontFamily: Fonts.fontSemiBold,
      marginBottom: 8,
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
