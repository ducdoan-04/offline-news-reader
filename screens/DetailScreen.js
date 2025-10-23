import * as Sharing from "expo-sharing";
import {
  Button,
  Image, Platform, ScrollView, Share, StyleSheet,
  Text,
  ToastAndroid,
  View
} from "react-native";

import { shareNews } from "../utils/shareNews";

export default function DetailScreen({ route }) {
  const { item } = route.params;

const sharePost = async () => {
  try {
    const text = `${item.title}\n\n${item.body}`;
    if (Platform.OS === "web") {
      await Share.share({ message: text, title: item.title });
    } else {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(undefined, {
          dialogTitle: "Chia sẻ bài viết",
          message: text,
        });
      } else {
        await Share.share({ message: text });
      }
    }
    ToastAndroid.show("📤 Đã mở menu chia sẻ", ToastAndroid.SHORT);
  } catch (error) {
    console.log("Share error:", error);
  }
};

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: `https://picsum.photos/seed/${item.id}/800/400`,
        }}
        style={styles.image}
      />

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>

      <View style={styles.metaBox}>
        <Text style={styles.meta}>🕒 Đăng lúc: 10:30 AM, 23/10/2025</Text>
        <Text style={styles.meta}>✍️ Tác giả: AI Reporter</Text>
      </View>

      {/* <TouchableOpacity style={styles.shareBtn} onPress={sharePost}>
        <Text style={styles.shareText}>📤 Chia sẻ bài viết</Text>
      </TouchableOpacity> */}
      <View style={{ marginTop: 20 }}>
        <Button title="📤 Chia sẻ bài viết" onPress={() => shareNews(item)} />
      </View>

      <View style={styles.footerBox}>
        <Text style={styles.footerTitle}>📖 Gợi ý đọc thêm</Text>
        <Text style={styles.footerText}>
          - 10 xu hướng công nghệ nổi bật 2025{"\n"}
          - Ứng dụng AI giúp tối ưu học tập{"\n"}
          - 5 cách bảo vệ dữ liệu cá nhân khi online
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 240, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 16, marginHorizontal: 16, color: "#007AFF" },
  body: { fontSize: 16, lineHeight: 26, margin: 16, color: "#333", textAlign: "justify" },
  metaBox: { backgroundColor: "#f5f5f5", padding: 12, marginHorizontal: 16, borderRadius: 8 },
  meta: { fontSize: 13, color: "#666" },
  shareBtn: {
    backgroundColor: "#007AFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  shareText: { color: "#fff", fontWeight: "bold" },
  footerBox: { margin: 16, padding: 12, backgroundColor: "#eef7ff", borderRadius: 8 },
  footerTitle: { fontWeight: "bold", color: "#007AFF", marginBottom: 6 },
  footerText: { color: "#444", fontSize: 14, lineHeight: 22 },
});
