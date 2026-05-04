import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";

export default function FlashCardTopicsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Học từ vựng</Text>
      <Text style={styles.subtitle}>Chọn chủ đề để bắt đầu (đang hoàn thiện).</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("FlashCard", { topicId: "demo" })}
      >
        <Text style={styles.btnText}>Thử flashcard mẫu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", color: "#3D5CFF" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 8 },
  btn: {
    marginTop: 24,
    backgroundColor: "#3D5CFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
