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
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BaseView } from '../../components';
import { Colors, Sizes } from '../../styles';
import { Fonts, propertyStatuses } from '../../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '../../store/useAuthStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getStatusMeta = statusId => {
  const found = propertyStatuses.find(s => s.id === statusId);
  return {
    label: found?.name || 'Status',
    color: found?.color || Colors.PRIMARY,
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
  const user = useAuthStore(state => state.user);
  const incoming = route.params || {};
  const item = incoming?.property || incoming?.item || incoming;
  const images =
    item?.imageUrls && item?.imageUrls.length > 0
      ? item?.imageUrls
      : item?.images && item?.images.length > 0
      ? item?.images
      : item?.imageUrl
      ? [item?.imageUrl]
      : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const previewImages = useMemo(
    () => images.map(uri => ({ url: uri })),
    [images],
  );

  const statusMeta = getStatusMeta(item?.statusId || item?.status?.id);
  const addressLine = useMemo(() => {
    const locationParts = [item?.address, item?.village, item?.district, item?.city, item?.province].filter(Boolean);
    return locationParts.join(', ');
  }, [item?.address, item?.village, item?.district, item?.city, item?.province]);

  const featureCards = useMemo(
    () =>
      [
        item?.bedrooms ? { icon: 'bed-king-outline', label: `${item?.bedrooms} Kamar` } : null,
        item?.bathrooms ? { icon: 'shower', label: `${item?.bathrooms} Kamar Mandi` } : null,
        item?.buildingArea ? { icon: 'home-floor-1', label: `${item?.buildingArea} m² Bangunan` } : null,
        item?.landArea ? { icon: 'ruler-square', label: `${item?.landArea} m² Tanah` } : null,
        item?.floors ? { icon: 'stairs', label: `${item?.floors} Lantai` } : null,
        item?.garage ? { icon: 'car', label: `${item?.garage} Garasi` } : null,
      ].filter(Boolean),
    [item?.bathrooms, item?.bedrooms, item?.buildingArea, item?.floors, item?.garage, item?.landArea],
  );

  const openPreview = (startIndex = 0) => {
    if (!previewImages.length || !global.showImagePreview) return;
    const ordered = [
      ...previewImages.slice(startIndex),
      ...previewImages.slice(0, startIndex),
    ];
    global.showImagePreview(ordered);
  };

  const renderImage = ({ item: uri, index }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => openPreview(index)}>
      <Image source={{ uri }} style={styles.heroImage} />
    </TouchableOpacity>
  );

  const contactNumber =
    item?.contactNumber ||
    item?.phoneNumber ||
    item?.ownerPhone ||
    item?.ownerContact ||
    item?.whatsapp;
  const isOwner = item?.uid && user?.uid && item.uid === user.uid;

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

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.statusBar + 8, backgroundColor: Colors.BACKGROUND, paddingBottom: 100 }}
      >
        <View style={styles.heroContainer}>
          <FlatList
            data={images}
            renderItem={renderImage}
            keyExtractor={(uri, index) => `${uri}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveIndex(index);
            }}
          />
          <View style={[styles.heroOverlay, {paddingTop: insets.top}]}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="chevron-left" size={22} color={Colors.TEXT} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <MaterialCommunityIcons name="share-variant" size={20} color={Colors.TEXT} />
            </TouchableOpacity>
          </View>
          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    { opacity: activeIndex === idx ? 1 : 0.35, width: activeIndex === idx ? 16 : 8 },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: statusMeta.color + '20' }]}>
              <Text style={[styles.badgeText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
            </View>
            <View style={styles.badgeSecondary}>
              <Text style={styles.badgeSecondaryText}>Recommended</Text>
            </View>
          </View>

          <Text style={styles.title}>{item?.propertyName || item?.title || 'Properti'}</Text>
          <Text style={styles.subtitle}>
            {item?.propertyTypeName || item?.propertyType?.name || item?.type || 'Tipe tidak dikenal'}
          </Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <MaterialCommunityIcons name="tag-outline" size={14} color={Colors.TEXT} />
              <Text style={styles.tagText}>{statusMeta.label}</Text>
            </View>
            {item?.category ? (
              <View style={styles.tag}>
                <MaterialCommunityIcons name="home-city-outline" size={14} color={Colors.TEXT} />
                <Text style={styles.tagText}>{item.category}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="star-outline" size={16} color={Colors.TEXT} />
            <Text style={styles.infoText}>{item?.rating || '5.0'} Rating</Text>
            <View style={styles.bullet} />
            <MaterialCommunityIcons name="map-marker-distance" size={16} color={Colors.TEXT} />
            <Text style={styles.infoText}>{item?.distance || 'Dekat'}</Text>
            <View style={styles.bullet} />
            <Text style={[styles.infoText, styles.linkText]}>300 Reviews</Text>
          </View>

          {featureCards.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Infomasi</Text>
              </View>
              <View style={styles.featureColumn}>
                {featureCards.map((feature, idx) => (
                  <View key={idx} style={styles.featureCard}>
                    <View style={styles.featureIconWrapper}>
                      <MaterialCommunityIcons name={feature.icon} size={20} color={Colors.WHITE} />
                    </View>
                    <Text style={styles.featureText}>{feature.label}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>Harga</Text>
          <Text style={styles.price}>{formatPrice(item?.price)}</Text>

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Alamat</Text>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={Colors.TEXT} />
            <Text style={[styles.metaText, { flex: 1 }]} numberOfLines={2}>
              {addressLine || 'Alamat belum diisi'}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="file-certificate-outline" size={18} color={Colors.TEXT} />
            <Text style={styles.metaText}>{item?.certificateTypeName || 'Sertifikat tidak diketahui'}</Text>
          </View>

          {item?.description ? (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Deskripsi</Text>
              <Text style={styles.description}>{item.description}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>
      {!isOwner && (
        <View style={[styles.stickyBar, {paddingBottom: insets?.bottom}]}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContact} activeOpacity={0.88}>
            <MaterialCommunityIcons name="phone-outline" size={18} color={Colors.WHITE} />
            <Text style={styles.contactText}>Hubungi Pengiklan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.7,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.PRIMARY,
    marginTop: Sizes.statusBar,
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
    backgroundColor: '#FFFFFFD0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
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
    backgroundColor: Colors.WHITE,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderRadius: 18,
    marginHorizontal: 12,
    marginTop: -14,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    fontFamily: Fonts.fontMedium,
    fontSize: 12,
  },
  badgeSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.PRIMARY_20,
  },
  badgeSecondaryText: {
    fontFamily: Fonts.fontMedium,
    fontSize: 12,
    color: Colors.PRIMARY,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.TEXT,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.GRAY_DARK,
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
    backgroundColor: Colors.WHITE_50,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  tagText: {
    fontSize: 12,
    fontFamily: Fonts.fontMedium,
    color: Colors.TEXT,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  infoText: {
    color: Colors.TEXT,
    fontFamily: Fonts.fontRegular,
    fontSize: 13,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.GRAY_DARK,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: Colors.TEXT,
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
    color: Colors.TEXT,
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
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
    marginBottom: 10,
  },
  featureText: {
    fontFamily: Fonts.fontMedium,
    color: Colors.TEXT,
    flex: 1,
  },
  featureIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {
    fontSize: 20,
    fontFamily: Fonts.fontBold,
    color: Colors.PRIMARY,
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
    color: Colors.TEXT,
  },
  description: {
    fontFamily: Fonts.fontRegular,
    fontSize: 14,
    color: Colors.TEXT,
    lineHeight: 20,
    marginTop: 4,
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 16 + Sizes.bottomSpace,
    paddingTop: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  contactButton: {
    height: 48,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  contactText: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 15,
  },
});

export default GlobalDetailPropertyScreen;
