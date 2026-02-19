import React from 'react';
import { TouchableOpacity as DefaultTouchableOpacity } from 'react-native';
import { multipleTapHandler } from '../helpers';
import Styles from './styles';

const TouchableOpacity = props => {
  const {
    defaultMainView,
    unflex,
    row,
    centering,
    shadow,
    center,
    spacebetween,
    absolute,
    left,
    right,
    containerDisabled,
  } = Styles;
  return (
    <DefaultTouchableOpacity
      onPress={multipleTapHandler(props.onPress, 500)}
      style={[
        defaultMainView,
        props.unflex && unflex,
        props.row && row,
        props.centering && centering,
        props.center && center,
        props.spacebetween && spacebetween,
        props.left && left,
        props.right && right,
        props.absolute && absolute,
        props.shadow && shadow,
        props.style,
        props.disabled && !props.isWhite && containerDisabled,
      ]}
      disabled={props.disabled}
    >
      {props.children}
    </DefaultTouchableOpacity>
  );
};

export { TouchableOpacity };
