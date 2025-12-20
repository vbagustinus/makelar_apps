import DeviceInfo from 'react-native-device-info';

export const isVersionHigher = version => {
  if (!version) {
    return false;
  }
  const splitRemoteVersion = version.toString().split('.');
  const remotePatch = splitRemoteVersion.pop();
  const remoteMinor = splitRemoteVersion.pop();
  const remoteMajor = splitRemoteVersion.pop();
  const deviceVersion = DeviceInfo.getVersion().split('(')[0];
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
