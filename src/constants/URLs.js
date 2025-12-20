import { NativeModules, Platform } from 'react-native';

const URL_STORE = {
  ios: 'itms-apps://apps.apple.com/id/app/investree-for-lender/id1288527633',
  android: 'market://details?id=id.investree',
};

export default {
  get MAIN_URL() {
    return NativeModules.SecureKeys && NativeModules.SecureKeys.urlMain;
  },
  get BASE_URL() {
    let linkVersion =
      NativeModules.SecureKeys && NativeModules.SecureKeys.urlBase;
    return {
      v2: linkVersion + 'v2/',
      v3: linkVersion + 'v3/',
    };
  },
  get SBN_URL() {
    return NativeModules.SecureKeys && NativeModules.SecureKeys.urlSBN;
  },
  get STORE_URL() {
    return URL_STORE[Platform.OS] || '';
  },
  get URL_UPDATE_REKSADANA_PROFILE() {
    return (
      NativeModules.SecureKeys &&
      NativeModules.SecureKeys.urlReksadanaUpdateProfile
    );
  },
  get RDL_INFO() {
    return (
      NativeModules.SecureKeys &&
      NativeModules.SecureKeys.urlMain + 'rekening-dana-lender'
    );
  },
  get CAPTCHA_URL() {
    return NativeModules.SecureKeys && NativeModules.SecureKeys.urlCaptcha;
  },
  get BE_URL() {
    let domain03 = NativeModules.SecureKeys && NativeModules.SecureKeys.urlBE03;
    let domain05 = NativeModules.SecureKeys && NativeModules.SecureKeys.urlBE05;
    return {
      domain03,
      domain05,
    };
  },
};
