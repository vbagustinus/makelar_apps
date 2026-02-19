import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import * as React from 'react';
import {
  Animated,
  StyleSheet,
  Platform,
  Linking,
  AppState,
  BackHandler,
  Alert,
} from 'react-native';
import {
  NavigationContainer,
  useFocusEffect,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import RNBootSplash from 'react-native-bootsplash';
import mobileAds from 'react-native-google-mobile-ads';
import analytics from '@react-native-firebase/analytics';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import HomeScreen from './scenes/home';
import PropertyScreen from './scenes/property';
import ProfileScreen from './scenes/profile';
import FavoritesScreen from './scenes/profile/FavoritesScreen';
import PrivacyScreen from './scenes/profile/privacypolicy';
import AuthScreen from './scenes/auth';
import OTPScreen from './scenes/auth/OTPScreen';
import { View, Text, TouchableOpacity } from './components';
import { Sizes, useThemeColors } from './styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Fonts } from './constants';
import useAuthStore from './store/useAuthStore';
import { getString } from './helpers';
import AddPropertyScreen from './scenes/property/AddPropertyScreen';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AboutAppScreen from './scenes/profile/AboutAppScreen';
import EditPropertyScreen from './scenes/property/EditPropertyScreen';
import DetailPropertyScreen from './scenes/property/DetailPropertyScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UnderConstructionScreen from './scenes/profile/UnderConstructionScreen';
import remoteConfig from '@react-native-firebase/remote-config';
import { isVersionHigher } from './utils/checkVersions';
import FastImage from '@d11/react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import { logotransparent } from './assets/images';
import GlobalDetailPropertyScreen from './scenes/property/GlobalDetailPropertyScreen';
import GlobalPropertyFilterScreen from './scenes/home/GlobalPropertyFilterScreen';
import GlobalPopup from './components/GlobalPopup';
import GlobalModal from './components/GlobalModal';
import GlobalImagePreview from './components/GlobalImagePreview';
import EditProfileScreen from './scenes/profile/EditProfileScreen';
import GlobalPropertyListScreen from './scenes/home/GlobalPropertyListScreen';
import MapPickerScreen from './scenes/property/MapPickerScreen';
import DonationScreen from './scenes/profile/DonationScreen';
import SettingsScreen from './scenes/profile/SettingsScreen';
import useThemeStore from './store/useThemeStore';

const forFade = ({ current, next }: any) => {
  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0,
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: { opacity },
  };
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const FloatingTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const tabStyles = React.useMemo(
    () => createFloatingTabStyles(colors, insets),
    [colors, insets],
  );
  const isDarkTheme = colors.BACKGROUND === '#0D1B2D';
  const activeGradient = isDarkTheme
    ? colors.GRADIENT_SKY || ['#3EA6FF', '#227BFF']
    : ['#2F95FF', '#1F6FFF'];
  const activeSurface = isDarkTheme
    ? 'rgba(255,255,255,0.04)'
    : 'rgba(31,111,255,0.92)';
  const inactiveSurface = isDarkTheme
    ? 'transparent'
    : 'rgba(26,62,120,0.06)';
  const inactiveBorder = isDarkTheme
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(26,62,120,0.12)';
  const activeBorderColor = isDarkTheme
    ? 'rgba(140,195,255,0.35)'
    : 'rgba(255,255,255,0.45)';
  const activeTextColor = isDarkTheme ? '#EAF3FF' : '#FFFFFF';
  const inactiveTextColor = isDarkTheme ? 'rgba(214,230,255,0.72)' : '#6B7280';
  const inactiveIconColor = isDarkTheme ? 'rgba(214,230,255,0.72)' : '#6B7280';
  const [tabContainerWidth, setTabContainerWidth] = React.useState(0);
  const tabCount = state.routes.length || 1;
  const tabGap = 8;
  const horizontalPadding = 10;
  const activePillWidth =
    tabContainerWidth > 0
      ? (tabContainerWidth - horizontalPadding * 2 - tabGap * (tabCount - 1)) /
        tabCount
      : 0;

  const translateX = React.useRef(new Animated.Value(0)).current;
  const itemProgressRef = React.useRef<Animated.Value[]>([]);
  if (itemProgressRef.current.length !== tabCount) {
    itemProgressRef.current = state.routes.map((_: any, idx: number) =>
      new Animated.Value(idx === state.index ? 1 : 0),
    );
  }

  React.useEffect(() => {
    if (!activePillWidth) {
      return;
    }
    Animated.spring(translateX, {
      toValue: state.index * (activePillWidth + tabGap),
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [activePillWidth, state.index, tabGap, translateX]);

  React.useEffect(() => {
    const animations = itemProgressRef.current.map((value, idx) =>
      Animated.spring(value, {
        toValue: idx === state.index ? 1 : 0,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }),
    );
    Animated.parallel(animations).start();
  }, [state.index]);

  return (
    <View style={tabStyles.floatingTab}>
      <LinearGradient
        pointerEvents="none"
        colors={[
          colors.PRIMARY_20 || 'rgba(255,255,255,0.2)',
          'rgba(0,0,0,0)',
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={tabStyles.floatingTabGlow}
      />
      <View
        style={tabStyles.floatingTabContainer}
        onLayout={event => {
          setTabContainerWidth(event.nativeEvent.layout.width);
        }}
      >
        {activePillWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              tabStyles.activePillWrapper,
              {
                width: activePillWidth,
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={activeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={tabStyles.activePill}
            />
          </Animated.View>
        ) : null}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          let label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;

          let iconName: any;
          if (route.name === 'Home') {
            iconName = 'view-dashboard';
            label = 'Home';
          } else if (route.name === 'Semua') {
            iconName = 'home-search';
            label = 'All';
          } else if (route.name === 'PropertyScreen') {
            iconName = 'home-plus';
            label = 'My Property';
          } else if (route.name === 'Profil') {
            iconName = 'account-tie';
            label = 'Profile';
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              onLongPress={onLongPress}
              style={tabStyles.tabButton}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[
                  tabStyles.tabPill,
                  isFocused
                    ? {
                        backgroundColor: activeSurface,
                        borderColor: activeBorderColor,
                        borderWidth: 1,
                      }
                    : {
                        backgroundColor: inactiveSurface,
                        borderColor: inactiveBorder,
                        borderWidth: 1,
                      },
                  {
                    transform: [
                      {
                        translateY: itemProgressRef.current[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -2],
                        }),
                      },
                      {
                        scale: itemProgressRef.current[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.03],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Animated.View
                  style={[
                    tabStyles.iconShell,
                    isFocused
                      ? tabStyles.iconShellActive
                      : tabStyles.iconShellInactive,
                    {
                      opacity: itemProgressRef.current[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: isDarkTheme ? [0.95, 1] : [0.92, 1],
                      }),
                    },
                  ]}
                >
                  <MaterialDesignIcons
                    name={iconName}
                    size={22}
                    color={isFocused ? activeTextColor : inactiveIconColor}
                  />
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

function BottomNavigation() {
  const tokenStorage = getString('token');
  const token = useAuthStore(state => state.token);

  return (
    <Tab.Navigator
      id="bottom-tabs"
      screenOptions={{ headerShown: false }}
      tabBar={props => <FloatingTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Semua" component={GlobalPropertyListScreen} />
      <Tab.Screen
        name="PropertyScreen"
        component={tokenStorage || token ? PropertyScreen : AuthScreen}
      />
      <Tab.Screen
        name="Profil"
        component={tokenStorage || token ? ProfileScreen : AuthScreen}
      />
    </Tab.Navigator>
  );
}

function StackNavigation() {
  return (
    <Stack.Navigator id="main-stack" key={'Main'}>
      <Stack.Screen
        name="Main"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />
      {/* HOME */}
      <Stack.Screen
        key="DonationScreen"
        name="DonationScreen"
        component={DonationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        key="MapPickerScreen"
        name="MapPickerScreen"
        component={MapPickerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        key="GlobalPropertyFilterScreen"
        name="GlobalPropertyFilterScreen"
        component={GlobalPropertyFilterScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        key="PrivacyScreen"
        name="PrivacyScreen"
        component={PrivacyScreen}
        options={{ headerShown: false }}
      />
      {/* PROPERTY */}
      <Stack.Screen
        key="AddPropertyScreen"
        name="AddPropertyScreen"
        component={AddPropertyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        key="EditPropertyScreen"
        name="EditPropertyScreen"
        component={EditPropertyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        key="DetailPropertyScreen"
        name="DetailPropertyScreen"
        component={DetailPropertyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        key="GlobalDetailPropertyScreen"
        name="GlobalDetailPropertyScreen"
        component={GlobalDetailPropertyScreen}
        options={{ headerShown: false }}
      />
      {/* PROFILE */}
      <Stack.Screen
        key="AboutAppScreen"
        name="AboutAppScreen"
        component={AboutAppScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        key="SettingsScreen"
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        key="EditProfileScreen"
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        key="FavoritesScreen"
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      {/* GLOBAL */}
      <Stack.Screen
        key="UnderConstructionScreen"
        name="UnderConstructionScreen"
        component={UnderConstructionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function App() {
  const theme = useThemeStore(state => state.theme);
  const colors = useThemeColors();
  const routeNameRef = React.useRef<any>(null);
  const navigationRef = React.useRef<any>(null);
  const [newVersionDetail, setNewVersionDetail] = React.useState({
    ios_version: {
      mandatory: false,
      version: DeviceInfo.getVersion(),
      link: '',
    },
    android_version: {
      mandatory: false,
      version: DeviceInfo.getVersion(),
      link: 'https://play.google.com/store/apps/details?id=com.makelar_apps',
    },
  });
  const [newVersionAvailable, setNewVersionAvailable] = React.useState(false);
  const navigationTheme = React.useMemo(() => {
    const base = theme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.PRIMARY,
        background: colors.BACKGROUND,
        card: colors.CARD,
        text: colors.TEXT,
        border: colors.GRAY_LIGHT,
        notification: colors.PRIMARY,
      },
    };
  }, [colors, theme]);
  const isMandatoryUpdate =
    Platform.OS === 'ios'
      ? !newVersionDetail?.ios_version?.mandatory
      : !newVersionDetail?.android_version?.mandatory;

  React.useEffect(() => {
    getValues();
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('Adapter status:', adapterStatuses);
      });
  }, []);

  const getValues = () => {
    remoteConfig().setConfigSettings({
      fetchTimeMillis: 5000,
      minimumFetchIntervalMillis: 30000,
    });
    remoteConfig()
      .setDefaults({
        ios_version: {
          version: DeviceInfo.getVersion(),
          is_mandatory: false,
        },
        android_version: {
          version: DeviceInfo.getVersion(),
          is_mandatory: false,
        },
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then(async fetchedRemotely => {
        const values = await remoteConfig().getAll();
        // const android_version = JSON.parse(values.android_version._value);
        // const newVersion = await isVersionHigher(android_version?.version);
        // setNewVersionAvailable(newVersion);
        // setNewVersionDetail({ android_version });
        const raw = values.android_version.asString();

        let parsed;

        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = {
            version: raw ?? DeviceInfo.getVersion(),
            mandatory: false,
          };
        }

        setNewVersionDetail(prev => ({
          ...prev,
          android_version: parsed,
        }));

        const newVersion = await isVersionHigher(parsed?.version);
        setNewVersionAvailable(newVersion);
      });
  };

  const linking = {
    prefixes: ['makelar://', 'https://makelar.vercel.app'],
    config: {
      screens: {
        InfoScreen: 'home',
        GlobalDetailPropertyScreen: {
          path: 'property/:id',
        },
      },
    },
  };

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <NavigationContainer
          key={`nav-${theme}`}
          linking={linking}
          ref={navigationRef}
          theme={navigationTheme}
          onReady={() => {
            routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            RNBootSplash.hide({ fade: true });
          }}
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName =
              navigationRef.current.getCurrentRoute().name;
            if (previousRouteName !== currentRouteName) {
              await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              });
            }
            routeNameRef.current = currentRouteName;
          }}
        >
          {newVersionAvailable && (
            <Modal isVisible={newVersionAvailable}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <View
                  unflex
                  style={{
                    backgroundColor: colors.CARD,
                    borderRadius: Sizes.widthScreen * 0.05,
                    width: Sizes.widthScreen * 0.7,
                    minHeight: Sizes.widthScreen * 0.75,
                    paddingHorizontal: Sizes.widthScreen * 0.05,
                    marginTop: Sizes.widthScreen * 0.05,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: colors.GRAY_LIGHT,
                  }}
                >
                  <FastImage
                    style={{
                      width: Sizes.widthScreen * 0.25,
                      height: Sizes.widthScreen * 0.25,
                      marginVertical: Sizes.widthScreen * 0.05,
                      borderRadius: 10,
                    }}
                    source={logotransparent}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Text
                    style={{
                      color: colors.TEXT,
                      fontSize: Sizes.widthScreen * 0.035,
                      fontFamily: Fonts.fontSemiBold,
                      textAlign: 'center',
                    }}
                  >
                    Version{' '}
                    {Platform.OS === 'ios'
                      ? newVersionDetail?.ios_version?.version
                      : newVersionDetail?.android_version?.version}{' '}
                    is now available!{'\n'}Please update your app.
                  </Text>
                  <TouchableOpacity
                    unflex
                    style={{
                      width: Sizes.widthScreen * 0.3,
                      height: Sizes.widthScreen * 0.1,
                      backgroundColor: colors.PRIMARY,
                      borderRadius: Sizes.widthScreen * 0.1,
                      marginTop: Sizes.widthScreen * 0.05,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() =>
                      Linking.openURL(newVersionDetail?.android_version?.link)
                    }
                  >
                    <Text
                      style={{
                        color: colors.WHITE,
                        fontSize: Sizes.widthScreen * 0.035,
                        fontFamily: Fonts.fontSemiBold,
                      }}
                    >
                      Update
                    </Text>
                  </TouchableOpacity>
                  {isMandatoryUpdate && (
                    <TouchableOpacity
                      style={{
                        width: Sizes.widthScreen * 0.3,
                        height: Sizes.widthScreen * 0.1,
                        backgroundColor: colors.WHITE,
                        borderWidth: 0.5,
                        borderColor: colors.PRIMARY,
                        borderRadius: Sizes.widthScreen * 0.1,
                        marginVertical: Sizes.widthScreen * 0.05,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => setNewVersionAvailable(false)}
                    >
                      <Text
                        style={{
                          color: colors.PRIMARY,
                          fontSize: Sizes.widthScreen * 0.035,
                          fontFamily: Fonts.fontSemiBold,
                        }}
                      >
                        Later
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Modal>
          )}
          <StackNavigation />
        </NavigationContainer>
        <GlobalPopup />
        <GlobalModal />
        <GlobalImagePreview />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const createFloatingTabStyles = (colors, insets) =>
  StyleSheet.create({
    floatingTab: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      paddingBottom: insets.bottom + 8,
      paddingTop: 8,
    },
    floatingTabGlow: {
      position: 'absolute',
      left: 30,
      right: 30,
      bottom: insets.bottom + 2,
      height: 86,
      borderRadius: 34,
    },
    floatingTabContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor:
        colors.BACKGROUND === '#0D1B2D'
          ? 'rgba(16,30,52,0.92)'
          : 'rgba(255,255,255,0.94)',
      marginHorizontal: 14,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 30,
      borderWidth: 1,
      borderColor:
        colors.BACKGROUND === '#0D1B2D'
          ? 'rgba(255,255,255,0.12)'
          : 'rgba(48,86,140,0.18)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 20,
      elevation: 12,
      overflow: 'hidden',
      gap: 8,
    },
    activePillWrapper: {
      position: 'absolute',
      top: 8,
      bottom: 8,
      left: 10,
      borderRadius: 20,
    },
    activePill: {
      flex: 1,
      borderRadius: 20,
      borderWidth: 1,
      borderColor:
        colors.BACKGROUND === '#0D1B2D'
          ? 'rgba(140,195,255,0.45)'
          : 'rgba(255,255,255,0.65)',
      shadowColor: '#2B7CFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colors.BACKGROUND === '#0D1B2D' ? 0.24 : 0.28,
      shadowRadius: 10,
      elevation: 8,
    },
    tabButton: {
      alignItems: 'center',
      flex: 1,
      zIndex: 2,
    },
    tabPill: {
      minHeight: 54,
      width: '100%',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 4,
    },
    iconShell: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconShellActive: {
      backgroundColor:
        colors.BACKGROUND === '#0D1B2D'
          ? 'rgba(255,255,255,0.14)'
          : 'rgba(255,255,255,0.12)',
    },
    iconShellInactive: {
      backgroundColor:
        colors.BACKGROUND === '#0D1B2D'
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(20,40,80,0.12)',
    },
    tabLabel: {
      fontFamily: Fonts.fontSemiBold,
      fontSize: 11,
      letterSpacing: 0.2,
      lineHeight: 14,
    },
  });

export default App;
