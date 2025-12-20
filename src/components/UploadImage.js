import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Fonts } from '../constants';
import { Colors, Sizes } from '../styles';

export const UploadImage = ({
  initialUri,
  onImagePicked,
  title = 'Upload photo',
  description = '',
  disabled = false,
  disabledTakePhoto = false,
}) => {
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (initialUri) {
      setImageUri(initialUri);
    }
  }, [initialUri]);

  const handleUploadPreview = () => {
    if (imageUri || disabledTakePhoto) {
      global.showImagePreview([{ url: imageUri }]);
    } else {
      Alert.alert(
        'Choose Source',
        'Would you like to take a photo or choose from the gallery?',
        [
          { text: 'Camera', onPress: openCamera },
          { text: 'Gallery', onPress: openGallery },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true },
      );
    }
  };

  const handleUpload = () => {
    Alert.alert(
      'Choose Source',
      'Would you like to take a photo or choose from the gallery?',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const openCamera = () => {
    ImagePicker.launchCamera(
      { mediaType: 'photo', quality: 0.5, includeBase64: true },
      handleResponse,
    );
  };

  const openGallery = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 0.5, includeBase64: true },
      handleResponse,
    );
  };

  const handleResponse = response => {
    if (response.didCancel || response.errorCode) {
      if (response.errorCode) {
        Alert.alert(
          'Error',
          response.errorMessage || 'Failed to access media.',
        );
      }
      return;
    }

    const asset = response.assets?.[0];
    if (asset?.uri && asset?.base64) {
      setImageUri(asset.uri);
      onImagePicked?.({
        uri: asset.uri,
        base64: `data:image/jpeg;base64,${asset.base64}`,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={disabled}
        style={styles.uploadBox}
        onPress={handleUploadPreview}
        activeOpacity={0.8}
      >
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            {!disabled && !disabledTakePhoto && (
              <TouchableOpacity style={styles.editBadge} onPress={handleUpload}>
                <Text style={styles.editText}>🖊️ Change</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <Ionicons
              name='cloud-upload'
              size={40}
              color='#ccc'
              style={styles.icon}
            />
            <Text style={styles.placeholderText}>{title}</Text>
            <Text style={styles.placeholderTextDescription}>{description}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.fontRegular,
    marginBottom: 8,
    color: Colors.BLACK_FONT,
  },
  image: {
    flex: 1,
    width: '100%',
    height: 160,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 12,
    borderWidth: Sizes.borderWidth,
  },
  placeholder: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderText: {
    color: '#888',
    fontFamily: Fonts.fontRegular,
    fontSize: 14,
  },
  placeholderTextDescription: {
    color: '#888',
    fontFamily: Fonts.fontRegular,
    fontSize: 12,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontFamily: Fonts.fontRegular,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    height: 160,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: '#bbb',
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: Fonts.fontRegular,
  },
});
