import React, { useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BaseView, DropdownSearchableDefault } from '../../components';
import { Fonts, propertyCategories, propertyStatuses } from '../../constants';
import { useThemeColors } from '../../styles';

function GlobalPropertyFilterScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const currentFilters = route.params?.currentFilters || {};

  const [propertyType, setPropertyType] = React.useState(
    currentFilters.propertyType || null,
  );
  const [status, setStatus] = React.useState(currentFilters.status || null);
  const [searchQuery, setSearchQuery] = React.useState(
    currentFilters.search || '',
  );

  const handleApply = () => {
    const filters = { propertyType, status, search: searchQuery };
    navigation.navigate('Main', {
      screen: 'Semua',
      params: { filters, updatedAt: Date.now() },
      merge: true,
    });
  };

  const handleReset = () => {
    setPropertyType(null);
    setStatus(null);
    setSearchQuery('');
  };

  return (
    <BaseView
      title="Filter Properti"
      disableLeftMenu
      containerStyle={{ flex: 1, backgroundColor: colors.BACKGROUND }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Kata kunci</Text>
        <View style={styles.searchRow}>
          <MaterialCommunityIcons
            name="magnify"
            size={18}
            color={colors.GREY}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau lokasi properti"
            placeholderTextColor={colors.GREY}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={colors.GREY}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Kategori</Text>
        <DropdownSearchableDefault
          placeholder="Pilih tipe properti"
          iconName="home-outline"
          options={propertyCategories}
          onSelect={setPropertyType}
          value={propertyType}
          styleContainer={{ marginVertical: 4 }}
        />

        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Status</Text>
        <DropdownSearchableDefault
          placeholder="Pilih status"
          iconName="tag-outline"
          options={propertyStatuses}
          onSelect={setStatus}
          value={status}
          styleContainer={{ marginVertical: 4 }}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <MaterialCommunityIcons
            name="refresh"
            size={18}
            color={colors.PRIMARY}
          />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <MaterialCommunityIcons name="check" size={18} color={colors.WHITE} />
          <Text style={styles.applyText}>Terapkan</Text>
        </TouchableOpacity>
      </View>
    </BaseView>
  );
}

const createStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
      marginBottom: 8,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.CARD,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    searchInput: {
      flex: 1,
      fontFamily: Fonts.fontRegular,
      fontSize: 14,
      color: colors.TEXT,
      marginLeft: 8,
    },
    clearButton: {
      padding: 4,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderTopWidth: 1,
      borderColor: colors.GRAY_LIGHT,
      backgroundColor: colors.CARD,
    },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor:
        colors.BACKGROUND === '#0D1B2D' ? '#0F1C34' : colors.BACKGROUND,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.PRIMARY,
    },
    resetText: {
      marginLeft: 6,
      color: colors.PRIMARY,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 13,
    },
    applyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.PRIMARY,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: colors.PRIMARY,
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    applyText: {
      marginLeft: 8,
      color: colors.WHITE,
      fontFamily: Fonts.fontSemiBold,
      fontSize: 14,
    },
  });

export default GlobalPropertyFilterScreen;
