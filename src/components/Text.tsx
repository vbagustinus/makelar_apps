import React from 'react';
import { Text as DefaultText } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './styles';

export const Text = props => {
  const { textCustomFont, textItalic, textBold, textUnderline, textCenter } =
    Styles;
  return (
    <DefaultText
      {...props}
      allowFontScaling={false}
      style={[
        textCustomFont,
        props.style,
        props.center && textCenter,
        props.italic && textItalic,
        props.bold && textBold,
        props.underline && textUnderline,
      ]}
    >
      {props.children}
    </DefaultText>
  );
};

Text.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Text.defaultProps = {
  style: null,
};
