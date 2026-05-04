import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";

export default function ChooseModeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chọn chế độ</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Listening")}
      >
        <Text style={styles.btnText}>Nghe</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Writing")}
      >
        <Text style={styles.btnText}>Viết</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", color: "#3D5CFF", marginBottom: 24 },
  btn: {
    backgroundColor: "#3D5CFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
