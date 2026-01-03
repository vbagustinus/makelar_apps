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
          ? { icon: 'bed-king-outline', label: `${item?.bedrooms} Kamar` }
          : null,
        item?.bathrooms
          ? { icon: 'shower', label: `${item?.bathrooms} Kamar Mandi` }
          : null,
        item?.buildingArea
          ? { icon: 'home-floor-1', label: `${item?.buildingArea} m² Bangunan` }
          : null,
        item?.landArea
          ? { icon: 'ruler-square', label: `${item?.landArea} m² Tanah` }
          : null,
        item?.floors
          ? { icon: 'stairs', label: `${item?.floors} Lantai` }
          : null,
        item?.garage ? { icon: 'car', label: `${item?.garage} Garasi` } : null,
      ].filter(Boolean),
    [
      item?.bathrooms,
      item?.bedrooms,
      item?.buildingArea,
      item?.floors,
      item?.garage,
      item?.landArea,
    ],
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
          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((_, idx) => (
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
                  backgroundColor: `${statusMeta.color}20`,
                  borderColor: statusMeta.color || colors.PRIMARY,
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: statusMeta.color || colors.PRIMARY },
                ]}
              >
                {statusMeta.label}
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
            {item?.propertyName || item?.title || 'Properti'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.GREY }]}>
            {item?.propertyTypeName || item?.propertyType?.name || ''}
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
                {statusMeta.label}
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
                  {item?.category}
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

          {featureCards.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.TEXT }]}>
                  Informasi
                </Text>
              </View>
              <View style={styles.featureColumn}>
                {featureCards.map((feature, idx) => (
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
              {item?.certificateTypeName || 'Sertifikat tidak diketahui'}
            </Text>
          </View>

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
  });

export default GlobalDetailPropertyScreen;
