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
import RNBootSplash from 'react-native-bootsplash';
import mobileAds from 'react-native-google-mobile-ads';
import analytics from '@react-native-firebase/analytics';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import HomeScreen from './scenes/home';
import PropertyScreen from './scenes/property';
import ProfileScreen from './scenes/profile';
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

const forFade = ({ current, next }) => {
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

const FloatingTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const tabStyles = React.useMemo(
    () => createFloatingTabStyles(colors, insets),
    [colors, insets],
  );
  return (
    <View style={tabStyles.floatingTab}>
      <View style={tabStyles.floatingTabContainer}>
        {state.routes.map((route, index) => {
          // ... (Kode untuk menentukan ikon dan label tetap sama)

          const { options } = descriptors[route.key];
          let label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;

          let iconName;
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

          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(route.name)}
              style={tabStyles.tabButton}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isFocused
                    ? colors.PRIMARY
                    : colors.transparent,
                  padding: 10,
                  borderRadius: 24,
                  width: 52,
                  height: 52,
                  overflow: 'hidden',
                }}
              >
                <MaterialDesignIcons
                  name={iconName}
                  size={30}
                  color={isFocused ? colors.WHITE : colors.GRAY_DARK}
                />
              </View>
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
    <Stack.Navigator key={'Main'}>
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
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
      <Stack.Screen
        key="MapPickerScreen"
        name="MapPickerScreen"
        component={MapPickerScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
      <Stack.Screen
        key="GlobalPropertyFilterScreen"
        name="GlobalPropertyFilterScreen"
        component={GlobalPropertyFilterScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />

      <Stack.Screen
        key="PrivacyScreen"
        name="PrivacyScreen"
        component={PrivacyScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
      {/* PROPERTY */}
      <Stack.Screen
        key="AddPropertyScreen"
        name="AddPropertyScreen"
        component={AddPropertyScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
      <Stack.Screen
        key="EditPropertyScreen"
        name="EditPropertyScreen"
        component={EditPropertyScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
      <Stack.Screen
        key="DetailPropertyScreen"
        name="DetailPropertyScreen"
        component={DetailPropertyScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
      <Stack.Screen
        key="GlobalDetailPropertyScreen"
        name="GlobalDetailPropertyScreen"
        component={GlobalDetailPropertyScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
      {/* PROFILE */}
      <Stack.Screen
        key="AboutAppScreen"
        name="AboutAppScreen"
        component={AboutAppScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
      <Stack.Screen
        key="SettingsScreen"
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
      <Stack.Screen
        key="EditProfileScreen"
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
      {/* GLOBAL */}
      <Stack.Screen
        key="UnderConstructionScreen"
        name="UnderConstructionScreen"
        component={UnderConstructionScreen}
        options={{ headerStyleInterpolator: forFade, headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function App() {
  const theme = useThemeStore(state => state.theme);
  const colors = useThemeColors();
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
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

        setNewVersionDetail({ android_version: parsed });

        const newVersion = await isVersionHigher(parsed?.version);
        setNewVersionAvailable(newVersion);
      });
  };

  const linking = {
    prefixes: ['makelar://'],
    config: {
      screens: {
        InfoScreen: 'home',
        GlobalDetailPropertyScreen: 'property', // e.g. makelar://property?id=xxx
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
            <Modal transparent={true} isVisible={newVersionAvailable}>
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
      paddingBottom: insets.bottom + 6,
    },
    floatingTabContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colors.CARD,
      marginHorizontal: 20,
      paddingVertical: 6,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.1,
      shadowRadius: 18,
      elevation: 8,
      overflow: 'visible',
    },
    tabButton: { alignItems: 'center', flex: 1, paddingVertical: 5 },
  });

export default App;
