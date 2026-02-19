import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Colors, Sizes } from '../styles';
import { Fonts } from '../constants';
import { emptyFunction } from '../helpers';

const Alignments = {
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const styles = StyleSheet.create({
  containerStyle: {
    borderColor: Colors.borderStone,
    borderRadius: 8 * Sizes.ratioWidthScreen,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 42 * Sizes.ratioWidthScreen,
    borderWidth: Sizes.borderWidth,
  },
  labelText: {
    color: Colors.charcoal,
    fontFamily: Fonts.fontSemiBold,
    letterSpacing: 0.42,
    fontSize: 14 * Sizes.ratioWidthScreen,
  },
  dropDownIcon: {
    marginRight: 10 * Sizes.ratioWidthScreen,
    alignSelf: 'center',
  },
});

const TouchableTextView = props => (
  <View style={props.containerStyle}>
    {!props.editable ? (
      <Text style={styles.labelText}>{props.placeholder}</Text>
    ) : null}
    <TouchableOpacity
      disabled={props.disabled}
      style={[
        styles.containerStyle,
        props.center && (Alignments.center as any),
        {
          marginTop: props.editable ? 0 : 10 * Sizes.ratioHeightScreen,
          backgroundColor:
            !props.editable || props.disabled
              ? Colors.haze
              : Colors.transparent,
        },
      ]}
      onPress={props.editable ? props.onPress : emptyFunction}
    >
      <View style={{ flexDirection: 'row' }}>
        {props.additionalComponent}
        <Text
          style={[
            {
              fontFamily: Fonts.fontRegular,
              color: props.value ? Colors.charcoal : Colors.charcoal05opacity,
              fontSize: 14 * Sizes.ratioWidthScreen,
              marginHorizontal: 14 * Sizes.ratioWidthScreen,
            },
            props.textStyle,
          ]}
        >
          {props.value || props.placeholder}
        </Text>
      </View>
      <MaterialDesignIcons
        name="chevron-right"
        size={20}
        color={Colors.charcoal}
        style={styles.dropDownIcon}
      />
    </TouchableOpacity>
  </View>
);

TouchableTextView.propTypes = {
  value: PropTypes.string,
  onPress: PropTypes.func,
  placeholder: PropTypes.string,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  editable: PropTypes.bool,
  disable: PropTypes.bool,
  additionalComponent: PropTypes.element,
};

TouchableTextView.defaultProps = {
  editable: true,
  disable: false,
};

export default TouchableTextView;
