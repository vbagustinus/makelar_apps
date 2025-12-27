import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
// Mengganti Ionicons jika tidak digunakan, namun saya biarkan importnya jika library masih dipakai
// import { Ionicons } from '@react-native-vector-icons/ionicons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Sizes } from '../../styles';
import FastImage from '@d11/react-native-fast-image';
import { banner1, banner2, banner3, banner4, logotransparent } from '../../assets/images';
import { Fonts, propertyCategories } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../store/useAuthStore';
import { getString, zustandMMKVStorage } from '../../helpers';
import usePropertyStore from '../../store/usePropertyStore'; // DIUBAH: Import Store
import { GlobalBannerAd } from '../ads';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

// --- DATA DUMMY (Dibiarkan tetap relevan dengan properti) ---
const categories = [
  'Rumah',
  'Apartemen',
  'Tanah',
  'Ruko',
  'Kos',
  'Villa',
  'Gudang',
];

const banners = [
  { id: 1, image: banner1 },
  { id: 2, image: banner2 },
  { id: 3, image: banner3 },
  { id: 4, image: banner4 },
];

const properties = [
  {
    id: '1',
    title: 'Rumah Minimalis Modern',
    price: 'Rp 980jt',
    location: 'Jakarta Selatan',
    image: 'https://picsum.photos/seed/p1/600/400',
  },
  {
    id: '2',
    title: 'Apartemen City View',
    price: 'Rp 1,2M',
    location: 'Bandung',
    image: 'https://picsum.photos/seed/p2/600/400',
  },
  {
    id: '3',
    title: 'Rumah Cluster Tenang',
    price: 'Rp 760jt',
    location: 'Bogor',
    image: 'https://picsum.photos/seed/p3/600/400',
  },
  {
    id: '4',
    title: 'Ruko 2 Lantai',
    price: 'Rp 1,8M',
    location: 'Bekasi',
    image: 'https://picsum.photos/seed/p4/600/400',
  },
];

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const fetchUserData = useAuthStore(state => state.fetchUserData);
  const fetchTopUsersByPoint = useAuthStore(
    state => state.fetchTopUsersByPoint,
  );
  const updateUserPoint = useAuthStore(state => state.updateUserPoint);
  const listUser = useAuthStore(state => state.listUser);
  const user = useAuthStore(state => state.user);
  const tokenStorage = getString('token');
  const token = useAuthStore(state => state.token);
  const handleOpenProperty = property => {
    const isOwner = property?.uid && user?.uid && property.uid === user.uid;
    const targetRoute = isOwner ? 'DetailPropertyScreen' : 'GlobalDetailPropertyScreen';
    navigation.navigate(targetRoute, property);
  };

  // DIUBAH: Mengambil variabel properti dari usePropertyStore
  const {
    totalProperties, // DIUBAH: totalPigeons
    totalForSale, // DIUBAH: totalMale
    totalForRent, // DIUBAH: totalFemale
    fetchPropertyCounts, // DIUBAH: fetchPigeonCounts
    fetchLatestProperties, // DIUBAH: fetchLatestPigeons
    totalPropertyError, // DIUBAH: totalPigeonsError
    totalPropertyLoading, // DIUBAH: totalPigeonsLoading
    latestProperties, // DIUBAH: latestPigeons
    latestPropertiesError, // DIUBAH: latestPigeonsError
    latestPropertiesLoading, // DIUBAH: latestPigeonsLoading
    fetchAllProperties, // DIUBAH: fetchAllPigeons
    listAllProperties, // DIUBAH: listAllPigeons
    listAllPropertiesLoading, // DIUBAH: listAllPigeonsLoading
    listAllPropertiesError, // DIUBAH: listAllPigeonsError
  } = usePropertyStore(); // DIUBAH: useBloodlineStore -> usePropertyStore

  const [refreshing, setRefreshing] = React.useState(false);
  const [successModal, setSuccessModal] = React.useState(false);

  // console.log('listUser', listUser);

  const goToPointScreen = () => {
    if ((token || tokenStorage) && user) {
      navigation.navigate('PointScreen');
    } else {
      goToProfileScreen();
    }
  };

  const goToProfileScreen = () => {
    navigation.navigate('Profil'); // Assuming 'Profil' is the profile screen name
  };

  // DIUBAH: Navigasi ke daftar properti pribadi
  const goToPropertyScreen = () => {
    // Arahkan ke tab Properti; tab ini otomatis menampilkan AuthScreen jika belum login
    navigation.navigate('BloodLineScreen');
  };

  // DIUBAH: Navigasi ke daftar properti global
  const goToPropertyGlobalScreen = () => {
    navigation.navigate('Semua'); // Asumsi 'Semua' adalah layar daftar properti global
  };

  const handleCategoryPress = label => {
    const selectedType =
      propertyCategories.find(cat => cat.name?.toLowerCase() === label.toLowerCase()) || null;
    navigation.navigate('Semua', {
      filters: { propertyType: selectedType, status: null, search: '' },
      updatedAt: Date.now(),
    });
  };

  const goToLeaderBoardScreen = () => {
    navigation.navigate('LeaderBoardScreen', { data: listUser });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const tokenuid = zustandMMKVStorage.getItem('token');
      await fetchUserData(tokenuid);
    };
    !user && (token || tokenStorage) && fetchUserInfo();
  }, []);

  useEffect(() => {
    initialData();
  }, [user]);

  const initialData = () => {
    if (user && (token || tokenStorage)) {
      fetchPropertyCounts(); // DIUBAH
      fetchLatestProperties(); // DIUBAH
      fetchTopUsersByPoint(5);
    }
    fetchAllProperties(); // DIUBAH
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    initialData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const withCurrency = price => {
    if (price === 0) return 'Rp 0';
    if (!price) return 'Rp -';
    const numeric = Number(String(price).replace(/[^0-9]/g, ''));
    if (Number.isNaN(numeric)) return `Rp ${price}`;
    return `Rp ${numeric.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  // DIUBAH: Mengganti komponen lama yang tidak lagi relevan
  const renderLatestProperties = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleOpenProperty(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardImageWrapper}>
        <FastImage
          source={{ uri: item.imageUrl || item.image }}
          style={styles.cardImage}
        />
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{item?.propertyTypeName || item?.propertyType?.name || 'Tipe'}</Text>
        </View>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.propertyName || item.title}
      </Text>
      <View style={styles.cardInfoRow}>
        <MaterialDesignIcons
          name='map-marker-outline'
          size={14}
          color={Colors.GRAY_DARK}
        />
        <Text style={styles.cardLocation} numberOfLines={1}>
          {item.address || item.location || 'Lokasi belum diisi'}
        </Text>
      </View>
      <Text style={styles.cardPrice}>{withCurrency(item.price)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TouchableOpacity
        style={[styles.searchContainer, { paddingTop: insets.top + 20 }]}
        activeOpacity={0.8}
        onPress={goToPropertyGlobalScreen}
      >
        <Text style={styles.searchBar}>🔍 Cari properti...</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.PRIMARY]}
          />
        }
      >
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryChip}
              onPress={() => handleCategoryPress(item)}
            >
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Banner Slider */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.bannerWrapper}
        >
          {banners.map(b => (
            <FastImage
              key={b.id}
              source={b.image}
              style={styles.bannerImage}
            />
          ))}
        </ScrollView>

        {/* My Property Stats/Action Section (Jika user login) */}
        {(token || tokenStorage) && user && (
          <Animated.View
            entering={FadeInUp.delay(200)}
            style={styles.userStatsContainer}
          >
            <Text style={styles.sectionTitle}>Dashboard Saya</Text>

            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statBox}
                onPress={goToPropertyScreen}
              >
                <MaterialDesignIcons
                  name='warehouse'
                  size={30}
                  color={Colors.PRIMARY}
                />
                <Text style={styles.statCount}>{totalProperties}</Text>
                <Text style={styles.statLabel}>Total Properti</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statBox}
                onPress={goToPropertyScreen}
              >
                <MaterialDesignIcons
                  name='sale'
                  size={30}
                  color={Colors.SUCCESS}
                />
                <Text style={styles.statCount}>{totalForSale}</Text>
                <Text style={styles.statLabel}>Properti Dijual</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statBox}
                onPress={goToPropertyScreen}
              >
                <MaterialDesignIcons
                  name='currency-usd'
                  size={30}
                  color={Colors.WARNING}
                />
                <Text style={styles.statCount}>{totalForRent}</Text>
                <Text style={styles.statLabel}>Properti Disewa</Text>
              </TouchableOpacity>
            </View>

            {/* Tombol Aksi */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('AddPropertyScreen')} // Asumsi AddPropertyScreen
            >
              <MaterialDesignIcons
                name='plus-circle-outline'
                size={18}
                color={Colors.WHITE}
              />
              <Text style={styles.actionButtonText}>Tambah Properti Baru</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Properti Terbaru (Latest Properties) */}
        <Text style={styles.sectionTitle}>Properti Terbaru Anda</Text>
        {latestPropertiesLoading ? (
          <ActivityIndicator
            size='large'
            color={Colors.PRIMARY}
            style={{ marginVertical: 20 }}
          />
        ) : latestProperties.length > 0 ? (
          <FlatList
            data={latestProperties}
            numColumns={2}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            columnWrapperStyle={styles.propertyListColumn}
            contentContainerStyle={styles.propertyListContainer}
            renderItem={renderLatestProperties} // Menggunakan data dari Store
          />
        ) : (
          <View style={styles.emptyDataContainer}>
            <MaterialDesignIcons
              name='inbox-outline'
              size={50}
              color={Colors.GREY}
            />
            <Text style={styles.emptyDataText}>
              Anda belum memiliki properti yang tersimpan.
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={goToPropertyScreen}
            >
              <Text style={styles.actionButtonText}>+ Tambah Sekarang</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Global Properties Section (Properti Pilihan Global) */}
        <Text style={styles.sectionTitle}>Properti Pilihan Global</Text>
        {listAllPropertiesLoading ? (
          <ActivityIndicator
            size='large'
            color={Colors.PRIMARY}
            style={{ marginVertical: 20 }}
          />
        ) : (
          <FlatList
            data={listAllProperties.length > 0 ? listAllProperties : properties} // Gunakan data global atau dummy
            numColumns={2}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            columnWrapperStyle={styles.propertyListColumn}
            contentContainerStyle={styles.propertyListContainer}
            renderItem={({ item }) => (
              // Menggunakan struktur item properti yang sama
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleOpenProperty(item)}
              >
                <View style={styles.cardImageWrapper}>
                  <FastImage
                    source={{ uri: item.imageUrl || item.image }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>
                      {item?.propertyTypeName || item?.propertyType?.name || 'Tipe'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.propertyName || item.title}
                </Text>
                <View style={styles.cardInfoRow}>
                  <MaterialDesignIcons
                    name='map-marker-outline'
                    size={14}
                    color={Colors.GRAY_DARK}
                  />
                  <Text style={styles.cardLocation} numberOfLines={1}>
                    {item.address || item.location || 'Lokasi belum diisi'}
                  </Text>
                </View>
                <Text style={styles.cardPrice}>{withCurrency(item.price)}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Button Tambah Properti */}
      <TouchableOpacity
        style={styles.fab}
        onPress={goToPropertyScreen}
      >
      <MaterialDesignIcons name='plus' size={24} color={Colors.WHITE} />
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },

  searchContainer: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: Colors.PRIMARY,
  },
  searchBar: {
    backgroundColor: '#e9eef5',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    fontFamily: Fonts.fontSemiBold,
  },

  categoryContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    marginBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  categoryText: { fontSize: 14, color: Colors.PRIMARY, fontFamily: Fonts.fontSemiBold, },

  bannerWrapper: { marginTop: 10, height: 150, paddingHorizontal: 10 },
  bannerImage: {
    width: width - 40, // Sesuaikan lebar agar terlihat penuh
    height: 150,
    borderRadius: 14,
    marginHorizontal: 10,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 18,
    fontFamily: Fonts.fontSemiBold,
    color: '#333',
    paddingHorizontal: 16,
  },

  // --- STATS / DASHBOARD USER ---
  userStatsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.WHITE,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  statCount: {
    fontSize: 20,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.BLACK,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.GREY,
    textAlign: 'center',
    fontFamily: Fonts.fontRegular,
  },

  // --- LIST PROPERTI ---
  propertyListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  propertyListColumn: {
    gap: 12,
  },
  card: {
    backgroundColor: Colors.CARD,
    borderRadius: 16,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
    paddingBottom: 10,
  },
  cardImageWrapper: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  cardBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.fontMedium,
    color: Colors.TEXT,
  },
  cardTitle: {
    fontFamily: Fonts.fontSemiBold,
    fontSize: 14,
    marginTop: 10,
    paddingHorizontal: 10,
    color: Colors.TEXT,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  cardPrice: {
    color: Colors.PRIMARY,
    fontFamily: Fonts.fontBold,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  cardLocation: {
    color: Colors.GRAY_DARK,
    fontSize: 12,
    paddingHorizontal: 0,
    marginTop: 4,
    marginBottom: 4,
    fontFamily: Fonts.fontRegular,
  },

  // --- TOMBOL AKSI BIASA ---
  actionButton: {
    flexDirection: 'row',
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 14,
    marginLeft: 5,
  },

  // --- EMPTY STATE ---
  emptyDataContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.WHITE,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  emptyDataText: {
    marginTop: 10,
    marginBottom: 10,
    color: Colors.GREY,
    fontSize: 14,
    fontFamily: Fonts.fontSemiBold,
  },

  // --- FLOATING ACTION BUTTON ---
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 26,
    backgroundColor: Colors.PRIMARY,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default HomeScreen;
