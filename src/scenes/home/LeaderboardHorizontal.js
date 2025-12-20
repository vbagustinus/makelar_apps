import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import { Fonts } from '../../constants';
import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';
import { Colors } from '../../styles';
import { logo } from '../../assets/images';

const LeaderboardHorizontal = ({ users = [] }) => {
  const renderItem = ({ item, index }) => {
    let rankIcon = null;
    if (index === 0) rankIcon = '👑'; // Juara 1
    if (index === 1) rankIcon = '🥈'; // Juara 2
    if (index === 2) rankIcon = '🥉'; // Juara 3

    return (
      <View style={styles.card}>
        <ImageBackground
          blurRadius={10}
          source={item?.photoURL ? { uri: item?.photoURL } : logo}
          style={styles.avatar}
        >
          <Text style={styles.rank}>{rankIcon ? rankIcon : index + 1}</Text>
        </ImageBackground>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={styles.name} numberOfLines={1}>
            {item.displayName}
          </Text>
          <Text style={styles.point}>{item.point} poin</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={users}
      keyExtractor={(item, idx) => idx.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

export default LeaderboardHorizontal;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  card: {
    width: 200,
    alignItems: 'center',
    marginRight: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.WHITE_20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  rank: {
    fontSize: 25,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.WHITE,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 6,
    // backgroundColor: '#ccc',
    borderColor: Colors.WHITE_50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  name: {
    fontSize: 14,
    fontFamily: Fonts.fontRegular,
    textAlign: 'center',
    color: Colors.WHITE,
  },
  point: {
    fontSize: 11,
    marginTop: 10,
    color: Colors.WHITE_80,
    fontFamily: Fonts.fontRegular,
  },
  titleLeaderboard: {
    color: '#fff',
    fontSize: 18,
    fontFamily: Fonts.fontRegular,
    marginBottom: 5,
  },
});
