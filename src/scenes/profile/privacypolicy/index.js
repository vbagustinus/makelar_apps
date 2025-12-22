import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { BaseView, Text } from '../../../components';
import { Colors, FontSize, Sizes } from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../../constants';

export default function PrivacyScreen({ navigation: { pop } }) {
  const navigation = useNavigation();

  return (
    <BaseView
      onBackPress={pop}
      noshadow
      isScrollable
      title='Kebijakan Privasi Makelar'
      containerStyle={styles.container}
    >
      <StatusBar translucent backgroundColor='transparent' />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Tanggal Berlaku: 1 Januari 2025</Text>
        <Text style={styles.text}>
          Selamat datang di aplikasi mobile Makelar ("Aplikasi"). Privasi Anda adalah
          prioritas kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
          melindungi informasi pribadi Anda ketika Anda menggunakan aplikasi kami dan layanan terkait.
        </Text>

        <Text style={styles.subtitle}>1. Informasi yang Kami Kumpulkan</Text>
        <Text style={styles.text}>
          Kami dapat mengumpulkan jenis informasi berikut ketika Anda menggunakan
          Makelar:
        </Text>
        <Text style={styles.bulletText}>
          • **Informasi yang Anda Berikan:** Ketika Anda mendaftar atau menggunakan fitur tertentu,
          kami dapat mengumpulkan informasi seperti nama Anda, alamat email,
          negara, dan detail apa pun yang Anda masukkan tentang properti Anda (misalnya, nama,
          lokasi, harga, tipe properti, dan deskripsi).
        </Text>
        <Text style={styles.bulletText}>
          • **Automatically Collected Information:** We may automatically
          collect non-personal data such as device information (model, operating
          system, device ID), IP address, app usage statistics, and crash logs.
        </Text>

        <Text style={styles.subtitle}>2. Cara Kami Menggunakan Informasi Anda</Text>
        <Text style={styles.text}>Informasi yang kami kumpulkan digunakan untuk:</Text>
        <Text style={styles.bulletText}>
          • Menyediakan, memelihara, dan meningkatkan fungsionalitas Aplikasi.
        </Text>
        <Text style={styles.bulletText}>
          • Mempersonalisasi pengalaman Anda dan mengaktifkan fitur seperti
          manajemen profil dan penyimpanan data properti.
        </Text>
        <Text style={styles.bulletText}>
          • Berkomunikasi dengan Anda tentang pembaruan penting, perbaikan bug, atau permintaan
          dukungan.
        </Text>
        <Text style={styles.bulletText}>
          • Menganalisis pola penggunaan untuk meningkatkan kinerja dan pengalaman pengguna.
        </Text>

        <Text style={styles.subtitle}>3. Layanan Pihak Ketiga</Text>
        <Text style={styles.text}>
          Makelar menggunakan layanan pihak ketiga untuk menyediakan autentikasi,
          analitik, dan penyimpanan data cloud. Ini mungkin termasuk:
        </Text>
        <Text style={styles.bulletText}>
          • **Firebase (Google LLC):** Digunakan untuk autentikasi, database, dan
          analitik.
        </Text>
        <Text style={styles.bulletText}>
          • **Google Sign-In:** Digunakan untuk login yang aman dan disederhanakan.
        </Text>
        <Text style={styles.text}>
          Silakan tinjau kebijakan privasi mereka masing-masing untuk informasi lebih lanjut
          tentang bagaimana mereka mengelola data Anda.
        </Text>

        <Text style={styles.subtitle}>4. Data Storage and Transfers</Text>
        <Text style={styles.text}>
          Your information may be stored and processed on servers located in
          different countries (for example, Firebase servers). By using the App,
          you consent to the transfer of your information across international
          borders in accordance with this Privacy Policy.
        </Text>

        <Text style={styles.subtitle}>5. Data Security</Text>
        <Text style={styles.text}>
          We take reasonable technical and organizational measures to protect
          your data from unauthorized access, loss, misuse, or alteration.
          However, no internet transmission is completely secure, and we cannot
          guarantee absolute security.
        </Text>

        <Text style={styles.subtitle}>6. Your Rights</Text>
        <Text style={styles.text}>
          Depending on your location, you may have certain privacy rights:
        </Text>
        <Text style={styles.bulletText}>
          • Access, update, or delete your personal information.
        </Text>
        <Text style={styles.bulletText}>
          • Withdraw consent for certain data processing activities.
        </Text>
        <Text style={styles.bulletText}>
          • Request a copy of your stored data.
        </Text>
        <Text style={styles.bulletText}>
          • Object to data processing based on legitimate interests.
        </Text>

        <Text style={styles.subtitle}>7. GDPR Compliance (European Users)</Text>
        <Text style={styles.text}>
          If you are located in the European Economic Area (EEA), you have the
          right to request access, correction, or deletion of your personal
          data. You may also lodge a complaint with your local data protection
          authority if you believe your rights have been violated.
        </Text>

        <Text style={styles.subtitle}>
          8. CCPA Compliance (California Users)
        </Text>
        <Text style={styles.text}>
          California residents have the right to request information about the
          categories of personal data we collect, disclose, and the right to
          request deletion of their data. We do not sell your personal
          information to third parties.
        </Text>

        <Text style={styles.subtitle}>9. Privasi Anak-Anak</Text>
        <Text style={styles.text}>
          Makelar tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak
          dengan sengaja mengumpulkan data pribadi dari anak-anak. Jika kami mengetahui bahwa kami
          telah mengumpulkan data tersebut, kami akan menghapusnya segera.
        </Text>

        <Text style={styles.subtitle}>10. Changes to This Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy from time to time. The updated
          version will be posted within the App and will include the new
          effective date. We encourage you to review this page periodically.
        </Text>

        <Text style={styles.subtitle}>11. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions or concerns about this Privacy Policy or how
          we handle your information, please contact us at:
        </Text>
        <Text style={styles.bulletText}>📧 atahdeveloper@gmail.com</Text>
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
