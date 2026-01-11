import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeColors, Sizes, Colors } from '../../styles';
import { Fonts, propertyStatuses } from '../../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '../../store/useAuthStore';
import { GlobalBannerAd } from '../ads';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getStatusMeta = (statusId, colors) => {
  const found = propertyStatuses.find(s => s.id === statusId);
  return {
    label: found?.name || 'Status',
    color: found?.color || colors.PRIMARY,
  };
};

const formatPrice = value => {
  if (!value) return '-';
  const numeric = Number(String(value).replace(/[^0-9]/g, ''));
  if (Number.isNaN(numeric)) return value;
  return `Rp ${numeric.toLocaleString('id-ID')}`;
};

const GlobalDetailPropertyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useAuthStore(state => state.user);

  const extractName = val => {
    if (!val) return null;
    if (typeof val === 'object')
      return val.name || val.label || val.value || null;
    return val;
  };

  const extractValue = val => {
    if (!val) return '';
    if (Array.isArray(val)) {
      // If it's an array, join the names
      return val.map(v => (typeof v === 'object' ? v.name || v.label || v.value || '' : String(v))).filter(Boolean).join(', ');
    }
    if (typeof val === 'object') {
      return val.name || val.label || val.value || val.displayName || '';
    }
    return String(val);
  };

  const incoming = route.params || {};
  const item = incoming?.property || incoming?.item || incoming;

  // Debug logging
  console.log('=== DEBUG GlobalDetailPropertyScreen ===');
  console.log('Property Type:', item?.propertyTypeName);
  console.log('Tower:', typeof item?.tower, item?.tower);
  console.log('Floor Number:', typeof item?.floorNumber, item?.floorNumber);
  console.log('Unit Number:', typeof item?.unitNumber, item?.unitNumber);
  console.log(
    'Apartment Facilities:',
    typeof item?.apartmentFacilities,
    item?.apartmentFacilities,
  );
  console.log('Balcony:', typeof item?.balcony, item?.balcony);
  console.log('Full item keys:', Object.keys(item || {}));

  const images =
    item?.imageUrls && item?.imageUrls.length > 0
      ? item?.imageUrls
      : item?.images && item?.images?.length > 0
      ? item?.images
      : item?.imageUrl
      ? [item?.imageUrl]
      : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const previewImages = useMemo(
    () => images?.map(uri => ({ url: uri })),
    [images],
  );

  const statusMeta = getStatusMeta(item?.statusId || item?.status?.id, colors);
  const addressLine = useMemo(() => {
    const locationParts = [
      item?.address,
      item?.village,
      item?.district,
      item?.city,
      item?.province,
    ].filter(Boolean);
    return locationParts.join(', ');
  }, [
    item?.address,
    item?.village,
    item?.district,
    item?.city,
    item?.province,
  ]);

  const featureCards = useMemo(
    () =>
      [
        item?.bedrooms
          ? {
              icon: 'bed-king-outline',
              label: `${extractValue(item?.bedrooms)} Kamar`,
            }
          : null,
        item?.bathrooms
          ? {
              icon: 'shower',
              label: `${extractValue(item?.bathrooms)} Kamar Mandi`,
            }
          : null,
        item?.buildingArea
          ? {
              icon: 'home-floor-1',
              label: `${extractValue(item?.buildingArea)} m² Bangunan`,
            }
          : null,
        item?.landArea
          ? {
              icon: 'ruler-square',
              label: `${extractValue(item?.landArea)} m² Tanah`,
            }
          : null,
        item?.floors
          ? {
              icon: 'stairs',
              label: `${extractValue(item?.floors)} Lantai`,
            }
          : null,
        item?.garage
          ? {
              icon: 'car',
              label: `${extractValue(item?.garage)} Garasi`,
            }
          : null,
        item?.electricPower
          ? {
              icon: 'lightning-bolt',
              label: `${extractValue(item?.electricPower)} VA`,
            }
          : null,
      ].filter(Boolean),
    [
      item?.bathrooms,
      item?.bedrooms,
      item?.buildingArea,
      item?.floors,
      item?.garage,
      item?.landArea,
      item?.electricPower,
    ],
  );

  const additionalSpecs = useMemo(() => {
    const specs = [];
    
    console.log('=== Building additionalSpecs ===');

    // General
    if (item?.builtYear) {
      const value = extractValue(item?.builtYear);
      console.log('builtYear:', typeof item?.builtYear, item?.builtYear, '→', value);
      specs.push({
        label: 'Tahun Dibangun',
        value,
      });
    }
    if (item?.renovationYear) {
      const value = extractValue(item?.renovationYear);
      console.log('renovationYear:', typeof item?.renovationYear, item?.renovationYear, '→', value);
      specs.push({
        label: 'Tahun Renovasi',
        value,
      });
    }
    if (item?.facing) {
      const value = extractValue(item?.facing);
      console.log('facing:', typeof item?.facing, item?.facing, '→', value);
      specs.push({ label: 'Hadap', value });
    }
    if (item?.furnished) {
      const value = extractValue(item?.furnished);
      console.log('furnished:', typeof item?.furnished, item?.furnished, '→', value);
      specs.push({ label: 'Furnished', value });
    }
    if (item?.waterSource) {
      const value = extractValue(item?.waterSource);
      console.log('waterSource:', typeof item?.waterSource, item?.waterSource, '→', value);
      specs.push({
        label: 'Sumber Air',
        value,
      });
    }
    if (item?.roadWidth) {
      const value = extractValue(item?.roadWidth);
      console.log('roadWidth:', typeof item?.roadWidth, item?.roadWidth, '→', value);
      specs.push({
        label: 'Lebar Jalan',
        value: `${value} m`,
      });
    }
    if (item?.carAccess) {
      const value = extractValue(item?.carAccess);
      console.log('carAccess:', typeof item?.carAccess, item?.carAccess, '→', value);
      specs.push({
        label: 'Akses Mobil',
        value,
      });
    }
    if (item?.condition) {
      const value = extractValue(item?.condition);
      console.log('condition:', typeof item?.condition, item?.condition, '→', value);
      specs.push({ label: 'Kondisi', value });
    }
    if (item?.environmentType) {
      const value = extractValue(item?.environmentType);
      console.log('environmentType:', typeof item?.environmentType, item?.environmentType, '→', value);
      specs.push({
        label: 'Lingkungan',
        value,
      });
    }
    if (item?.monthlyFee) {
      const value = extractValue(item?.monthlyFee);
      console.log('monthlyFee:', typeof item?.monthlyFee, item?.monthlyFee, '→', value);
      specs.push({
        label: 'Iuran Bulanan',
        value: formatPrice(value),
      });
    }
    if (item?.imbNumber) {
      const value = extractValue(item?.imbNumber);
      console.log('imbNumber:', typeof item?.imbNumber, item?.imbNumber, '→', value);
      specs.push({ label: 'No. IMB', value });
    }
    if (item?.legalOwnerName) {
      const value = extractValue(item?.legalOwnerName);
      console.log('legalOwnerName:', typeof item?.legalOwnerName, item?.legalOwnerName, '→', value);
      specs.push({
        label: 'Nama di Sertifikat',
        value,
      });
    }

    // Apartment
    if (item?.tower) {
      const value = extractValue(item?.tower);
      console.log('tower:', typeof item?.tower, item?.tower, '→', value);
      specs.push({ label: 'Tower', value });
    }
    if (item?.floorNumber) {
      const value = extractValue(item?.floorNumber);
      console.log('floorNumber:', typeof item?.floorNumber, item?.floorNumber, '→', value);
      specs.push({
        label: 'Lantai Ke',
        value,
      });
    }
    if (item?.unitNumber) {
      const value = extractValue(item?.unitNumber);
      console.log('unitNumber:', typeof item?.unitNumber, item?.unitNumber, '→', value);
      specs.push({ label: 'No. Unit', value });
    }
    if (item?.unitType) {
      const value = extractValue(item?.unitType);
      console.log('unitType:', typeof item?.unitType, item?.unitType, '→', value);
      specs.push({ label: 'Tipe Unit', value });
    }
    if (item?.maintenanceFee) {
      const value = extractValue(item?.maintenanceFee);
      console.log('maintenanceFee:', typeof item?.maintenanceFee, item?.maintenanceFee, '→', value);
      specs.push({
        label: 'Biaya IPL',
        value: formatPrice(value),
      });
    }
    console.log('item?.balcony', item);
    
    if (item?.balcony) {
      const value = extractValue(item?.balcony);
      console.log('balcony:', typeof item?.balcony, item?.balcony, '→', value);
      specs.push({ label: 'Balkon', value });
    }
    if (item?.apartmentFacilities) {
      const value = extractValue(item?.apartmentFacilities);
      console.log('apartmentFacilities:', typeof item?.apartmentFacilities, item?.apartmentFacilities, '→', value);
      specs.push({
        label: 'Fasilitas Apt',
        value,
      });
    }

    // Land
    if (item?.landShape) {
      const value = extractValue(item?.landShape);
      console.log('landShape:', typeof item?.landShape, item?.landShape, '→', value);
      specs.push({
        label: 'Bentuk Tanah',
        value,
      });
    }
    if (item?.frontageWidth) {
      const value = extractValue(item?.frontageWidth);
      console.log('frontageWidth:', typeof item?.frontageWidth, item?.frontageWidth, '→', value);
      specs.push({
        label: 'Lebar Depan',
        value: `${value} m`,
      });
    }
    if (item?.zoning) {
      const value = extractValue(item?.zoning);
      console.log('zoning:', typeof item?.zoning, item?.zoning, '→', value);
      specs.push({ label: 'Zoning', value });
    }
    if (item?.contour) {
      const value = extractValue(item?.contour);
      console.log('contour:', typeof item?.contour, item?.contour, '→', value);
      specs.push({ label: 'Kontur', value });
    }
    if (item?.roadType) {
      const value = extractValue(item?.roadType);
      console.log('roadType:', typeof item?.roadType, item?.roadType, '→', value);
      specs.push({ label: 'Tipe Jalan', value });
    }

    // Shop/Retail
    if (item?.buildingWidth) {
      const value = extractValue(item?.buildingWidth);
      console.log('buildingWidth:', typeof item?.buildingWidth, item?.buildingWidth, '→', value);
      specs.push({
        label: 'Lebar Bangunan',
        value: `${value} m`,
      });
    }
    if (item?.buildingLength) {
      const value = extractValue(item?.buildingLength);
      console.log('buildingLength:', typeof item?.buildingLength, item?.buildingLength, '→', value);
      specs.push({
        label: 'Panjang Bangunan',
        value: `${value} m`,
      });
    }
    if (item?.parkingSpace) {
      const value = extractValue(item?.parkingSpace);
      console.log('parkingSpace:', typeof item?.parkingSpace, item?.parkingSpace, '→', value);
      specs.push({
        label: 'Parkir',
        value: `${value} m²`,
      });
    }
    if (item?.restroomCount) {
      const value = extractValue(item?.restroomCount);
      console.log('restroomCount:', typeof item?.restroomCount, item?.restroomCount, '→', value);
      specs.push({
        label: 'Kamar Mandi',
        value,
      });
    }
    if (item?.electricityType) {
      const value = extractValue(item?.electricityType);
      console.log('electricityType:', typeof item?.electricityType, item?.electricityType, '→', value);
      specs.push({
        label: 'Tipe Listrik',
        value,
      });
    }
    if (item?.businessSuitableFor) {
      const value = extractValue(item?.businessSuitableFor);
      console.log('businessSuitableFor:', typeof item?.businessSuitableFor, item?.businessSuitableFor, '→', value);
      specs.push({
        label: 'Cocok Untuk',
        value,
      });
    }

    // Office
    if (item?.officeType) {
      const value = extractValue(item?.officeType);
      console.log('officeType:', typeof item?.officeType, item?.officeType, '→', value);
      specs.push({
        label: 'Tipe Kantor',
        value,
      });
    }
    if (item?.meetingRoomCount) {
      const value = extractValue(item?.meetingRoomCount);
      console.log('meetingRoomCount:', typeof item?.meetingRoomCount, item?.meetingRoomCount, '→', value);
      specs.push({
        label: 'R. Meeting',
        value,
      });
    }
    if (item?.workspaceCapacity) {
      const value = extractValue(item?.workspaceCapacity);
      console.log('workspaceCapacity:', typeof item?.workspaceCapacity, item?.workspaceCapacity, '→', value);
      specs.push({
        label: 'Kapasitas',
        value: `${value} orang`,
      });
    }
    if (item?.pantry) {
      const value = extractValue(item?.pantry);
      console.log('pantry:', typeof item?.pantry, item?.pantry, '→', value);
      specs.push({ label: 'Pantry', value });
    }
    if (item?.toiletType) {
      const value = extractValue(item?.toiletType);
      console.log('toiletType:', typeof item?.toiletType, item?.toiletType, '→', value);
      specs.push({
        label: 'Tipe Toilet',
        value,
      });
    }

    // Kos
    if (item?.totalRooms) {
      const value = extractValue(item?.totalRooms);
      console.log('totalRooms:', typeof item?.totalRooms, item?.totalRooms, '→', value);
      specs.push({
        label: 'Total Kamar',
        value,
      });
    }
    if (item?.occupiedRooms) {
      const value = extractValue(item?.occupiedRooms);
      console.log('occupiedRooms:', typeof item?.occupiedRooms, item?.occupiedRooms, '→', value);
      specs.push({
        label: 'Kamar Terisi',
        value,
      });
    }
    if (item?.roomFacilities) {
      const value = extractValue(item?.roomFacilities);
      console.log('roomFacilities:', typeof item?.roomFacilities, item?.roomFacilities, '→', value);
      specs.push({
        label: 'Fasilitas Kamar',
        value,
      });
    }
    if (item?.bathroomInside) {
      const value = extractValue(item?.bathroomInside);
      console.log('bathroomInside:', typeof item?.bathroomInside, item?.bathroomInside, '→', value);
      specs.push({
        label: 'K. Mandi Dalam',
        value,
      });
    }
    if (item?.incomePerMonth) {
      const value = extractValue(item?.incomePerMonth);
      console.log('incomePerMonth:', typeof item?.incomePerMonth, item?.incomePerMonth, '→', value);
      specs.push({
        label: 'Pendapatan/Bln',
        value: formatPrice(value),
      });
    }
    if (item?.rules) {
      const value = extractValue(item?.rules);
      console.log('rules:', typeof item?.rules, item?.rules, '→', value);
      specs.push({ label: 'Aturan', value });
    }

    // Industry
    if (item?.ceilingHeight) {
      const value = extractValue(item?.ceilingHeight);
      console.log('ceilingHeight:', typeof item?.ceilingHeight, item?.ceilingHeight, '→', value);
      specs.push({
        label: 'Tinggi Atap',
        value: `${value} m`,
      });
    }
    if (item?.loadingDock) {
      const value = extractValue(item?.loadingDock);
      console.log('loadingDock:', typeof item?.loadingDock, item?.loadingDock, '→', value);
      specs.push({
        label: 'Loading Dock',
        value,
      });
    }
    if (item?.truckAccess) {
      const value = extractValue(item?.truckAccess);
      console.log('truckAccess:', typeof item?.truckAccess, item?.truckAccess, '→', value);
      specs.push({
        label: 'Akses Truk',
        value,
      });
    }
    if (item?.powerCapacity) {
      const value = extractValue(item?.powerCapacity);
      console.log('powerCapacity:', typeof item?.powerCapacity, item?.powerCapacity, '→', value);
      specs.push({
        label: 'Kapasitas Daya',
        value: `${value} KVA`,
      });
    }
    if (item?.floorStrength) {
      const value = extractValue(item?.floorStrength);
      console.log('floorStrength:', typeof item?.floorStrength, item?.floorStrength, '→', value);
      specs.push({
        label: 'Kekuatan Lantai',
        value: `${value} ton/m²`,
      });
    }

    console.log('=== Final specs array ===', specs);
    return specs;
  }, [item, extractValue]);

  const openPreview = (startIndex = 0) => {
    if (!previewImages?.length || !global.showImagePreview) return;
    const ordered = [
      ...previewImages?.slice(startIndex),
      ...previewImages?.slice(0, startIndex),
    ];
    global.showImagePreview(ordered);
  };

  const renderImage = ({ item: uri, index }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => openPreview(index)}>
      <Image source={{ uri }} style={styles.heroImage} />
    </TouchableOpacity>
  );

  const isOwner = item?.uid && user?.uid && item?.uid === user.uid;
  const contactNumber =
    item?.contactNumber ||
    item?.ownerContact ||
    item?.ownerPhone ||
    item?.phoneNumber ||
    item?.owner?.contactNumber ||
    item?.owner?.phoneNumber ||
    item?.owner?.whatsapp ||
    item?.whatsapp ||
    (isOwner ? user?.phoneNumber || user?.whatsapp : null);

  const handleContact = async () => {
    if (!contactNumber) {
      Alert.alert('Info', 'Kontak pengiklan belum tersedia.');
      return;
    }
    const telUrl = `tel:${contactNumber}`;
    const supported = await Linking.canOpenURL(telUrl);
    if (supported) {
      Linking.openURL(telUrl);
    } else {
      Alert.alert('Gagal', 'Tidak bisa membuka panggilan untuk nomor ini.');
    }
  };

  const statusChipBg =
    colors.BACKGROUND === '#0D1B2D' ? '#1D2B48' : colors.BACKGROUND;

  return (
    <View style={[styles.screen, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={
          colors.BACKGROUND === '#0D1B2D' ? 'light-content' : 'dark-content'
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Sizes.statusBar + 6,
          paddingBottom: 100,
          backgroundColor: colors.BACKGROUND,
        }}
      >
        <View style={[styles.heroContainer, { backgroundColor: colors.CARD }]}>
          <FlatList
            data={images}
            renderItem={renderImage}
            keyExtractor={(uri, index) => `${uri}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
              );
              setActiveIndex(index);
            }}
          />
          <View style={[styles.heroOverlay, { paddingTop: insets.top }]}>
            <TouchableOpacity
              style={[
                styles.iconCircle,
                {
                  backgroundColor: colors.CARD,
                  borderColor: colors.GRAY_LIGHT,
                },
              ]}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={22}
                color={colors.TEXT}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.iconCircle,
                {
                  backgroundColor: colors.CARD,
                  borderColor: colors.GRAY_LIGHT,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="share-variant"
                size={20}
                color={colors.TEXT}
              />
            </TouchableOpacity>
          </View>
          {images?.length > 1 && (
            <View style={styles.dots}>
              {images?.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    {
                      opacity: activeIndex === idx ? 1 : 0.35,
                      width: activeIndex === idx ? 16 : 8,
                      backgroundColor: colors.WHITE,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View
          style={[
            styles.content,
            {
              backgroundColor:
                colors.BACKGROUND === '#0D1B2D'
                  ? '#121F38'
                  : 'rgba(255,255,255,0.92)',
              borderColor: colors.GRAY_LIGHT,
            },
          ]}
        >
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: `${statusMeta?.color}20`,
                  borderColor: statusMeta?.color || colors.PRIMARY,
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: statusMeta?.color || colors.PRIMARY },
                ]}
              >
                {statusMeta?.label}
              </Text>
            </View>
            <View
              style={[
                styles.badgeSecondary,
                {
                  backgroundColor:
                    colors.BACKGROUND === '#0D1B2D'
                      ? '#1F2E4D'
                      : colors.PRIMARY_20,
                  borderColor: colors.PRIMARY,
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[styles.badgeSecondaryText, { color: colors.PRIMARY }]}
              >
                Recommended
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.TEXT }]}>
            {extractValue(item?.propertyName || item?.title || 'Properti')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.GREY }]}>
            {extractValue(item?.propertyTypeName || item?.propertyType)}
          </Text>
          <View style={styles.tagRow}>
            <View
              style={[
                styles.tag,
                {
                  backgroundColor: statusChipBg,
                  borderColor: colors.GRAY_LIGHT,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="tag-outline"
                size={14}
                color={colors.TEXT}
              />
              <Text style={[styles.tagText, { color: colors.TEXT }]}>
                {statusMeta?.label}
              </Text>
            </View>
            {item?.category ? (
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: statusChipBg,
                    borderColor: colors.GRAY_LIGHT,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="home-city-outline"
                  size={14}
                  color={colors.TEXT}
                />
                <Text style={[styles.tagText, { color: colors.TEXT }]}>
                  {extractValue(item?.category)}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="star-outline"
              size={16}
              color={colors.TEXT}
            />
            <Text style={[styles.infoText, { color: colors.TEXT }]}>
              {item?.rating || '5.0'} Rating
            </Text>
            <View style={[styles.bullet, { backgroundColor: colors.GREY }]} />
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={16}
              color={colors.TEXT}
            />
            <Text style={[styles.infoText, { color: colors.TEXT }]}>
              {item?.distance || 'Dekat'}
            </Text>
            <View style={[styles.bullet, { backgroundColor: colors.GREY }]} />
            <Text
              style={[
                styles.infoText,
                styles.linkText,
                { color: colors.PRIMARY },
              ]}
            >
              300 Reviews
            </Text>
          </View>

          {featureCards?.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.TEXT }]}>
                  Informasi
                </Text>
              </View>
              <View style={styles.featureColumn}>
                {featureCards?.map((feature, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.featureCard,
                      {
                        backgroundColor:
                          colors.BACKGROUND === '#0D1B2D'
                            ? '#0F1C34'
                            : colors.BACKGROUND,
                        borderColor: colors.GRAY_LIGHT,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.featureIconWrapper,
                        { backgroundColor: colors.PRIMARY },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={feature.icon}
                        size={20}
                        color={colors.WHITE}
                      />
                    </View>
                    <Text style={[styles.featureText, { color: colors.TEXT }]}>
                      {feature.label}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={[styles.sectionTitle, { color: colors.TEXT }]}>
            Harga
          </Text>
          <Text style={[styles.price, { color: colors.PRIMARY }]}>
            {formatPrice(item?.price)}
          </Text>

          <Text
            style={[styles.sectionTitle, { marginTop: 16, color: colors.TEXT }]}
          >
            Alamat
          </Text>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color={colors.TEXT}
            />
            <Text
              style={[styles.metaText, { flex: 1, color: colors.TEXT }]}
              numberOfLines={2}
            >
              {item?.address || 'Alamat belum diisi'}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="file-certificate-outline"
              size={18}
              color={colors.TEXT}
            />
            <Text style={[styles.metaText, { color: colors.TEXT }]}>
              {extractValue(item?.certificateTypeName) || 'Sertifikat tidak diketahui'}
            </Text>
          </View>

          {additionalSpecs && additionalSpecs?.length > 0 && (
            <>
              <Text
                style={[
                  styles.sectionTitle,
                  { marginTop: 16, color: colors.TEXT },
                ]}
              >
                Spesifikasi
              </Text>
              <View style={styles.specsGrid}>
                {additionalSpecs?.map((spec, idx) => (
                  <View key={idx} style={styles.specItem}>
                    <Text style={[styles.specLabel, { color: colors.GREY }]}>
                      {spec?.label}
                    </Text>
                    <Text style={[styles.specValue, { color: colors.TEXT }]}>
                      {spec?.value}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {item?.description ? (
            <>
              <Text
                style={[
                  styles.sectionTitle,
                  { marginTop: 16, color: colors.TEXT },
                ]}
              >
                Deskripsi
              </Text>
              <Text style={[styles.description, { color: colors.TEXT }]}>
                {item?.description}
              </Text>
            </>
          ) : null}
        </View>
      </ScrollView>
      {!isOwner && (
        <View
          style={[
            styles.stickyBar,
            {
              paddingBottom: insets?.bottom || 16,
              backgroundColor:
                colors.BACKGROUND === '#0D1B2D'
                  ? '#0E1929'
                  : 'rgba(255,255,255,0.92)',
              borderColor: colors.GRAY_LIGHT,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: colors.PRIMARY }]}
            onPress={handleContact}
            activeOpacity={0.88}
          >
            <MaterialCommunityIcons
              name="phone-outline"
              size={18}
              color={colors.WHITE}
            />
            <Text style={[styles.contactText, { color: colors.WHITE }]}>
              Hubungi Pengiklan
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ marginVertical: 10 }}>
        <GlobalBannerAd />
      </View>
    </View>
  );
};

const createStyles = colors =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    heroContainer: {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.7,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      overflow: 'hidden',
      backgroundColor: colors.CARD,
      marginTop: Sizes.statusBar,
      shadowColor: '#000',
      shadowOpacity: colors.BACKGROUND === '#0D1B2D' ? 0.25 : 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
    heroImage: {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.7,
      resizeMode: 'cover',
    },
    heroOverlay: {
      position: 'absolute',
      top: Sizes.statusBar + 22,
      left: 16,
      right: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    iconCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    },
    dots: {
      position: 'absolute',
      bottom: 14,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    dot: {
      height: 8,
      borderRadius: 4,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 30,
      borderRadius: 18,
      marginHorizontal: 12,
      marginTop: -14,
      borderWidth: 1,
      shadowColor: '#000',
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    badgeRow: {
      flexDirection: 'row',
      marginBottom: 10,
      gap: 8,
      flexWrap: 'wrap',
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
    },
    badgeSecondary: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
    },
    badgeSecondaryText: {
      fontFamily: Fonts.fontMedium,
      fontSize: 12,
    },
    badgeText: {
      fontFamily: Fonts.fontMedium,
      fontSize: 12,
    },
    title: {
      fontSize: 22,
      fontFamily: Fonts.fontSemiBold,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: Fonts.fontRegular,
      marginBottom: 12,
    },
    tagRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 12,
      flexWrap: 'wrap',
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
    },
    tagText: {
      fontSize: 12,
      fontFamily: Fonts.fontMedium,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 14,
    },
    infoText: {
      fontFamily: Fonts.fontRegular,
      fontSize: 13,
    },
    bullet: {
      width: 4,
      height: 4,
      borderRadius: 2,
    },
    linkText: {
      textDecorationLine: 'underline',
      fontFamily: Fonts.fontMedium,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: Fonts.fontSemiBold,
      marginBottom: 8,
    },
    featureColumn: {
      width: '100%',
      marginBottom: 8,
    },
    featureCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      minHeight: 64,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 10,
    },
    featureText: {
      fontFamily: Fonts.fontMedium,
      flex: 1,
    },
    featureIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    price: {
      fontSize: 20,
      fontFamily: Fonts.fontBold,
      marginBottom: 4,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    metaText: {
      fontFamily: Fonts.fontRegular,
    },
    description: {
      fontFamily: Fonts.fontRegular,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 4,
    },
    stickyBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingBottom: 16,
      paddingTop: 12,
      borderTopWidth: 1,
    },
    contactButton: {
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    contactText: {
      fontFamily: Fonts.fontSemiBold,
      fontSize: 15,
    },
    specsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      gap: 12,
    },
    specItem: {
      width: (SCREEN_WIDTH - 64) / 2,
      backgroundColor:
        colors.BACKGROUND === '#0D1B2D' ? '#0F1C34' : colors.BACKGROUND,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    specLabel: {
      fontSize: 11,
      fontFamily: Fonts.fontRegular,
      marginBottom: 2,
    },
    specValue: {
      fontSize: 13,
      fontFamily: Fonts.fontSemiBold,
    },
  });

export default GlobalDetailPropertyScreen;
