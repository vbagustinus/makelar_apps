import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '../styles';
import { Fonts } from '../constants';

const Loading = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 1000,
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          borderRadius: 40,
          backgroundColor: Colors.WHITE,
        }}
      >
        <LottieView
          source={require('../assets/images/loading.json')}
          style={{ width: 200, height: 200 }}
          autoPlay
          loop
        />
        {/* <ActivityIndicator size="large" color={Colors.PURPLE} /> */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              marginTop: -10,
              marginBottom: 10,
              fontSize: 16,
              color: Colors.PRIMARY,
              fontFamily: Fonts.fontRegular,
            }}
          >
            Tunggu sebentar...
          </Text>
        </View>
      </View>
    </View>
  );
};

export { Loading };
