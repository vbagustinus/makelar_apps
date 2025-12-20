import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Modal from 'react-native-modal'; // ini versi 3rd party, bukan bawaan RN
import { useGlobalModal } from '../store/useModalStore';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../styles';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';

const GlobalModal = () => {
  const { visible, content, hideModal } = useGlobalModal();

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={hideModal}
      animationIn='fadeIn'
      animationOut='fadeOut'
      backdropOpacity={0.5}
      useNativeDriver
    >
      <LinearGradient
        colors={Colors.GRADIENT_ROYAL}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.modal}
      >
        {content}
        <Pressable onPress={hideModal} style={styles.button}>
          <MaterialIcons name='close-circle' size={30} color={Colors.WHITE} />
        </Pressable>
      </LinearGradient>
    </Modal>
  );
};

export default GlobalModal;

const styles = StyleSheet.create({
  modal: {
    borderRadius: 12,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.PRIMARY_20,
    padding: 5,
    borderRadius: 12,
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
