import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  TestIds,
} from 'react-native-google-mobile-ads';

// 🟢 Daftar Unit ID
const nativeUnitIds = ['ca-app-pub-2729357311903669/1059016556'];

const getRandomAdUnit = () => {
  // return TestIds.NATIVE;
  if (__DEV__) return TestIds.NATIVE;
  const randomIndex = Math.floor(Math.random() * nativeUnitIds.length);
  return nativeUnitIds[randomIndex];
};

export const GlobalNativeAd = ({ style }) => {
  const adUnitId = useMemo(() => getRandomAdUnit(), []);
  const [nativeAd, setNativeAd] = useState(null);
  console.log('nativeAd', nativeAd);

  useEffect(() => {
    const loadAd = async () => {
      try {
        const ad = await NativeAd.createForAdRequest(adUnitId, {
          requestNonPersonalizedAdsOnly: true,
        });
        setNativeAd(ad);
        console.log('✅ Native Ad loaded:', ad.headline);
      } catch (err) {
        console.error('❌ Gagal load Native Ad:', err);
      }
    };
    loadAd();
  }, [adUnitId]);

  if (!nativeAd) return null;

  return (
    <NativeAdView nativeAd={nativeAd} style={[styles.container, style]}>
      {/* Gambar utama */}
      {nativeAd.images?.[0]?.uri && (
        <Image source={{ uri: nativeAd.images[0].uri }} style={styles.image} />
      )}

      <View style={styles.row}>
        {/* Icon */}
        {nativeAd.icon && (
          <Image source={{ uri: nativeAd.icon.uri }} style={styles.icon} />
        )}

        {/* Teks */}
        <View style={styles.textArea}>
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text style={styles.headline}>{nativeAd.headline}</Text>
          </NativeAsset>

          <NativeAsset assetType={NativeAssetType.TAGLINE}>
            <Text style={styles.tagline}>{nativeAd.tagline}</Text>
          </NativeAsset>

          {nativeAd.advertiser && (
            <Text style={styles.advertiser}>{nativeAd.advertiser}</Text>
          )}

          {nativeAd.images?.[0]?.uri && (
            <Image
              source={{ uri: nativeAd.images[0].uri }}
              style={styles.image}
            />
          )}
        </View>
      </View>

      {/* CTA Button */}
      {nativeAd.callToAction && (
        <TouchableOpacity style={styles.ctaButton}>
          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <Text style={styles.ctaText}>{nativeAd.callToAction}</Text>
          </NativeAsset>
        </TouchableOpacity>
      )}
    </NativeAdView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 10,
  },
  textArea: {
    flex: 1,
  },
  headline: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 14,
    color: '#555',
  },
  advertiser: {
    fontSize: 12,
    color: '#888',
  },
  ctaButton: {
    backgroundColor: '#2575fc',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
