import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import Logo from '../../assets/images/logos/logo.svg';
import FastImage from '@d11/react-native-fast-image';

const MapPickerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // default region
  const [region, setRegion] = useState({
    latitude: route.params?.lat ?? -6.2,
    longitude: route.params?.lng ?? 106.816666,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const handleSave = () => {
    // kirim kembali ke screen sebelumnya
    route.params?.onSelectLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });

    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={reg => setRegion(reg)}
      />

      {/* Pin */}
      <View style={styles.pinContainer}>
        <Logo width={40} height={40} />
      </View>

      {/* Tombol pilih */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.btnText}>Pilih Lokasi Ini</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapPickerScreen;
