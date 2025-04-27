import { Text, View } from "react-native";

export default function Details() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "blue",
      }}
    >
      <Text style={{ color: "white", textAlign: "center" }}>
        This is the details page!
      </Text>
    </View>
  );
} 