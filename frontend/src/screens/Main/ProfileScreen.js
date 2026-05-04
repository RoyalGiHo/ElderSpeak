import React from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function ProfileScreen({ navigation }) {
  const rows = [
    { label: "Cài đặt", screen: "Settings" },
    { label: "Lịch sử", screen: "History" },
    { label: "Góp ý", screen: "Feedback" },
    { label: "Huy chương", screen: "Medals" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Thông tin</Text>
      <ScrollView style={styles.list}>
        {rows.map((r) => (
          <TouchableOpacity
            key={r.screen}
            style={styles.row}
            onPress={() => navigation.navigate(r.screen)}
          >
            <Text style={styles.rowLabel}>{r.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", color: "#3D5CFF" },
  list: { marginTop: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  rowLabel: { fontSize: 16, color: "#333" },
  chevron: { fontSize: 22, color: "#999" },
});
