import React from 'react';
import { Toolbar } from './Toolbar';
import { useThemeColors, FontSize, Colors } from '../styles';
import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Loading } from './Loading';

export const BaseView = ({
  title,
  isScrollable,
  loading,
  children,
  containerStyle,
  additionalStyle,
  backgroundColor = Colors.BACKGROUND,
  disableToolbar,
  isWhiteToolbar,
  disableLeftMenu,
  onBackPress,
  rightMenu,
  rightMenuOnPress,
  noshadow,
  bottomComponent,
  floatingComponent,
  headerComponent,
  footerComponent,
}: any) => {
  const colors = useThemeColors();
  const Wrapper: any = isScrollable ? Animated.ScrollView : View;
  const wrapperProps: any = isScrollable
    ? {
        showsVerticalScrollIndicator: false,
        alwaysBounceVertical: false,
        bounces: false,
        keyboardShouldPersistTaps: 'handled' as const,
        contentContainerStyle: [styles.contentContainer, containerStyle],
      }
    : {
        style: [styles.contentContainer, containerStyle],
      };

  return (
    <View
      style={[
        styles.baseContainer,
        { backgroundColor: backgroundColor || colors.BACKGROUND },
        additionalStyle,
      ]}
    >
      {!disableToolbar && (
        <Toolbar
          title={title}
          isWhite={isWhiteToolbar || false}
          leftMenu={
            !disableLeftMenu ? (
              <Ionicons
                name={'chevron-back-outline'}
                size={FontSize.FONT_SIZE_30}
                color={colors.WHITE}
              />
            ) : null
          }
          leftMenuOnPress={() => onBackPress?.()}
          rightMenu={rightMenu}
          rightMenuOnPress={rightMenuOnPress || false}
          noshadow={noshadow || false}
          bottomComponent={bottomComponent}
        />
      )}
      {loading && <Loading />}
      <Wrapper {...wrapperProps}>
        {headerComponent}
        {children}
        {footerComponent}
      </Wrapper>
      {floatingComponent && floatingComponent}
    </View>
  );
};

BaseView.propTypes = {
  title: PropTypes.string,
  onBackPress: PropTypes.func,
  isScrollable: PropTypes.bool,
  loading: PropTypes.bool,
  floatingComponent: PropTypes.element,
  containerStyle: PropTypes.object,
  additionalStyle: PropTypes.any,
  backgroundColor: PropTypes.string,
  headerComponent: PropTypes.element,
  footerComponent: PropTypes.element,
};

BaseView.defaultProps = {
  isScrollable: false,
  title: '',
  backgroundColor: null,
};
