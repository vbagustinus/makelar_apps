import React, { Component } from 'react';
import { View } from 'react-native';
import KeyboardAccessoryView from './KeyboardAccessoryView';
import Styles from '../styles';

export default class KeyboardAccessoryNavigation extends Component {
  render() {
    const { ...passThroughProps } = this.props;

    return (
      <KeyboardAccessoryView {...passThroughProps}>
        <View style={Styles.accessoryContainer} />
      </KeyboardAccessoryView>
    );
  }
}

KeyboardAccessoryNavigation.propTypes = {
  ...KeyboardAccessoryView.propTypes,
};
