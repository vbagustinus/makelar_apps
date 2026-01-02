import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Colors } from '../styles';
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
}) => {
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
        color={Colors.TEXT}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputRow}>
          {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
          <TextInput
            style={[styles.input, prefix ? { paddingLeft: 6 } : null]}
            placeholder={placeholder}
            placeholderTextColor={Colors.GRAY_DARK}
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
}) => {
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
        color={Colors.TEXT}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.GRAY_DARK}
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
}) => {
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
            color={Colors.TEXT}
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
const styles = StyleSheet.create({
  containerDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT, // lebih soft
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.WHITE,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  focused: {
    borderColor: Colors.PRIMARY_LIGHT, // highlight lembut
    shadowOpacity: 0.09,
  },

  icon: {
    marginRight: 12,
    opacity: 0.8,
  },

  iconRight: {
    marginLeft: 10,
    opacity: 0.7,
  },

  textContainer: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    color: Colors.TEXT,
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
    color: Colors.TEXT,
    fontSize: 14,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
    marginRight: 6,
  },

  input: {
    fontSize: 15,
    color: Colors.TEXT,
    fontFamily: Fonts.fontRegular,
    paddingVertical: 4,
  },
});
