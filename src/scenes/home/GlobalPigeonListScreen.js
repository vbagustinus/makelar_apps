import * as React from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
  View,
  Text,
  BaseView,
  EmptyData,
  DropdownSearchableDefault,
} from '../../components';
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {
  // Menghapus konstanta burung yang tidak relevan
  Fonts,
  propertyTypes, // DIUBAH: Mengambil konstanta tipe properti
} from '../../constants';
import { Colors, Sizes } from '../../styles';
import { useNavigation } from '@react-navigation/native';
import { LoadingPigeonsGLobal } from '../property/LoadingPigeons'; // Mungkin perlu diubah namanya
import useAuthStore from '../../store/useAuthStore';
import { GlobalBannerAd, GlobalNativeAd } from '../ads';
import { logotransparent } from '../../assets/images';
import usePropertyStore from '../../store/usePropertyStore'; // DIUBAH: Import Store
import FastImage from '@d11/react-native-fast-image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

// --- CONTOH DATA PROPERTI BARU (Data dummy asli Anda tampaknya berupa data Agen/Perusahaan) ---
// Saya akan membuat data properti sederhana untuk kartu yang lebih jelas:
const dummyProperties = [
  {
    id: '1',
    title: 'Rumah Minimalis Modern',
    price: 'Rp 980.000.000',
    location: 'Jakarta Selatan',
    type: 'Rumah',
    seller: 'PT Properti Jaya',
    image: 'https://picsum.photos/seed/p1/600/400',
  },
  {
    id: '2',
    title: 'Apartemen City View Mewah',
    price: 'Rp 1.200.000.000',
    location: 'Bandung City',
    type: 'Apartemen',
    seller: 'Grup Megah',
    image: 'https://picsum.photos/seed/p2/600/400',
  },
  {
    id: '3',
    title: 'Tanah Kavling Siap Bangun',
    price: 'Rp 450.000.000',
    location: 'Bogor Timur',
    type: 'Tanah',
    seller: 'Developer Mandiri',
    image: 'https://picsum.photos/seed/p3/600/400',
  },
  {
    id: '4',
    title: 'Ruko 2 Lantai Strategis',
    price: 'Rp 1.800.000.000',
    location: 'Bekasi Pusat',
    type: 'Ruko',
    seller: 'Agen Pro X',
    image: 'https://picsum.photos/seed/p4/600/400',
  },
  // Data dummy agen/perusahaan yang Anda berikan sebelumnya:
  // Catatan: Saya akan menggunakan struktur kartu di bawah untuk menampilkan detail PROPERTI,
  // bukan data agen/perusahaan yang ada di kode Anda sebelumnya.
  // Jika Anda ingin menampilkan AGEN/PERUSAHAAN, silakan beritahu saya.
];

