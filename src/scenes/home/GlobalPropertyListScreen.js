import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { GlobalBannerAd, useInterstitialAd } from '../ads';
import { useThemeColors } from '../../styles';
import { Fonts, propertyStatuses, propertyCategories } from '../../constants';
import usePropertyStore from '../../store/usePropertyStore';
import { Text } from '../../components';
import { LoadingPropertiesGlobal } from '../property/LoadingProperties';
import PropertyGlobalCard from './PropertyGlobalCard';
import { getString, setItem } from '../../helpers';
import MapView, { Marker } from 'react-native-maps';

function GlobalPropertyListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    listGlobalProperties,
    listGlobalPropertiesLoading,
    fetchGlobalProperties,
    fetchMoreGlobalProperties,
    globalHasMore,
    globalIsFetchingMore,
  } = usePropertyStore();

  const { showAd } = useInterstitialAd();
  const [searchQuery, setSearchQuery] = useState('');
  const [mapView, setMapView] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Read filters from navigation params
  const filters = route.params?.filters || null;
  const updatedAt = route.params?.updatedAt || 0;

  // Derived states from filters
  const selectedPropertyType = filters?.propertyType || null;
  const selectedStatus = filters?.status || null;
  const locationFilters = filters?.location || null;
  const minPrice = filters?.minPrice || null;
  const maxPrice = filters?.maxPrice || null;

  // Auto-fill search if passed from filters
  useEffect(() => {
    if (filters?.search) {
      setSearchQuery(filters.search);
    } else {
      setSearchQuery('');
    }
  }, [filters]);

  useEffect(() => {
    const stored = getString('globalSearchHistory');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed);
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  // Initial Fetch & Filter Change
  useEffect(() => {
    const activeTypeId = selectedPropertyType?.id || null;
    fetchGlobalProperties({
      propertyTypeId: activeTypeId,
      locationFilters: locationFilters,
    });
  }, [selectedPropertyType, locationFilters, updatedAt]);

  const onRefresh = async () => {
    setRefreshing(true);
    const activeTypeId = selectedPropertyType?.id || null;
    await fetchGlobalProperties({
      propertyTypeId: activeTypeId,
      locationFilters: locationFilters,
    });
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!globalIsFetchingMore && globalHasMore) {
      const activeTypeId = selectedPropertyType?.id || null;
      fetchMoreGlobalProperties({
        propertyTypeId: activeTypeId,
        locationFilters: locationFilters,
      });
    }
  };

  // Client-side filtering (Search & Status)
  const filteredProperties = useMemo(() => {
    let data = listGlobalProperties || [];

    // Filter by Status (Client-side)
    if (selectedStatus) {
      data = data.filter(
        item => (item?.statusId || item?.status?.id) === selectedStatus.id,
      );
    }

    // Filter by Min Price (Client-side)
    if (minPrice) {
      data = data.filter(item => {
        const itemPrice = Number(String(item.price).replace(/[^0-9]/g, ''));
        return !Number.isNaN(itemPrice) && itemPrice >= minPrice;
      });
    }

    // Filter by Max Price (Client-side)
    if (maxPrice) {
      data = data.filter(item => {
        const itemPrice = Number(String(item.price).replace(/[^0-9]/g, ''));
        return !Number.isNaN(itemPrice) && itemPrice <= maxPrice;
      });
    }

    // Filter by Search Query (Client-side)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(item => {
        const searchTerms = [
          item.propertyName,
          item.price,
          item.address,
          item.description,
          item.province?.name,
          item.city?.name,
          item.district?.name,
          item.village?.name,
          item.propertyTypeName,
          propertyStatuses.find(
            s => s.id === (item?.statusId || item?.status?.id),
          )?.name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchTerms.includes(query);
      });
    }

    return injectAds(data);
  }, [listGlobalProperties, searchQuery, selectedStatus, minPrice, maxPrice]);

  const quickSuggestions = useMemo(
    () => propertyCategories.map(item => item.name),
    [],
  );

  const saveSearchHistory = useCallback(
    query => {
      const trimmed = query.trim();
      if (!trimmed) return;
      setRecentSearches(prev => {
        const normalized = trimmed.toLowerCase();
        const next = [
          trimmed,
          ...prev.filter(item => item.toLowerCase() !== normalized),
        ].slice(0, 8);
        setItem('globalSearchHistory', JSON.stringify(next));
        return next;
      });
    },
    [setRecentSearches],
  );

  const clearSearchHistory = () => {
    setRecentSearches([]);
    setItem('globalSearchHistory', JSON.stringify([]));
  };

  const mapItems = useMemo(() => {
    const raw = (filteredProperties || []).filter(item => item.type !== 'ad');
    return raw
      .map(item => {
        const lat =
          Number(item?.latitude) ||
          Number(item?.lat) ||
          Number(item?.location?.latitude);
        const lng =
          Number(item?.longitude) ||
          Number(item?.lng) ||
          Number(item?.location?.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }
        return { ...item, lat, lng };
      })
      .filter(Boolean);
  }, [filteredProperties]);

  const openExternalMap = item => {
    const lat = item?.lat;
    const lng = item?.lng;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const label = encodeURIComponent(item?.propertyName || 'Properti');
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const handleOpenFilter = () => {
    navigation.navigate('GlobalPropertyFilterScreen', {
      currentFilters: {
        propertyType: selectedPropertyType,
        status: selectedStatus,
        search: searchQuery,
        location: locationFilters,
        minPrice: minPrice,
        maxPrice: maxPrice,
      },
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setItem('lastFilterLabel', 'Semua properti');
    navigation.setParams({ filters: null });
    fetchGlobalProperties({ propertyTypeId: null, locationFilters: null });
  };

  const renderItem = ({ item }) => {
    if (item.type === 'ad') {
      return (
        <View style={styles.adContainer}>
          <View style={styles.adPlaceholder}>
            <Text style={styles.adText}>Iklan</Text>
          </View>
        </View>
      );
    }
    return <PropertyGlobalCard item={item} />;
  };

  const renderEmpty = () => {
    if (listGlobalPropertiesLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="home-search-outline"
          size={64}
          color={colors.GREY}
        />
        <Text style={styles.emptyTitle}>Tidak ada properti ditemukan</Text>
        <Text style={styles.emptySubtitle}>
          Coba ubah filter atau kata kunci pencarian Anda
        </Text>
        {(selectedPropertyType ||
          selectedStatus ||
          locationFilters ||
          minPrice ||
          maxPrice ||
          searchQuery) && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetFilters}
          >
            <Text style={styles.resetButtonText}>Reset Filter</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        backgroundColor={colors.BACKGROUND}
        barStyle={
          colors.BACKGROUND === '#0D1B2D' ? 'light-content' : 'dark-content'
        }
      />

      {/* Search Header (Custom, User Liked This) */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        {/* Removed Back Button based on request */}
        <View style={styles.searchBar}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.GREY}
          />
          <TextInput
            style={styles.input}
            placeholder="Cari nama properti..."
            placeholderTextColor={colors.GREY}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => saveSearchHistory(searchQuery)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={colors.GREY}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setMapView(prev => !prev)}
        >
          <MaterialCommunityIcons
            name={mapView ? 'format-list-bulleted' : 'map-outline'}
            size={22}
            color={colors.TEXT}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={handleOpenFilter}>
          <MaterialCommunityIcons
            name="tune"
            size={24}
            color={
              selectedPropertyType ||
              selectedStatus ||
              locationFilters ||
              minPrice ||
              maxPrice
                ? colors.PRIMARY
                : colors.TEXT
            }
          />
          {(selectedPropertyType ||
            selectedStatus ||
            locationFilters ||
            minPrice ||
            maxPrice) && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>

      {/* Search History & Quick Suggestions */}
      {!mapView && (recentSearches.length > 0 || quickSuggestions.length) && (
        <View style={styles.quickRow}>
          {recentSearches.length > 0 && (
            <View style={styles.quickSection}>
              <View style={styles.quickHeader}>
                <Text style={styles.quickTitle}>Riwayat</Text>
                <TouchableOpacity onPress={clearSearchHistory}>
                  <Text style={styles.quickAction}>Hapus</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quickList}>
                {recentSearches.map(item => (
                  <TouchableOpacity
                    key={item}
                    style={styles.quickChip}
                    onPress={() => {
                      setSearchQuery(item);
                      saveSearchHistory(item);
                    }}
                  >
                    <Text style={styles.quickChipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <View style={styles.quickSection}>
            <Text style={styles.quickTitle}>Saran cepat</Text>
            <View style={styles.quickList}>
              {quickSuggestions.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.quickChipAlt}
                  onPress={() => {
                    setSearchQuery(item);
                    saveSearchHistory(item);
                  }}
                >
                  <Text style={styles.quickChipText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Filter Chips Display */}
      {(selectedPropertyType || locationFilters) && (
        <View style={styles.activeFiltersRow}>
          {selectedPropertyType && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{selectedPropertyType.name}</Text>
            </View>
          )}
          {locationFilters?.province && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {locationFilters.village?.name ||
                  locationFilters.district?.name ||
                  locationFilters.city?.name ||
                  locationFilters.province?.name}
              </Text>
            </View>
          )}
          {(minPrice || maxPrice) && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {minPrice && maxPrice
                  ? `Rp ${minPrice.toLocaleString(
                      'id-ID',
                    )} - ${maxPrice.toLocaleString('id-ID')}`
                  : minPrice
                  ? `> Rp ${minPrice.toLocaleString('id-ID')}`
                  : `< Rp ${maxPrice.toLocaleString('id-ID')}`}
              </Text>
            </View>
          )}
        </View>
      )}

      {listGlobalPropertiesLoading && !listGlobalProperties.length ? (
        <LoadingPropertiesGlobal />
      ) : mapView ? (
        <View style={styles.mapWrapper}>
          {mapItems.length === 0 ? (
            renderEmpty()
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: mapItems[0].lat,
                longitude: mapItems[0].lng,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
              }}
            >
              {mapItems.map(item => (
                <Marker
                  key={item.id}
                  coordinate={{ latitude: item.lat, longitude: item.lng }}
                  title={item.propertyName || 'Properti'}
                  description={item.address || item.city?.name || ''}
                  onPress={() => openExternalMap(item)}
                />
              ))}
            </MapView>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.PRIMARY]}
            />
          }
          ListHeaderComponent={
            <View style={{ marginVertical: 10 }}>
              <GlobalBannerAd />
            </View>
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            globalIsFetchingMore && (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.PRIMARY} />
              </View>
            )
          }
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}

// Helper to inject Ads
// Ensure ad objects don't break keyExtractor (use distinct IDs)
const injectAds = (data, interval = 6) => {
  if (!data) return [];
  const withAds = [];
  data.forEach((item, index) => {
    withAds.push(item);
    if ((index + 1) % interval === 0 && index !== data.length - 1) {
      withAds.push({ id: `ad-local-${index}`, type: 'ad' });
    }
  });
  return withAds;
};

const createStyles = colors =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.BACKGROUND,
      borderBottomWidth: 1,
      borderBottomColor: colors.GRAY_LIGHT,
    },
    // Custom Search Bar Style from Step 508
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.CARD,
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 44,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    input: {
      flex: 1,
      marginLeft: 8,
      fontFamily: Fonts.fontRegular,
      fontSize: 14,
      color: colors.TEXT,
    },
    filterBtn: {
      padding: 10,
      marginLeft: 8,
      position: 'relative',
    },
    quickRow: {
      paddingHorizontal: 16,
      paddingBottom: 8,
      gap: 10,
    },
    quickSection: {
      gap: 8,
    },
    quickHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    quickTitle: {
      fontSize: 12,
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
    },
    quickAction: {
      fontSize: 12,
      fontFamily: Fonts.fontSemiBold,
      color: colors.PRIMARY,
    },
    quickList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    quickChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.CARD,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    quickChipAlt: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.PRIMARY_20,
    },
    quickChipText: {
      fontSize: 12,
      fontFamily: Fonts.fontMedium,
      color: colors.TEXT,
    },
    badge: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.PRIMARY_LIGHT,
      borderWidth: 1,
      borderColor: colors.BACKGROUND,
    },
    activeFiltersRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
      flexWrap: 'wrap',
    },
    chip: {
      backgroundColor: colors.PRIMARY_LIGHT,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    chipText: {
      fontSize: 12,
      color: colors.PRIMARY,
      fontFamily: Fonts.fontMedium,
    },
    listContent: {
      padding: 12,
      paddingBottom: 40,
    },
    mapWrapper: {
      flex: 1,
      padding: 12,
    },
    map: {
      flex: 1,
      borderRadius: 16,
      overflow: 'hidden',
    },
    columnWrapper: {
      justifyContent: 'space-between',
      // gap: 12 is supported in new RN, but let's be safe if it's not
    },
    adContainer: {
      flex: 1,
      margin: 6,
      height: 220,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    adPlaceholder: {
      backgroundColor: '#e0e0e0',
      padding: 10,
      borderRadius: 8,
    },
    adText: {
      color: '#888',
      fontSize: 12,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
    },
    emptyTitle: {
      marginTop: 16,
      fontSize: 18,
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
    },
    emptySubtitle: {
      marginTop: 8,
      fontSize: 14,
      fontFamily: Fonts.fontRegular,
      color: colors.GREY,
      textAlign: 'center',
      paddingHorizontal: 32,
    },
    resetButton: {
      marginTop: 24,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: colors.PRIMARY,
      borderRadius: 20,
    },
    resetButtonText: {
      color: colors.WHITE,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 14,
    },
  });

export default GlobalPropertyListScreen;
