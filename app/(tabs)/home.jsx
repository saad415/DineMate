// app/tabs/home.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from '../../config/firebaseConfig';
import { uploadRestaurants } from '../../store/restaurants';

import { Colors } from "../../constants/Colors";
import logo from "../../assets/images/dinetimelogo.png";
import banner from "../../assets/images/homeBanner.png";

export default function Home() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);

  // check guest/email
  const temp = async () => {
    const isGuest = await AsyncStorage.getItem("isGuest");
    const email = await AsyncStorage.getItem("userEmail");
    console.log({ isGuest, email });
  };

  // fetch restaurants
  const getRestaurants = async () => {
    const q = query(collection(db, "restaurants"));
    const res = await getDocs(q);
    const data = [];
    res.forEach((doc) => data.push(doc.data()));
    setRestaurants(data);
  };

  useEffect(() => {
    getRestaurants();
    temp();
    //uploadRestaurants();
  }, []);

  // render each card
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/restaurant/[restaurant]", params: { restaurant: item.id } })}
      style={styles.card}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardText}>{item.address}</Text>
      <Text style={styles.cardText}>
        Open: {item.opening} - Close: {item.closing}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.SECONDARY}
      />

      {/* Header Bar */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Text
            style={[
              styles.headerText,
              Platform.OS === "ios"
                ? { paddingTop: 8 }
                : { paddingTop: 4 },
            ]}
          >
            Welcome to
          </Text>
          <Image source={logo} style={styles.logo} resizeMode="cover" />
        </View>
      </View>
    {/* Banner with Blur */}
    <ImageBackground
              source={banner}
              style={styles.banner}
              resizeMode="cover"
            >
              <BlurView
                intensity={Platform.OS === "android" ? 100 : 25}
                tint="dark"
                style={styles.blurOverlay}
              >
                <Text style={styles.bannerText}>
                  Dine with your loved ones
                </Text>
              </BlurView>
            </ImageBackground>

      <ScrollView
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.scrollContent}
      >
       

        {/* Special Discount Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special Discount %</Text>
        </View>

        {/* Discount List */}
        {restaurants.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <ActivityIndicator color={Colors.PRIMARY} />
        )}

        {/* Restaurants Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors.PRIMARY }]}>
            Our Restaurants
          </Text>
        </View>

        {restaurants.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <ActivityIndicator color={Colors.PRIMARY} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.SECONDARY,
    paddingBottom: Platform.OS === "android" ? 55 : 20,
  },
  scrollContent: {
    backgroundColor: Colors.SECONDARY,
  },

  // Header
  headerWrapper: {
    alignItems: "center",
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    width: "92%",
    backgroundColor: "#5f5f5f",
    borderRadius: 12,
    padding: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 14,
  },
  logo: {
    width: 80,
    height: 48,
  },

  // Banner
  banner: {
    width: "100%",
    height: 108,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  blurOverlay: {
    width: "100%",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  bannerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  // Section header
  sectionHeader: {
    backgroundColor: Colors.SECONDARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },

  // List
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#5f5f5f",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    width: 200,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    height: 112,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
});
