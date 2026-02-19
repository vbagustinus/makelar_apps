import {
  NativeModules,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Values } from '../constants';

export const emailValidation = text => {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^-<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
  return reg.test(text);
};

export const phoneValidation = num =>
  (num && num.length >= 9 && num.length <= 12) || num === '';

export const numberValidation = text => {
  const reg = /^\d+$/;
  return reg.test(text);
};

export const nameValidation = text => text && text.length >= 3;

export const removeNonCharacter = text => text.replace(/[^a-zA-Z .',‘’]/g, '');

export const passwordValidation = password => {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,20}$/;
  return reg.test(password);
};

export const referralValidation = referral => {
  return referral && referral.length >= 3;
};

export const passportValidation = passport => {
  const reg = /^[a-zA-Z]\d{8}$/;
  return reg.test(passport);
};

export const isWNI = id => id === (Values as any).wni;

export const isIOS = () => Platform.OS === 'ios';

export const isAndroid = () => Platform.OS === 'android';

export const isIPhoneXSize = dim => dim.height == 812 || dim.width == 812;

export const isIPhoneXrSize = dim => dim.height == 896 || dim.width == 896;

export function getTouchableComponent(useNativeFeedback) {
  if (useNativeFeedback === true && isAndroid() === true) {
    return TouchableNativeFeedback;
  }
  return TouchableOpacity;
}

export const isProduction =
  NativeModules.BuildConfig &&
  NativeModules.BuildConfig.FLAVOR === Values.production;

export const isRemoteConfigHigher = remoteConfigVersion => {
  if (!remoteConfigVersion) {
    return false;
  }
  const splitRemoteVersion = remoteConfigVersion.toString().split('.');
  const remotePatch = splitRemoteVersion.pop();
  const remoteMinor = splitRemoteVersion.pop();
  const remoteMajor = splitRemoteVersion.pop();
  const deviceVersion = DeviceInfo.getVersion().toString().split('(')[0];
  const splitDeviceVersion = deviceVersion.split('.');
  const devicePatch = splitDeviceVersion.pop();
  const deviceMinor = splitDeviceVersion.pop();
  const deviceMajor = splitDeviceVersion.pop();
  const isMajorHigher = +deviceMajor < +remoteMajor;
  const isMinorHigher = +deviceMinor < +remoteMinor;
  const isPatchHigher =
    +devicePatch < +remotePatch &&
    +deviceMinor <= +remoteMinor &&
    +deviceMajor <= +remoteMajor;
  return isMajorHigher || isMinorHigher || isPatchHigher;
};
