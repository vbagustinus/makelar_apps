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
import { logotransparent } from '../../assets/images';
import { Fonts } from '../../constants';
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
  { id: 1, image: 'https://picsum.photos/seed/banner1/800/400' },
  { id: 2, image: 'https://picsum.photos/seed/banner2/800/400' },
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
    navigation.navigate('PropertyScreen'); // Asumsi 'PropertyScreen' adalah layar daftar properti pribadi
  };

  // DIUBAH: Navigasi ke daftar properti global
  const goToPropertyGlobalScreen = () => {
    navigation.navigate('Semua'); // Asumsi 'Semua' adalah layar daftar properti global
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

  // DIUBAH: Mengganti komponen lama yang tidak lagi relevan
  const renderLatestProperties = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('DetailPropertyScreen', { property: item })
      } // Asumsi rute
    >
      <FastImage
        source={{ uri: item.imageUrl || item.image }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.propertyName || item.title}
      </Text>
      <Text style={styles.cardPrice}>{item.price}</Text>
      <Text style={styles.cardLocation}>{item.address || item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchBar}>🔍 Cari properti...</Text>
      </View>

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
            <TouchableOpacity key={index} style={styles.categoryChip}>
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
              source={{ uri: b.image }}
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
                  name='home-currency-usd'
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
              onPress={() => navigation.navigate('AddPropertyScreen')}
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
                onPress={() =>
                  navigation.navigate('GlobalDetailPropertyScreen', {
                    property: item,
                  })
                }
              >
                <FastImage
                  source={{ uri: item.imageUrl || item.image }}
                  style={styles.cardImage}
                />
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.propertyName || item.title}
                </Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
                <Text style={styles.cardLocation}>
                  {item.address || item.location}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Button Tambah Properti */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPropertyScreen')} // Asumsi AddPropertyScreen
      >
        <MaterialDesignIcons name='plus' size={24} color={Colors.WHITE} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f5f8' },

  searchContainer: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: 'white',
    elevation: 4,
  },
  searchBar: {
    backgroundColor: '#e9eef5',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
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
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryText: { fontSize: 14, color: '#1A73E8', fontWeight: '500' },

  bannerWrapper: { marginTop: 10, height: 150 },
  bannerImage: {
    width: width - 32, // Sesuaikan lebar agar terlihat penuh
    height: 150,
    borderRadius: 12,
    marginLeft: 16,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '700',
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
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 4,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statCount: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.BLACK,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.GREY,
    textAlign: 'center',
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
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  cardPrice: {
    color: '#1A73E8',
    fontWeight: '700',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  cardLocation: {
    color: '#888',
    fontSize: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
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
    fontWeight: '600',
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
