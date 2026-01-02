import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Sizes } from '../styles';
import { Fonts } from '../constants';
import { logo } from '../assets/images';

export const EmptyData = ({
  message = 'Tidak ada data tersedia.',
  description = '',
  illustration = logo,
}) => {
  return (
    <View style={styles.container}>
      {illustration && (
        <Image
          source={illustration}
          style={styles.illustration}
          resizeMode="contain"
        />
      )}
      <Text style={styles.message}>{message}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: Sizes.heightScreen / 2,
  },
  illustration: {
    width: 150,
    height: 150,
    marginBottom: 10,
    // tintColor: Colors.PRIMARY,
  },
  message: {
    fontSize: 16,
    color: Colors.PRIMARY,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: Fonts.fontRegular,
  },
  description: {
    fontSize: 14,
    color: Colors.PRIMARY,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    fontFamily: Fonts.fontRegular,
  },
});
