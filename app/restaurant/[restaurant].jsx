import {
  View,
  Text,
  Platform,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  Linking,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import DatePickerComponent from "../../components/DatePickerComponent";
import GuestPickerComponent from "../../components/GuestPickerComponent";
import FindSlots from "../../components/FindSlots";

export default function Restaurant() {
  const { restaurant } = useLocalSearchParams();
  const flatListRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState({});

  const [slotsData, setSlotsData] = useState({});

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(2);
  const [date, setDate] = useState(new Date());

  const handleNextImage = () => {
    const carouselLength = carouselData[0]?.images.length;
    if (currentIndex < carouselLength - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }

    if (currentIndex == carouselLength - 1) {
      const nextIndex = 0;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  };
  const handlePrevImage = () => {
    const carouselLength = carouselData[0]?.images.length;
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }

    if (currentIndex == 0) {
      const prevIndex = carouselLength - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const carouselItem = ({ item }) => {
    return (
      <View style={{ width: windowWidth - 2, height: 256, position: 'relative' }}>
        <View
          style={{
            position: "absolute",
            top: "50%",
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 50,
            padding: 5,
            zIndex: 10,
            right: "6%",
          }}
        >
          <Ionicons
            onPress={handleNextImage}
            name="arrow-forward"
            size={24}
            color="white"
          />
        </View>
        <View
          style={{
            position: "absolute",
            top: "50%",
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 50,
            padding: 5,
            zIndex: 10,
            left: "2%",
          }}
        >
          <Ionicons
            onPress={handlePrevImage}
            name="arrow-back"
            size={24}
            color="white"
          />
        </View>
        <View
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            left: "50%",
            transform: [{ translateX: -50 }],
            zIndex: 10,
            bottom: 15,
          }}
        >
          {carouselData[0].images?.map((_, i) => (
            <View
              key={i}
              style={{
                backgroundColor: 'white',
                height: i == currentIndex ? 12 : 8,
                width: i == currentIndex ? 12 : 8,
                padding: 1,
                marginHorizontal: 4,
                borderRadius: 50,
              }}
            />
          ))}
        </View>
        <Image
          source={{ uri: item }}
          style={{
            opacity: 0.5,
            backgroundColor: "black",
            marginRight: 20,
            marginLeft: 5,
            borderRadius: 25,
            height: 256,
          }}
        />
      </View>
    );
  };

  const getRestaurantData = async () => {
    console.log("Restaurant name:", restaurant);
    try {
      const restaurantQuery = query(
        collection(db, "restaurants"),
        where("id", "==", restaurant)
      );
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (restaurantSnapshot.empty) {
        console.log("No matching restaurant found");
        return;
      }

      for (const restaurantDoc of restaurantSnapshot.docs) {
        const restaurantData = restaurantDoc.data();
        setRestaurantData(restaurantData);

        const restaurantId = restaurantData.id;
        const restaurantRef = doc(db, "restaurants", restaurantId);

        const carouselQuery = query(
          collection(db, "carouselImages"),
          where("res_id", "==", restaurantRef)
        );
        const carouselSnapshot = await getDocs(carouselQuery);
        const carouselImages = [];
        if (carouselSnapshot.empty) {
          console.log("No matching carousel found");
          return;
        }
        carouselSnapshot.forEach((carouselDoc) => {
          carouselImages.push(carouselDoc.data());
        });
        setCarouselData(carouselImages);

        const slotsQuery = query(
          collection(db, "slots"),
          where("ref_id", "==", restaurantRef)
        );
        const slotsSnapshot = await getDocs(slotsQuery);
        const slots = [];
        if (slotsSnapshot.empty) {
          console.log("No matching slots found");
          return;
        }
        slotsSnapshot.forEach((slotDoc) => {
          slots.push(slotDoc.data());
        });
        setSlotsData(slots[0]?.slot);
      }
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };
  const handleLocation = async () => {
    const url = "https://maps.app.goo.gl/TtSmNr394bVp9J8n8";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URL", url);
    }
  };
  useEffect(() => {
    console.log("Restaurant ID:", restaurant);
    getRestaurantData();
  }, [restaurant]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#2b2b2b",
        paddingBottom: Platform.OS == "android" ? 55 : 20,
      }}
    >
      <ScrollView style={{ height: '100%' }}>
        <View style={{ flex: 1, marginVertical: 8, padding: 8 }}>
          <Text style={{ fontSize: 24, color: "#f49b33", marginRight: 8, fontWeight: '600' }}>
            {restaurant}
          </Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "#f49b33" }} />
        </View>
        <View style={{ height: 256, maxWidth: '98%', marginHorizontal: 8, borderRadius: 25 }}>
          <FlatList
            ref={flatListRef}
            data={carouselData[0]?.images}
            renderItem={carouselItem}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            style={{ borderRadius: 25 }}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 8, padding: 8 }}>
          <Ionicons name="location-sharp" size={24} color="#f49b33" />
          <Text style={{ maxWidth: '75%', color: 'white' }}>
            {restaurantData?.address} |{"  "}
            <Text
              onPress={handleLocation}
              style={{ textDecorationLine: 'underline', flex: 1, marginTop: 4, color: "#f49b33", fontStyle: 'italic', fontWeight: '600' }}
            >
              Get Direction
            </Text>
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', padding: 8 }}>
          <Ionicons name="time" size={20} color="#f49b33" />
          <Text style={{ maxWidth: '75%', marginHorizontal: 8, fontWeight: '600', color: 'white' }}>
            {restaurantData?.opening} - {restaurantData?.closing}
          </Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, margin: 8, padding: 8, borderColor: "#f49b33", borderRadius: 8 }}>
          <View style={{ flex: 1, flexDirection: 'row', margin: 8, padding: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Ionicons name="calendar" size={20} color="#f49b33" />
              <Text style={{ color: 'white', marginHorizontal: 8, fontSize: 16 }}>
                Select booking date
              </Text>
            </View>
            <DatePickerComponent date={date} setDate={setDate} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', backgroundColor: "#474747", borderRadius: 8, margin: 8, padding: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Ionicons name="people" size={20} color="#f49b33" />
              <Text style={{ color: 'white', marginHorizontal: 8, fontSize: 16 }}>
                Select number of guests
              </Text>
            </View>
            <GuestPickerComponent
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FindSlots
            restaurant={restaurant}
            date={date}
            selectedNumber={selectedNumber}
            slots={slotsData}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}