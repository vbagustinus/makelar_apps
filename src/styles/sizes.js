import { Dimensions, StyleSheet } from 'react-native';
import { scaleSize } from './mixins';

const { width, height } = Dimensions.get('window');

export default {
  widthScreen: width,
  heightScreen: height,
  ratioWidthScreen: (width / 385).toFixed(2),
  ratioHeightScreen: (height / 680).toFixed(2),
  borderWidth: StyleSheet.hairlineWidth,
  SIZE_50: scaleSize(50),
  SIZE_45: scaleSize(45),
  SIZE_40: scaleSize(40),
  SIZE_35: scaleSize(35),
  SIZE_30: scaleSize(30),
  SIZE_25: scaleSize(25),
  SIZE_20: scaleSize(20),
  SIZE_15: scaleSize(15),
  SIZE_10: scaleSize(10),
  SIZE_5: scaleSize(5),
  SIZE_4: scaleSize(4),
  SIZE_3: scaleSize(3),
  CUSTOM_SIZE: num => scaleSize(num),
};
