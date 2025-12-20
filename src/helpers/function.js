import { Linking } from 'react-native';

export const emptyFunction = () => {};

export const sendEmail = (to, subject = '', body = '') => {
  const email = `mailto:${to}?subject=${subject}&body=${body}`;
  Linking.canOpenURL(email).then(supported => {
    supported && Linking.openURL(email);
  });
};

export const sendEmailTo = to => {
  const email = `mailto:${to}`;
  Linking.canOpenURL(email).then(supported => {
    supported && Linking.openURL(email);
  });
};

export const openLinkUrl = link => {
  Linking.canOpenURL(link).then(supported => {
    supported && Linking.openURL(link);
  });
};
