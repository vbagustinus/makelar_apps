import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import DateTimePicker, {
  useDefaultStyles,
  DateType,
} from 'react-native-ui-datepicker';
import { Colors } from '../styles';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from '../constants';
import dayjs from 'dayjs';
dayjs.locale('id');

export const DatePicker = ({
  label,
  placeholder = 'Pilih tanggal',
  iconName,
  onSelect,
  defaultDate,
}) => {
  console.log('defaultDate', defaultDate);

  const formattedDefaultDate = dayjs(defaultDate).format('LL');
  console.log('formattedDefaultDate', formattedDefaultDate);

  const defaultStyles = useDefaultStyles();
  const [isVisible, setIsVisible] = useState(false); // Mengatur modal
  const [selectedDate, setSelectedDate] = useState(formattedDefaultDate); // Tanggal yang dipilih
  const [date, setDate] = useState(new Date()); // Tanggal default

  useEffect(() => {
    setSelectedDate(formattedDefaultDate);
  }, [formattedDefaultDate]);

  const handleSelect = selectedDate => {
    if (!selectedDate) {
      console.warn('Tanggal yang dipilih tidak valid');
      return;
    }
    const formattedDate = dayjs(selectedDate).format('LL');
    setSelectedDate(prevDate =>
      prevDate !== formattedDate ? formattedDate : prevDate,
    );
    setDate(prevDate => (prevDate !== selectedDate ? selectedDate : prevDate));

    if (typeof onSelect === 'function') {
      console.log('Tanggal yang dipilih:', formattedDate, selectedDate);
      onSelect({
        formattedDate,
        date: dayjs(selectedDate).format(),
      });
    } else {
      console.warn('Callback onSelect tidak didefinisikan atau bukan fungsi');
    }

    setIsVisible(false); // Tutup modal
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsVisible(true)} // Tampilkan modal saat diklik
      >
        <Ionicons name={iconName} size={20} color="#fff" style={styles.icon} />
        <View style={styles.textContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          <Text
            style={[
              styles.input,
              { color: selectedDate ? '#fff' : '#ffffff80' },
            ]}
          >
            {selectedDate || placeholder}
          </Text>
        </View>
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#fff"
          style={styles.iconRight}
        />
      </TouchableOpacity>

      {/* Modal untuk DatePicker */}
      <Modal
        navigationBarTranslucent
        statusBarTranslucent
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={Colors.GRADIENT_ROYAL}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.modalContent}
          >
            <DateTimePicker
              locale="id"
              mode="single"
              date={date}
              onChange={({ date: newDate }) => {
                if (newDate) {
                  handleSelect(newDate);
                } else {
                  console.warn(
                    'Tidak ada tanggal yang dipilih di DateTimePicker',
                  );
                }
              }}
              maxDate={new Date()}
              styles={{
                ...defaultStyles,
                today: {
                  borderColor: Colors.WHITE,
                  borderWidth: 0.5,
                  fontFamily: Fonts.fontRegular,
                  borderRadius: 10,
                },
                selected: {
                  backgroundColor: Colors.PRIMARY,
                  color: Colors.WHITE,
                  fontFamily: Fonts.fontRegular,
                  borderRadius: 10,
                  borderColor: Colors.WHITE,
                  borderWidth: 0.5,
                },
                selected_label: {
                  color: Colors.WHITE,
                  fontFamily: Fonts.fontRegular,
                  borderRadius: 10,
                },
                day_cell: {
                  color: Colors.WHITE,
                  fontFamily: Fonts.fontRegular,
                },
                day_label: {
                  color: Colors.WHITE,
                  fontFamily: Fonts.fontRegular,
                },
                day: { color: Colors.WHITE, fontFamily: Fonts.fontRegular },
                days: { color: Colors.WHITE, fontFamily: Fonts.fontRegular },
                month_label: {
                  color: Colors.WHITE,
                  fontFamily: Fonts.fontRegular,
                },
                month_selector: { color: Colors.WHITE },
                year_label: {
                  color: Colors.WHITE,
                  fontFamily: Fonts.fontRegular,
                },
                active_year_label: {
                  color: Colors.WHITE,
                  fontFamily: Fonts.fontRegular,
                },
                header: { color: Colors.WHITE, fontFamily: Fonts.fontRegular },
                disabled_label: {
                  color: Colors.GRAY,
                  fontFamily: Fonts.fontRegular,
                },
                disabled: { color: Colors.GRAY, fontFamily: Fonts.fontRegular },
                today_label: {
                  color: Colors.WHITE,
                  fontFamily: Fonts.fontRegular,
                },
                button_next_image: { tintColor: Colors.WHITE },
                button_prev_image: { tintColor: Colors.WHITE },
                year_selector_label: {
                  color: Colors.WHITE,
                  fontFamily: Fonts.fontSemiBold,
                },
                month_selector_label: {
                  color: Colors.WHITE,
                  fontFamily: Fonts.fontSemiBold,
                },
                weekday_label: {
                  color: Colors.GRAY_MEDIUM,
                  fontFamily: Fonts.fontRegular,
                },
              }}
            />
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff30',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  icon: {
    marginRight: 12,
  },
  iconRight: {
    marginLeft: 8,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#ffffff70',
    marginBottom: 4,
    fontFamily: Fonts.fontRegular,
  },
  input: {
    fontSize: 14,
    color: '#fff',
    fontFamily: Fonts.fontRegular,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    padding: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.fontRegular,
  },
});
