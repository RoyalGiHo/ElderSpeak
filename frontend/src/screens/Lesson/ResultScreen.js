import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";

export default function ResultScreen({ navigation, route }) {
  const mode = route?.params?.mode ?? "lesson";

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kết quả</Text>
      <Text style={styles.subtitle}>Chế độ: {mode}</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("MainTabs")}
      >
        <Text style={styles.btnText}>Về trang chủ</Text>
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
