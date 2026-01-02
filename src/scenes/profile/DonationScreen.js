import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import { BaseView } from '../../components';
import { Colors, Sizes } from '../../styles';
import { Fonts } from '../../constants';
import {
  binance,
  bitcoin,
  etherium,
  paypal,
  solana,
  usdt,
} from '../../assets/images';
import FastImage from '@d11/react-native-fast-image';
import { useNavigation } from '@react-navigation/native';

/// --- DATA DONASI ---
const DONATION_OPTIONS = [
  {
    name: 'PayPal',
    // Ikon untuk PayPal di MaterialCommunityIcons adalah 'paypal'
    icon: paypal,
    color: '#00457C',
    actionType: 'link',
    link: 'https://paypal.me/vbagustinus',
    description: 'Berdonasi dengan cepat dan aman melalui PayPal.',
  },
  {
    name: 'Bitcoin (BTC)',
    // Ikon untuk Bitcoin di MaterialCommunityIcons adalah 'bitcoin'
    icon: bitcoin,
    color: '#F7931A', // Warna Bitcoin
    actionType: 'copy',
    address: 'bc1pcxspvgxqv0zek2s585d6gsnr6uh39xp5hsl8gtqr5fjn8tu4tmnqkhmfu7',
    description: 'Dukung kami dengan Bitcoin.',
  },
  {
    name: 'Ethereum (ETH)',
    // Ikon untuk Ethereum di MaterialCommunityIcons adalah 'ethereum'
    icon: etherium,
    color: '#627EEA', // Warna Ethereum
    actionType: 'copy',
    address: '0xF11477A7F562D30f11E8a4d1F3818fe1805b6FC5',
    description: 'Dukung kami dengan Ethereum (ERC-20/Native).', // Diperjelas
  },
  {
    name: 'Binance Coin (BNB)',
    // Ikon untuk Binance (BNB)
    icon: binance, // Pilihan ikon: 'currency-bdt', 'layers'
    color: '#F3BA2F', // Warna Binance
    actionType: 'copy',
    address: '0xF11477A7F562D30f11E8a4d1F3818fe1805b6FC5', // **GANTI**
    description: 'Dukung kami menggunakan BNB (BSC/BEP-20).', // Diperjelas
  },
  {
    name: 'Solana (SOL)',
    // Ikon untuk Solana
    icon: solana, // Pilihan ikon: 'currency-inr', 'sitemap'
    color: '#9945FF', // Warna Solana
    actionType: 'copy',
    address: 'GstFpH6kB99e1f3S2Eq53BrCKUhL8d7oDrVxJBq9JZSL', // **GANTI**
    description:
      'Dukung kami menggunakan Solana Network (Cepat & Biaya Rendah).', // Diperjelas
  },
  {
    name: 'Tether USD (USDT)',
    // Ikon untuk USDT (Stablecoin)
    icon: usdt,
    color: '#50AF95', // Warna Tether
    actionType: 'copy',
    address: '0xF11477A7F562D30f11E8a4d1F3818fe1805b6FC5', // **GANTI**
    description: 'Donasi stabil melalui USDT (BEP20 Direkomendasikan).', // Diperjelas
  },
  // Tambahkan mata uang kripto lain jika diperlukan (misal: Litecoin, Dogecoin)
];

const DonationScreen = () => {
  const navigation = useNavigation();

  // Fungsi untuk menangani aksi donasi (link atau copy)
  const handleDonationAction = option => {
    if (option.actionType === 'link') {
      // 1. Aksi Link (Untuk PayPal)
      Linking.openURL(option.link).catch(err => {
        Alert.alert('Error', `Failed to open link: ${err.message}`);
      });
    } else if (option.actionType === 'copy') {
      // 2. Aksi Copy (Untuk Kripto)
      Clipboard.setString(option.address);
      Alert.alert(
        `${option.name} Alamat Disalin`,
        `Alamat telah disalin ke papan klip Anda. Silakan tempel ke dompet kripto Anda untuk menyelesaikan donasi.`,
        [{ text: 'OK' }],
      );
    }
  };

  const renderDonationOption = (option, index) => (
    <TouchableOpacity
      key={option.name}
      style={[styles.cardContainer, { borderColor: option.color }]}
      onPress={() => handleDonationAction(option)}
    >
      <LinearGradient
        colors={[option.color, Colors.PRIMARY_50, '#ffffff00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        {/* <MaterialCommunityIcons 
          name={option.icon} 
          size={40} 
          color={option.color} 
          style={styles.icon} 
        /> */}
        <FastImage
          source={option.icon}
          style={styles.icon}
          resizeMode={FastImage.resizeMode.stretch}
        />

        <View style={styles.textWrapper}>
          <Text style={styles.cardTitle}>{option.name}</Text>
          <Text style={styles.cardDescription}>{option.description}</Text>

          {option.actionType === 'copy' && (
            <Text style={styles.addressText} numberOfLines={1}>
              {option.address.substring(0, 10)}... (Ketuk untuk salin)
            </Text>
          )}
        </View>

        <View style={styles.actionButton}>
          <MaterialCommunityIcons
            name={option.actionType === 'link' ? 'open-in-new' : 'content-copy'}
            size={20}
            color={Colors.WHITE}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <BaseView
      title="Dukungan & Donasi"
      isScrollable={false}
      onBackPress={() => navigation.pop()}
      containerStyle={{ flex: 1, backgroundColor: '#f2f4f8' }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>
              Bantu Kami Terus Berkembang! 💖
            </Text>
            <Text style={styles.heroSubtitle}>
              Donasi Anda membantu menutup biaya server dan pengembangan
              berkelanjutan untuk aplikasi ini.
            </Text>
          </View>
        </View>

        <View style={styles.optionsList}>
          {DONATION_OPTIONS.map(renderDonationOption)}
        </View>

        <Text style={styles.footerNote}>Terima kasih atas dukungan Anda!</Text>
      </ScrollView>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
  heroTextWrap: { gap: 6 },
  heroTitle: {
    fontFamily: Fonts.fontBold,
    fontSize: Sizes.CUSTOM_SIZE(18),
    color: Colors.TEXT,
  },
  heroSubtitle: {
    fontFamily: Fonts.fontRegular,
    fontSize: Sizes.CUSTOM_SIZE(12),
    color: Colors.GRAY_DARK,
    lineHeight: 18,
  },
  optionsList: {
    marginTop: 8,
    gap: 10,
  },
  cardContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e4e8f0',
    backgroundColor: '#ffffff',
    shadowColor: '#0d1b2a',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  gradientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  icon: {
    width: 40,
    height: 40,
    textAlign: 'center',
  },
  textWrapper: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontFamily: Fonts.fontSemiBold,
    fontSize: Sizes.CUSTOM_SIZE(14),
    color: Colors.TEXT,
  },
  cardDescription: {
    fontFamily: Fonts.fontRegular,
    fontSize: Sizes.CUSTOM_SIZE(11),
    color: Colors.TEXT,
    marginTop: 2,
  },
  addressText: {
    fontFamily: Fonts.fontItalic,
    fontSize: Sizes.CUSTOM_SIZE(10),
    color: Colors.TEXT,
    marginTop: 5,
  },
  actionButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: Colors.PRIMARY,
    marginLeft: 10,
  },
  footerNote: {
    fontFamily: Fonts.fontMedium,
    fontSize: Sizes.CUSTOM_SIZE(12),
    color: Colors.TEXT,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DonationScreen;
