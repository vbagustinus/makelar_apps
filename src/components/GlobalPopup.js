// GlobalPopup.js
import React from 'react';
import { View, Text, Modal, Button } from 'react-native';
import { usePopupStore } from '../store/usePopupStore';

export default function GlobalPopup() {
  const { popup, hidePopup } = usePopupStore();

  return (
    <Modal visible={!!popup} transparent animationType='fade'>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '80%',
          }}
        >
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            {popup?.message}
          </Text>
          <Button title='Tutup' onPress={hidePopup} />
        </View>
      </View>
    </Modal>
  );
}
