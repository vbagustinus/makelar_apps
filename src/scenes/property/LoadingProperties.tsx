import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Progressive,
  ShineOverlay,
} from 'rn-placeholder';
import { Colors, Sizes } from '../../styles';

export const LoadingProperties = () => {
  const renderShimmerItem = () => (
    <Placeholder Animation={Progressive} style={styles.placeholderContainer}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <PlaceholderMedia style={styles.imagePlaceholder} />
        <View style={styles.textContainer}>
          <PlaceholderLine width={60} style={styles.titlePlaceholder} />
          <PlaceholderLine width={40} />
          <PlaceholderLine width={50} />
          <PlaceholderLine width={70} />
        </View>
      </View>
    </Placeholder>
  );

  return (
    <FlatList
      data={[1, 2, 3, 4, 5]} // Placeholder data
      keyExtractor={(item, index) => `shimmer-${index}`}
      renderItem={renderShimmerItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export const LoadingPropertiesGlobal = () => {
  const renderShimmerItem = () => (
    <Placeholder Animation={Progressive} style={styles.placeholderContainer}>
      <View
        style={{
          paddingTop: 20,
          marginLeft: 15,
        }}
      >
        <PlaceholderLine width={40} />
        <PlaceholderLine width={80} />
        <PlaceholderMedia style={styles.imagePlaceholderGLobal} />
        <View
          style={{
            marginTop: 20,
          }}
        >
          <PlaceholderLine width={60} style={styles.titlePlaceholder} />
          <PlaceholderLine width={40} />
          <PlaceholderLine width={70} />
        </View>
      </View>
    </Placeholder>
  );

  return (
    <FlatList
      data={[1, 2, 3, 4, 5, 6, 7]} // Placeholder data
      keyExtractor={(item, index) => `shimmer-${index}`}
      renderItem={renderShimmerItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    paddingTop: 80,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE_20,
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
  },
  imagePlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: Colors.WHITE_20,
  },
  imagePlaceholderGLobal: {
    width: Sizes.widthScreen - 60,
    height: 350,
    borderRadius: 8,
    backgroundColor: Colors.WHITE_20,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  titlePlaceholder: {
    marginBottom: 8,
  },
});
