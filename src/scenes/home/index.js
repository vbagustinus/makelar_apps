import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import FastImage from '@d11/react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Fonts, propertyCategories } from '../../constants';
import { getString, setItem, zustandMMKVStorage } from '../../helpers';
import { requestLocationPermission } from '../../utils/permissions';
import useAuthStore from '../../store/useAuthStore';
import usePropertyStore from '../../store/usePropertyStore';
import { Colors, useThemeColors } from '../../styles';
import useThemeStore from '../../store/useThemeStore';
import { Text } from '../../components';
import { banner1, banner2, banner3, banner4 } from '../../assets/images';
import dayjs from 'dayjs';

const { width } = Dimensions.get('window');

const promoBanners = [
  { id: 1, image: banner1 },
  { id: 2, image: banner2 },
  { id: 3, image: banner3 },
  { id: 4, image: banner4 },
];

const fallbackProperties = [
  {
    id: '1',
    title: 'Rumah Minimalis Modern',
    price: 'Rp 980000000',
    location: 'Jakarta Selatan',
    image: 'https://picsum.photos/seed/p1/600/400',
    tag: 'Rumah',
  },
  {
    id: '2',
    title: 'Apartemen City View',
    price: 'Rp 1200000000',
    location: 'Bandung',
    image: 'https://picsum.photos/seed/p2/600/400',
    tag: 'Apartemen',
  },
  {
    id: '3',
    title: 'Ruko Strategis',
    price: 'Rp 1800000000',
    location: 'Bekasi',
    image: 'https://picsum.photos/seed/p3/600/400',
    tag: 'Ruko',
  },
  {
    id: '4',
    title: 'Gudang Luas',
    price: 'Rp 2500000000',
    location: 'Surabaya',
    image: 'https://picsum.photos/seed/p4/600/400',
    tag: 'Industri/Gudang',
  },
];

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const theme = useThemeStore(state => state.theme);
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isMountedRef = useRef(true);

  const [activeCategory, setActiveCategory] = useState(
    propertyCategories?.[0]?.name || 'Rumah',
  );
  const [refreshing, setRefreshing] = useState(false);
  const [locationLabel, setLocationLabel] = useState(
    getString('lastLocationLabel') || 'Memuat lokasi...',
  );
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [lastFilterLabel, setLastFilterLabel] = useState(
    getString('lastFilterLabel') || 'Semua properti',
  );
  const [locationTimestamp, setLocationTimestamp] = useState(() => {
    const saved = getString('lastLocationTime');
    return saved ? Number(saved) : null;
  });
  const lastGeoRequestRef = useRef(0);

  const fetchUserData = useAuthStore(state => state.fetchUserData);
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);

  const {
    totalProperties,
    totalForSale,
    totalForRent,
    totalPropertyLoading,
    fetchPropertyCounts,
    fetchLatestProperties,
    fetchAllProperties,
    latestProperties,
    latestPropertiesLoading,
    listAllProperties,
    listAllPropertiesLoading,
  } = usePropertyStore();

  const tokenStorage = getString('token');

  const handleOpenProperty = property => {
    const isOwner = property?.uid && user?.uid && property.uid === user.uid;
    const targetRoute = isOwner
      ? 'DetailPropertyScreen'
      : 'GlobalDetailPropertyScreen';
    navigation.navigate(targetRoute, property);
  };

  const goToPropertyScreen = () => {
    navigation.navigate('PropertyScreen');
  };

  const goToPropertyGlobalScreen = filters => {
    if (filters?.propertyType?.name || filters?.propertyType?.id) {
      const name = filters.propertyType.name || filters.propertyType.id;
      setLastFilterLabel(`Tipe: ${name}`);
      setItem('lastFilterLabel', `Tipe: ${name}`);
    } else if (filters === null) {
      setLastFilterLabel('Semua properti');
      setItem('lastFilterLabel', 'Semua properti');
    }
    navigation.navigate('Semua', {
      filters,
      updatedAt: Date.now(),
    });
  };

  const openFilterScreen = () => {
    setLastFilterLabel('Filter kustom');
    setItem('lastFilterLabel', 'Filter kustom');
    navigation.navigate('GlobalPropertyFilterScreen');
  };

  const fetchCityByCoords = async (latitude, longitude, signal) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MakelarApp/1.0 (support@makelar.local)',
          },
          signal,
        },
      );
      if (!response.ok) {
        throw new Error('reverse geocode failed');
      }
      const data = await response.json();
      const addr = data?.address || {};
      return (
        addr.city ||
        addr.town ||
        addr.village ||
        addr.county ||
        addr.state ||
        'Lokasi ditemukan'
      );
    } catch (error) {
      console.log('Reverse geocode error', error?.message);
      if (signal?.aborted) return null;
      return null;
    }
  };

  const getCurrentPositionWithTimeout = () =>
    new Promise(resolve => {
      let didReturn = false;
      const timer = setTimeout(() => {
        if (!didReturn) {
          didReturn = true;
          resolve(null);
        }
      }, 12000);

      Geolocation.getCurrentPosition(
        pos => {
          if (!didReturn) {
            didReturn = true;
            clearTimeout(timer);
            resolve(pos);
          }
        },
        error => {
          console.log('Geolocation error', error?.message);
          if (!didReturn) {
            didReturn = true;
            clearTimeout(timer);
            resolve(null);
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });

  const renderSkeletonGrid = (count = 4) => (
    <View style={styles.skeletonGrid}>
      {Array.from({ length: count }).map((_, idx) => (
        <View key={idx} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonLineShort} />
          <View style={styles.skeletonLineLong} />
        </View>
      ))}
    </View>
  );

  const openAppSettings = () => {
    Linking.openSettings?.();
  };

  const updateUserLocation = useCallback(async () => {
    if (locating) return;
    const now = Date.now();
    if (now - lastGeoRequestRef.current < 5000) {
      return;
    }
    lastGeoRequestRef.current = now;
    setLocating(true);
    setLocationError(false);
    setLocationLabel('Mendeteksi lokasi...');
    const abortController = new AbortController();
    try {
      if (Platform.OS === 'ios' && Geolocation.requestAuthorization) {
        Geolocation.requestAuthorization('whenInUse');
      }
      const granted = await requestLocationPermission();
      if (!granted) {
        setLocationLabel('Lokasi tidak aktif');
        setLocationError(true);
        return;
      }

      const position = await getCurrentPositionWithTimeout();

      if (!position?.coords) {
        setLocationLabel('Tidak dapat mengambil lokasi');
        setLocationError(true);
        return;
      }

      const { latitude, longitude } = position.coords;
      const city = await fetchCityByCoords(
        latitude,
        longitude,
        abortController.signal,
      );
      if (isMountedRef.current) {
        setLocationLabel(
          city || `Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`,
        );
        setLocationTimestamp(now);
        setItem(
          'lastLocationLabel',
          city || `Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`,
        );
        setItem('lastLocationTime', String(now));
        setItem('lastLat', String(latitude));
        setItem('lastLon', String(longitude));
      }
    } finally {
      if (isMountedRef.current) {
        setLocating(false);
      }
      abortController.abort();
    }
  }, [locating]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const tokenuid = zustandMMKVStorage.getItem('token');
      await fetchUserData(tokenuid);
    };
    !user && (token || tokenStorage) && fetchUserInfo();
  }, [fetchUserData, token, tokenStorage, user]);

  const initialData = useCallback(() => {
    if (user && (token || tokenStorage)) {
      fetchPropertyCounts();
      fetchLatestProperties();
    }
    fetchAllProperties();
  }, [
    fetchAllProperties,
    fetchLatestProperties,
    fetchPropertyCounts,
    token,
    tokenStorage,
    user,
  ]);

  useEffect(() => {
    initialData();
  }, [initialData, user]);

  useEffect(() => {
    updateUserLocation();
  }, [updateUserLocation]);

  useFocusEffect(
    useCallback(() => {
      setLastFilterLabel(getString('lastFilterLabel') || 'Semua properti');
    }, []),
  );

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    initialData();
    setTimeout(() => setRefreshing(false), 1200);
  }, [initialData]);

  const withCurrency = price => {
    if (price === 0) return 'Rp 0';
    if (!price) return 'Rp -';
    const numeric = Number(String(price).replace(/[^0-9]/g, ''));
    if (Number.isNaN(numeric)) return `Rp ${price}`;
    return `Rp ${numeric.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const latestList = latestProperties?.length ? latestProperties : [];
  const globalList = listAllProperties?.length
    ? listAllProperties
    : fallbackProperties;

  return (
    <View style={styles.wrapper}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <LinearGradient
        colors={
          theme === 'dark' ? ['#0E1C34', '#0B162A'] : ['#EAF3FF', '#F8FAFF']
        }
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <View style={styles.locationRow}>
          <View style={styles.locationIcon}>
            <MaterialDesignIcons
              name="map-marker-radius"
              size={20}
              color={colors.PRIMARY}
            />
          </View>
          <View>
            <Text style={styles.locationLabel}>Lokasi Anda</Text>
            <TouchableOpacity
              style={styles.locationSelector}
              activeOpacity={0.8}
              onPress={updateUserLocation}
            >
              <Text style={styles.locationValue}>
                {locating ? 'Mendeteksi...' : locationLabel}
                {locationTimestamp && !locating
                  ? ` • ${dayjs(locationTimestamp).format('HH:mm')}`
                  : ''}
              </Text>
              {!locationError && (
                <MaterialDesignIcons
                  name="refresh"
                  size={18}
                  color={colors.TEXT}
                />
              )}
            </TouchableOpacity>
            {locationError ? (
              <TouchableOpacity
                style={styles.locationSettings}
                onPress={openAppSettings}
                activeOpacity={0.8}
              >
                <MaterialDesignIcons
                  name="cog-outline"
                  size={16}
                  color={colors.PRIMARY}
                />
                <Text style={styles.locationSettingsText}>Buka Pengaturan</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={styles.headerActions}>
          {/* <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
              <MaterialDesignIcons
                name="bell-outline"
                size={20}
                color={colors.TEXT}
              />
              <View style={styles.notificationDot} />
            </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SettingsScreen')}
          >
            <MaterialDesignIcons
              name="tune-variant"
              size={20}
              color={colors.TEXT}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.PRIMARY]}
          />
        }
      >
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.searchInput}
            activeOpacity={0.85}
            onPress={() => goToPropertyGlobalScreen(null)}
          >
            <MaterialDesignIcons name="magnify" size={20} color={colors.GREY} />
            <Text style={styles.searchPlaceholder}>
              Cari properti impian...
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={openFilterScreen}
            activeOpacity={0.85}
          >
            <MaterialDesignIcons name="tune" size={20} color={colors.WHITE} />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.filterChipRow}>
          <MaterialDesignIcons
            name="filter-variant"
            size={16}
            color={colors.PRIMARY}
          />
          <Text style={styles.filterChipText}>{lastFilterLabel}</Text>
          <TouchableOpacity
            onPress={openFilterScreen}
            activeOpacity={0.8}
            style={styles.filterChipAction}
          >
            <Text style={styles.filterChipActionText}>Atur</Text>
          </TouchableOpacity>
        </View> */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {propertyCategories.map(cat => {
            const isActive =
              activeCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  setActiveCategory(cat.name);
                  goToPropertyGlobalScreen({
                    propertyType: cat,
                    status: null,
                    search: '',
                  });
                }}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
                activeOpacity={0.85}
              >
                <MaterialDesignIcons
                  name={
                    cat.name === 'Apartemen'
                      ? 'office-building'
                      : cat.name === 'Tanah'
                      ? 'image-filter-hdr'
                      : 'home-outline'
                  }
                  size={16}
                  color={isActive ? colors.WHITE : colors.TEXT}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isActive && { color: colors.WHITE },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Animated.View
          entering={FadeInDown.duration(450)}
          style={styles.heroCard}
        >
          <FastImage source={promoBanners[0].image} style={styles.heroImage} />
          <LinearGradient
            colors={
              theme === 'dark'
                ? ['#0C1B30', '#0C1B3090']
                : ['#0B5AD840', '#0B5AD8CC']
            }
            style={styles.heroOverlay}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}></Text>
            <Text style={styles.heroTitle}>
              Jual Beli & Sewa Jadi Lebih Mudah
            </Text>
            <Text style={styles.heroSubtitle}>
              Temukan hunian impian dalam satu genggaman aplikasi Makelar.
            </Text>
            <TouchableOpacity
              style={styles.heroButton}
              activeOpacity={0.9}
              onPress={() => goToPropertyGlobalScreen(null)}
            >
              <LinearGradient
                colors={colors.GRADIENT_SKY}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroButtonInner}
              >
                <Text style={styles.heroButtonText}>Lihat Sekarang</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {(token || tokenStorage) &&
          (totalPropertyLoading ? (
            <Animated.View
              entering={FadeInDown.delay(120)}
              style={styles.dashboardRow}
            >
              {[1, 2, 3].map(item => (
                <View key={item} style={styles.statSkeleton} />
              ))}
            </Animated.View>
          ) : (
            <Animated.View
              entering={FadeInDown.delay(150)}
              style={styles.dashboardRow}
            >
              <DashboardStat
                icon="home-analytics"
                label="Total Properti"
                value={totalProperties || 0}
                colors={colors}
                styles={styles}
              />
              <DashboardStat
                icon="sale"
                label="Properti Dijual"
                value={totalForSale || 0}
                colors={colors}
                styles={styles}
              />
              <DashboardStat
                icon="home-import-outline"
                label="Properti Disewa"
                value={totalForRent || 0}
                colors={colors}
                styles={styles}
              />
            </Animated.View>
          ))}

        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Properti Terbaru Anda</Text>
          </View>
          {latestPropertiesLoading ? (
            renderSkeletonGrid(4)
          ) : latestList.length ? (
            <FlatList
              data={latestList}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={item => item.id}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <PropertyCard
                  item={item}
                  colors={colors}
                  onPress={() => handleOpenProperty(item)}
                  withCurrency={withCurrency}
                  styles={styles}
                />
              )}
            />
          ) : (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <MaterialDesignIcons
                  name="home-plus-outline"
                  size={28}
                  color={colors.PRIMARY}
                />
              </View>
              <Text style={styles.emptyTitle}>Belum ada properti</Text>
              <Text style={styles.emptyCaption}>
                Anda belum memiliki properti yang tersimpan atau didaftarkan
                saat ini.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={goToPropertyScreen}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={colors.GRADIENT_SKY}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryButtonInner}
                >
                  <Text style={styles.primaryButtonText}>
                    + Tambah Sekarang
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(250)}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Properti Pilihan Global</Text>
            <TouchableOpacity
              onPress={() => goToPropertyGlobalScreen(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.linkText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          {listAllPropertiesLoading ? (
            renderSkeletonGrid(6)
          ) : (
            <FlatList
              data={globalList}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={item => item.id}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <PropertyCard
                  item={item}
                  colors={colors}
                  onPress={() => handleOpenProperty(item)}
                  withCurrency={withCurrency}
                  styles={styles}
                />
              )}
            />
          )}
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fabWrapper}
        activeOpacity={0.9}
        onPress={goToPropertyScreen}
      >
        <LinearGradient
          colors={colors.GRADIENT_SKY}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <MaterialDesignIcons name="plus" size={28} color={colors.WHITE} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const PropertyCard = ({ item, onPress, colors, withCurrency, styles }) => (
  <TouchableOpacity
    style={[
      styles.card,
      { backgroundColor: colors.CARD, borderColor: colors.GRAY_LIGHT },
    ]}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View style={styles.cardImageWrapper}>
      <FastImage
        source={{ uri: item.imageUrl || item.image }}
        style={styles.cardImage}
      />
      <View style={[styles.cardBadge, { backgroundColor: colors.HAZE }]}>
        <Text style={[styles.cardBadgeText, { color: colors.TEXT }]}>
          {item?.propertyTypeName ||
            item?.propertyType?.name ||
            item?.tag ||
            'Properti'}
        </Text>
      </View>
      <TouchableOpacity style={styles.cardHeart}>
        <MaterialDesignIcons
          name="heart-outline"
          size={18}
          color={colors.WHITE}
        />
      </TouchableOpacity>
    </View>
    <Text style={[styles.cardTitle, { color: colors.TEXT }]} numberOfLines={2}>
      {item.propertyName || item.title}
    </Text>
    <View style={styles.cardInfoRow}>
      <MaterialDesignIcons
        name="map-marker-outline"
        size={14}
        color={colors.GREY}
      />
      <Text
        style={[styles.cardLocation, { color: colors.GREY }]}
        numberOfLines={1}
      >
        {item.address || item.location || 'Lokasi belum diisi'}
      </Text>
    </View>
    <Text style={[styles.cardPrice, { color: colors.PRIMARY }]}>
      {withCurrency(item.price)}
    </Text>
  </TouchableOpacity>
);

const DashboardStat = ({ icon, label, value, colors, styles }) => (
  <View
    style={[
      styles.statCard,
      { backgroundColor: colors.CARD, borderColor: colors.GRAY_LIGHT },
    ]}
  >
    <View style={[styles.statIcon, { backgroundColor: colors.HAZE }]}>
      <MaterialDesignIcons name={icon} size={20} color={colors.PRIMARY} />
    </View>
    <Text style={[styles.statValue, { color: colors.TEXT }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: colors.GREY }]}>{label}</Text>
  </View>
);

const createStyles = colors =>
  StyleSheet.create({
    wrapper: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      gap: 16,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    locationIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.HAZE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    locationLabel: {
      color: colors.GREY,
      fontSize: 12,
      fontFamily: Fonts.fontRegular,
    },
    locationSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    locationValue: {
      color: colors.TEXT,
      fontSize: 16,
      fontFamily: Fonts.fontSemiBold,
    },
    locationSettings: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    locationSettingsText: {
      color: colors.PRIMARY,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 12,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginRight: 20,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.CARD,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationDot: {
      position: 'absolute',
      top: 8,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.WARNING,
    },
    searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    searchInput: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.CARD,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    searchPlaceholder: {
      color: colors.GREY,
      fontFamily: Fonts.fontRegular,
      fontSize: 14,
    },
    filterButton: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.PRIMARY,
      shadowColor: colors.PRIMARY,
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    filterChipRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 6,
      backgroundColor: colors.CARD,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      alignSelf: 'flex-start',
    },
    filterChipText: {
      color: colors.TEXT,
      fontSize: 12,
      fontFamily: Fonts.fontRegular,
    },
    filterChipAction: {
      marginLeft: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      backgroundColor: colors.HAZE,
    },
    filterChipActionText: {
      color: colors.PRIMARY,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 12,
    },
    categoryContainer: { marginTop: 10 },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: colors.CARD,
      borderRadius: 20,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      gap: 8,
    },
    categoryChipActive: {
      backgroundColor: colors.PRIMARY,
      borderColor: colors.PRIMARY,
      shadowColor: colors.PRIMARY,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    categoryText: {
      fontSize: 13,
      color: colors.TEXT,
      fontFamily: Fonts.fontSemiBold,
    },
    heroCard: {
      height: 200,
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 6,
    },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 24,
    },
    heroContent: {
      position: 'absolute',
      left: 18,
      right: 18,
      bottom: 18,
      gap: 6,
    },
    heroLabel: {
      fontFamily: Fonts.fontSemiBold,
      fontSize: 12,
      color: colors.WHITE,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    heroTitle: {
      fontFamily: Fonts.fontBold,
      fontSize: 20,
      color: colors.WHITE,
      lineHeight: 26,
    },
    heroSubtitle: {
      fontFamily: Fonts.fontRegular,
      fontSize: 13,
      color: colors.WHITE_80,
      lineHeight: 18,
    },
    heroButton: { alignSelf: 'flex-start', marginTop: 6 },
    heroButtonInner: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
    },
    heroButtonText: {
      color: colors.WHITE,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 14,
    },
    dashboardRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 4,
    },
    statSkeleton: {
      flex: 1,
      height: 90,
      borderRadius: 18,
      backgroundColor: colors.HAZE,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    statCard: {
      flex: 1,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    statValue: {
      fontFamily: Fonts.fontSemiBold,
      fontSize: 18,
    },
    statLabel: {
      fontFamily: Fonts.fontRegular,
      fontSize: 12,
      marginTop: 2,
    },
    sectionContainer: {
      marginTop: 8,
      backgroundColor: colors.CARD,
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
    },
    linkText: {
      fontFamily: Fonts.fontSemiBold,
      color: colors.PRIMARY,
      fontSize: 13,
    },
    card: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      overflow: 'hidden',
      paddingBottom: 12,
    },
    cardImageWrapper: {
      height: width * 0.28,
      position: 'relative',
      overflow: 'hidden',
    },
    cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    cardBadge: {
      position: 'absolute',
      top: 10,
      left: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    cardBadgeText: {
      fontSize: 11,
      fontFamily: Fonts.fontMedium,
      color: Colors.TEXT,
    },
    cardHeart: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#00000040',
    },
    cardTitle: {
      fontFamily: Fonts.fontSemiBold,
      fontSize: 14,
      marginTop: 10,
      paddingHorizontal: 10,
    },
    cardInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      marginTop: 4,
    },
    cardLocation: {
      fontSize: 12,
      fontFamily: Fonts.fontRegular,
      flex: 1,
    },
    cardPrice: {
      fontFamily: Fonts.fontBold,
      paddingHorizontal: 10,
      marginTop: 6,
      fontSize: 14,
    },
    emptyBox: {
      borderStyle: 'dashed',
      borderWidth: 1.2,
      borderColor: colors.GRAY_LIGHT,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.BACKGROUND,
    },
    emptyIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.HAZE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
      fontSize: 16,
    },
    emptyCaption: {
      fontFamily: Fonts.fontRegular,
      color: colors.GREY,
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 18,
    },
    primaryButton: { width: '100%' },
    primaryButtonInner: {
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      color: colors.WHITE,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 14,
    },
    fabWrapper: {
      position: 'absolute',
      bottom: 18,
      alignSelf: 'center',
      shadowColor: colors.PRIMARY,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    fab: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skeletonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    skeletonCard: {
      width: (width - 16 * 2 - 12) / 2,
      backgroundColor: colors.CARD,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    skeletonImage: {
      width: '100%',
      height: 110,
      borderRadius: 12,
      backgroundColor: colors.HAZE,
      marginBottom: 10,
    },
    skeletonLineShort: {
      width: '60%',
      height: 12,
      backgroundColor: colors.HAZE,
      borderRadius: 8,
      marginBottom: 6,
    },
    skeletonLineLong: {
      width: '80%',
      height: 12,
      backgroundColor: colors.HAZE,
      borderRadius: 8,
    },
  });

export default HomeScreen;
