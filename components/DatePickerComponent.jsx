import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  roundedLg: {
    borderRadius: 12,
  },
  textWhite: {
    color: 'white',
  },
  textBase: {
    fontSize: 16,
  },
  px2: {
    paddingHorizontal: 8,
  },
  py1: {
    paddingVertical: 4,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  bgGray: {
    backgroundColor: '#474747',
  },
});

const DatePickerComponent = ({ date, setDate }) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  const handlePress = () => {
    setShow(true);
  };
  return (
    <View style={styles.flexRow}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.roundedLg, styles.textWhite, styles.textBase, Platform.OS === 'android' && styles.px2, Platform.OS === 'android' && styles.py1, Platform.OS === 'android' && styles.justifyCenter, Platform.OS === 'android' && styles.bgGray]}
      >
        {Platform.OS === 'android' && (
          <Text style={[styles.px2, styles.py1, styles.bgGray, styles.textWhite]}>
            {date.toLocaleDateString()}
          </Text>
        )}
        {Platform.OS === 'android' && show && (
          <DateTimePicker
            accentColor="#f49b33"
            textColor="#f49b33"
            value={date}
            mode="date"
            onChange={onChange}
            display="default"
            minimumDate={new Date()}
            maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          />
        )}
        {Platform.OS == 'ios' && (
          <DateTimePicker
            accentColor="#f49b33"
            textColor="#f49b33"
            value={date}
            mode="date"
            onChange={onChange}
            display="default"
            minimumDate={new Date()}
            maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DatePickerComponent;