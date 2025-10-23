import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";

export default function HomeScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const NEWS_KEY = "@news_cache";
  const HISTORY_KEY = "@read_history";

  // tải tin tức
  const fetchNews = async (showToast = false) => {
    setLoading(true);
    const state = await NetInfo.fetch();

    if (state.isConnected) {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=10"
        );
        const data = await response.json();
        setNews(data);
        await AsyncStorage.setItem(NEWS_KEY, JSON.stringify(data));
        setIsOffline(false);
        if (showToast)
          ToastAndroid.show("✅ Đã cập nhật tin mới", ToastAndroid.SHORT);
      } catch (error) {
        console.warn("Lỗi fetch API:", error);
        loadCached(true);
      }
    } else {
      loadCached(true);
    }
    setLoading(false);
  };

  // đọc cache
  const loadCached = async (showToast = false) => {
    const cached = await AsyncStorage.getItem(NEWS_KEY);
    if (cached) {
      setNews(JSON.parse(cached));
      setIsOffline(true);
      if (showToast)
        ToastAndroid.show("⚠️ Offline mode (dữ liệu cache)", ToastAndroid.SHORT);
    } else {
      setNews([]);
      if (showToast)
        ToastAndroid.show("😢 Không có dữ liệu offline", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews(true);
    setRefreshing(false);
  };

  const openDetail = async (item) => {
    navigation.navigate("Detail", { item });
    try {
      const old = JSON.parse(await AsyncStorage.getItem(HISTORY_KEY)) || [];
      const updated = [item, ...old.filter((x) => x.id !== item.id)];
      await AsyncStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(updated.slice(0, 20))
      );
    } catch (e) {
      console.log("Lỗi lưu lịch sử:", e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>
          Đang tải tin tức...
        </Text>
      </View>
    );
  }

  // 🧩 FIX QUAN TRỌNG — ép scroll web hoạt động
  if (Platform.OS === "web") {
    return (
      <div
        style={{
          overflowY: "auto",
          height: "100vh",
          backgroundColor: "#f8f8f8",
          padding: 10,
        }}
      >
        {isOffline && (
          <Text style={styles.offlineText}>
            ⚠️ Offline mode - dữ liệu cache
          </Text>
        )}

        {news.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => openDetail(item)}
          >
            <Image
              source={{ uri: `https://picsum.photos/seed/${item.id}/400/200` }}
              style={styles.image}
            />
            <View style={{ padding: 10 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.body}>
                {item.body}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </div>
    );
  }

  // Mobile giữ FlatList để có refresh
  return (
    <View style={styles.container}>
      {isOffline && (
        <Text style={styles.offlineText}>⚠️ Offline mode - dữ liệu cache</Text>
      )}
      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => openDetail(item)}
          >
            <Image
              source={{ uri: `https://picsum.photos/seed/${item.id}/400/200` }}
              style={styles.image}
            />
            <View style={{ padding: 10 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.body}>
                {item.body}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  offlineText: {
    textAlign: "center",
    color: "#d9534f",
    marginBottom: 8,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  image: { width: "100%", height: 180 },
  title: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  body: { fontSize: 14, color: "#555" },
});
