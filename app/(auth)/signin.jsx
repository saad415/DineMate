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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { Colors } from "../../constants/Colors";  
import logo from "../../assets/images/dinetimelogo.png";
const entryImg = require("../../assets/images/Frame.png");
import { app } from "../../config/firebaseConfig";  // Add this import


export default function Signup() {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  const handleGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };

  const handleSignin = async (values) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredentials.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        await AsyncStorage.setItem("userEmail", values.email);
        await AsyncStorage.setItem("isGuest", "false");
        router.push("/home");
      } else {
        Alert.alert("Error", "No user data found.");
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        Alert.alert("Signin Failed", "Incorrect credentials. Try again.");
      } else {
        Alert.alert("Sign in Error", "Unexpected error, try later.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>Let's get you started</Text>

          <View style={styles.formContainer}>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignin}
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
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    placeholder="you@example.com"
                    placeholderTextColor="#888"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}

                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    placeholder="••••••••"
                    placeholderTextColor="#888"
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}

                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={[styles.button, styles.signInButton]}
                  >
                    <Text style={[styles.buttonText, styles.signInText]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <View style={styles.linksContainer}>
              <TouchableOpacity
                onPress={() => router.push("/signup")}
                style={styles.linkRow}
              >
                <Text style={styles.linkText}>New User? </Text>
                <Text style={styles.linkAccent}>Sign up</Text>
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
    alignItems: "center",
    padding: 16,
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
  formContainer: {
    width: "83%",
  },
  label: {
    color: Colors.PRIMARY,
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 8,
    color: "#fff",
    backgroundColor: "#2b2b2b",
  },
  error: {
    color: "#f87171", // red-500
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 24,
    alignItems: "center",
  },
  signInButton: {
    backgroundColor: Colors.PRIMARY,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signInText: {
    color: "#000",
  },
  linksContainer: {
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
