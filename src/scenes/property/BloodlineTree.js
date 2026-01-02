import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import PigeonCard from './PigeonCard';
import { Colors, Sizes } from '../../styles';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { femaleColors, Fonts, maleColors } from '../../constants';
import FastImage from '@d11/react-native-fast-image';
import { logotransparent } from '../../assets/images';
import {
  Canvas,
  Group,
  Image,
  Line as SkiaLine,
  useImage,
} from '@shopify/react-native-skia';

const LineComponent = ({ x1, y1, x2, y2, colors, nested = 0 }) => {
  const width = Math.abs(x2 - x1) || 2;
  const height = Math.abs(y2 - y1) || 2;

  const left = Math.min(x1, x2);
  const top = Math.min(y1, y2);

  const strokeColor = colors?.[nested] || Colors.PRIMARY;

  return (
    <View
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        zIndex: -1,
      }}
      pointerEvents="none"
    >
      <Canvas style={{ width, height }}>
        <SkiaLine
          p1={{ x: x1 - left, y: y1 - top }}
          p2={{ x: x2 - left, y: y2 - top }}
          color={strokeColor}
          strokeWidth={2}
        />
      </Canvas>
    </View>
  );
};

// Halaman utama
const BloodlineTreeScreen = ({ birds, maxNested, mainId }) => {
  const logo = useImage(
    require('../../assets/images/logos/logo-transparent.png'),
  );
  // console.log('maxNested', maxNested);
  let widthCustom = 1; // Default width multiplier
  switch (maxNested) {
    case 1:
      widthCustom = 1;
      break;
    case 2:
      widthCustom = 1.5;
      break;
    case 3:
      widthCustom = 2;
      break;
    case 4:
      widthCustom = 2.5;
      break;
    case 5:
      widthCustom = 3;
      break;
    case 6:
      widthCustom = 3.5;
      break;
    case 7:
      widthCustom = 4;
      break;
    case 8:
      widthCustom = 4.5;
      break;
    default:
      break;
  }

  // Recursive layout
  const renderTree = ({ bird, depth = 0, offsetY = 0 }) => {
    if (!bird) return null;

    const spacingY =
      maxNested <= 1 ? 50 / maxNested : maxNested <= 2 ? 100 / maxNested : 200;
    const spacingX = 180;

    const currentY = offsetY;
    const currentX = depth * spacingX;

    // console.log('nested', bird?.nested);
    // console.log('currentY', currentY);
    // console.log('currentX', currentX);
    // console.log('spacingY', spacingY);

    const isLastBloodline = !bird?.nested;
    const isMiniPigeonCard4 = bird?.nested === 4;
    const isMiniPigeonCard5 = bird?.nested === 5;
    const isMiniPigeonCard6 = bird?.nested === 6;
    const isMiniPigeonCardMoreThen5 = bird?.nested > 5;
    const fatherY =
      bird?.nested <= 1
        ? currentY - spacingY - 120
        : currentY -
          spacingY /
            (bird?.nested -
              (isMiniPigeonCard5 ? -5.5 : isMiniPigeonCard4 ? -1.5 : 0.7));
    const motherY =
      bird?.nested <= 1
        ? currentY + spacingY + 120
        : currentY +
          spacingY /
            (bird?.nested -
              (isMiniPigeonCard5 ? -5.5 : isMiniPigeonCard4 ? -1.5 : 0.7));
    const bloodLineCondition = isMiniPigeonCardMoreThen5
      ? 10
      : isMiniPigeonCard5
      ? 30
      : isMiniPigeonCard4
      ? 30
      : isLastBloodline
      ? 15
      : 30;
    const bloodlineTopPigeonCard = isMiniPigeonCard5
      ? currentY + 15
      : isLastBloodline
      ? currentY + 15
      : currentY;
    return (
      <Animated.View
        entering={FadeInRight.delay(500 * bird?.nested)}
        key={bird?.id}
      >
        {/* Kotak utama burung */}
        <PigeonCard
          mainId={mainId}
          bird={bird}
          style={[
            {
              position: 'absolute',
              left: currentX,
              top: bloodlineTopPigeonCard,
              borderColor: femaleColors[bird?.nested] || Colors.PRIMARY,
            },
            bird?.nested > 4 && {
              height: 30,
            },
          ]}
        />

        {/* SVG Garis ke Father */}
        {bird?.nested < 6 && bird?.father && (
          <>
            {/* Vertikal cabang */}
            <LineComponent
              x1={currentX + 120}
              y1={currentY + bloodLineCondition}
              x2={currentX + 120}
              y2={fatherY + bloodLineCondition}
              nested={bird?.nested}
              colors={femaleColors}
            />
            {/* Horizontal ke node */}
            <LineComponent
              x1={currentX + 120}
              y1={fatherY + bloodLineCondition}
              x2={currentX + spacingX}
              y2={fatherY + bloodLineCondition}
              nested={bird?.nested}
              colors={femaleColors}
            />
            {renderTree({
              bird: bird?.father,
              depth: depth + 1,
              offsetY: fatherY,
              nested: bird?.nested + 1,
            })}
          </>
        )}

        {/* SVG Garis ke Mother */}
        {bird?.nested < 6 && bird?.mother && (
          <>
            {/* Vertikal cabang */}
            <LineComponent
              x1={currentX + 120}
              y1={currentY + bloodLineCondition}
              x2={currentX + 120}
              y2={motherY + bloodLineCondition}
              nested={bird?.nested}
              colors={femaleColors}
            />
            {/* Horizontal ke node */}
            <LineComponent
              x1={currentX + 120}
              y1={motherY + bloodLineCondition}
              x2={currentX + spacingX}
              y2={motherY + bloodLineCondition}
              nested={bird?.nested}
              colors={femaleColors}
            />
            {renderTree({
              bird: bird?.mother,
              depth: depth + 1,
              offsetY: motherY,
              nested: bird?.nested,
            })}
          </>
        )}
      </Animated.View>
    );
  };

  return (
    <ScrollView horizontal style={{ flex: 1 }}>
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          left: 40,
        }}
      >
        <FastImage
          source={logotransparent}
          style={{
            height: '100%',
            width: '100%',
            opacity: 0.4,
          }}
        />
      </View>
      <ScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={[
          { justifyContent: 'center', alignItems: 'center' },
          maxNested >= 3 && { paddingTop: 150 * widthCustom },
        ]}
      >
        <View
          style={{
            width: 350 * widthCustom,
            height: (maxNested <= 2 ? 600 : 600) * widthCustom,
            paddingTop: maxNested >= 2 ? 10 * widthCustom : 10,
          }}
        >
          {renderTree({
            bird: birds,
            depth: 0,
            offsetY: 300,
            nested: birds?.nested,
          })}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

export default BloodlineTreeScreen;
