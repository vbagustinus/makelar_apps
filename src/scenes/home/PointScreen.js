import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { Colors, Sizes } from '../../styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '../../constants';
import { BaseView } from '../../components';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import useAuthStore from '../../store/useAuthStore';

// const adUnitId = __DEV__
//   ? TestIds.REWARDED
//   : 'ca-app-pub-2729357311903669/6116778489';
const adUnitId = 'ca-app-pub-2729357311903669/6116778489';
const TOTAL_ADS = 5;

export default function PointScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const user = useAuthStore(state => state.user);
  const { updateUserPoint } = useAuthStore();

  const [watchedAds, setWatchedAds] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // 🔥 RewardedAd instance
  const [rewardedAd] = useState(() =>
    RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    }),
  );

  useEffect(() => {
    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
        console.log('Rewarded Ad loaded ✅');
      },
    );

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async reward => {
        console.log('Reward earned:', reward);
        await updateUserPoint(user.uid, reward.amount);
        await setEarnedPoints(reward.amount);
        await setSuccessModal(true);
        await setWatchedAds(prev => prev + 1);
      },
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(
      AdEventType.CLOSED, // 🔥 pakai AdEventType di sini
      () => {
        setLoaded(false);
        rewardedAd.load();
      },
    );

    rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, [rewardedAd]);

  const handleWatchAd = () => {
    if (loaded) {
      rewardedAd.show();
    } else {
      Alert.alert('Iklan belum siap', 'Coba sebentar lagi.');
      rewardedAd.load();
    }
  };

  const renderItem = ({ item, index }) => {
    const done = index < watchedAds;
    return (
      <TouchableOpacity
        style={[styles.item, done && styles.done]}
        disabled={done}
        onPress={handleWatchAd}
      >
        {done ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialDesignIcons
              name='check-circle'
              size={40}
              color={Colors.WHITE}
            />
            <Text style={styles.text}>Iklan {index + 1} sudah ditonton</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialDesignIcons
              name='play-circle'
              size={40}
              color={Colors.WHITE}
            />
            <Text style={styles.text}>Tonton Iklan {index + 1}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <BaseView
      onBackPress={navigation.pop}
      title='Tambah Poin'
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <StatusBar
        barStyle='light-content'
        backgroundColor={Colors.PRIMARY}
        translucent
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={{
            alignItems: 'center',
            marginVertical: 20,
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.fontSemiBold,
              color: Colors.WHITE,
              fontSize: 20,
            }}
          >
            POIN
          </Text>
          <Text
            style={{
              fontFamily: Fonts.fontBold,
              color: Colors.WHITE,
              fontSize: 60,
              marginTop: 20,
            }}
          >
            {user?.point || 0}
          </Text>
        </View>
        <Text style={styles.title}>Tonton iklan untuk dapat poin</Text>

        <FlatList
          data={Array(TOTAL_ADS).fill(null)}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
        />

        {/* <Text style={styles.progress}>
          Progress: {watchedAds}/{TOTAL_ADS}
        </Text> */}
      </ScrollView>

      {/* Modal sukses */}
      <Modal
        visible={successModal}
        transparent
        animationType='fade'
        onRequestClose={() => setSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={require('../../assets/images/successfully-done.json')}
              autoPlay
              loop={false}
              onAnimationFinish={() => {
                setTimeout(() => setSuccessModal(false), 500);
              }}
              style={{ width: 250, height: 250, marginTop: -20 }}
            />
            <Text style={styles.modalText}>
              🎉 Kamu berhasil mendapatkan {earnedPoints} poin!
            </Text>
          </View>
        </View>
      </Modal>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 18,
    fontFamily: Fonts.fontSemiBold,
    marginBottom: 16,
    color: '#fff',
    paddingTop: 20,
    textAlign: 'center',
  },
  item: {
    padding: 16,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.WHITE_20,
  },
  done: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.fontRegular,
    marginLeft: 10,
  },
  progress: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: Fonts.fontRegular,
    color: '#fff',
  },
  content: {
    padding: 20 * Sizes.ratioWidthScreen,
    paddingTop: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.PRIMARY,
    padding: 0,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    marginTop: -60,
    fontSize: 14,
    color: Colors.WHITE,
    fontFamily: Fonts.fontRegular,
    textAlign: 'center',
    padding: 20,
  },
});
