import { useEffect, useState } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Pakai TestIds saat development
const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-2729357311903669/7460000260';

// Inisialisasi RewardedAd
const rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const useRewardedAd = (onRewardEarned, onAdClosed) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('Reward earned:', reward);
        if (onRewardEarned) {
          onRewardEarned(reward); // Panggil callback reward
        }
      },
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        rewardedAd.load(); // Auto reload setelah ditutup
        if (onAdClosed) {
          onAdClosed();
        }
      },
    );

    // Load pertama kali
    rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, [onRewardEarned, onAdClosed]);

  const showAd = () => {
    if (loaded) {
      rewardedAd.show();
    } else {
      console.log('Rewarded ad not loaded yet');
      if (onAdClosed) {
        onAdClosed();
      }
    }
  };

  return { showAd, loaded };
};
