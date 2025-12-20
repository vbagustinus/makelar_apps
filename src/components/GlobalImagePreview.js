import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '../styles';
import { logopigeon } from '../assets/images';

const GlobalImagePreview = () => {
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    global.showImagePreview = imageList => {
      setImages(imageList);
      setVisible(true);
    };

    global.hideImagePreview = () => {
      setVisible(false);
      setImages([]);
    };

    return () => {
      global.showImagePreview = undefined;
      global.hideImagePreview = undefined;
    };
  }, []);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType='fade'>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={styles.closeButton}
        >
          <Ionicons name='close-circle' size={40} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>
      <ImageViewer
        imageUrls={images}
        enableSwipeDown
        onSwipeDown={() => setVisible(false)}
        failImageSource={logopigeon}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default GlobalImagePreview;
