import * as React from 'react';
import { BaseView, EmptyData } from '../../components';
import {
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Fonts, propertyStatuses } from '../../constants';
import { Colors, Sizes } from '../../styles';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const statusPillStyle = color => ({
  backgroundColor: '#FFFFFF90',
  borderColor: color,
  borderWidth: 0.6,
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 12,
});

const formatPrice = value => {
  if (!value) return '-';
  const numeric = Number(String(value).replace(/[^0-9]/g, ''));
  if (Number.isNaN(numeric)) return value;
  return `Rp ${numeric.toLocaleString('id-ID')}`;
};

const getStatusMeta = rawStatus => {
  // rawStatus bisa berupa id (angka/string) atau object { id, name }
  const statusId = rawStatus?.id ?? rawStatus;
  const found =
    propertyStatuses.find(s => `${s.id}` === `${statusId}`) ||
    propertyStatuses.find(s => s.name?.toLowerCase() === String(rawStatus || '').toLowerCase());
  return {
    label: found?.name || (statusId ? `${statusId}` : 'Status'),
    color: found?.color || Colors.PRIMARY,
  };
};

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
  const route = useRoute();

  const [appliedPropertyType, setAppliedPropertyType] = React.useState(null);
  const [appliedStatus, setAppliedStatus] = React.useState(null);
  const [appliedSearchQuery, setAppliedSearchQuery] = React.useState('');
  const lastFiltersUpdateRef = React.useRef(null);

  // --- LOGIKA ANIMASI SCROLL (TETAP SAMA) ---
  const translateY = useSharedValue(0);
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1,
    transform: [{ translateY: 0 }],
  }));
  // --- END LOGIKA ANIMASI SCROLL ---

  React.useEffect(() => {
    // Load awal tanpa filter; filter type backend akan dipicu tombol cari
    fetchGlobalProperties({ propertyTypeId: null });
  }, []);

  React.useEffect(() => {
    const updatedAt = route.params?.updatedAt;
    if (!updatedAt || updatedAt === lastFiltersUpdateRef.current) return;
    lastFiltersUpdateRef.current = updatedAt;

    const incomingFilters = route.params?.filters || {};
    const nextType = incomingFilters.propertyType || null;
    const nextStatus = incomingFilters.status || null;
    const nextSearch = incomingFilters.search || '';

    setAppliedPropertyType(nextType);
    setAppliedStatus(nextStatus);
    setAppliedSearchQuery(nextSearch);

    fetchGlobalProperties({ propertyTypeId: nextType?.id ?? null });
  }, [route.params?.updatedAt, route.params?.filters, fetchGlobalProperties]);

  const injectAds = (data, interval = 5) => {
    const result = [];
    // Data List Global Seharusnya dari listGlobalProperties,
    // tapi kita pakai dummyProperties untuk contoh UI:
    data.forEach((item, index) => {
      result.push({ ...item, _type: 'property' }); // DIUBAH: type
      // if ((index + 1) % interval === 0) {
      //   result.push({ _type: 'ad', id: `ad-${index}` });
      // }
    });
    return result;
  };

  // Menggunakan data dari state store, atau data dummy jika store kosong
  const propertiesToDisplay =
    listGlobalProperties.length > 0 ? listGlobalProperties : dummyProperties;
  const hasAnyData = propertiesToDisplay.length > 0;

  const filteredProperties = React.useMemo(() => {
    const query = appliedSearchQuery.trim().toLowerCase();
    return propertiesToDisplay.filter(item => {
      const matchesType =
        !appliedPropertyType ||
        `${item?.propertyTypeId || item?.propertyType?.id}` === `${appliedPropertyType?.id}` ||
        (item?.propertyTypeName || item?.propertyType?.name || item?.type || '')
          .toLowerCase()
          .includes((appliedPropertyType?.name || '').toLowerCase());

      const matchesStatus =
        !appliedStatus ||
        `${item?.statusId || item?.status?.id}` === `${appliedStatus?.id}` ||
        (item?.status?.name || '')
          .toLowerCase()
          .includes((appliedStatus?.name || '').toLowerCase());

      const matchesSearch =
        !query ||
        [
          item?.propertyName,
          item?.title,
          item?.address,
          item?.location,
          item?.city,
          item?.province,
        ]
          .filter(Boolean)
          .some(field => field.toLowerCase().includes(query));

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [propertiesToDisplay, appliedPropertyType, appliedStatus, appliedSearchQuery]);

  const propertiesWithAds = injectAds(filteredProperties, 5);

  const renderItem = ({ item }) => {
    if (item?._type === 'ad') {
      return (
        <View style={styles.adCardSocial}>
          <GlobalNativeAd />
        </View>
      );
    }

    const statusMeta = getStatusMeta(item.statusId || item.status?.id);
    const imageUrl = item?.imageUrl || item?.image;
    const priceDisplay = formatPrice(item?.price);
    const locationLabel =
      item?.address ||
      item?.location ||
      [item?.city, item?.province].filter(Boolean).join(', ') ||
      '-';

    return (
      <Pressable
        onPress={() => navigation.navigate('GlobalDetailPropertyScreen', item)}
        style={styles.card}
      >
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <FastImage source={{ uri: imageUrl }} style={styles.propertyImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons name='image-off-outline' size={28} color={Colors.GRAY_DARK} />
            </View>
          )}
          <View style={styles.overlayRow}>
            <View style={statusPillStyle(statusMeta.color)}>
              <Text style={styles.statusText}>{statusMeta.label}</Text>
            </View>
            <View style={styles.heartButton}>
              <MaterialCommunityIcons name='heart-outline' size={18} color={Colors.TEXT} />
            </View>
          </View>
        </View>

        <Text style={styles.propertyNameText} numberOfLines={2}>
          {item?.propertyName || item?.title || 'Properti'}
        </Text>

        <View style={styles.detailRow}>
          <MaterialCommunityIcons name='map-marker-outline' size={16} color={Colors.GRAY_DARK} />
          <Text style={styles.locationText} numberOfLines={1} ellipsizeMode='tail'>
            {locationLabel}
          </Text>
        </View>

        <View style={styles.tagRow}>
          <View style={styles.tagPill}>
            <MaterialCommunityIcons name='home-outline' size={14} color={Colors.PRIMARY} />
            <Text style={styles.tagText} numberOfLines={1}>
              {item?.propertyTypeName || item?.propertyType?.name || item?.type || '-'}
            </Text>
          </View>
          <View style={styles.tagPill}>
            <MaterialCommunityIcons name='map-marker-path' size={14} color={Colors.PRIMARY} />
            <Text style={styles.tagText} numberOfLines={1}>
              {statusMeta.label}
            </Text>
          </View>
        </View>

        <Text style={styles.priceText}>{priceDisplay}</Text>
      </Pressable>
    );
  };

  const handleResetFilters = () => {
    setAppliedPropertyType(null);
    setAppliedStatus(null);
    setAppliedSearchQuery('');
    fetchGlobalProperties({ propertyTypeId: null });
  };

  const goToFilterScreen = () => {
    navigation.navigate('GlobalPropertyFilterScreen', {
      currentFilters: {
        propertyType: appliedPropertyType,
        status: appliedStatus,
        search: appliedSearchQuery,
      },
    });
  };

  const renderFilterSummary = () => {
    const chips = [
      appliedSearchQuery ? { id: 'search', label: `Cari: ${appliedSearchQuery}` } : null,
      appliedPropertyType ? { id: 'type', label: appliedPropertyType?.name } : null,
      appliedStatus ? { id: 'status', label: appliedStatus?.name } : null,
    ].filter(Boolean);

    return (
      <Animated.View style={[styles.filterWrapper, headerAnimatedStyle]}>
        <View style={styles.filterHeaderRow}>
          <Text style={styles.filterTitle}>Filter Properti</Text>
          <View style={styles.filterActionRow}>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
              <MaterialCommunityIcons name='refresh' size={16} color={Colors.PRIMARY} />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.openFilterButton} onPress={goToFilterScreen}>
              <MaterialCommunityIcons name='tune' size={16} color={Colors.WHITE} />
              <Text style={styles.applyText}>Atur Filter</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chipRow}>
          {chips.length > 0 ? (
            chips.map(chip => (
              <View key={chip.id} style={styles.chip}>
                <Text style={styles.chipText}>{chip.label}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.filterSummary}>Belum ada filter aktif</Text>
          )}
        </View>

        <Text style={styles.filterSummary}>
          Menampilkan {filteredProperties.length} properti
        </Text>
      </Animated.View>
    );
  };

  return (
    <BaseView
      title={'Semua Properti'}
      disableLeftMenu
      containerStyle={{ flex: 1, backgroundColor: Colors.BACKGROUND }}
    >
      <View unflex style={{ marginLeft: -0 }}>
        <GlobalBannerAd />
      </View>
      {listGlobalPropertiesLoading && <LoadingPigeonsGLobal />}

      <AnimatedFlashList
        style={{ flex: 1 }}
        onScroll={event => {
          translateY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        data={propertiesWithAds}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item?.id || item?._type + item?.id}
        estimatedItemSize={220}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderFilterSummary}
        ListEmptyComponent={
          <EmptyData
            message={
              hasAnyData
                ? 'Tidak ada properti yang cocok dengan filter.'
                : 'Belum ada data properti global.'
            }
            description={
              hasAnyData
                ? 'Coba ubah kata kunci atau reset filter.'
                : 'Data properti dari semua pengguna di seluruh dunia akan muncul di sini.'
            }
            illustration={logotransparent}
          />
        }
        onEndReached={() => {
          if (!globalIsFetchingMore && globalHasMore && globalLastVisible) {
            fetchMoreGlobalProperties({ propertyTypeId: appliedPropertyType?.id });
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
      <View unflex style={{ paddingBottom: 40, backgroundColor: Colors.BACKGROUND }} />
    </BaseView>
  );
}

// 🎨 STYLE UPDATE
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.CARD,
    borderBottomWidth: 1,
    borderColor: Colors.WHITE_50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.TEXT,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.fontRegular,
    color: Colors.GRAY_DARK,
  },
  filterWrapper: {
    backgroundColor: Colors.CARD,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  filterActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.TEXT,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  chipText: {
    color: Colors.TEXT,
    fontFamily: Fonts.fontMedium,
    fontSize: 12,
  },
  listContainer: {
    padding: 12,
    backgroundColor: Colors.BACKGROUND,
    paddingTop: 8,
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

  card: {
    backgroundColor: Colors.CARD,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    marginHorizontal: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 1.15,
    backgroundColor: Colors.WHITE,
    marginBottom: 12,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  propertyNameText: {
    fontSize: 17,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.TEXT,
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 13,
    color: Colors.GRAY_DARK,
    marginLeft: 6,
    maxWidth: '85%',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
    flexWrap: 'wrap',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GRAY_LIGHT,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    marginLeft: 6,
    color: Colors.TEXT,
    fontFamily: Fonts.fontMedium,
    fontSize: 12,
  },
  priceText: {
    fontSize: 18,
    fontFamily: Fonts.fontBold,
    color: Colors.PRIMARY,
    marginTop: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  overlayRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heartButton: {
    backgroundColor: '#FFFFFFD0',
    borderRadius: 999,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  statusText: {
    color: Colors.TEXT,
    fontSize: 12,
    fontFamily: Fonts.fontMedium,
  },
  filterSummary: {
    fontFamily: Fonts.fontRegular,
    color: Colors.GRAY_DARK,
    fontSize: 12,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  resetText: {
    marginLeft: 6,
    color: Colors.PRIMARY,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 12,
  },
  openFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  applyText: {
    marginLeft: 6,
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 12,
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
