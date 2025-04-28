// app/restaurant/[restaurant].jsx
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

export default function Restaurant() {
  const { restaurant } = useLocalSearchParams(); // ✅ lowercase r

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{restaurant}</Text> {/* ✅ show the restaurant name */}
    </View>
  );
}
