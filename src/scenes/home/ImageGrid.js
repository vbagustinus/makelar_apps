import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text, // <--- Tambahan untuk ListEmptyComponent
} from 'react-native';
// Mengganti FlatList dengan Carousel
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import FastImage from '@d11/react-native-fast-image';
import { Fonts } from '../../constants'; // Dipertahankan
import { logo, logotransparent } from '../../assets/images'; // Dipertahankan
import { useSharedValue } from 'react-native-reanimated';
import { Colors } from '../../styles';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Komponen Carousel Gambar Sederhana dan Dinamis (Swipeable).
 * * @param {Array<string>} imageUrls - Array string URL gambar.
 * @param {number} carouselWidth - Lebar area carousel (default: SCREEN_WIDTH).
 * @param {number} itemHeight - Tinggi setiap item/gambar di carousel (default: 200).
 * @param {number} padding - Padding horizontal di sekitar setiap gambar (default: 10).
 * @param {function} onPressImage - Fungsi yang dipanggil saat gambar ditekan, menerima index dan URL.
 */
const ImageCarousel = ({
  imageUrls = [],
  carouselWidth = SCREEN_WIDTH, // Menggunakan lebar penuh layar sebagai default
  itemHeight = 250, // Tinggi gambar carousel (dapat disesuaikan)
  padding = 10, // Padding horizontal di sekitar gambar
  onPressImage = () => {},
  logo: defaultLogo, // Menggunakan logo default
}) => {
  // Konversi array string URL menjadi format array objek
  const data = imageUrls.map((url, index) => ({
    id: index.toString(),
    url: url,
  }));

  // Hitung lebar item setelah dikurangi padding
  const itemWidth = carouselWidth - padding * 2;

  const renderItem = ({ item, index }) => {
    const imageSource = item.url ? { uri: item.url } : logo; // Gunakan logo default jika URL kosong/null

    return (
      <View style={[styles.itemContainer, { paddingHorizontal: padding }]}>
        <TouchableOpacity
          style={styles.touchableArea}
          onPress={() => onPressImage(index, item.url)}
          activeOpacity={0.8}
        >
          <FastImage
            source={imageSource}
            style={[
              styles.image,
              {
                borderRadius: 8, // Menggunakan borderRadius yang lebih besar untuk carousel
              },
            ]}
            resizeMode={FastImage.resizeMode.cover}
            defaultSource={logo}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const ref = React.useRef(null);
  const progress = useSharedValue(0);

  const onPressPagination = index => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  // Tampilkan komponen kosong jika tidak ada gambar
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No images found.</Text>
      </View>
    );
  }

  return (
    <View style={{ width: carouselWidth, height: itemHeight }}>
      <Carousel
        loop
        width={carouselWidth}
        height={itemHeight}
        data={data}
        scrollAnimationDuration={1000}
        // Atur lebar item yang akan dirender (dikurangi padding agar ada ruang antar item)
        defaultIndex={0}
        autoPlay={imageUrls.length > 1}
        autoPlayInterval={5000}
        renderItem={renderItem}
        onProgressChange={progress}
        // Gunakan `itemWidth` untuk menampilkan item satu per satu
        // Jika Anda ingin tampilan 'peek' (melihat item berikutnya), atur itemWidth lebih kecil dari carouselWidth
        // Misalnya: itemWidth = carouselWidth * 0.8

        // Contoh untuk mode 'peek':
        // itemWidth={carouselWidth * 0.9}

        // Contoh untuk mode penuh (default):
        itemWidth={carouselWidth}

        // Pager (indikator) bawaan bisa ditambahkan jika diperlukan
        // customPagination={...}
      />
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: Colors.WHITE_50, borderRadius: 50 }}
        activeDotStyle={{
          backgroundColor: Colors.PRIMARY_80,
        }}
        containerStyle={{ gap: 5, marginTop: -20 }}
        onPress={onPressPagination}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableArea: {
    flex: 1,
    width: '100%',
  },
  image: {
    flex: 1, // Memastikan gambar mengisi container
    width: '100%',
    backgroundColor: '#eee',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100, // Tinggi default saat kosong
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    fontFamily: Fonts.fontRegular,
  },
});

export default ImageCarousel;
