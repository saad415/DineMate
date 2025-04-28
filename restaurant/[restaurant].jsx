// app/tabs/home.jsx
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, Text } from "react-native";
// ✓ import the named export

export default function Restaurant() {
const { Restaurant} = useLocalSearchParams();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{Restaurant}</Text>
    </View>
  );
}
