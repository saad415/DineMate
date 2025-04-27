// app/signup.jsx
import React from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import validationSchema from "../../utils/authSchema";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

import { Colors } from "../../constants/Colors";
import logo from "../../assets/images/dinetimelogo.png";
const entryImg = require("../../assets/images/Frame.png");

export default function Signup() {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  const handleGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };

  const handleSignup = async (values) => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCred.user;
      await setDoc(doc(db, "users", user.uid), {
        email: values.email,
        createdAt: new Date(),
      });
      await AsyncStorage.setItem("userEmail", values.email);
      await AsyncStorage.setItem("isGuest", "false");
      router.push("/home");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Signup Failed!",
          "This email address is already in use. Please use a different email.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Signup Error",
          "An unexpected error occurred. Please try again later.",
          [{ text: "OK" }]
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>Let's get you started</Text>

          <View style={styles.formWrapper}>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignup}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  {/* Email Field */}
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}

                  {/* Password Field */}
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#888"
                    secureTextEntry
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}

                  {/* Sign Up Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={[styles.button, styles.primaryButton]}
                  >
                    <Text style={[styles.buttonText, styles.primaryButtonText]}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            {/* Footer Links */}
            <View style={styles.linkSection}>
              <TouchableOpacity
                onPress={() => router.push("/signin")}
                style={styles.linkRow}
              >
                <Text style={styles.linkText}>Already a User? </Text>
                <Text style={styles.linkAccent}>Sign in</Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                onPress={handleGuest}
                style={styles.linkRow}
              >
                <Text style={styles.linkText}>Be a </Text>
                <Text style={styles.linkAccent}>Guest User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Illustration */}
        <View style={styles.bottomImageContainer}>
          <Image
            source={entryImg}
            style={styles.bottomImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.SECONDARY}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  topSection: {
    padding: 16,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  formWrapper: {
    width: "83%",
  },
  label: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 8,
    color: "#fff",
    backgroundColor: Colors.SECONDARY,
  },
  error: {
    color: "#f87171",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: Colors.PRIMARY,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#000",
  },
  linkSection: {
    alignItems: "center",
    marginTop: 16,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  linkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  linkAccent: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.PRIMARY,
  },
  dividerText: {
    marginHorizontal: 8,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomImageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  bottomImage: {
    width: "100%",
    height: 150,
  },
});
