import React from 'react';
import FastImage from '@d11/react-native-fast-image';
import PropTypes from 'prop-types';
import { logo } from '../assets/images';

const Image = ({ imageSource, tintColor = undefined, imageStyle = {} }) => (
  <FastImage
    source={imageSource}
    resizeMode={'contain'}
    tintColor={tintColor}
    style={[imageStyle]}
    defaultSource={logo}
  />
);

Image.propTypes = {
  onPress: PropTypes.func,
  containerStyle: PropTypes.object,
  imageComponent: PropTypes.element,
  resizeMode: PropTypes.string,
  tintColor: PropTypes.string,
  imageStyle: PropTypes.object,
};

Image.defaultProps = {
  containerStyle: {},
  imageComponent: null,
  resizeMode: 'stretch',
  tintColor: '',
  imageStyle: {},
};

export { Image };
