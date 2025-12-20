import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {
  BaseView,
  GlobalBottomSheet,
  Loading,
  Text,
  View,
} from '../../components';
import { logo } from '../../assets/images';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Colors, Sizes } from '../../styles';
import { Fonts } from '../../constants';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { authorize } from 'react-native-app-auth';
import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import useAuthStore from '../../store/useAuthStore';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useNavigation } from '@react-navigation/native';
import { GlobalBannerAd } from '../ads';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const AuthScreen = () => {
  const navigation = useNavigation();
  const fetchUserData = useAuthStore(state => state.fetchUserData);
  const saveUserData = useAuthStore(state => state.saveUserData);
  const setUser = useAuthStore(state => state.setUser);
  const userLoading = useAuthStore(state => state.userLoading);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+62');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(email !== '');
  const [isPasswordValid, setIsPasswordValid] = useState(email !== '');
  const [showPassword, setShowPassword] = useState(false);
  const bottomSheetNoHPRef = useRef(null);

  const openNoHPBottomSheet = () => {
    bottomSheetNoHPRef.current?.present();
  };

  const closeNoHPBottomSheet = () => {
    bottomSheetNoHPRef.current?.dismiss();
  };

  const isNotEmptyFields = () => {
    return email !== '' || password !== '';
  };

  const isButtonRegisterValid = () => {
    return (
      email.length > 3 && password.length > 3 && isEmailValid && isPasswordValid
    );
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Only validate when input has more than 4 characters
    if (email?.length > 3) {
      setIsEmailValid(emailRegex.test(email));
    } else {
      setIsEmailValid(true); // Assume valid until long enough
    }

    if (password?.length > 3) {
      setIsPasswordValid(password.length >= 8);
    } else {
      setIsPasswordValid(true); // Assume valid to avoid early red error
    }
  }, [email, password]);
  const config = {
    issuer: 'https://accounts.google.com',
    clientId:
      '548706959315-5uvfbefvt8u2m13aqfo9l93hp3e5nk2g.apps.googleusercontent.com',
    redirectUrl:
      'com.googleusercontent.apps.548706959315-5uvfbefvt8u2m13aqfo9l93hp3e5nk2g:/oauth2redirect/google',
    scopes: ['openid', 'profile', 'email'],
    AdditionalHeaders: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0Cobalt/Version',
    },
  };

  const signInWithGoogle = async () => {
    try {
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
        return;
      } else {
        setUser(existingUserData);
        return;
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handlePhoneChange = text => {
    setPhoneNumber(text);
    setIsPhoneValid(phoneNumber.length > 6 && isValidPhoneNumber(text));
  };

  const handleSendOtp = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert(
        'Invalid number',
        'Please enter a valid international format number. Example: +628123456789',
      );
      return;
    }
    try {
      setLoading(true);
      Alert.alert('OTP sent to', phoneNumber);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('OTP sent successfully');
      closeNoHPBottomSheet();
      setLoading(false);
      navigation.navigate('OTPScreen', { confirmation });
    } catch (error) {
      console.log('Error sending OTP:', error);
      setLoading(false);
      Alert.alert('Failed to send OTP', 'The number might be incorrect.');
    }
  };

  const smartAuth = async () => {
    setLoading(true);
    try {
      // Try to sign in first
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      const existingUserData = await fetchUserData(user.uid);

      if (!existingUserData) {
        const newUserData = {
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
        };
        await saveUserData(user.uid, newUserData);
        analytics().setUserProperty('email', user.email);
        setUser(newUserData);
      } else {
        setUser(existingUserData);
      }
    } catch (error) {
      console.log('Auth error 1:', error);

      // Add invalid credential check
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-credential'
      ) {
        try {
          const userCredential = await auth().createUserWithEmailAndPassword(
            email,
            password,
          );
          const user = userCredential.user;

          const newUserData = {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email || '',
            phoneNumber: '',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
          };

          await saveUserData(user.uid, newUserData);
          analytics().setUserProperty('email', user.email);
          setUser(newUserData);
        } catch (signUpError) {
          console.error('Registration failed:', signUpError.message);
          Alert.alert('Registration Failed', signUpError.message);
        }
      } else {
        console.error('Login failed:', error.message);
        Alert.alert('Login Failed', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseView
      disableToolbar
      isScrollable
      containerStyle={{
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: 180 * Sizes.ratioWidthScreen,
      }}
    >
      <View centering style={styles.container}>
        {(userLoading || loading) && <Loading />}
        <Image source={logo} style={styles.image} />
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Please sign in / register</Text>
        <View
          style={{
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={[
              styles.googleButtonBox,
              isNotEmptyFields() && {
                opacity: 0.9,
                backgroundColor: Colors.GRAY_MEDIUM,
              },
            ]}
            onPress={signInWithGoogle}
            disabled={isNotEmptyFields()}
          >
            <MaterialDesignIcons
              name={'google'}
              size={35}
              color={Colors.PRIMARY}
            />
            <Text style={styles.googleButtonText}> Login with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
      <GlobalBannerAd />
      <GlobalBottomSheet
        title='Sign in with phone number'
        ref={bottomSheetNoHPRef}
        onClose={closeNoHPBottomSheet}
      >
        <Text
          style={[
            styles.subtitle,
            { marginTop: 10, color: Colors.BLACK_FONT, textAlign: 'left' },
          ]}
        >
          Use an active phone number to receive an OTP code. Please use the
          correct format starting with{' '}
          <Text style={{ color: Colors.WARNING, fontFamily: Fonts.fontBold }}>
            +62 XXXX
          </Text>
        </Text>
        <BottomSheetTextInput
          style={[styles.input, !isPhoneValid && { borderColor: Colors.RED }]}
          placeholder='Example: +628123456789'
          placeholderTextColor={Colors.GRAY_BLACK}
          keyboardType='phone-pad'
          value={phoneNumber}
          onChangeText={handlePhoneChange}
        />

        {!isPhoneValid && (
          <Text style={styles.errorText}>Invalid phone number</Text>
        )}

        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={[
              styles.googleButton,
              !isPhoneValid && {
                opacity: 0.9,
                backgroundColor: Colors.GRAY_MEDIUM,
              },
            ]}
            onPress={handleSendOtp}
            disabled={!isPhoneValid}
          >
            <MaterialDesignIcons
              name={'cellphone'}
              size={30}
              color={Colors.PRIMARY}
            />
            <Text style={styles.googleButtonText}>Send OTP</Text>
          </TouchableOpacity>
        </View>
      </GlobalBottomSheet>
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
    fontSize: 16,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.WHITE,
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.WHITE,
    textAlign: 'center',
    fontFamily: Fonts.fontRegular,
  },
  errorText: {
    color: Colors.WARNING,
    marginTop: 8,
    fontSize: 14,
    fontFamily: Fonts.fontRegular,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    color: Colors.BLACK_FONT,
    fontFamily: Fonts.fontRegular,
    minWidth: '50%',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '70%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    width: Sizes.widthScreen - 80,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 20,
  },
  googleButtonText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontFamily: Fonts.fontMedium,
    marginLeft: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    width: '85%',
    flex: 0,
    marginTop: 15,
  },
});
