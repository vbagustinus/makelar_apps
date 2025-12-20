import React from 'react';
import { View } from './View';
import { Toolbar } from './Toolbar';
import { Colors, FontSize } from '../styles';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Loading } from './Loading';

export const BaseView = props => (
  <View
    style={[
      styles.baseContainer,
      !props.isScrollable && props.containerStyle,
      props.additionalStyle,
    ]}
  >
    {!props.disableToolbar && (
      <Toolbar
        title={props.title}
        isWhite={props.isWhiteToolbar || false}
        leftMenu={
          !props.disableLeftMenu ? (
            <Ionicons
              name={'chevron-back-outline'}
              size={FontSize.FONT_SIZE_30}
              color={Colors.WHITE}
            />
          ) : null
        }
        leftMenuOnPress={() => props?.onBackPress()}
        rightMenu={props.rightMenu}
        rightMenuOnPress={props.rightMenuOnPress || false}
        noshadow={props.noshadow || false}
        bottomComponent={props.bottomComponent}
      />
    )}
    {props.loading && <Loading />}
    {props.isScrollable ? (
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        bounces={false}
        contentContainerStyle={props.containerStyle}
      >
        {props.children}
      </Animated.ScrollView>
    ) : (
      props.children
    )}
    {props.floatingComponent && props.floatingComponent}
  </View>
);

BaseView.propTypes = {
  title: PropTypes.string,
  onBackPress: PropTypes.func,
  isScrollable: PropTypes.bool,
  loading: PropTypes.bool,
  floatingComponent: PropTypes.element,
  containerStyle: PropTypes.object,
};

BaseView.defaultProps = {
  isScrollable: false,
  title: '',
};
