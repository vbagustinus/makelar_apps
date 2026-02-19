import React, { useEffect, useMemo, useState } from 'react';
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
  Share,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeColors, Sizes } from '../../styles';
import { Fonts } from '../../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '../../store/useAuthStore';
import usePropertyStore from '../../store/usePropertyStore';
import useFavoriteStore from '../../store/useFavoriteStore';
import { GlobalBannerAd } from '../ads';
import { usePropertyDetail } from '../../hooks/usePropertyDetail';
import { logo } from '../../assets/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GlobalDetailPropertyScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useAuthStore(state => state.user);

  const incoming = route.params || {};
  const directId = incoming?.id || incoming?.propertyId;
  const initialItem = incoming?.property || incoming?.item || incoming;
  const [detailItem, setDetailItem] = useState(
    initialItem && Object.keys(initialItem).length > 1 ? initialItem : null,
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const getPropertyById = usePropertyStore(state => state.getPropertyById);

  useEffect(() => {
    if (!directId || detailItem) return;
    setDetailLoading(true);
    getPropertyById(directId)
      .then(data => {
        setDetailItem(data || {});
      })
      .finally(() => {
        setDetailLoading(false);
      });
  }, [directId, detailItem, getPropertyById]);

  const item = detailItem || initialItem || {};
  const favoriteId = item?.id || item?.propertyId || directId;
  const isFavorite = useFavoriteStore(state => state.isFavorite(favoriteId));
  const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);

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

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const {
    images,
    previewImages,
    statusMeta,
    featureCards,
    additionalSpecs,
    formatPrice,
    extractValue,
  } = usePropertyDetail(item, colors);
  const displayImages = images.length ? images : [null];

  const openPreview = (startIndex = 0) => {
    if (!previewImages?.length || !global.showImagePreview) return;
    const ordered = [
      ...previewImages?.slice(startIndex),
      ...previewImages?.slice(0, startIndex),
    ];
    global.showImagePreview(ordered);
  };

  const renderImage = ({ item: uri, index }) => {
    const showFallback = !uri || imageErrors[index];
    const source = showFallback ? logo : { uri };
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => openPreview(index)}>
        <Image
          source={source}
          style={styles.heroImage}
          onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
        />
      </TouchableOpacity>
    );
  };

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

  const getSanitizedNumber = raw => {
    if (!raw) return '';
    return String(raw).replace(/[^0-9+]/g, '');
  };

  const openWhatsapp = async (number, propertyLink) => {
    const sanitized = getSanitizedNumber(number);
    const waNumber = sanitized.replace(/^0/, '62').replace(/^\+/, '');
    const messageBase = 'Saya mendapat info properti ini dari aplikasi Makelar';
    const message = propertyLink
      ? `${messageBase} dengan link ${propertyLink}, saya mau tahu `
      : `${messageBase}, saya mau tahu `;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
      message,
    )}`;
    const supported = await Linking.canOpenURL(waUrl);
    if (supported) {
      Linking.openURL(waUrl);
    } else {
      Alert.alert('Gagal', 'Tidak bisa membuka WhatsApp.');
    }
  };

  const openTelephone = async number => {
    const sanitized = getSanitizedNumber(number);
    const telUrl = `tel:${sanitized}`;
    const supported = await Linking.canOpenURL(telUrl);
    if (supported) {
      Linking.openURL(telUrl);
    } else {
      Alert.alert('Gagal', 'Tidak bisa membuka panggilan untuk nomor ini.');
    }
  };

  const handleContact = async () => {
    if (!contactNumber) {
      Alert.alert('Info', 'Kontak pengiklan belum tersedia.');
      return;
    }
    const propertyId = item?.id || item?.propertyId || directId;
    const propertyLink = propertyId
      ? `https://makelar.vercel.app/property/${propertyId}`
      : '';
    Alert.alert('Hubungi Pengiklan', 'Pilih metode kontak:', [
      {
        text: 'WhatsApp',
        onPress: () => openWhatsapp(contactNumber, propertyLink),
      },
      {
        text: 'Telepon',
        onPress: () => openTelephone(contactNumber),
      },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  const handleShare = async () => {
    const propertyId = item?.id || item?.propertyId || directId;
    if (!propertyId) {
      Alert.alert('Info', 'ID properti belum tersedia.');
      return;
    }
    const url = `https://makelar.vercel.app/property/${propertyId}`;
    try {
      await Share.share({
        message: `Cek properti ini di Makelar: ${url}`,
        url,
      });
    } catch (error) {
      Alert.alert('Gagal', 'Tidak bisa membuka menu share.');
    }
  };

  const handleToggleFavorite = () => {
    if (!favoriteId) {
      Alert.alert('Info', 'ID properti belum tersedia.');
      return;
    }
    if (!user?.uid) {
      Alert.alert('Info', 'Silakan login untuk menyimpan favorit.');
      return;
    }
    toggleFavorite(item);
  };

  const openExternalMap = () => {
    const lat =
      Number(item?.latitude) ||
      Number(item?.lat) ||
      Number(item?.location?.latitude);
    const lng =
      Number(item?.longitude) ||
      Number(item?.lng) ||
      Number(item?.location?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      Alert.alert('Info', 'Lokasi properti belum tersedia.');
      return;
    }
    const label = encodeURIComponent(
      extractValue(item?.propertyName || item?.title || 'Properti'),
    );
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const hasCoords = (() => {
    const lat =
      Number(item?.latitude) ||
      Number(item?.lat) ||
      Number(item?.location?.latitude);
    const lng =
      Number(item?.longitude) ||
      Number(item?.lng) ||
      Number(item?.location?.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng);
  })();

  if (detailLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.BACKGROUND }]}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={
            colors.BACKGROUND === '#0D1B2D' ? 'light-content' : 'dark-content'
          }
        />
        <View
          style={[
            styles.stickyHeader,
            { paddingTop: insets.top + 8, paddingHorizontal: 16 },
          ]}
        >
          <View style={styles.stickyHeaderRow}>
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
            <View style={styles.headerActions}>
              {user?.uid ? (
                <TouchableOpacity
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: colors.CARD,
                      borderColor: colors.GRAY_LIGHT,
                    },
                  ]}
                  onPress={handleToggleFavorite}
                >
                  <MaterialCommunityIcons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFavorite ? colors.ALERT : colors.TEXT}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: colors.CARD,
                    borderColor: colors.GRAY_LIGHT,
                  },
                ]}
                onPress={handleShare}
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  size={20}
                  color={colors.TEXT}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.TEXT }]}>
            Memuat detail properti...
          </Text>
          <Text style={[styles.emptyCaption, { color: colors.GREY }]}>
            Mohon tunggu sebentar.
          </Text>
        </View>
      </View>
    );
  }

  if (!item || Object.keys(item).length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.BACKGROUND }]}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={
            colors.BACKGROUND === '#0D1B2D' ? 'light-content' : 'dark-content'
          }
        />
        <View
          style={[
            styles.stickyHeader,
            { paddingTop: insets.top + 8, paddingHorizontal: 16 },
          ]}
        >
          <View style={styles.stickyHeaderRow}>
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
            <View style={styles.headerActions}>
              {user?.uid ? (
                <TouchableOpacity
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: colors.CARD,
                      borderColor: colors.GRAY_LIGHT,
                    },
                  ]}
                  onPress={handleToggleFavorite}
                >
                  <MaterialCommunityIcons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFavorite ? colors.ALERT : colors.TEXT}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: colors.CARD,
                    borderColor: colors.GRAY_LIGHT,
                  },
                ]}
                onPress={handleShare}
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  size={20}
                  color={colors.TEXT}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.TEXT }]}>
            Properti tidak ditemukan.
          </Text>
          <Text style={[styles.emptyCaption, { color: colors.GREY }]}>
            Coba kembali dan pilih properti lain.
          </Text>
        </View>
      </View>
    );
  }

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
      <View
        style={[
          styles.stickyHeader,
          { paddingTop: insets.top + 8, paddingHorizontal: 16 },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.stickyHeaderRow}>
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
          <View style={styles.headerActions}>
            {user?.uid ? (
              <TouchableOpacity
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: colors.CARD,
                    borderColor: colors.GRAY_LIGHT,
                  },
                ]}
                onPress={handleToggleFavorite}
              >
                <MaterialCommunityIcons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? colors.ALERT : colors.TEXT}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[
                styles.iconCircle,
                {
                  backgroundColor: colors.CARD,
                  borderColor: colors.GRAY_LIGHT,
                },
              ]}
              onPress={handleShare}
            >
              <MaterialCommunityIcons
                name="share-variant"
                size={20}
                color={colors.TEXT}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
            data={displayImages}
            renderItem={renderImage}
            keyExtractor={(uri, index) =>
              uri ? `${uri}-${index}` : `placeholder-${index}`
            }
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
                        name={feature.icon as any}
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

          <View style={styles.adSlot}>
            <GlobalBannerAd />
          </View>

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
            {hasCoords ? (
              <TouchableOpacity
                style={styles.mapLinkButton}
                onPress={openExternalMap}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="directions"
                  size={18}
                  color={colors.PRIMARY}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="file-certificate-outline"
              size={18}
              color={colors.TEXT}
            />
            <Text style={[styles.metaText, { color: colors.TEXT }]}>
              {extractValue(item?.certificateTypeName) ||
                'Sertifikat tidak diketahui'}
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
    stickyHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      elevation: 10,
    },
    stickyHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    iconCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingTop: Sizes.statusBar + 80,
    },
    emptyTitle: {
      fontFamily: Fonts.fontSemiBold,
      fontSize: 18,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyCaption: {
      fontFamily: Fonts.fontRegular,
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 18,
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
    adSlot: {
      marginTop: 12,
      paddingVertical: 6,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor: colors.CARD,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    mapLinkButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.HAZE,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
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
