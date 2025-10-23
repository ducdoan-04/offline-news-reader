import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform, Share } from "react-native";

// Hàm share đa nền tảng
export async function shareNews(item) {
  const shareText = `${item.title}\n\n${item.body}\n\nĐọc thêm: https://jsonplaceholder.typicode.com/posts/${item.id}`;

  // Web — dùng navigator.share
  if (Platform.OS === "web") {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: `https://jsonplaceholder.typicode.com/posts/${item.id}`,
        });
      } catch (e) {
        console.log("Web share cancel:", e);
      }
    } else {
      alert("Trình duyệt của bạn không hỗ trợ chia sẻ");
    }
    return;
  }

  // Mobile — dùng expo-sharing nếu có ảnh
  try {
    const imageUrl = `https://picsum.photos/seed/${item.id}/400/200`;
    const localUri = `${FileSystem.cacheDirectory}${item.id}.jpg`;

    // Tải ảnh về cache tạm
    const download = await FileSystem.downloadAsync(imageUrl, localUri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(download.uri, {
        dialogTitle: item.title,
      });
    } else {
      // Fallback khi không có expo-sharing (ví dụ iOS simulator)
      await Share.share({ message: shareText });
    }
  } catch (e) {
    console.log("Lỗi chia sẻ:", e);
    await Share.share({ message: shareText });
  }
}
