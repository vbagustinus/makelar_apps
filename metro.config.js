const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

// 1. Ambil konfigurasi default
const defaultConfig = getDefaultConfig(__dirname);

// Ambil resolver default
const { assetExts, sourceExts } = defaultConfig.resolver;

// 2. Custom config: TAMBAHKAN SVG TRANSFORMER
const customConfig = {
  transformer: {
    babelTransformerPath: require.resolve(
      'react-native-svg-transformer'
    ),
  },
  resolver: {
    // SVG dikeluarkan dari asset
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    // SVG dianggap source code
    sourceExts: [...sourceExts, 'svg'],
  },
};

// 3. Gabungkan default dan custom config
const combinedConfig = mergeConfig(defaultConfig, customConfig);

// 4. Wrap dengan Reanimated (WAJIB PALING AKHIR)
module.exports = wrapWithReanimatedMetroConfig(combinedConfig);
