import React from 'react';
import { TouchableOpacity } from 'react-native';
import { multipleTapHandler } from '../helpers';
import { Text } from './Text';
import Styles from './styles';

const Button = ({
  onPress,
  children,
  styleContainerProps,
  styleTextProps,
  style,
  disabled,
  styleDisabled,
  styleTextDisabled,
  accessibilityLabel,
}) => {
  const { buttonStyle, textStyle, containerDisabled, textDisable } = Styles;
  return (
    <TouchableOpacity
      onPress={multipleTapHandler(onPress, 500)}
      accessibilityLabel={accessibilityLabel}
      style={[
        buttonStyle,
        style,
        styleContainerProps,
        disabled && (styleDisabled || containerDisabled),
      ]}
      disabled={disabled}
    >
      <Text
        style={[
          textStyle,
          disabled && (styleTextDisabled || textDisable),
          styleTextProps,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const ButtonComponent = ({
  onPress,
  children,
  styleContainerProps,
  style,
  disabled,
  styleDisabled,
  accessibilityLabel,
}) => {
  const { buttonStyle, containerDisabled } = Styles;
  return (
    <TouchableOpacity
      onPress={multipleTapHandler(onPress, 500)}
      accessibilityLabel={accessibilityLabel}
      style={[
        buttonStyle,
        style,
        styleContainerProps,
        disabled && (styleDisabled || containerDisabled),
        { flexDirection: 'row' },
      ]}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  ignoreMultipleTouches: false,
};

export { Button, ButtonComponent };
