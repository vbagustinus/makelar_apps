import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const TouchableImage = props => (
  <TouchableOpacity onPress={props.onPress} style={props.containerStyle}>
    {props.imageComponent || (
      <Image
        source={props.imageSource}
        resizeMode={props.resizeMode}
        tintColor={props.tintColor}
        style={[{ tintColor: props.tintColor }, props.imageStyle]}
      />
    )}
  </TouchableOpacity>
);

TouchableImage.propTypes = {
  onPress: PropTypes.func,
  containerStyle: PropTypes.object,
  imageComponent: PropTypes.element,
  resizeMode: PropTypes.string,
  tintColor: PropTypes.string,
  imageStyle: PropTypes.object,
};

TouchableImage.defaultProps = {
  containerStyle: {},
  imageComponent: null,
  resizeMode: 'stretch',
  tintColor: '',
  imageStyle: {},
};

export { TouchableImage };
