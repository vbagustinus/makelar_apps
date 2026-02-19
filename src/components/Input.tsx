import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useThemeColors } from '../styles';
import { Fonts } from '../constants';
import MapView, { Marker } from 'react-native-maps';

export const Input = ({
  label,
  placeholder,
  iconName,
  secureTextEntry = false,
  onIconPress,
  onChangeText, // Callback untuk perubahan teks
  value, // Nilai yang diterima dari luar
  multiline = false,
  keyboardType = 'default',
  prefix = '',
}: any) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Sinkronisasi state lokal dengan nilai dari properti `value`
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleTextChange = text => {
    setInputValue(text); // Update state lokal
    if (onChangeText) {
      onChangeText(text); // Panggil callback dengan nilai input
    }
  };

  return (
    <View style={[styles.container, focused ? styles.focused : null]}>
      <MaterialDesignIcons
        name={iconName}
        size={20}
        color={colors.GREY}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputRow}>
          {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
          <TextInput
            style={[styles.input, prefix ? { paddingLeft: 6 } : null]}
            placeholder={placeholder}
            placeholderTextColor={colors.GREY}
            secureTextEntry={secureTextEntry}
            value={inputValue} // Gunakan nilai dari state lokal
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            multiline={multiline}
            keyboardType={keyboardType}
            onChangeText={handleTextChange} // Gunakan handler untuk menangani perubahan teks
          />
        </View>
      </View>
      {onIconPress && (
        <TouchableOpacity onPress={onIconPress}>
          <MaterialDesignIcons
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={20}
            color="#aaa"
            style={styles.iconRight}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const InputDefault = ({
  label,
  placeholder,
  iconName,
  secureTextEntry = false,
  onIconPress,
  onChangeText, // Callback untuk perubahan teks
  value, // Nilai yang diterima dari luar
}: any) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Sinkronisasi state lokal dengan nilai dari properti `value`
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleTextChange = text => {
    setInputValue(text); // Update state lokal
    if (onChangeText) {
      onChangeText(text); // Panggil callback dengan nilai input
    }
  };

  return (
    <View style={[styles.containerDefault, focused ? styles.focused : null]}>
      <MaterialDesignIcons
        name={iconName}
        size={20}
        color={colors.GREY}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.GREY}
          secureTextEntry={secureTextEntry}
          value={inputValue} // Gunakan nilai dari state lokal
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={handleTextChange} // Gunakan handler untuk menangani perubahan teks
        />
      </View>
      {onIconPress && (
        <TouchableOpacity onPress={onIconPress}>
          <MaterialDesignIcons
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={20}
            color="#aaa"
            style={styles.iconRight}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const InputMaps = ({
  label,
  placeholder,
  iconName,
  secureTextEntry = false,
  onIconPress,
  onChangeText, // Callback untuk perubahan teks
  value, // Nilai yang diterima dari luar
  onPress,
  lat,
  lng,
}: any) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Sinkronisasi state lokal dengan nilai dari properti `value`
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleTextChange = text => {
    setInputValue(text); // Update state lokal
    if (onChangeText) {
      onChangeText(text); // Panggil callback dengan nilai input
    }
  };

  return (
    <TouchableOpacity
      style={[styles.containerDefault, focused ? styles.focused : null]}
      onPress={onPress}
    >
      {lat && lng ? (
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <View
            style={{
              width: '100%',
              height: 200,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: lat,
                  longitude: lng,
                }}
              />
            </MapView>
          </View>
        </View>
      ) : (
        <>
          <MaterialDesignIcons
            name={iconName}
            size={20}
            color={colors.GREY}
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.input}>{placeholder}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};
const createStyles = colors =>
  StyleSheet.create({
    containerDefault: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: colors.CARD,
      shadowColor: colors.BLACK,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },

    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.CARD,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      shadowColor: colors.BLACK,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },

    focused: {
      borderColor: colors.PRIMARY,
      shadowOpacity: 0.09,
    },

    icon: {
      marginRight: 12,
      opacity: 0.8,
      color: colors.GREY,
    },

    iconRight: {
      marginLeft: 10,
      opacity: 0.7,
      color: colors.GREY,
    },

    textContainer: {
      flex: 1,
    },

    label: {
      fontSize: 11,
      color: colors.TEXT,
      marginBottom: 3,
      fontFamily: Fonts.fontMedium,
      opacity: 0.85,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    prefix: {
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
      fontSize: 14,
      paddingHorizontal: 6,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: colors.HAZE,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      marginRight: 6,
    },

    input: {
      fontSize: 15,
      color: colors.TEXT,
      fontFamily: Fonts.fontRegular,
      paddingVertical: 4,
    },
  });
