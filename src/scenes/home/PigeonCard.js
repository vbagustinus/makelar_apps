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
import {
  birdColors,
  eyeColorOptions,
  Fonts,
  genderOptions,
} from '../../constants';
import { Colors } from '../../styles';
import { useNavigation } from '@react-navigation/native';

const PigeonCard = ({ item, isPrivate }) => {
  const navigation = useNavigation();
  const gender = genderOptions.find(g => g.id === item.genderId);
  const color = birdColors.find(c => c.id === item.colorId);
  const eye = eyeColorOptions.find(e => e.id === item.eyeColorId);

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
          source={{ uri: item?.imageUrl }}
          style={styles.banner}
          resizeMode='cover'
          imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        >
          {/* Bisa ditambah overlay jika mau */}
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.name}
          </Text>
          <View style={styles.statItem}>
            <Icon name='gender-male-female' size={18} color={Colors.PINK} />
            <Text style={styles.statText}>{gender?.name}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name='eye-outline' size={18} color={Colors.YELLOW} />
            <Text style={styles.statText}>{color?.name}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name='palette-outline' size={18} color={Colors.PURPLE} />
            <Text style={styles.statText}>{eye?.name}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: Colors.WHITE_20,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    borderColor: Colors.WHITE_50,
    borderWidth: 1,
  },
  banner: {
    height: 100,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.fontSemiBold,
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.WHITE_80,
    fontFamily: Fonts.fontRegular,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
    fontFamily: Fonts.fontRegular,
  },
});

export default PigeonCard;
