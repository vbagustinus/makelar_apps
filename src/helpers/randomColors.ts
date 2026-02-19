'use strict';
import { Colors } from '../styles';
const C: any = Colors;

export const randomColors = [
  C.LIGHT_BLUE,
  C.DARK_SLATE_BLUE,
  C.LIGHT_STEEL_PINK,
  C.LIGHT_SLATE_GREY,
  C.SALMON,
  C.TOMATO,
  C.DARK_SLATE_GREY,
  C.MEDIUM_AQUAMARINE,
  C.MEDIUM_TURQUOISE,
  C.POWDER_BLUE,
  C.LIGHT_STEEL_BLUE,
  C.STEEL_BLUE,
  C.THISTLE,
  C.ROSY_BROWN,
  C.NEW_YORK_PINK,
  C.RAJAH,
  C.DUST_STORM,
  C.MOUNTBATTEN_PINK,
  C.BARLEY_CORN,
  C.INDIAN_RED,
  C.BURLY_WOOD,
  C.LIGHT_KHAKI,
  C.DARK_SEA_GREEN,
  C.SKEPTIC,
  C.SILVER_CHALICE,
  C.BEAUTY_BUSH,
  C.QUILL_GRAY,
  C.YOUR_PINK,
  C.ANTIQUE_WHITE,
  C.WHEAT,
  C.TURQUOISE_GREEN,
  C.BROWN,
  C.DARK_OLIVE_GREEN,
  C.PALE_TURQUOISE,
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
