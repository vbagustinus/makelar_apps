import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { Fonts, propertyStatuses } from '../../constants';
import { useThemeColors } from '../../styles';
import { useNavigation } from '@react-navigation/native';
import FastImage from '@d11/react-native-fast-image';

const PropertyGlobalCard = ({ item }) => {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const imageUrl = item?.imageUrl || item?.imageUrls?.[0];
  const priceDisplay = item?.price
    ? `Rp ${Number(item.price).toLocaleString('id-ID')}`
    : '-';
  const locationDisplay =
    item?.village?.name ||
    item?.district?.name ||
    item?.city?.name ||
    item?.city ||
    '-';

  const statusInfo = useMemo(() => {
    return (
      propertyStatuses.find(
        s => s.id === (item?.statusId || item?.status?.id),
      ) || null
    );
  }, [item?.statusId, item?.status?.id]);

  console.log('item', item);
  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        navigation.navigate('GlobalDetailPropertyScreen', item);
      }}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <FastImage
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialCommunityIcons
              name="image-off-outline"
              size={30}
              color={colors.GREY}
            />
          </View>
        )}
        <View
          style={[
            styles.statusBadge,
            statusInfo?.color ? { backgroundColor: statusInfo.color } : {},
          ]}
        >
          <Text style={styles.statusText}>
            {statusInfo?.name || item?.status || 'Status'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item?.propertyName || 'Nama Properti'}
        </Text>

        <Text style={styles.price}>{priceDisplay}</Text>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={14}
            color={colors.GREY}
            style={{ marginRight: 4, marginTop: 1 }}
          />
          <Text style={styles.location} numberOfLines={1}>
            {locationDisplay}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = colors =>
  StyleSheet.create({
    card: {
      flex: 1,
      margin: 6,
      backgroundColor: colors.CARD,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      overflow: 'hidden',
    },
    imageContainer: {
      height: 140, // Slightly taller for premium look
      width: '100%',
      backgroundColor: colors.BACKGROUND,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholderImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusText: {
      color: 'white',
      fontSize: 10,
      fontFamily: Fonts.fontMedium,
    },
    content: {
      padding: 10,
    },
    title: {
      fontSize: 13,
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
      marginBottom: 4,
      minHeight: 36, // Ensure alignment for 2 line logic
      lineHeight: 18,
    },
    price: {
      fontSize: 14,
      fontFamily: Fonts.fontBold,
      color: colors.PRIMARY || '#007BFF',
      marginBottom: 6,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    location: {
      fontSize: 11,
      fontFamily: Fonts.fontRegular,
      color: colors.GREY,
      flex: 1,
    },
  });

export default PropertyGlobalCard;
