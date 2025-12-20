import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { Colors, Sizes } from '../styles';
import { Fonts } from '../constants';
import ZoomableImageModal from './GlobalImagePreview';
import FastImage from '@d11/react-native-fast-image';

export const Upload = ({ onUpload, initialImage = null }) => {
  console.log('initialImage', initialImage);

  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [imageVisible, setImageVisible] = useState(false);
  console.log('selectedImage', selectedImage);

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
    }
  }, [initialImage]);

  const handleUpload = async () => {
    try {
      const options = {
        mediaType: 'photo', // Photos only
        includeBase64: false,
        maxWidth: 1000, // Maximum image width
        maxHeight: 1000, // Maximum image height
        quality: 0.8, // Compression quality (0.1 - 1.0)
      };

      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage);
        return;
      }

      const { assets } = result;
      if (assets && assets.length > 0) {
        const image = assets[0];
        setSelectedImage(image.uri);

        // Trigger callback with selected image data
        if (onUpload) {
          onUpload(image);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const handleUploadPreview = () => {
    global.showImagePreview([{ url: selectedImage }]);
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={handleUploadPreview}
          activeOpacity={0.8}
        >
          <FastImage
            source={{ uri: selectedImage }}
            style={styles.imagePreview}
          />
          <TouchableOpacity style={styles.editBadge} onPress={handleUpload}>
            <Text style={styles.editText}>🖊️ Change</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.placeholderContainer}
          onPress={handleUpload}
        >
          <Ionicons
            name='cloud-upload-outline'
            size={40}
            color='#fff'
            style={styles.icon}
          />
          <Text style={styles.title}>Upload your pigeon photo</Text>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Upload</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff30',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.fontRegular,
    color: '#fff',
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.PRIMARY_50,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.fontRegular,
  },
  image: {
    width: Sizes.widthScreen - 130,
    height: Sizes.widthScreen - 130,
    borderRadius: 20,
    marginBottom: 16,
  },
  placeholderText: {
    color: '#888',
    fontFamily: Fonts.fontRegular,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.Primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontFamily: Fonts.fontRegular,
  },
  label: {
    fontFamily: Fonts.fontRegular,
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
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
  placeholderText: {
    color: '#666',
    fontSize: 14,
    fontFamily: Fonts.fontRegular,
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
    paddingVertical: 5,
    borderRadius: 8,
  },
  editText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: Fonts.fontSemiBold,
  },
});
