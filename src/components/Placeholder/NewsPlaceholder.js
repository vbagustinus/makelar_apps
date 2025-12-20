import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  Placeholder,
  Shine,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';

export const NewsPlaceholder = () => {
  const placeholderCount = 4; // Jumlah placeholder yang diinginkan

  return (
    <FlatList
      data={[1, 2, 3, 4]} // Membuat array kosong dengan panjang placeholderCount
      keyExtractor={(item, index) => index.toString()} // Menggunakan index sebagai key
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={() => (
        <View
          style={{
            width: 150,
            borderRadius: 8,
            overflow: 'hidden',
            marginRight: 10,
            marginTop: 20,
            backgroundColor: '#ffffff30',
          }}
        >
          <Placeholder Animation={Shine}>
            <PlaceholderMedia style={{ width: '100%', height: 100 }} />
            <View style={{ padding: 5 }}>
              <PlaceholderLine width={20} height={10} />
              <PlaceholderLine width={60} height={10} />
            </View>
          </Placeholder>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({});
