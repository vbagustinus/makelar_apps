// src/ads/useGlobalRewardedAd.js
import { useState, useEffect, useRef } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';

// const adUnitId = TestIds.REWARDED;
const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-2729357311903669/7460000260';

// 🔥 Fungsi callback yang akan dipanggil setelah reward didapatkan
let rewardCallback = () => {};

let failureCallback = () => {};

// 🔥 Instance Rewarded Ad (dibuat di luar hook agar bersifat singleton/global)
const rewardedAdInstance = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const useGlobalRewardedAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [reward, setReward] = useState(null);

  useEffect(() => {
    const unsubscribeLoaded = rewardedAdInstance.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
        console.log('Global Rewarded Ad loaded ✅');
      },
    );

    const unsubscribeEarned = rewardedAdInstance.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      r => {
        setReward(r);
        console.log('Reward earned:', r);
        // Panggil callback yang didefinisikan di komponen
        if (rewardCallback) {
          rewardCallback(r);
        }
      },
    );

    const unsubscribeClosed = rewardedAdInstance.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        rewardedAdInstance.load(); // Muat ulang setelah ditutup
      },
    );

    const unsubscribeError = rewardedAdInstance.addAdEventListener(
      AdEventType.ERROR,
      e => {
        setLoaded(false);
        console.error('Global Rewarded Ad FAILED:', e);

        // 🔥 Panggil callback kegagalan yang disediakan
        if (failureCallback) {
          failureCallback();
        }
      },
    );

    // Muat iklan saat aplikasi pertama kali berjalan
    if (!rewardedAdInstance.loaded) {
      rewardedAdInstance.load();
    }

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const showRewardedAd = (callbackOnReward, callbackOnFailure) => {
    if (loaded) {
      // ... (Set rewardCallback)
      rewardCallback = callbackOnReward;
      failureCallback = callbackOnFailure; // 🔥 SET FAILURE CALLBACK
      rewardedAdInstance.show();
      return true;
    }
    return false;
  };

  return { isAdLoaded: loaded, showRewardedAd, rewardedAdInstance };
};
