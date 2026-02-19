import React, { useMemo, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BaseView, DropdownSearchableDefault } from '../../components';
import { Fonts, propertyCategories, propertyStatuses } from '../../constants';
import { useThemeColors } from '../../styles';
import { setItem } from '../../helpers';
import usePropertyStore from '../../store/usePropertyStore';

function GlobalPropertyFilterScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    fetchProvinces,
    fetchCitiesByProvince,
    fetchDistrictsByCity,
    fetchVillagesByDistrict,
    listProvinces,
    listCities,
    listDistricts,
    listVillages,
  } = usePropertyStore();

  const currentFilters = route.params?.currentFilters || {};

  const [propertyType, setPropertyType] = useState(
    currentFilters.propertyType || null,
  );
  const [status, setStatus] = useState(currentFilters.status || null);
  const [searchQuery, setSearchQuery] = useState(currentFilters.search || '');
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || '');

  // --- LOCATION STATE ---
  const [province, setProvince] = useState(
    currentFilters.location?.province || null,
  );
  const [city, setCity] = useState(currentFilters.location?.city || null);
  const [district, setDistrict] = useState(
    currentFilters.location?.district || null,
  );
  const [village, setVillage] = useState(
    currentFilters.location?.village || null,
  );

  // Key to force re-render dropdowns on reset
  const [resetKey, setResetKey] = useState(0);

  // --- LOCATION EFFECTS ---
  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  useEffect(() => {
    if (province) {
      fetchCitiesByProvince(province.id);
    } else {
      fetchCitiesByProvince(null);
    }
  }, [province, fetchCitiesByProvince]);

  useEffect(() => {
    if (city) {
      fetchDistrictsByCity(city.id);
    } else {
      fetchDistrictsByCity(null);
    }
  }, [city, fetchDistrictsByCity]);

  useEffect(() => {
    if (district) {
      fetchVillagesByDistrict(district.id);
    } else {
      fetchVillagesByDistrict(null);
    }
  }, [district, fetchVillagesByDistrict]);

  // RESET LOGIC saat Parent berubah (User Interaction)
  const handleSelectProvince = item => {
    setProvince(item);
    setCity(null);
    setDistrict(null);
    setVillage(null);
  };

  const handleSelectCity = item => {
    setCity(item);
    setDistrict(null);
    setVillage(null);
  };

  const handleSelectDistrict = item => {
    setDistrict(item);
    setVillage(null);
  };

  const handleSelectVillage = item => {
    setVillage(item);
  };

  const handleApply = () => {
    const filters = {
      propertyType,
      status,
      search: searchQuery,
      location: {
        province,
        city,
        district,
        village,
      },
      minPrice: minPrice ? Number(minPrice.replace(/[^0-9]/g, '')) : null,
      maxPrice: maxPrice ? Number(maxPrice.replace(/[^0-9]/g, '')) : null,
    };
    const parts: string[] = [];
    if (searchQuery) parts.push(`Cari: ${searchQuery}`);
    if (propertyType?.name) parts.push(propertyType.name);
    // Label Lokasi Pintar
    if (village?.name) parts.push(village.name);
    else if (district?.name) parts.push(district.name);
    else if (city?.name) parts.push(city.name);
    else if (province?.name) parts.push(province.name);

    if (status?.name) parts.push(status.name);

    if (minPrice && maxPrice) {
      parts.push(
        `Rp ${Number(minPrice).toLocaleString('id-ID')} - ${Number(
          maxPrice,
        ).toLocaleString('id-ID')}`,
      );
    } else if (minPrice) {
      parts.push(`Min: Rp ${Number(minPrice).toLocaleString('id-ID')}`);
    } else if (maxPrice) {
      parts.push(`Max: Rp ${Number(maxPrice).toLocaleString('id-ID')}`);
    }

    const label = parts.length ? parts.join(' • ') : 'Semua properti';
    setItem('lastFilterLabel', label);
    navigation.navigate('Main', {
      screen: 'Semua',
      params: { filters, updatedAt: Date.now() },
      merge: true,
    });
  };

  const handleReset = () => {
    setPropertyType(null);
    setStatus(null);
    setSearchQuery('');
    setProvince(null);
    setCity(null);
    setDistrict(null);
    setVillage(null);
    setMinPrice('');
    setMaxPrice('');
    setItem('lastFilterLabel', 'Semua properti');
    // Force re-render of dropdowns
    setResetKey(prev => prev + 1);
  };

  return (
    <BaseView
      title="Filter Properti"
      // disableLeftMenu
      onBackPress={navigation.goBack}
      containerStyle={{ flex: 1, backgroundColor: colors.BACKGROUND }}
    >
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={100}
      >
        <Text style={styles.sectionTitle}>Kata kunci</Text>
        <View style={styles.searchRow}>
          <MaterialCommunityIcons
            name="magnify"
            size={18}
            color={colors.GREY}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau lokasi properti"
            placeholderTextColor={colors.GREY}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={colors.GREY}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Lokasi</Text>
        <DropdownSearchableDefault
          key={`prov-${resetKey}`}
          placeholder="Pilih Provinsi"
          iconName="map-marker-outline"
          options={listProvinces || []}
          onSelect={handleSelectProvince}
          value={province}
          styleContainer={{ marginVertical: 4 }}
        />
        <DropdownSearchableDefault
          key={`city-${resetKey}`}
          placeholder="Pilih Kota/Kabupaten"
          iconName="city-variant-outline"
          options={listCities || []}
          onSelect={handleSelectCity}
          value={city}
          styleContainer={{ marginVertical: 4 }}
        />
        <DropdownSearchableDefault
          key={`dist-${resetKey}`}
          placeholder="Pilih Kecamatan"
          iconName="map-marker-radius-outline"
          options={listDistricts || []}
          onSelect={handleSelectDistrict}
          value={district}
          styleContainer={{ marginVertical: 4 }}
        />
        <DropdownSearchableDefault
          key={`vill-${resetKey}`}
          placeholder="Pilih Kelurahan/Desa"
          iconName="home-group"
          options={listVillages || []}
          onSelect={handleSelectVillage}
          value={village}
          styleContainer={{ marginVertical: 4 }}
        />

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Kategori</Text>
        <DropdownSearchableDefault
          key={`type-${resetKey}`}
          placeholder="Pilih tipe properti"
          iconName="home-outline"
          options={propertyCategories}
          onSelect={setPropertyType}
          value={propertyType}
          styleContainer={{ marginVertical: 4 }}
        />

        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Status</Text>
        <DropdownSearchableDefault
          key={`status-${resetKey}`}
          placeholder="Pilih status"
          iconName="tag-outline"
          options={propertyStatuses}
          onSelect={setStatus}
          value={status}
          styleContainer={{ marginVertical: 4 }}
        />

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Rentang Harga (Rp)
        </Text>
        <View style={styles.priceRow}>
          <View style={styles.priceInputWrapper}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min"
              placeholderTextColor={colors.GREY}
              keyboardType="numeric"
              value={minPrice ? Number(minPrice).toLocaleString('id-ID') : ''}
              onChangeText={text => setMinPrice(text.replace(/[^0-9]/g, ''))}
            />
          </View>
          <View style={styles.priceSeparator} />
          <View style={styles.priceInputWrapper}>
            <TextInput
              style={styles.priceInput}
              placeholder="Max"
              placeholderTextColor={colors.GREY}
              keyboardType="numeric"
              value={maxPrice ? Number(maxPrice).toLocaleString('id-ID') : ''}
              onChangeText={text => setMaxPrice(text.replace(/[^0-9]/g, ''))}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <MaterialCommunityIcons
            name="refresh"
            size={18}
            color={colors.PRIMARY}
          />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <MaterialCommunityIcons name="check" size={18} color={colors.WHITE} />
          <Text style={styles.applyText}>Terapkan</Text>
        </TouchableOpacity>
      </View>
    </BaseView>
  );
}

const createStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
      marginBottom: 8,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.CARD,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    searchInput: {
      flex: 1,
      fontFamily: Fonts.fontRegular,
      fontSize: 14,
      color: colors.TEXT,
      marginLeft: 8,
    },
    clearButton: {
      padding: 4,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderTopWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      backgroundColor: colors.CARD,
    },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor:
        colors.BACKGROUND === '#0D1B2D' ? '#0F1C34' : colors.BACKGROUND,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.PRIMARY,
    },
    resetText: {
      marginLeft: 6,
      color: colors.PRIMARY,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 13,
    },
    applyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.PRIMARY,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: colors.PRIMARY,
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    applyText: {
      marginLeft: 8,
      color: colors.WHITE,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 14,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginVertical: 4,
    },
    priceInputWrapper: {
      flex: 1,
      backgroundColor: colors.CARD,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      paddingHorizontal: 12,
      height: 48,
      justifyContent: 'center',
    },
    priceInput: {
      fontFamily: Fonts.fontRegular,
      fontSize: 14,
      color: colors.TEXT,
      padding: 0,
    },
    priceSeparator: {
      width: 10,
      height: 1,
      backgroundColor: colors.GREY,
    },
  });

export default GlobalPropertyFilterScreen;
