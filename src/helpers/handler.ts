import { BackHandler } from 'react-native';

/**
 * Attaches an event listener for Android hardware back button.
 * Returns a subscription object that can be removed later.
 */
export const handleAndroidBackButton = (callback, index = 0) => {
  const handler = () => {
    if (index > 0) {
      callback();
      return true;
    } else {
      BackHandler.exitApp();
      return true;
    }
  };

  const subscription = BackHandler.addEventListener(
    'hardwareBackPress',
    handler,
  );
  return subscription; // Penting untuk menyimpan ini agar bisa di-remove
};

/**
 * Removes the event listener using the subscription's remove() method.
 */
export const removeAndroidBackButtonHandler = subscription => {
  if (subscription && typeof subscription.remove === 'function') {
    subscription.remove();
  }
};

/**
 * Attaches an event listener that always exits the app on back press.
 * Returns subscription so bisa dilepas.
 */
export const exitAndroidBackButtonHandler = () => {
  const handler = () => {
    BackHandler.exitApp();
    return true;
  };

  const subscription = BackHandler.addEventListener(
    'hardwareBackPress',
    handler,
  );
  return subscription;
};

export const multipleTapHandler = (func, wait = 1000) => {
  let isLocked = false;
  let handler;

  return function () {
    if (!isLocked) {
      isLocked = true;
      func && func();
    }

    clearTimeout(handler);
    handler = setTimeout(() => {
      isLocked = false;
    }, wait);
  };
};
