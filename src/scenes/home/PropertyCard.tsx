import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import { Fonts, propertyStatuses } from '../../constants';
import { Colors } from '../../styles';
import { useNavigation } from '@react-navigation/native';
const PropertyCard = ({ item, isPrivate }) => {
  const navigation = useNavigation<any>();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate(
          isPrivate ? 'DetailPropertyScreen' : 'GlobalDetailPropertyScreen',
          item,
        );
      }}
    >
      <View style={styles.card}>
        <ImageBackground
          source={{ uri: item?.imageUrl || item?.imageUrls?.[0] }}
          style={styles.banner}
          resizeMode="cover"
          imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        >
          <View
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 4,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 10,
                fontFamily: Fonts.fontMedium,
              }}
            >
              {propertyStatuses.find(
                s => s.id === (item?.statusId || item?.status?.id),
              )?.name || 'Status'}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.propertyName || 'Nama Properti'}
          </Text>
          <View style={styles.statItem}>
            <Icon name="currency-usd" size={16} color={Colors.GREEN} />
            <Text style={styles.statText}>
              {item?.price
                ? `Rp ${Number(item.price).toLocaleString('id-ID')}`
                : '-'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="map-marker-outline" size={16} color={Colors.RED} />
            <Text style={styles.statText}>
              {item?.city?.name || item?.city || '-'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: Colors.WHITE_20,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    borderColor: Colors.WHITE_50,
    borderWidth: 1,
    marginBottom: 5,
  },
  banner: {
    height: 110,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.fontSemiBold,
    color: '#fff',
    marginBottom: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    color: '#eee',
    marginLeft: 5,
    fontSize: 11,
    fontFamily: Fonts.fontRegular,
    flex: 1,
  },
});

export default PropertyCard;
