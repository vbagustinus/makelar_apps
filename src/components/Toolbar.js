import React from 'react';
import PropTypes from 'prop-types';
import { Colors, Sizes } from '../styles';
import { Image, StatusBar, View } from 'react-native';
import { TouchableOpacity, Text } from '../components';
import { logo } from '../assets/images';
import Styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import { emptyFunction } from '../helpers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Toolbar = props => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ zIndex: 199, paddingBottom: 20 }}>
      <StatusBar
        barStyle={props.isWhite ? 'dark-content' : 'light-content'}
        translucent
      />
      <View
        unflex
        style={[
          !props.noshadow ? Styles.toolbarShadow : {},
          {
            backgroundColor: props.isWhite ? Colors.YELLOW : Colors.BACKGROUND,
          },
        ]}
      >
        <View style={Styles.containerToolbar}>
          <TouchableOpacity
            centering
            unflex
            style={[
              { width: !props.leftMenu ? 30 * Sizes.ratioWidthScreen : null },
              Styles.leftMenuContainer,
            ]}
            onPress={props.leftMenuOnPress}
          >
            {props.leftMenu}
          </TouchableOpacity>
          <View unflex>
            {props.title ? (
              <Text
                style={[
                  Styles.title,
                  { color: props?.isWhite ? Colors.PRIMARY : Colors.WHITE },
                ]}
              >
                {props.title}
              </Text>
            ) : (
              <Image
                source={logo}
                resizeMethod={'auto'}
                resizeMode="stretch"
                style={Styles.logo}
              />
            )}
          </View>
          <TouchableOpacity
            centering
            unflex
            style={[
              { width: !props.rightMenu ? 30 * Sizes.ratioWidthScreen : null },
              Styles.rightMenuContainer,
            ]}
            onPress={props.rightMenuOnPress}
          >
            {props.rightMenu}
          </TouchableOpacity>
        </View>
        {props.bottomComponent && props.bottomComponent}
      </View>
    </View>
  );
};

Toolbar.propTypes = {
  title: PropTypes.string,
  leftMenu: PropTypes.element,
  rightMenu: PropTypes.element,
  bottomComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  isWhite: PropTypes.bool,
};

Toolbar.defaultProps = {
  leftMenuOnPress: emptyFunction,
  rightMenuOnPress: emptyFunction,
  isWhite: false,
};

export { Toolbar };
