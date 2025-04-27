// app/index.jsx
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import logo from "../assets/images/dinetimelogo.png";
const entryImg = require("../assets/images/Frame.png");

// ← import your color palette
import { Colors } from "../constants/Colors";

export default function Index() {
  const router = useRouter();

  const handleGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          {/* Logo */}
          <Image source={logo} style={styles.logo} resizeMode="contain" />

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              style={[styles.button, styles.signUpButton]}
            >
              <Text style={[styles.buttonText, styles.signUpText]}>
                Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGuest}
              style={[styles.button, styles.guestButton]}
            >
              <Text style={[styles.buttonText, styles.guestText]}>
                Guest User
              </Text>
            </TouchableOpacity>
          </View>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign In Link */}
          <TouchableOpacity
            onPress={() => router.push("/signin")}
            style={styles.signInContainer}
          >
            <Text style={styles.signInText}>Already a User? </Text>
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
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
  // full‐screen container, dark background
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY,
  },
  // make scrollable fill, center content top-to-bottom
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },

  // Top block: logo + buttons + links
  topSection: {
    alignItems: "center",
    padding: 16,
  },

  // Logo image
  logo: {
    width: 300,
    height: 300,
    marginBottom: 24,
  },

  // Button group spacing
  buttonGroup: {
    width: "75%",
  },

  // Common button style
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  // Sign-up button background
  signUpButton: {
    backgroundColor: Colors.PRIMARY,
  },
  // Guest button outline
  guestButton: {
    backgroundColor: Colors.SECONDARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  // Common text in buttons
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  // Text colors
  signUpText: {
    color: "#000",
  },
  guestText: {
    color: Colors.PRIMARY,
  },

  // Divider with lines + “or”
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.PRIMARY,
  },
  dividerText: {
    marginHorizontal: 8,
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // Sign-in link row
  signInContainer: {
    flexDirection: "row",
  },
  signInText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  signInLink: {
    color: Colors.PRIMARY,
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
  },

  // Bottom illustration
  bottomImageContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  bottomImage: {
    width: "100%",
    height: 150,
  },
});
