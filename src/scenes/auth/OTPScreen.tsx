import React, { useState } from 'react';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
// import { BaseView, Text, View } from '../../components';
import { OtpInput } from 'react-native-otp-entry';
import { Colors } from '../../styles';
import { Fonts } from '../../constants';
import auth from '@react-native-firebase/auth';

import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { BaseView, Loading, Text, View } from '../../components';
import useAuthStore from '../../store/useAuthStore';
import analytics from '@react-native-firebase/analytics';
import { GlobalBannerAd } from '../ads';

const OtpScreen = ({ route, navigation }) => {
  const fetchUserData = useAuthStore(state => state.fetchUserData);
  const saveUserData = useAuthStore(state => state.saveUserData);
  const setUser = useAuthStore(state => state.setUser);
  const userLoading = useAuthStore(state => state.userLoading);
  const [otp, setOtp] = useState('');
  const { confirmation } = route.params;

  const handleSubmitOtp = async () => {
    try {
      const userCredential = await confirmation.confirm(otp);
      const user = userCredential.user;
      console.log('User signed in:', user);

      const existingUserData = await fetchUserData(user.uid);

      if (!existingUserData) {
        const newUserData = {
          uid: user.uid,
          phoneNumber: user?.phoneNumber,
          displayName: '',
          email: '',
          photoURL: '',
          createdAt: new Date().toISOString(),
        };
        await saveUserData(user.uid, newUserData);
        // setUserProperty('email', user.email);
        // setUserPropertys('email', user.email);
        navigation.goBack();
        await analytics().setUserId(user.uid);
        await analytics().setUserProperty('phone', user.phoneNumber || '');
        return;
      } else {
        setUser(existingUserData);
        navigation.goBack();
        return;
      }
    } catch (error) {
      Alert.alert('OTP Salah', 'Silahkan masukkan nomor OTP yang sesuai!');
    }
  };

  return (
    <BaseView disableToolbar>
      {userLoading && <Loading />}
      <View centering style={styles.container}>
        <Text style={styles.title}>Masukkan Kode OTP</Text>
        <Text style={styles.subtitle}>
          Kami telah mengirimkan kode ke nomor Anda.
        </Text>

        <OtpInput
          numberOfDigits={6}
          focusColor="green"
          autoFocus={false}
          hideStick={true}
          placeholder="******"
          blurOnFilled={true}
          disabled={false}
          type="numeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          onFocus={() => console.log('Focused')}
          onBlur={() => console.log('Blurred')}
          onTextChange={text => console.log(text)}
          textInputProps={{
            accessibilityLabel: 'One-Time Password',
          }}
          textProps={{
            accessibilityRole: 'text',
            accessibilityLabel: 'OTP digit',
            allowFontScaling: false,
          }}
          onFilled={code => {
            setOtp(code);
          }}
          theme={{
            containerStyle: styles.otpContainer,
            pinCodeContainerStyle: styles.otpBox,
            pinCodeTextStyle: styles.otpText,
          }}
        />
        <TouchableOpacity style={styles.googleButton} onPress={handleSubmitOtp}>
          <MaterialDesignIcons
            name={'cellphone'}
            size={50}
            color={Colors.PRIMARY}
          />
          <Text style={styles.googleButtonText}>Verifikasi Kode OTP</Text>
        </TouchableOpacity>
        <View unflex style={{ height: 100 }} />
        <GlobalBannerAd />
      </View>
    </BaseView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.WHITE,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.WHITE,
    textAlign: 'center',
    fontFamily: Fonts.fontRegular,
    marginBottom: 30,
  },
  otpContainer: {
    justifyContent: 'center',
  },
  otpBox: {
    borderRadius: 8,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  otpText: {
    fontSize: 18,
    color: Colors.PRIMARY,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontFamily: Fonts.fontMedium,
    marginLeft: 12,
  },
});
