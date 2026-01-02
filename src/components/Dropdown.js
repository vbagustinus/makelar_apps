import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Sizes } from '../styles';
import { Fonts } from '../constants';
import CountrySelect from 'react-native-country-select';

export const DropdownSearchable = ({
  label,
  placeholder,
  iconName,
  options,
  onSelect,
  value, // Initial value from outside
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  console.log('filteredOptions', label, filteredOptions);

  // Sync initial value with internal state
  useEffect(() => {
    if (value) {
      setSelectedValue(value.name || '');
    }
  }, [value]);

  const handleSearch = text => {
    setSearchTerm(text);
    const filtered = options.filter(item =>
      item?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = item => {
    setSelectedValue(item?.name);
    onSelect(item);
    setIsVisible(false);
    setSearchTerm('');
    setFilteredOptions(options);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsVisible(true)}
      >
        <MaterialDesignIcons
          name={iconName}
          size={20}
          color={Colors.TEXT}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text
            style={[
              styles.input,
              { color: selectedValue ? Colors.TEXT : Colors.GRAY_DARK },
            ]}
          >
            {selectedValue || placeholder}
          </Text>
        </View>
        <MaterialDesignIcons
          name="chevron-down"
          size={20}
          color={Colors.GRAY_DARK}
          style={styles.iconRight}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
        onDismiss={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setIsVisible(false);
            Keyboard.dismiss();
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari..."
                placeholderTextColor={Colors.GRAY_DARK}
                value={searchTerm}
                onChangeText={handleSearch}
              />

              <FlatList
                data={filteredOptions}
                keyExtractor={item => item?.id?.toString()}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.option,
                      { flexDirection: 'row', padding: 0 },
                    ]}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        padding: 12,
                      }}
                      onPress={() => handleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          { color: item?.color || Colors.TEXT },
                        ]}
                      >
                        {item?.name}
                      </Text>
                      {item?.description && (
                        <Text
                          style={[
                            styles.optionText,
                            { fontSize: 12, color: Colors.GRAY_BLACK },
                          ]}
                        >
                          {item?.description}
                        </Text>
                      )}
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    style={{
                      backgroundColor: Colors.WARNING,
                      padding: 5,
                      padding: 12,
                    }}>
                    <Text>details</Text>
                    </TouchableOpacity> */}
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>Tidak ada data</Text>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export const DropdownSearchableDefault = ({
  label,
  placeholder,
  iconName,
  options,
  onSelect,
  value,
  styleContainer = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  // Sync initial value with internal state
  useEffect(() => {
    if (value) {
      setSelectedValue(value.name || '');
    }
  }, [value]);

  const handleSearch = text => {
    setSearchTerm(text);
    const filtered = options.filter(item =>
      item?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = item => {
    console.log(item);
    setSelectedValue(item?.name);
    onSelect(item);
    setIsVisible(false);
    setSearchTerm('');
    setFilteredOptions(options);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.container, styleContainer]}
        onPress={() => setIsVisible(true)}
      >
        <MaterialDesignIcons
          name={iconName}
          size={20}
          color={Colors.GRAY_DARK}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.input,
              { color: selectedValue ? Colors.TEXT : Colors.GRAY_MEDIUM },
            ]}
          >
            {selectedValue || placeholder}
          </Text>
        </View>
        <MaterialDesignIcons
          name="chevron-down"
          size={20}
          color={Colors.GRAY_DARK}
          style={styles.iconRight}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
        onDismiss={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setIsVisible(false);
            Keyboard.dismiss();
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#ffffff70"
                value={searchTerm}
                onChangeText={handleSearch}
              />

              <FlatList
                data={filteredOptions}
                keyExtractor={item => item?.id?.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.optionText}>{item?.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>Tidak ada data tersedia.</Text>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export const DropdownSearchableCountry = ({
  label,
  placeholder,
  iconName,
  options,
  onSelect,
  value,
  styleContainer = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  // Sync initial value with internal state
  useEffect(() => {
    if (value) {
      setSelectedValue(value.name || '');
    }
  }, [value]);

  const handleSelect = item => {
    console.log(item);

    setSelectedValue(item?.name);
    onSelect(item);
    setIsVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.container, styleContainer]}
        onPress={() => setIsVisible(true)}
      >
        <MaterialDesignIcons
          name={iconName}
          size={20}
          color={Colors.GRAY_DARK}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.input,
              { color: selectedValue ? Colors.TEXT : Colors.GRAY_DARK },
            ]}
          >
            {selectedValue || placeholder}
          </Text>
        </View>
        <MaterialDesignIcons
          name="chevron-down-outline"
          size={20}
          color={Colors.GRAY_DARK}
          style={styles.iconRight}
        />
      </TouchableOpacity>
      <CountrySelect
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        onSelect={item => {
          const obj = {
            flag: item?.flag || '',
            name: item?.name?.common || '',
            area: item?.area || '',
            idd: item?.idd?.root || '',
          };
          handleSelect(obj);
        }}
        countrySelectStyle={styles.countrySelectStyle}
        style={styles.countrySelectStyle}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  // CONTROLLER ====================================
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
    marginBottom: 2,
    fontFamily: Fonts.fontMedium,
    opacity: 0.85,
  },

  input: {
    fontSize: 15,
    color: Colors.TEXT,
    fontFamily: Fonts.fontRegular,
    paddingVertical: 4,
  },

  // MODAL ==========================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  modalContent: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 18,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },

  searchInput: {
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    borderRadius: 10,
    marginBottom: 12,
    color: Colors.TEXT,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.GRAY_WHITE,
  },

  // LIST ============================================
  option: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },

  optionText: {
    fontSize: 15,
    color: Colors.TEXT,
    fontFamily: Fonts.fontRegular,
  },

  emptyText: {
    fontSize: 13,
    color: Colors.GRAY_DARK,
    textAlign: 'center',
    paddingTop: 20,
  },

  // COUNTRY SELECT ==================================
  countrySelectStyle: {
    fontFamily: Fonts.fontRegular,
  },
});