function GlobalPropertyListScreen() {
  // DIUBAH: Nama Komponen
  const navigation = useNavigation();
  const {
    // DIUBAH: Variabel yang diambil dari usePropertyStore
    totalProperties,
    totalForSale,
    totalForRent,
    fetchPropertyCounts,
    fetchLatestProperties,
    fetchGlobalProperties,
    fetchMoreGlobalProperties,
    listGlobalProperties, // DIUBAH
    listPropertyLoading,
    deletePropertySuccess,
    listGlobalPropertiesLoading, // DIUBAH
    isFetchingMore,
    hasMoreProperty,
    globalIsFetchingMore,
    globalHasMore,
    globalLastVisible,
  } = usePropertyStore(); // DIUBAH: Menggunakan usePropertyStore
  const clearToken = useAuthStore(state => state.clearToken);
  const user = useAuthStore(state => state.user);

  const [propertyType, setPropertyType] = React.useState(null); // DIUBAH: State filter

  // --- LOGIKA ANIMASI SCROLL (TETAP SAMA) ---
  const translateY = useSharedValue(80);
  const lastOffsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentOffset = event.contentOffset.y;

      if (currentOffset > lastOffsetY.value + 10) {
        // Scrolling down → hide
        translateY.value = withTiming(-100, { duration: 300 });
      } else if (currentOffset < lastOffsetY.value - 10) {
        // Scrolling up → show
        translateY.value = withTiming(80, { duration: 300 });
      }

      lastOffsetY.value = currentOffset;
    },
  });

  const animatedBottomStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  // --- END LOGIKA ANIMASI SCROLL ---

  React.useEffect(() => {
    // Memuat data properti global saat komponen dimuat
    initialData();
  }, []);

  const initialData = () => {
    // DIUBAH: Memanggil fungsi fetch properti baru
    fetchGlobalProperties({ propertyTypeId: propertyType?.id });
  };

  const injectAds = (data, interval = 5) => {
    const result = [];
    // Data List Global Seharusnya dari listGlobalProperties,
    // tapi kita pakai dummyProperties untuk contoh UI:
    data.forEach((item, index) => {
      result.push({ ...item, _type: 'property' }); // DIUBAH: type
      if ((index + 1) % interval === 0) {
        result.push({ _type: 'ad', id: `ad-${index}` });
      }
    });
    return result;
  };

  // Menggunakan data dari state store, atau data dummy jika store kosong
  const propertiesToDisplay =
    listGlobalProperties.length > 0 ? listGlobalProperties : dummyProperties;
  const propertiesWithAds = injectAds(propertiesToDisplay, 5);

  const renderItem = ({ item }) => {
    if (item?._type === 'ad') {
      return (
        <View style={styles.adCardSocial}>
          <GlobalNativeAd />
        </View>
      );
    }

    // --- KARTU PROPERTI (Disusun ulang agar terlihat seperti listing properti) ---
    return (
      <Pressable
        onPress={() => navigation.navigate('GlobalDetailPropertyScreen', item)} // DIUBAH: Navigasi
        style={styles.pressableContainerSocial}
      >
        <View style={styles.propertyItemContainer}>
          {/* Gambar Properti */}
          <View style={styles.imageWrapper}>
            <FastImage
              source={{ uri: item?.imageUrl || item?.image }} // Menggunakan imageUrl dari store atau image dari dummy
              style={styles.propertyImage}
            />
          </View>

          {/* Detail Properti */}
          <View style={styles.propertyDetailsContent}>
            <Text style={styles.propertyNameText} numberOfLines={2}>
              {item?.propertyName || item?.title}
            </Text>

            <View style={styles.priceContainer}>
              <MaterialCommunityIcons
                name='currency-usd'
                size={16}
                color={Colors.PRIMARY}
              />
              <Text style={styles.priceText}>{item?.price || item?.price}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name='map-marker-outline'
                size={14}
                color='#6B6B6B'
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {item?.address || item?.location}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name='home-city-outline'
                size={14}
                color='#6B6B6B'
              />
              <Text style={styles.typeText} numberOfLines={1}>
                {item?.propertyType?.name || item?.type} •{' '}
                {item?.landArea ? `${item.landArea}m²` : 'N/A'}
              </Text>
            </View>

            {/* Tombol Kontak (Contoh Aksi) */}
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity style={styles.contactButton}>
                <MaterialCommunityIcons
                  name='phone-outline'
                  size={18}
                  color={Colors.WHITE}
                />
                <Text style={styles.contactButtonText}>Hubungi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <BaseView
      title={'Semua Properti Global'} // DIUBAH: Judul
      disableLeftMenu
      bottomComponent={
        <Animated.View
          unflex
          style={[
            {
              padding: 10,
              backgroundColor: Colors.PRIMARY,
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              right: 0,
              left: 0,
              bottom: 0,
            },
            animatedBottomStyle,
          ]}
        >
          <View style={{ justifyContent: 'center' }}>
            <DropdownSearchableDefault
              styleContainer={styles.dropdownContainer}
              label='Tipe'
              placeholder='Pilih Tipe Properti' // DIUBAH
              iconName='home-city-outline' // DIUBAH: Ikon
              options={propertyTypes} // DIUBAH: Konstanta
              value={propertyType}
              onSelect={setPropertyType}
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={initialData}>
            <Text style={styles.searchButtonText}>Cari</Text>
          </TouchableOpacity>
        </Animated.View>
      }
    >
      <View unflex style={{ marginLeft: -0 }}>
        <GlobalBannerAd />
      </View>
      {listGlobalPropertiesLoading && <LoadingPigeonsGLobal />}{' '}
      {/* Ganti namanya nanti */}
      {!listGlobalPropertiesLoading && (
        <AnimatedFlashList
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          // onRefresh={initialData}
          // refreshing={listGlobalPropertiesLoading}
          data={propertiesWithAds}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?.id || item?._type + item?.id}
          estimatedItemSize={200} // Ukuran item yang lebih besar
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <EmptyData
              message='Belum ada data properti global.' // DIUBAH
              description='Data properti dari semua pengguna di seluruh dunia akan muncul di sini.' // DIUBAH
              illustration={logotransparent}
            />
          }
          onEndReached={() => {
            if (!globalIsFetchingMore && globalHasMore) {
              // DIUBAH: parameter filter
              fetchMoreGlobalProperties({ propertyTypeId: propertyType?.id });
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <View style={{ padding: 20 }}>
              {globalIsFetchingMore && (
                <ActivityIndicator size='large' color={Colors.PRIMARY} />
              )}
              <View style={styles.spacer} />
            </View>
          }
        />
      )}
      <View
        unflex
        style={{ paddingBottom: 70, backgroundColor: Colors.WHITE }}
      />
    </BaseView>
  );
}

// 🎨 STYLE UPDATE
const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    paddingTop: 5,
  },
  pressableContainerSocial: {
    marginHorizontal: 0,
    marginBottom: 10,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  adCardSocial: {
    marginHorizontal: 0,
    marginBottom: 10,
    backgroundColor: 'transparent',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#e0e0e0',
  },

  // --- ITEM PROPERTI (Kartu) ---
  propertyItemContainer: {
    flexDirection: 'row',
    padding: 10,
  },

  // --- GAMBAR PROPERTI ---
  imageWrapper: {
    borderRadius: 5,
    overflow: 'hidden',
    width: 120 * Sizes.ratioWidthScreen,
    height: 120 * Sizes.ratioWidthScreen,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // --- DETAIL TEKS ---
  propertyDetailsContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  propertyNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginLeft: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  locationText: {
    fontSize: 12,
    color: '#6B6B6B',
    marginLeft: 5,
    maxWidth: '90%',
  },
  typeText: {
    fontSize: 12,
    color: '#6B6B6B',
    marginLeft: 5,
  },

  // --- TOMBOL AKSI ---
  actionButtonContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: Colors.PRIMARY,
    elevation: 2,
  },
  contactButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.WHITE,
  },
  // --- STYLE DROPDOWN BAWAH ---
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff30',
    borderRadius: 12,
    padding: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ffffff30',
    marginRight: 20,
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff30',
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 20,
    marginRight: 20,
    height: 40,
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  searchButtonText: {
    fontFamily: Fonts.fontBold,
    fontSize: 12,
    color: Colors.WHITE,
  },
  spacer: {
    height: 20, // Untuk jarak di footer
  },
});

export default GlobalPropertyListScreen;
