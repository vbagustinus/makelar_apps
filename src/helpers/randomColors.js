'use strict';
import { Colors } from '../styles';

export const randomColors = [
  Colors.LIGHT_BLUE,
  Colors.DARK_SLATE_BLUE,
  Colors.LIGHT_STEEL_PINK,
  Colors.LIGHT_SLATE_GREY,
  Colors.SALMON,
  Colors.TOMATO,
  Colors.DARK_SLATE_GREY,
  Colors.MEDIUM_AQUAMARINE,
  Colors.MEDIUM_TURQUOISE,
  Colors.POWDER_BLUE,
  Colors.LIGHT_STEEL_BLUE,
  Colors.STEEL_BLUE,
  Colors.THISTLE,
  Colors.ROSY_BROWN,
  Colors.NEW_YORK_PINK,
  Colors.RAJAH,
  Colors.DUST_STORM,
  Colors.MOUNTBATTEN_PINK,
  Colors.BARLEY_CORN,
  Colors.INDIAN_RED,
  Colors.BURLY_WOOD,
  Colors.LIGHT_KHAKI,
  Colors.DARK_SEA_GREEN,
  Colors.SKEPTIC,
  Colors.SILVER_CHALICE,
  Colors.BEAUTY_BUSH,
  Colors.QUILL_GRAY,
  Colors.YOUR_PINK,
  Colors.ANTIQUE_WHITE,
  Colors.WHEAT,
  Colors.TURQUOISE_GREEN,
  Colors.BROWN,
  Colors.DARK_OLIVE_GREEN,
  Colors.PALE_TURQUOISE,
];

export const colorForCommonRandoms = () => {
  const colors = [
    'rgb(119,170,255)',
    'rgb(153,204,255)',
    'rgb(187,238,255)',
    'rgb(85,136,255)',
    'rgb(51,102,255)',
  ];
  return colors[Math.floor(Math.random() * (colors.length - 1)) + 0];
};

export const colorForFemaleRandoms = () => {
  const colors = [
    'rgb(197,16,16)',
    'rgb(186,62,188)',
    'rgb(143,21,74)',
    'rgb(225,79,79)',
    'rgb(210,143,143)',
  ];
  return colors[Math.floor(Math.random() * (colors.length - 1)) + 0];
};

export const colorForMaleRandoms = () => {
  const colors = [
    'rgb(182,148,14)',
    'rgb(0,79,148)',
    'rgb(145,16,2)',
    'rgb(30,45,71)',
    'rgb(190,102,0)',
  ];
  return colors[Math.floor(Math.random() * (colors.length - 1)) + 0];
};
