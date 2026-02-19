import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Fonts } from './constants';

const UpdateScreen = ({ status, progress }) => {
  const strokeWidth = 8;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progressStroke = circumference - progress * circumference;

  return (
    <View style={styles.container}>
      {/* Lingkaran Progres */}
      <View style={styles.circleContainer}>
        <Svg height={120} width={120}>
          {/* Background Circle */}
          <Circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#d3d3d3"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <Circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#4CAF50"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progressStroke}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>

      {/* Teks Status */}
      <Text style={styles.statusText}>
        {status === 'UPDATING'
          ? 'Pembaruan Sedang Berjalan...'
          : 'Memeriksa Pembaruan...'}
      </Text>

      {/* Loading Spinner */}
      {progress === 0 && (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    position: 'absolute',
    color: '#4CAF50',
    fontSize: 18,
    fontFamily: Fonts.fontSemiBold,
  },
  statusText: {
    color: 'white',
    fontSize: 18,
    fontFamily: Fonts.fontSemiBold,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default UpdateScreen;
