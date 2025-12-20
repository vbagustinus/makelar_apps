import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Pastikan sudah menginstal react-native-linear-gradient
import { Colors } from '../styles';
import { Fonts } from '../constants';

export const Popup = ({ visible, onCancel, onConfirm, title, message }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={Colors.GRADIENT_ROYAL}
        style={styles.popupContainer}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 1 }}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.okButton} onPress={onConfirm}>
            <Text style={styles.okText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  popupContainer: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.WHITE,
    marginBottom: 10,
  },
  message: {
    fontSize: 12,
    fontFamily: Fonts.fontRegular,
    color: Colors.WHITE_80,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.RED_50,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.fontSemiBold,
  },
  okButton: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.SECONDARY,
    alignItems: 'center',
  },
  okText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.fontSemiBold,
  },
});

export default Popup;
