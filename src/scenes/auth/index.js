import React, { useState } from 'react';
import {
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  BaseView,
  Loading,
  Text,
  View,
} from '../../components';
import { logo } from '../../assets/images';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Colors, Sizes } from '../../styles';
import { Fonts } from '../../constants';
import { authorize } from 'react-native-app-auth';
import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import useAuthStore from '../../store/useAuthStore';
import { GlobalBannerAd } from '../ads';

const AuthScreen = () => {
  const fetchUserData = useAuthStore(state => state.fetchUserData);
  const saveUserData = useAuthStore(state => state.saveUserData);
  const setUser = useAuthStore(state => state.setUser);
  const userLoading = useAuthStore(state => state.userLoading);
  const [loading, setLoading] = useState(false);

  // const config = {
  //   issuer: 'https://accounts.google.com',
  //   clientId:
  //     '87496731262-flf5fk25of39fnfiiuvmc4e1ui2qvhai.apps.googleusercontent.com',
  //   redirectUrl:
  //     'com.googleusercontent.apps.87496731262-flf5fk25of39fnfiiuvmc4e1ui2qvhai://oauth2redirect/google',
  //   scopes: ['openid', 'profile', 'email'],
  //   AdditionalHeaders: {
  //     'User-Agent':
  //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0Cobalt/Version',
  //   },
  //   usePKCE: true,
  //   serviceConfiguration: {
  //     authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  //     tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
  //   },
  // };
  const config = {
    issuer: 'https://accounts.google.com',

    // ANDROID CLIENT ID (package + SHA matching google-services.json)
    clientId:
      '87496731262-flf5fk25of39fnfiiuvmc4e1ui2qvhai.apps.googleusercontent.com',

    // REDIRECT URI (must match manifest intent-filter)
    redirectUrl:
      'com.googleusercontent.apps.87496731262-flf5fk25of39fnfiiuvmc4e1ui2qvhai:/oauth2redirect/google',

    scopes: ['openid', 'profile', 'email'],
    usePKCE: true,
  };


  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await authorize(config);

      if (!result.idToken) {
        throw new Error('Google Sign-In failed: No ID token received.');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(
        result.idToken,
      );
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      const user = userCredential.user?._user;
      const profile = userCredential?.additionalUserInfo?.profile;
      const existingUserData = await fetchUserData(user.uid);

      if (!existingUserData) {
        const newUserData = {
          uid: user?.uid,
          displayName: user?.displayName || '',
          email: profile.email || '',
          photoURL: user?.photoURL || '',
          createdAt: new Date().toISOString(),
        };
        await saveUserData(user.uid, newUserData);
        analytics().setUserProperty('email', profile.email);
      } else {
        setUser(existingUserData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <BaseView
      disableToolbar
      isScrollable
      isWhiteToolbar
      containerStyle={{
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: 180 * Sizes.ratioWidthScreen,
      }}
    >
      <View centering style={styles.container}>
        {(userLoading || loading) && <Loading />}
        <Image source={logo} style={styles.image} />
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>Silahkan masuk dengan Google</Text>
        
        {/* Google Login Button */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}
        >
          <TouchableOpacity
            style={styles.googleButtonBox}
            onPress={signInWithGoogle}
            disabled={loading}
          >
            <MaterialDesignIcons
              name={'google'}
              size={28}
              color={Colors.PRIMARY}
            />
            <Text style={styles.googleButtonText}>Login dengan Google</Text>
          </TouchableOpacity>
        </View>
      </View>
      <GlobalBannerAd />
    </BaseView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
    resizeMode: 'contain',
    borderRadius: 110,
    marginTop: -100,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.TEXT,
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.TEXT,
    textAlign: 'center',
    fontFamily: Fonts.fontRegular,
    marginBottom: 20,
  },
  googleButtonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    width: Sizes.widthScreen - 80,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  googleButtonText: {
    fontSize: 15,
    color: Colors.PRIMARY,
    fontFamily: Fonts.fontMedium,
    marginLeft: 10,
  },
});
