import React, { useMemo } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import FastImage from '@d11/react-native-fast-image';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BaseView, Text, View } from '../../components';
import { useThemeColors } from '../../styles';
import { Fonts } from '../../constants';
import useFavoriteStore from '../../store/useFavoriteStore';
import useAuthStore from '../../store/useAuthStore';
import { logo } from '../../assets/images';

const FavoritesScreen = () => {
  const navigation = useNavigation<any>();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const favorites = useFavoriteStore(state => state.favorites);
  const favoritesLoading = useFavoriteStore(state => state.favoritesLoading);
  const loadFavorites = useFavoriteStore(state => state.loadFavorites);
  const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);
  const user = useAuthStore(state => state.user);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.uid) {
        loadFavorites();
      }
    }, [user?.uid, loadFavorites]),
  );

  const withCurrency = price => {
    if (price === 0) return 'Rp 0';
    if (!price) return 'Rp -';
    const numeric = Number(String(price).replace(/[^0-9]/g, ''));
    if (Number.isNaN(numeric)) return `Rp ${price}`;
    return `Rp ${numeric.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const handleOpen = item => {
    const isOwner = item?.uid && user?.uid && item.uid === user.uid;
    const targetRoute = isOwner
      ? 'DetailPropertyScreen'
      : 'GlobalDetailPropertyScreen';
    navigation.navigate(targetRoute, item);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { borderColor: colors.GRAY_LIGHT }]}
      activeOpacity={0.9}
      onPress={() => handleOpen(item)}
    >
      <View style={styles.cardImageWrapper}>
        <FastImage
          source={item.imageUrl ? { uri: item.imageUrl } : logo}
          style={styles.cardImage}
        />
        <TouchableOpacity
          style={styles.cardHeart}
          onPress={() => toggleFavorite(item)}
          activeOpacity={0.9}
        >
          <MaterialDesignIcons name="heart" size={18} color={colors.ALERT} />
        </TouchableOpacity>
      </View>
      <Text
        style={[styles.cardTitle, { color: colors.TEXT }]}
        numberOfLines={2}
      >
        {item.propertyName}
      </Text>
      <View style={styles.cardInfoRow}>
        <MaterialDesignIcons
          name="map-marker-outline"
          size={14}
          color={colors.GREY}
        />
        <Text style={[styles.cardLocation, { color: colors.GREY }]}>
          {item.address || 'Lokasi belum diisi'}
        </Text>
      </View>
      <Text style={[styles.cardPrice, { color: colors.PRIMARY }]}>
        {withCurrency(item.price)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BaseView
      title="Favorit"
      onBackPress={navigation.goBack}
      containerStyle={{ flex: 1, backgroundColor: colors.BACKGROUND }}
    >
      {!user?.uid ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <MaterialDesignIcons
              name="heart-outline"
              size={26}
              color={colors.PRIMARY}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.TEXT }]}>
            Login diperlukan
          </Text>
          <Text style={[styles.emptyCaption, { color: colors.GREY }]}>
            Masuk untuk melihat daftar favorit kamu.
          </Text>
        </View>
      ) : favoritesLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="small" color={colors.PRIMARY} />
          <Text style={[styles.loadingText, { color: colors.GREY }]}>
            Memuat favorit...
          </Text>
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <MaterialDesignIcons
              name="heart-outline"
              size={26}
              color={colors.PRIMARY}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.TEXT }]}>
            Belum ada favorit
          </Text>
          <Text style={[styles.emptyCaption, { color: colors.GREY }]}>
            Simpan properti favorit agar mudah ditemukan kembali.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </BaseView>
  );
};

const createStyles = colors =>
  StyleSheet.create({
    listContent: {
      padding: 16,
      gap: 12,
    },
    card: {
      backgroundColor: colors.CARD,
      borderRadius: 16,
      borderWidth: 1,
      overflow: 'hidden',
      paddingBottom: 12,
    },
    cardImageWrapper: {
      height: 180,
      position: 'relative',
      overflow: 'hidden',
    },
    cardImage: {
      width: '100%',
      height: '100%',
    },
    cardHeart: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#00000040',
    },
    cardTitle: {
      fontFamily: Fonts.fontSemiBold,
      fontSize: 15,
      marginTop: 10,
      paddingHorizontal: 12,
    },
    cardInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      marginTop: 4,
    },
    cardLocation: {
      fontSize: 12,
      fontFamily: Fonts.fontRegular,
      flex: 1,
    },
    cardPrice: {
      fontFamily: Fonts.fontBold,
      paddingHorizontal: 12,
      marginTop: 6,
      fontSize: 14,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    emptyIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.HAZE,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    emptyTitle: {
      fontFamily: Fonts.fontSemiBold,
      fontSize: 18,
      marginBottom: 6,
      textAlign: 'center',
    },
    emptyCaption: {
      fontFamily: Fonts.fontRegular,
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 18,
    },
    loadingState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    loadingText: {
      fontFamily: Fonts.fontRegular,
      fontSize: 13,
    },
  });

export default FavoritesScreen;
