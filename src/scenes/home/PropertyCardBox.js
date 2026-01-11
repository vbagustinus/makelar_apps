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
import { Fonts } from '../../constants';
import { Colors } from '../../styles';
import { useNavigation } from '@react-navigation/native';
const PropertyCardBox = ({ item, isPrivate }) => {
  const navigation = useNavigation();

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
          blurRadius={6}
          source={{ uri: item?.imageUrl || item?.imageUrls?.[0] }}
          style={styles.banner}
          resizeMode="cover"
          imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        >
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
          </View>
        </ImageBackground>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 150,
    backgroundColor: Colors.WHITE_20,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    borderColor: Colors.WHITE_50,
    borderWidth: 1,
  },
  banner: {
    width: 150,
    height: 150,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 12,
    backgroundColor: Colors.BLACK_80,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.fontSemiBold,
    color: '#fff',
    marginBottom: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 15,
    fontFamily: Fonts.fontRegular,
  },
});

export default PropertyCardBox;
