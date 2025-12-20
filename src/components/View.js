import React from 'react';
import * as Animatable from 'react-native-animatable';
import { View as DefaultView } from 'react-native';
import Styles from './styles';

export const View = props => {
  const {
    defaultStyle,
    unflex,
    row,
    centering,
    left,
    spacebetween,
    right,
    absolute,
    center,
    shadow,
  } = Styles;
  return props.animation ? (
    <Animatable.View
      key={props.key}
      animation={props.animationMethod}
      delay={props.delay}
      style={[
        defaultStyle,
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
      ]}
    >
      {props.children}
    </Animatable.View>
  ) : (
    <DefaultView
      style={[
        defaultStyle,
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
      ]}
    >
      {props.children}
    </DefaultView>
  );
};
