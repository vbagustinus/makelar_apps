import React, { useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import LinearGradient from 'react-native-linear-gradient';
import { Text, TouchableOpacity } from '../../components';
import { Fonts } from '../../constants';
import { useThemeColors } from '../../styles';
import useThemeStore from '../../store/useThemeStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const theme = useThemeStore(state => state.theme);
  const setTheme = useThemeStore(state => state.setTheme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.BACKGROUND,  }]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <LinearGradient
        colors={colors.GRADIENT_ROYAL}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, {paddingTop: insets.top + 20}]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <MaterialDesignIcons
              name="tune-variant"
              size={20}
              color={colors.WHITE}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Pengaturan Tampilan</Text>
            <Text style={styles.headerSubtitle}>
              Ubah tema aplikasi sesuai preferensi Anda.
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.headerToggle}
            activeOpacity={0.85}
          >
            <MaterialDesignIcons
              name={theme === 'dark' ? 'weather-night' : 'white-balance-sunny'}
              size={22}
              color={colors.PRIMARY}
            />
            <Text style={styles.headerToggleText}>
              {theme === 'dark' ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconBadge}>
              <MaterialDesignIcons
                name="theme-light-dark"
                size={20}
                color={colors.PRIMARY}
              />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.title}>Mode Gelap</Text>
              <Text style={styles.caption}>
                Sesuaikan tampilan ke mode gelap sesuai contoh desain.
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={value => setTheme(value ? 'dark' : 'light')}
              thumbColor={colors.WHITE}
              trackColor={{ false: colors.GRAY_LIGHT, true: colors.PRIMARY }}
            />
          </View>
        </View>

        <View style={styles.previewWrapper}>
          <Text style={styles.previewTitle}>Pratinjau</Text>
          <View style={styles.previewRow}>
            <View
              style={[styles.previewCard, { backgroundColor: colors.CARD }]}
            >
              <Text style={styles.previewLabel}>
                {theme === 'dark' ? 'Mode Gelap Aktif' : 'Mode Terang Aktif'}
              </Text>
              <Text style={styles.previewText}>
                Tema akan diaplikasikan pada halaman utama dan navigasi.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = colors =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    headerIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.WHITE_20,
    },
    headerTitle: {
      fontFamily: Fonts.fontSemiBold,
      fontSize: 18,
      color: colors.WHITE,
    },
    headerSubtitle: {
      fontFamily: Fonts.fontRegular,
      fontSize: 13,
      color: colors.WHITE_80,
      marginTop: 4,
    },
    headerToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.WHITE,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
      gap: 6,
    },
    headerToggleText: {
      fontFamily: Fonts.fontSemiBold,
      color: colors.PRIMARY,
      fontSize: 13,
    },
    content: {
      padding: 16,
      paddingBottom: 24,
      gap: 16,
    },
    card: {
      backgroundColor: colors.CARD,
      padding: 16,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.HAZE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowText: { flex: 1 },
    title: {
      fontFamily: Fonts.fontSemiBold,
      fontSize: 16,
      color: colors.TEXT,
    },
    caption: {
      fontFamily: Fonts.fontRegular,
      fontSize: 13,
      color: colors.GREY,
      marginTop: 2,
    },
    previewWrapper: { gap: 8 },
    previewTitle: {
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
      fontSize: 15,
      marginHorizontal: 4,
    },
    previewRow: { flexDirection: 'row', gap: 12 },
    previewCard: {
      flex: 1,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.GRAY_LIGHT,
    },
    previewLabel: {
      fontFamily: Fonts.fontSemiBold,
      color: colors.TEXT,
      fontSize: 14,
    },
    previewText: {
      fontFamily: Fonts.fontRegular,
      color: colors.GREY,
      fontSize: 13,
      marginTop: 6,
      lineHeight: 18,
    },
  });

export default SettingsScreen;
