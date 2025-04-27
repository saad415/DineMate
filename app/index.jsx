import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
      }}
    >
      <Text style={{ color: "white", textAlign: "center" }}>
        Lets See if text is updated.
      </Text>
      <TouchableOpacity 
        onPress={() => {
            router.push("/home");
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Click me</Text>
      </TouchableOpacity>
    </View>
  );
}
