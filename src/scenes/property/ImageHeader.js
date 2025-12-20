import { View, Text, StyleSheet } from 'react-native'; // Adding StyleSheet import
import FastImage from '@d11/react-native-fast-image';
import { Colors } from '../../styles'; // Removing unused FontSize and Sizes
import { Fonts } from '../../constants';

const HEADER_CAPTURE_HEIGHT = 100;

export const ImageHeader = ({ logoSource, title, subtitle, qrValue }) => {
  return (
    <View style={styles.captureHeaderContainer}>
      {/* Left Section: Logo and Text */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0 }}>
        <FastImage source={logoSource} style={styles.captureHeaderLogo} />
        <View style={styles.captureHeaderTextContainer}>
          <Text style={styles.captureHeaderTitle}>{title}</Text>
          <Text style={styles.captureHeaderSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {/* Right Section: Legend and QR Code */}
      <View style={{ alignContent: 'center', flex: 0, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <View style={styles.legendColorBoxRed} />
          <Text style={styles.description}>Male Parent</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.legendColorBoxPink} />
          <Text style={styles.description}>Female Parent</Text>
        </View>
      </View>
    </View>
  );
};

// Styles only used by the ImageHeader component
const styles = StyleSheet.create({
  captureHeaderContainer: {
    width: '100%',
    padding: 15,
    paddingBottom: 0, // Corrected 'paddinBottom' to 'paddingBottom'
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative', // Required for absolute positioning of children
    minHeight: HEADER_CAPTURE_HEIGHT, // Ensure sufficient height
  },
  captureHeaderLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 15,
    borderRadius: 30,
  },
  captureHeaderTextContainer: {
    justifyContent: 'center',
  },
  captureHeaderTitle: {
    fontFamily: Fonts.fontSemiBold,
    color: Colors.WHITE,
    fontSize: 18,
    marginBottom: 2,
  },
  captureHeaderSubtitle: {
    fontFamily: Fonts.fontRegular,
    color: '#E0E0E0',
    fontSize: 14,
  },
  description: {
    color: Colors.WHITE,
    fontSize: 12,
    fontFamily: Fonts.fontRegular,
  },
  legendColorBoxRed: {
    height: 10,
    width: 20,
    backgroundColor: Colors.RED,
    marginRight: 8,
  },
  legendColorBoxPink: {
    height: 10,
    width: 20,
    backgroundColor: Colors.PINK,
    marginRight: 8,
  },
});
