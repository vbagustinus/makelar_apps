import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Gunakan ID Iklan Test saat pengembangan
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-2729357311903669/4230259745';

// const adUnitId = TestIds.INTERSTITIAL;

// Inisialisasi Interstitial Ad
const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true, // Opsional
});

export const useInterstitialAd = (
  onAdClosedCallback: (() => void) | null = null,
) => {
  const [loaded, setLoaded] = useState(false);
  console.log('UNIT INTERSTITIAL ID', adUnitId);
  useEffect(() => {
    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        interstitialAd.load(); // Muat ulang iklan

        // Panggil callback setelah iklan ditutup
        if (onAdClosedCallback) {
          onAdClosedCallback();
        }
      },
    );

    const unsubscribeFailed = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      error => {
        console.error('Ad Error:', error);
      },
    );

    // Muat iklan saat pertama kali di-mount
    interstitialAd.load();

    // Bersihkan listener saat komponen unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeFailed();
    };
  }, [onAdClosedCallback]);

  // Fungsi untuk menampilkan iklan
  const showAd = () => {
    if (loaded) {
      interstitialAd.show();
    } else {
      onAdClosedCallback?.();
    }
  };

  return { showAd };
};
