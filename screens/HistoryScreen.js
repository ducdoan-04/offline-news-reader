import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const data = await AsyncStorage.getItem("@read_history");
    if (data) setHistory(JSON.parse(data));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadHistory);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕒 Lịch sử đọc gần đây</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("Detail", { item })}
          >
            <Text style={styles.headline}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.subtext}>
              {item.body}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  item: { backgroundColor: "#f2f2f2", padding: 10, borderRadius: 8, marginBottom: 8 },
  headline: { fontWeight: "bold", fontSize: 15 },
  subtext: { color: "#555", fontSize: 13 },
});
