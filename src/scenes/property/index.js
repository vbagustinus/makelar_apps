import * as React from 'react';
import { Text, BaseView, EmptyData, AddButton } from '../../components';
import { Image, Pressable, StyleSheet, TextInput, View, Animated, Share, Alert } from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { FlashList } from '@shopify/flash-list';
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);
import { Fonts, propertyStatuses } from '../../constants';
import { Colors } from '../../styles';
import { useNavigation } from '@react-navigation/native';
import { LoadingPigeons } from './LoadingPigeons';
import { GlobalBannerAd } from '../ads';
import { logo } from '../../assets/images';
import usePropertyStore from '../../store/usePropertyStore';
import useAuthStore from '../../store/useAuthStore';

const HEADER_MAX_HEIGHT = 180;

const statusPillStyle = color => ({
  backgroundColor: '#FFFFFF90',
  borderColor: color,
  borderWidth: 0.6,
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 12,
});

function PropertyScreen() {
  const navigation = useNavigation();
  const fetchProperties = usePropertyStore(state => state.fetchProperties);
  const listProperty = usePropertyStore(state => state.listProperty);
  const listPropertyLoading = usePropertyStore(state => state.listPropertyLoading);
  const globalLoading = usePropertyStore(state => state.globalLoading);
  const listPropertyError = usePropertyStore(state => state.listPropertyError);
  const fetchPropertyCounts = usePropertyStore(state => state.fetchPropertyCounts);
  const totalProperties = usePropertyStore(state => state.totalProperties);
  const totalForSale = usePropertyStore(state => state.totalForSale);
  const totalForRent = usePropertyStore(state => state.totalForRent);
  const user = useAuthStore(state => state.user);
  const deletePropertyData = usePropertyStore(state => state.deletePropertyData);
  const deletePropertySuccess = usePropertyStore(state => state.deletePropertySuccess);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all'); // all | sale | rent

  const getStatusMeta = statusId => {
    const found = propertyStatuses.find(s => s.id === statusId);
    return {
      label: found?.name || 'Status?',
      color: found?.color || Colors.GRAY_MEDIUM,
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
    if (filterStatus === 'sale') return filteredProperties.filter(p => p.statusId === 1);
    if (filterStatus === 'rent') return filteredProperties.filter(p => p.statusId === 2);
    return filteredProperties;
  }, [filteredProperties, filterStatus]);
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
        property?.price ? `Harga: Rp ${Number(property.price).toLocaleString('id-ID')}` : '',
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
    const targetRoute = isOwner ? 'DetailPropertyScreen' : 'GlobalDetailPropertyScreen';
    navigation.navigate(targetRoute, property);
  };

  const handleDelete = property => {
    Alert.alert(
      'Hapus Properti',
      `Anda yakin ingin menghapus "${property?.propertyName || 'Properti'}"? Tindakan ini tidak dapat dibatalkan.`,
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

  const renderItem = ({ item }) => {
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
      <Pressable
        onPress={() => handleOpenDetail(item)}
        style={styles.card}
      >
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.propertyImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons
                name='image-off-outline'
                size={28}
                color={Colors.GRAY_DARK}
              />
            </View>
          )}
          <View style={styles.overlayRow}>
            <View style={statusPillStyle(statusMeta.color)}>
              <Text style={styles.statusText}>{statusMeta.label}</Text>
            </View>
            {isOwner && (
              <View style={styles.overlayActions}>
                <Pressable style={styles.removeButton} onPress={() => handleDelete(item)}>
                  <MaterialCommunityIcons
                    name='trash-can-outline'
                    size={18}
                    color={Colors.TEXT}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.propertyTitle} numberOfLines={2}>
          {item?.propertyName || 'Properti'}
        </Text>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons
            name='map-marker-outline'
            size={16}
            color={Colors.GRAY_DARK}
          />
          <Text
            style={[styles.metaText, styles.metaLocation]}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {locationLabel}
          </Text>
        </View>
        <View style={styles.tagRow}>
          <View style={styles.tagPill}>
            <MaterialCommunityIcons
              name='home-outline'
              size={14}
              color={Colors.PRIMARY}
            />
            <Text style={styles.tagText} numberOfLines={1}>
              {item?.propertyTypeName || '-'}
            </Text>
          </View>
          <View style={styles.tagPill}>
            <MaterialCommunityIcons
              name='map-marker-path'
              size={14}
              color={Colors.PRIMARY}
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
            <Pressable style={styles.editAction} onPress={() => handleEdit(item)}>
              <MaterialCommunityIcons name='pencil-outline' size={16} color={Colors.WHITE} />
              <Text style={styles.editActionText}>Edit</Text>
            </Pressable>
          )}
          <Pressable style={styles.shareAction} onPress={() => handleShare(item)}>
            <MaterialCommunityIcons name='share-variant' size={16} color={Colors.PRIMARY} />
            <Text style={styles.shareActionText}>Share</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const renderHeader = () => {
    const headerHeight = scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, 0],
      extrapolate: 'clamp',
    });

    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT],
      outputRange: [0, -HEADER_MAX_HEIGHT / 2],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <Animated.View style={{ transform: [{ translateY: headerTranslate }] }}>
          <View unflex style={styles.hero}>
            <View style={styles.heroText}>
              <Text style={styles.pageTitle}>Properti Kamu</Text>
              <Text style={styles.pageSubtitle}>
                Kelola aset dan listing dengan tampilan yang rapi dan nyaman.
              </Text>
              <View style={styles.statRow}>
                <View style={styles.statPill}>
                  <MaterialCommunityIcons name='home-group' size={16} color={Colors.PRIMARY} />
                  <Text style={styles.statText}>Total {totalProperties || 0}</Text>
                </View>
                <View style={styles.statPill}>
                  <MaterialCommunityIcons name='tag-outline' size={16} color={Colors.PRIMARY} />
                  <Text style={styles.statText}>Dijual {totalForSale || 0}</Text>
                </View>
                <View style={styles.statPill}>
                  <MaterialCommunityIcons name='handshake-outline' size={16} color={Colors.PRIMARY} />
                  <Text style={styles.statText}>Disewa {totalForRent || 0}</Text>
                </View>
              </View>
            </View>
            <View style={styles.heroAction}>
              <AddButton onPress={handleAdd} />
            </View>
          </View>

          <View style={styles.topBar}>
            <TextInput
              style={styles.searchInput}
              placeholder='Cari properti...'
              placeholderTextColor={Colors.GRAY_DARK}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filterRow}>
            <Pressable
              style={[styles.filterChip, filterStatus === 'all' && styles.filterChipActive]}
              onPress={() => setFilterStatus('all')}
            >
              <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>
                Semua
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterChip, filterStatus === 'sale' && styles.filterChipActive]}
              onPress={() => setFilterStatus('sale')}
            >
              <Text style={[styles.filterText, filterStatus === 'sale' && styles.filterTextActive]}>
                Dijual
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterChip, filterStatus === 'rent' && styles.filterChipActive]}
              onPress={() => setFilterStatus('rent')}
            >
              <Text style={[styles.filterText, filterStatus === 'rent' && styles.filterTextActive]}>
                Disewakan
              </Text>
            </Pressable>
          </View>

          <View unflex style={{ marginLeft: -0 }}>
            <GlobalBannerAd />
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {listPropertyLoading && <LoadingPigeons />}
      {!listPropertyLoading && (
        <AnimatedFlashList
          style={{ flex: 1, backgroundColor: Colors.BACKGROUND }}
          onRefresh={fetchProperties}
          refreshing={listPropertyLoading}
          data={statusFiltered}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          estimatedItemSize={220}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <EmptyData
              message='Tidak ada properti ditemukan.'
              description='Silakan tambahkan properti terlebih dahulu.'
              illustration={logo}
            />
          }
          ListHeaderComponent={renderHeader}
          ListHeaderComponentStyle={styles.listHeader}
          onEndReached={null}
          onEndReachedThreshold={0}
          ListFooterComponent={<View style={styles.spacer} />}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    paddingHorizontal: 0,
  },
  listContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.BACKGROUND,
  },
  listHeader: {
    backgroundColor: Colors.BACKGROUND,
    paddingBottom: 8,
  },
  headerContainer: {
    overflow: 'hidden',
    backgroundColor: Colors.BACKGROUND,
  },
  hero: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: Colors.CARD,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
    marginHorizontal: 10,
    marginTop: 8,
    gap: 10,
  },
  heroText: {
    flex: 1,
    paddingRight: 12,
    paddingTop: 26,
  },
  heroAction: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 0,
  },
  pageTitle: {
    fontSize: 17,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.TEXT,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.fontRegular,
    color: Colors.GRAY_DARK,
    lineHeight: 17,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
    flexWrap: 'wrap',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFFE6',
    borderColor: Colors.WHITE_50,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  statText: {
    color: Colors.TEXT,
    fontFamily: Fonts.fontMedium,
    fontSize: 11,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFFE6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 6,
    marginRight: 10,
    color: Colors.TEXT,
    fontSize: 16,
    fontFamily: Fonts.fontRegular,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
    backgroundColor: '#FFFFFFE6',
  },
  filterChipActive: {
    backgroundColor: Colors.PRIMARY_20,
    borderColor: Colors.PRIMARY,
  },
  filterText: {
    fontFamily: Fonts.fontMedium,
    color: Colors.TEXT,
    fontSize: 13,
  },
  filterTextActive: {
    color: Colors.PRIMARY,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: Colors.CARD,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
    flex: 1,
    marginHorizontal: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusText: {
    color: Colors.TEXT,
    fontSize: 12,
    fontFamily: Fonts.fontMedium,
  },
  typeText: {
    color: Colors.GRAY_DARK,
    fontSize: 13,
    fontFamily: Fonts.fontMedium,
    marginBottom: 6,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 1.15,
    backgroundColor: Colors.WHITE,
    marginBottom: 12,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  propertyTitle: {
    fontSize: 17,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.TEXT,
    letterSpacing: 0.2,
  },
  priceText: {
    fontSize: 14,
    fontFamily: Fonts.fontBold,
    color: Colors.PRIMARY,
    marginTop: 8,
    letterSpacing: 0.2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
    flexWrap: 'wrap',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GRAY_LIGHT,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    marginLeft: 6,
    color: Colors.TEXT,
    fontFamily: Fonts.fontMedium,
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  editAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  editActionText: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 12,
  },
  shareAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    gap: 6,
  },
  shareActionText: {
    color: Colors.PRIMARY,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 12,
  },
  metaText: {
    marginLeft: 6,
    color: Colors.GRAY_DARK,
    fontFamily: Fonts.fontRegular,
    letterSpacing: 0.1,
  },
  metaLocation: {
    flex: 1,
    maxWidth: '85%',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.WHITE_50,
    marginVertical: 8,
  },
  removeButton: {
    backgroundColor: '#FFFFFFD0',
    borderRadius: 999,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFFE6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  ratingText: {
    color: Colors.TEXT,
    fontFamily: Fonts.fontMedium,
  },
  spacer: {
    height: 60,
  },
});

export default PropertyScreen;
