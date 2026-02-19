import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors, Sizes } from '../styles';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from '../constants';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

export const FloatingButton = ({ onPress }) => {
  return (
    <View style={styles.fab}>
      <TouchableOpacity onPress={onPress}>
        <Ionicons name="add" size={30} color={Colors.WHITE} />
      </TouchableOpacity>
    </View>
  );
};

export const AddButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.add}>
      <MaterialDesignIcons name="home-plus" size={25} color={Colors.WHITE} />
      <Text style={styles.addText}>Tambah</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 90 * Sizes.ratioHeightScreen, // Jarak dari bawah layar
    right: 16, // Jarak dari sisi kanan layar
    width: 56, // Ukuran FAB
    height: 56,
    borderRadius: 28, // Membuat FAB berbentuk lingkaran
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  add: {
    width: 100, // Ukuran FAB
    height: 40,
    borderRadius: 10, // Membuat FAB berbentuk lingkaran
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    borderColor: Colors.WHITE,
    borderWidth: 1,
  },
  addText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontFamily: Fonts.fontRegular,
    marginLeft: 5,
  },
});
