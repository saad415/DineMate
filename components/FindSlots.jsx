import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Formik } from "formik";
import Ionicons from "@expo/vector-icons/Ionicons";
import validationSchema from "../utils/guestFormSchema";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#f49b33',
    padding: 8,
    marginVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  slotsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginHorizontal: 8,
    padding: 8,
    backgroundColor: '#474747',
    borderRadius: 8,
  },
  slotButton: {
    margin: 8,
    padding: 16,
    backgroundColor: '#f49b33',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotButtonDisabled: {
    opacity: 0.5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#474747',
    marginHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 24,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  submitButton: {
    padding: 8,
    marginVertical: 8,
    backgroundColor: '#f49b33',
    borderRadius: 8,
    marginTop: 40,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

const FindSlots = ({
  date,
  selectedNumber,
  slots,
  selectedSlot,
  setSelectedSlot,
  restaurant,
}) => {
  const [slotsVisible, setSlotsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [guestCount, setGuestCount] = useState(1);

  const handlePress = () => {
    setSlotsVisible(!slotsVisible);
  };

  const handleBooking = async () => {
    const userEmail = await AsyncStorage.getItem("userEmail");
    const guestStatus = await AsyncStorage.getItem("isGuest");
    if (userEmail) {
      try {
        await addDoc(collection(db, "bookings"), {
          email: userEmail,
          slot: selectedSlot,
          date: date.toISOString(),
          guests: selectedNumber,
          restaurant: restaurant,
        });

        alert("Booking successfully Done!");
      } catch (error) {
        console.log(error);
      }
    } else if (guestStatus === "true") {
      setFormVisible(true);
      setModalVisible(true);
    }
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleSlotPress = (slot) => {
    let prevSlot = selectedSlot;
    if (prevSlot == slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };
  const handleFormSubmit = async (values) => {
    try {
      await addDoc(collection(db, "bookings"), {
        ...values,
        slot: selectedSlot,
        date: date.toISOString(),
        guests: selectedNumber,
        restaurant: restaurant,
      });

      alert("Booking successfully Done!");
      setModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const incrementGuestCount = () => {
    setGuestCount(prevCount => prevCount + 1);
  };

  const decrementGuestCount = () => {
    if (guestCount > 1) {
      setGuestCount(prevCount => prevCount - 1);
    }
  };

  console.log('slotsVisible:', slotsVisible);
  console.log('guestCount:', guestCount);

  return (
    <View style={styles.container}>
      <View style={[selectedSlot != null && { flexDirection: 'row' }]}>
        <View style={[selectedSlot != null && { flex: 1 }]}>
          <TouchableOpacity onPress={handlePress}>
            <Text style={styles.button}>Find Slots</Text>
          </TouchableOpacity>
        </View>
        {selectedSlot != null && (
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleBooking}>
              <Text style={styles.buttonText}>Book Slot</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {slotsVisible && (
        <View style={styles.slotsContainer}>
          {slots && slots.length > 0 ? (
            slots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.slotButton, selectedSlot && selectedSlot !== slot && styles.slotButtonDisabled]}
                onPress={() => handleSlotPress(slot)}
                disabled={selectedSlot == slot || selectedSlot == null ? false : true}
              >
                <Text style={styles.buttonText}>{slot}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.buttonText}>No available slots for this date</Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 12 }}>
            <TouchableOpacity onPress={decrementGuestCount} style={styles.slotButton}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.buttonText, { marginHorizontal: 20 }]}>{guestCount}</Text>
            <TouchableOpacity onPress={incrementGuestCount} style={styles.slotButton}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          margin: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {formVisible && (
              <Formik
                initialValues={{ fullName: '', phoneNumber: '' }}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={{ width: '100%' }}>
                    <View>
                      <Ionicons
                        name="close-sharp"
                        size={30}
                        color={'#f49b33'}
                        onPress={handleCloseModal}
                      />
                    </View>
                    <Text style={styles.buttonText}>Name</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('fullName')}
                      value={values.fullName}
                      onBlur={handleBlur('fullName')}
                    />

                    {touched.fullName && errors.fullName && (
                      <Text style={styles.errorText}>{errors.fullName}</Text>
                    )}
                    <Text style={styles.buttonText}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('phoneNumber')}
                      value={values.phoneNumber}
                      onBlur={handleBlur('phoneNumber')}
                    />

                    {touched.phoneNumber && errors.phoneNumber && (
                      <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                    )}

                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={styles.submitButton}
                    >
                      <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FindSlots;