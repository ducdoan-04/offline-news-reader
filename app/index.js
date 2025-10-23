import { createStackNavigator } from "@react-navigation/stack";
import { LogBox, Text, TouchableOpacity } from "react-native";
import DetailScreen from "../screens/DetailScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HomeScreen from "../screens/HomeScreen";
LogBox.ignoreLogs(["pointerEvents is deprecated"]);


const Stack = createStackNavigator();

export default function Index({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="News"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: "Offline News Reader",
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("History")}
              style={{ marginRight: 12 }}
            >
              <Text style={{ color: "#fff", fontSize: 20 }}>🕒</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          title: "Chi tiết bài viết",
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "Lịch sử đọc",
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}
