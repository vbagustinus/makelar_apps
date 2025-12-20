import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

// 🟢 Ganti ini dengan daftar unit ID kamu
const bannerUnitIds = [
  'ca-app-pub-2729357311903669/1483966464', // Banner 1
  'ca-app-pub-2729357311903669/9729998435', // Banner 2
  'ca-app-pub-2729357311903669/3504443385', // Banner 3
];

// Gunakan test ID di mode development
const getRandomAdUnit = () => {
  if (__DEV__) {
    return TestIds.BANNER;
  }
  // Ambil acak dari daftar
  const randomIndex = Math.floor(Math.random() * bannerUnitIds.length);
  return bannerUnitIds[randomIndex];
};

export const GlobalBannerAd = ({
  size = BannerAdSize.FULL_BANNER,
  style,
  ...props
}) => {
  // Gunakan useMemo biar tidak berubah tiap render
  const adUnitId = useMemo(() => getRandomAdUnit(), []);

  console.log('🔸 Banner unit yang tampil:', adUnitId);

  return (
    <BannerAd
      unitId={adUnitId}
      size={size}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      {...props}
      style={[styles.adStyle, style]}
    />
  );
};

const styles = StyleSheet.create({
  adStyle: {
    marginVertical: 10,
  },
});
