import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Formik } from "formik";
import Ionicons from "@expo/vector-icons/Ionicons";
import validationSchema from "../utils/guestFormSchema";


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#474747",
  },
  buttonArea: {
    borderRadius: 6,
  },
  numberBox: {
    paddingHorizontal: 8,
    backgroundColor: "#474747",
    borderColor: "#474747",
    borderWidth: 1,
  },
  numberText: {
    color: "white",
    fontSize: 18,
    paddingHorizontal: 8,
  },
  controlBox: {
    borderColor: "#f49b33",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
});


const GuestPickerComponent = ({ selectedNumber, setSelectedNumber }) => {
  const increment = () => setSelectedNumber(prev => prev + 1);
  const decrement = () => setSelectedNumber(prev => Math.max(prev - 1, 1));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={decrement} style={styles.controlBox}>
        <Text style={styles.numberText}>-</Text>
      </TouchableOpacity>

      <Text style={[styles.numberText, styles.numberBox]}>{selectedNumber}</Text>

      <TouchableOpacity onPress={increment} style={styles.controlBox}>
        <Text style={styles.numberText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GuestPickerComponent;
