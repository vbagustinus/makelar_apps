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

const PigeonCardBox = ({ item, isPrivate }) => {
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
          blurRadius={6}
          source={{ uri: item?.imageUrl }}
          style={styles.banner}
          resizeMode="cover"
          imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        >
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.name}
            </Text>
            <View style={styles.statItem}>
              <Icon name="gender-male-female" size={18} color={Colors.PINK} />
              <Text style={styles.statText}>{gender?.name}</Text>
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
    fontSize: 15,
    fontFamily: Fonts.fontRegular,
  },
});

export default PigeonCardBox;
