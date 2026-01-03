import * as React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Share,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { FlashList } from '@shopify/flash-list';
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);
import { Text, EmptyData } from '../../components';
import { Fonts, propertyStatuses } from '../../constants';
import { Sizes, useThemeColors } from '../../styles';
import { LoadingPigeons } from './LoadingPigeons';
import { GlobalBannerAd } from '../ads';
import { logo } from '../../assets/images';
import usePropertyStore from '../../store/usePropertyStore';
import useAuthStore from '../../store/useAuthStore';

function PropertyScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const fetchProperties = usePropertyStore(state => state.fetchProperties);
  const listProperty = usePropertyStore(state => state.listProperty);
  const listPropertyLoading = usePropertyStore(
    state => state.listPropertyLoading,
  );
  const globalLoading = usePropertyStore(state => state.globalLoading);
  const listPropertyError = usePropertyStore(state => state.listPropertyError);
  const fetchPropertyCounts = usePropertyStore(
    state => state.fetchPropertyCounts,
  );
  const totalProperties = usePropertyStore(state => state.totalProperties);
  const totalForSale = usePropertyStore(state => state.totalForSale);
  const totalForRent = usePropertyStore(state => state.totalForRent);
  const user = useAuthStore(state => state.user);
  const deletePropertyData = usePropertyStore(
    state => state.deletePropertyData,
  );
  const deletePropertySuccess = usePropertyStore(
    state => state.deletePropertySuccess,
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all'); // all | sale | rent
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [bodyHeight, setBodyHeight] = React.useState(0);
  const bodyHeightRef = React.useRef(0);

  const getStatusMeta = statusId => {
    const found = propertyStatuses.find(s => s.id === statusId);
    return {
      label: found?.name || 'Status?',
      color: found?.color || colors.GRAY_MEDIUM,
    };
  };

  React.useEffect(() => {
    fetchProperties();
    fetchPropertyCounts();
  }, [fetchProperties, fetchPropertyCounts]);

  React.useEffect(() => {
    if (listPropertyError) {
      console.warn('Property fetch error:', listPropertyError);
    }
  }, [listPropertyError]);

  React.useEffect(() => {
    if (deletePropertySuccess) {
      fetchProperties();
      fetchPropertyCounts();
    }
  }, [deletePropertySuccess, fetchProperties, fetchPropertyCounts]);

  const filteredProperties = React.useMemo(() => {
    if (!searchQuery.trim()) return listProperty;
    return listProperty.filter(prop =>
      prop.propertyName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, listProperty]);

  const statusFiltered = React.useMemo(() => {
    if (filterStatus === 'all') return filteredProperties;
    if (filterStatus === 'sale')
      return filteredProperties.filter(p => p.statusId === 1);
    if (filterStatus === 'rent')
      return filteredProperties.filter(p => p.statusId === 2);
    return filteredProperties;
  }, [filteredProperties, filterStatus]);

  const listWithAds = React.useMemo(() => {
    const combined = [];
    statusFiltered.forEach((item, idx) => {
      combined.push({ ...item, type: 'property' });
      if ((idx + 1) % 5 === 0) {
        combined.push({ type: 'ad', id: `ad-${idx}` });
      }
    });
    if (statusFiltered.length > 0 && statusFiltered.length < 5) {
      combined.push({ type: 'ad', id: 'ad-final' });
    }
    return combined;
  }, [statusFiltered]);
  const handleAdd = () => {
    return navigation.push('AddPropertyScreen');
  };

  const handleEdit = property => {
    navigation.push('EditPropertyScreen', property);
  };

  const handleShare = async property => {
    try {
      const messageParts = [
        property?.propertyName || 'Properti',
        property?.address || property?.city || '',
        property?.price
          ? `Harga: Rp ${Number(property.price).toLocaleString('id-ID')}`
          : '',
      ].filter(Boolean);
      await Share.share({
        message: messageParts.join(' • '),
      });
    } catch (error) {
      console.warn('Share failed', error);
    }
  };

  const handleOpenDetail = property => {
    const isOwner = property?.uid && user?.uid && property.uid === user.uid;
    const targetRoute = isOwner
      ? 'DetailPropertyScreen'
      : 'GlobalDetailPropertyScreen';
    navigation.navigate(targetRoute, property);
  };

  const handleDelete = property => {
    Alert.alert(
      'Hapus Properti',
      `Anda yakin ingin menghapus "${
        property?.propertyName || 'Properti'
      }"? Tindakan ini tidak dapat dibatalkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            deletePropertyData(property.id, property.imageUrls || []);
          },
        },
      ],
    );
  };

  const renderPropertyItem = ({ item }) => {
    const imageUrl = item.imageUrl || item.imageUrls?.[0];
    const statusMeta = getStatusMeta(item.statusId);
    const isOwner = item?.uid && user?.uid && item.uid === user.uid;
    const priceDisplay =
      item.price && !Number.isNaN(Number(item.price))
        ? `Rp ${Number(item.price).toLocaleString('id-ID')}`
        : item.price || '-';
    const locationLabel =
      item.city && item.province
        ? `${item.city?.name}, ${item.province?.name}`
        : item.city || item.province || '-';

    return (
      <Pressable onPress={() => handleOpenDetail(item)} style={styles.card}>
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.propertyImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons
                name="image-off-outline"
                size={28}
                color={colors.GREY}
              />
            </View>
          )}
          <View style={styles.overlayRow}>
            <View style={styles.statusPill(statusMeta.color)}>
              <Text style={styles.statusText}>{statusMeta.label}</Text>
            </View>
            {isOwner && (
              <View style={styles.overlayActions}>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleDelete(item)}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={18}
                    color={colors.WHITE}
                  />
                </Pressable>
              </View>
            )}
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{priceDisplay}</Text>
          </View>
        </View>

        <Text style={styles.propertyTitle} numberOfLines={2}>
          {item?.propertyName || 'Properti'}
        </Text>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={16}
            color={colors.GREY}
          />
          <Text
            style={[styles.metaText, styles.metaLocation]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {locationLabel}
          </Text>
        </View>
        <View style={styles.tagRow}>
          <View style={styles.tagPill}>
            <MaterialCommunityIcons
              name="home-outline"
              size={14}
              color={colors.PRIMARY}
            />
            <Text style={styles.tagText} numberOfLines={1}>
              {item?.propertyTypeName || '-'}
            </Text>
          </View>
          <View style={styles.tagPill}>
            <MaterialCommunityIcons
              name="map-marker-path"
              size={14}
              color={colors.PRIMARY}
            />
            <Text style={styles.tagText} numberOfLines={1}>
              {statusMeta.label}
            </Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>{priceDisplay}</Text>
        </View>

        <View style={styles.actionRow}>
          {isOwner && (
            <Pressable
              style={styles.editAction}
              onPress={() => handleEdit(item)}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={16}
                color={colors.WHITE}
              />
              <Text style={styles.editActionText}>Edit</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.shareAction}
            onPress={() => handleShare(item)}
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={16}
              color={colors.PRIMARY}
            />
            <Text style={styles.shareActionText}>Share</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const subtitleAnim = {
    opacity: scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 80],
          outputRange: [0, -8],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const blockFade = (start, end) => ({
    opacity: scrollY.interpolate({
      inputRange: [start, end],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [start, end],
          outputRange: [0, -10],
          extrapolate: 'clamp',
        }),
      },
    ],
  });

  const collapsibleStyle =
    bodyHeight > 0
      ? {
          height: scrollY.interpolate({
            inputRange: [0, 160],
            outputRange: [bodyHeight, 0],
            extrapolate: 'clamp',
          }),
          opacity: scrollY.interpolate({
            inputRange: [0, 160],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          }),
        }
      : {};

  const renderHeader = () => (
    <View style={styles.stickyHeader}>
      <LinearGradient
        colors={
          colors.BACKGROUND === '#0D1B2D'
            ? ['#0F1E36', '#0D162A']
            : ['#EAF3FF', '#F8FAFF']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero]}
      >
        <View style={[styles.heroText, { paddingTop: insets.top }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Properti Kamu</Text>
            <Animated.Text style={[styles.heroSubtitle]}>
              Kelola aset dan listing dengan tampilan yang rapi dan nyaman.
            </Animated.Text>
          </View>
          <View style={styles.heroAction}>
            <Pressable
              onPress={handleAdd}
              style={styles.addButton}
              android_ripple={{ color: colors.PRIMARY_50 }}
            >
              <LinearGradient
                colors={colors.GRADIENT_SKY}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addButtonInner}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#FFFFFF20',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={28}
                    color={colors.WHITE}
                  />
                </View>
                <Text style={styles.addButtonText}>Tambah</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        <Animated.View
          style={[{ overflow: 'hidden' }, collapsibleStyle]}
          onLayout={e => {
            if (bodyHeightRef.current === 0) {
              bodyHeightRef.current = e.nativeEvent.layout.height;
              setBodyHeight(bodyHeightRef.current);
            }
          }}
        >
          <Animated.View style={[styles.statRow, blockFade(20, 120)]}>
            <View style={styles.statPill}>
              <MaterialCommunityIcons
                name="home-group"
                size={16}
                color={colors.PRIMARY}
              />
              <Text style={styles.statText}>Total {totalProperties || 0}</Text>
            </View>
            <View style={styles.statPill}>
              <MaterialCommunityIcons
                name="tag-outline"
                size={16}
                color={colors.PRIMARY}
              />
              <Text style={styles.statText}>Dijual {totalForSale || 0}</Text>
            </View>
            <View style={styles.statPill}>
              <MaterialCommunityIcons
                name="handshake-outline"
                size={16}
                color={colors.PRIMARY}
              />
              <Text style={styles.statText}>Disewa {totalForRent || 0}</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.topBar, blockFade(40, 140)]}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari properti..."
              placeholderTextColor={colors.GREY}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Animated.View>

          <Animated.View style={[styles.filterRow, blockFade(60, 160)]}>
            <Pressable
              style={[
                styles.filterChip,
                filterStatus === 'all' && styles.filterChipActive,
              ]}
              onPress={() => setFilterStatus('all')}
            >
              <Text
                style={[
                  styles.filterText,
                  filterStatus === 'all' && styles.filterTextActive,
                ]}
              >
                Semua
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterChip,
                filterStatus === 'sale' && styles.filterChipActive,
              ]}
              onPress={() => setFilterStatus('sale')}
            >
              <Text
                style={[
                  styles.filterText,
                  filterStatus === 'sale' && styles.filterTextActive,
                ]}
              >
                Dijual
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterChip,
                filterStatus === 'rent' && styles.filterChipActive,
              ]}
              onPress={() => setFilterStatus('rent')}
            >
              <Text
                style={[
                  styles.filterText,
                  filterStatus === 'rent' && styles.filterTextActive,
                ]}
              >
                Disewakan
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );

  return (
    <LinearGradient
      colors={
        colors.BACKGROUND === '#0D1B2D'
          ? ['#0C1830', '#0A1428']
          : ['#E3F0FF', '#F6FAFF']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={
            colors.BACKGROUND === '#0D1B2D' ? 'light-content' : 'dark-content'
          }
        />
        {renderHeader()}
        {listPropertyLoading && <LoadingPigeons />}
        {!listPropertyLoading && (
          <AnimatedFlashList
            style={{ flex: 1, backgroundColor: 'transparent' }}
            onRefresh={fetchProperties}
            refreshing={listPropertyLoading}
            data={listWithAds}
            renderItem={({ item }) =>
              item.type === 'ad' ? (
                <View style={{ marginVertical: 10 }}>
                  <GlobalBannerAd />
                </View>
              ) : (
                renderPropertyItem({ item })
              )
            }
            keyExtractor={(item, index) => item.id || `${item.type}-${index}`}
            estimatedItemSize={360}
            numColumns={1}
            contentContainerStyle={styles.listContainer}
            onEndReached={null}
            onEndReachedThreshold={0}
            ListFooterComponent={<View style={styles.spacer} />}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false },
            )}
            scrollEventThrottle={16}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const createStyles = colors =>
  StyleSheet.create({
    gradientContainer: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'transparent',
      gap: 12,
    },
    headerContainer: {
      overflow: 'hidden',
      backgroundColor: 'transparent',
    },
    stickyHeader: {},
    hero: {
      // flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderRadius: 24,
      paddingHorizontal: 18,
      paddingBottom: 10,
      marginHorizontal: 4,
    },
    heroText: {
      // flex: 1,
      paddingRight: 8,
      flexDirection: 'row',
    },
    heroAction: {
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    heroSubtitle: {
      fontSize: 14,
      fontFamily: Fonts.fontRegular,
      color: colors.GREY,
      marginTop: 4,
      maxWidth: '80%',
    },
    addButton: {
      shadowColor: colors.PRIMARY,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
      borderRadius: 16,
      overflow: 'hidden',
    },
    addButtonInner: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 16,
      alignItems: 'center',
      gap: 8,
    },
    addButtonText: {
      color: colors.WHITE,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 14,
    },
    pageTitle: {
      fontSize: 22,
      fontFamily: Fonts.fontBold,
      color: colors.TEXT,
      marginBottom: 6,
    },
    pageSubtitle: {
      fontSize: 14,
      fontFamily: Fonts.fontRegular,
      color: colors.GREY,
      lineHeight: 20,
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 0,
      flexWrap: 'wrap',
      width: Sizes.widthScreen - 32,
    },
    statPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.BACKGROUND === '#0D1B2D' ? '#152647' : '#EEF3FF',
      borderColor: colors.GRAY_LIGHT,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 16,
      gap: 8,
      marginRight: 8,
    },
    statText: {
      color: colors.TEXT,
      fontFamily: Fonts.fontMedium,
      fontSize: 13,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingTop: 0,
      width: Sizes.widthScreen - 32,
    },
    searchInput: {
      backgroundColor: colors.CARD,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 16,
      marginTop: 6,
      marginBottom: 8,
      color: colors.TEXT,
      fontSize: 15,
      fontFamily: Fonts.fontRegular,
      flex: 1,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      marginBottom: 5,
      gap: 8,
      flexWrap: 'wrap',
    },
    filterChip: {
      borderRadius: 18,
      paddingVertical: 9,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      backgroundColor: colors.CARD,
    },
    filterChipActive: {
      backgroundColor: colors.PRIMARY_20,
      borderColor: colors.PRIMARY,
    },
    filterText: {
      fontFamily: Fonts.fontMedium,
      color: colors.TEXT,
      fontSize: 13,
    },
    filterTextActive: {
      color: colors.PRIMARY,
    },
    card: {
      backgroundColor:
        colors.BACKGROUND === '#0D1B2D' ? '#121F38' : '#FFFFFFF2',
      borderRadius: 22,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.BACKGROUND === '#0D1B2D' ? '#1F2E4D' : '#E1E8F5',
      shadowColor: '#000',
      shadowOpacity: colors.BACKGROUND === '#0D1B2D' ? 0.22 : 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
      gap: 10,
      marginBottom: 10,
    },
    statusPill: color => ({
      backgroundColor:
        colors.BACKGROUND === '#0D1B2D' ? '#FFFFFF20' : '#FFFFFF',
      borderColor: color,
      borderWidth: 0.8,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    }),
    statusText: {
      color: colors.TEXT,
      fontSize: 12,
      fontFamily: Fonts.fontMedium,
    },
    imageWrapper: {
      borderRadius: 18,
      overflow: 'hidden',
      width: '100%',
      aspectRatio: 1.35,
      backgroundColor: colors.GRAY_LIGHT,
      marginBottom: 8,
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
    overlayActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    propertyTitle: {
      fontSize: 16,
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
      letterSpacing: 0.2,
    },
    priceBadge: {
      position: 'absolute',
      bottom: 12,
      left: 12,
      backgroundColor: '#00000080',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 14,
    },
    priceBadgeText: {
      color: colors.WHITE,
      fontFamily: Fonts.fontBold,
      fontSize: 14,
      letterSpacing: 0.2,
    },
    priceText: {
      fontSize: 14,
      fontFamily: Fonts.fontBold,
      color: colors.PRIMARY,
      marginTop: 6,
      letterSpacing: 0.2,
    },
    tagRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: 8,
      flexWrap: 'wrap',
    },
    tagPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.BACKGROUND === '#0D1B2D' ? '#0F1C34' : '#EEF3FF',
      borderColor: colors.GRAY_LIGHT,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      gap: 6,
    },
    tagText: {
      color: colors.TEXT,
      fontFamily: Fonts.fontMedium,
      fontSize: 12,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    metaText: {
      marginLeft: 6,
      color: colors.GREY,
      fontFamily: Fonts.fontRegular,
      letterSpacing: 0.1,
    },
    metaLocation: {
      flex: 1,
      maxWidth: '85%',
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
      gap: 10,
    },
    editAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.PRIMARY,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      gap: 6,
      flex: 1,
      shadowColor: colors.PRIMARY,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    editActionText: {
      color: colors.WHITE,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 13,
    },
    shareAction: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.BACKGROUND === '#0D1B2D' ? '#0E192C' : '#F7FAFF',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.PRIMARY,
      gap: 6,
    },
    shareActionText: {
      color: colors.PRIMARY,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 13,
    },
    divider: {
      height: 1,
      backgroundColor: colors.WHITE_50,
      marginVertical: 8,
    },
    removeButton: {
      backgroundColor: '#00000066',
      borderRadius: 999,
      padding: 8,
      borderWidth: 1,
      borderColor: '#FFFFFF40',
    },
    spacer: {
      height: 80,
    },
  });

export default PropertyScreen;
