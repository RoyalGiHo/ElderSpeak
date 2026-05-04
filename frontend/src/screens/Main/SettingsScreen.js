import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>‹ Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Cài đặt</Text>
      <Text style={styles.subtitle}>Màn hình đang được hoàn thiện.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  back: { marginBottom: 16 },
  backText: { fontSize: 16, color: "#3D5CFF" },
  title: { fontSize: 24, fontWeight: "700", color: "#3D5CFF" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 8 },
});
