// LeaderBoardScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BaseView } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../styles';
import { Fonts } from '../../constants';
import FastImage from '@d11/react-native-fast-image';
import { logo } from '../../assets/images';
import Animated, { FadeInUp, ZoomIn, BounceIn } from 'react-native-reanimated';
import useAuthStore from '../../store/useAuthStore';
import { GlobalBannerAd } from '../ads';
import { maskPhoneNumber, maskEmail } from '../../helpers/maskString';

const LeaderBoardScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);
  const fetchTopUsersByPoint = useAuthStore(
    state => state.fetchTopUsersByPoint,
  );
  const listUser = useAuthStore(state => state.listUser);

  const dummyUsers = [
    {
      displayName: 'Alice',
      point: 120,
      photoURL: null,
      email: null,
      phoneNumber: '+6285157212193',
    },
    {
      displayName: 'Bob',
      point: 110,
      photoURL: null,
      phoneNumber: null,
      email: 'vbagustinus@gmail.com',
    },
    {
      displayName: 'Charlie',
      point: 105,
      photoURL: null,
      email: null,
      phoneNumber: '+6285157212193',
    },
    {
      displayName: 'David',
      point: 90,
      photoURL: null,
      phoneNumber: null,
      email: 'vbagustinus@gmail.com',
    },
    {
      displayName: 'Eve',
      point: 85,
      photoURL: null,
      email: null,
      phoneNumber: '+6285157212193',
    },
    {
      displayName: 'Frank',
      point: 80,
      photoURL: null,
      email: null,
      phoneNumber: '+6285157212193',
    },
    {
      displayName: 'Grace',
      point: 75,
      photoURL: null,
      phoneNumber: null,
      email: 'vbagustinus@gmail.com',
    },
    {
      displayName: 'Heidi',
      point: 70,
      photoURL: null,
      email: null,
      phoneNumber: '+6285157212193',
    },
    {
      displayName: 'Ivan',
      point: 65,
      photoURL: null,
      phoneNumber: null,
      email: 'vbagustinus@gmail.com',
    },
    {
      displayName: 'Judy',
      point: 60,
      photoURL: null,
      phoneNumber: null,
      email: 'vbagustinus@gmail.com',
    },
  ];

  const topThree = listUser.slice(0, 3);
  const others = listUser.slice(3);

  useEffect(() => {
    initialData();
  }, []);

  const initialData = () => {
    fetchTopUsersByPoint(10);
  };

  const renderTop = (item, index) => {
    let borderColor = '#E5E7EB';
    let rankIcon = null;
    if (index === 0) borderColor = '#FACC15'; // emas
    if (index === 1) borderColor = '#60A5FA'; // biru
    if (index === 2) borderColor = '#F87171'; // merah
    if (index === 0) rankIcon = '👑';
    if (index === 1) rankIcon = '🥈';
    if (index === 2) rankIcon = '🥉';

    const isWinner = index === 0;

    return (
      <View style={styles.topItemContainer} key={index}>
        <ImageBackground
          source={item?.photoURL ? { uri: item?.photoURL } : logo}
          style={[
            styles.topImageWrapper,
            { borderColor },
            isWinner && {
              width: 110,
              height: 110,
              borderRadius: 55,
              marginTop: 0,
            },
            index !== 0 && { marginTop: 30 }, // juara 1 lebih besar
          ]}
        >
          <Text style={styles.rank}>{rankIcon}</Text>
        </ImageBackground>
        <Text style={styles.topName}>{item?.displayName}</Text>
        {item?.phoneNumber && (
          <Text style={styles.listUsername}>
            {maskPhoneNumber(item?.phoneNumber)}
          </Text>
        )}
        {item?.email && (
          <Text style={styles.listUsername}>{maskEmail(item?.email)}</Text>
        )}
        <Text style={styles.topPoints}>{item?.point} Poin</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      style={styles.listItemContainer}
    >
      <Text style={styles.listRank}>{index + 4}</Text>
      <FastImage
        source={item?.photoURL ? { uri: item?.photoURL } : logo}
        style={styles.listAvatar}
        resizeMode='cover'
      />
      <View style={styles.listInfo}>
        <Text style={styles.listName}>{item?.displayName}</Text>
        {item?.phoneNumber && (
          <Text style={styles.listUsername}>
            {maskPhoneNumber(item?.phoneNumber)}
          </Text>
        )}
        {item?.email && (
          <Text style={styles.listUsername}>{maskEmail(item?.email)}</Text>
        )}
      </View>
      <Text style={styles.listPoints}>{item?.point} Poin</Text>
    </Animated.View>
  );

  const renderTopThree = topThree => {
    const order = [1, 0, 2]; // 2 kiri, 1 tengah, 3 kanan
    return (
      <View style={styles.topWrapper}>
        {order.map(i => {
          const item = topThree[i];
          if (!item) return null;
          return renderTop(item, i);
        })}
      </View>
    );
  };

  return (
    <BaseView
      onBackPress={navigation.pop}
      title='Papan Skor'
      style={[styles.container, { paddingTop: insets.top }]}
      bottomComponent={
        <View
          style={{
            // position: 'absolute',
            // left: 30,
            // top: 0,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            paddingHorizontal: 20,
            flexDirection: 'row',
            backgroundColor: Colors.PRIMARY,
          }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: Fonts.fontRegular,
            }}
          >
            Poinmu
          </Text>
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: Fonts.fontSemiBold,
              fontSize: 40,
            }}
          >
            {user?.point || '0'}
          </Text>
        </View>
      }
      floatingComponent={
        <View style={[styles.bannerBottom]}>
          <GlobalBannerAd />
        </View>
      }
    >
      <StatusBar
        barStyle='light-content'
        backgroundColor={Colors.PRIMARY}
        translucent
      />
      {/* Bagian Top 3 */}
      <View style={styles.topWrapper}>{renderTopThree(topThree)}</View>

      {/* List Ranking */}
      <View style={styles.listWrapper}>
        <FlatList
          onRefresh={initialData}
          refreshing={false}
          data={others}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
        />
      </View>
    </BaseView>
  );
};

export default LeaderBoardScreen;

// 🎨 Styles spesifik
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  gradientBackground: {
    flex: 1,
  },
  topWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  topItemContainer: {
    alignItems: 'center',
  },
  topImageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: Colors.BLACK_50,
    marginTop: 20,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  topImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  topName: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: Fonts.fontSemiBold,
    color: '#fff',
  },
  topPoints: {
    fontSize: 12,
    color: '#E5E7EB',
    fontFamily: Fonts.fontSemiBold,
  },
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.WHITE_20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.WHITE_50,
  },
  listRank: {
    fontSize: 14,
    fontFamily: Fonts.fontSemiBold,
    width: 30,
    color: Colors.WHITE,
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 14,
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
  },
  listUsername: {
    fontSize: 12,
    color: Colors.WHITE,
    fontFamily: Fonts.fontRegular,
  },
  listPoints: {
    fontSize: 14,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.WHITE,
  },
  rank: {
    fontSize: 35,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.WHITE,
  },
  bannerBottom: {
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
    paddingBottom: 20,
  },
});
