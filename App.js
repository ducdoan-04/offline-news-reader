import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DetailScreen from "./screens/DetailScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="News"
          component={HomeScreen}
          options={{
            title: "Offline News Reader",
            headerStyle: { backgroundColor: "#007AFF" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
          }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
