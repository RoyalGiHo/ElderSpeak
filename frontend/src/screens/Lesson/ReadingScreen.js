import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";

export default function ReadingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Luyện đọc</Text>
      <Text style={styles.subtitle}>Màn hình đang được hoàn thiện.</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Result", { mode: "reading" })}
      >
        <Text style={styles.btnText}>Hoàn thành (thử)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", color: "#185FA5" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 8 },
  btn: {
    marginTop: 24,
    backgroundColor: "#185FA5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
