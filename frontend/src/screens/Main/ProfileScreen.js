import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

const IS_LOGGED_IN_KEY = "is_logged_in";
const LAST_TAB_KEY = "last_main_tab";

export default function ProfileScreen({ navigation }) {
  const achievementRows = [
    { label: "Thành tích", icon: "award", screen: "Medals" },
    { label: "Tiến độ", icon: "bar-chart-2", screen: "History" },
  ];

  const accountRows = [
    { label: "Cài đặt", icon: "settings", screen: "Settings" },
    { label: "Đánh giá ứng dụng", icon: "star", screen: "Feedback" },
    { label: "Hỗ trợ / Phản hồi", icon: "tool", screen: "Feedback" },
  ];

  const handleLogout = async () => {
    await AsyncStorage.removeItem(IS_LOGGED_IN_KEY);
    await AsyncStorage.removeItem(LAST_TAB_KEY);
    navigation.reset({
      index: 0,
      routes: [{ name: "LetLogIn" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={84} color="#0A1A47" />
          <Text style={styles.userName}>Bác A</Text>
          <Text style={styles.memberText}>Thành viên từ tháng 1 / 2025</Text>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
            <Text style={styles.editButtonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>THÀNH TÍCH</Text>
        <View style={styles.sectionList}>
          {achievementRows.map((row) => (
            <TouchableOpacity
              key={row.label}
              style={styles.row}
              onPress={() => navigation.navigate(row.screen)}
              activeOpacity={0.78}
            >
              <Feather name={row.icon} size={28} color="#17192B" />
              <Text style={styles.rowLabel}>{row.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>
        <View style={styles.sectionList}>
          {accountRows.map((row) => (
            <TouchableOpacity
              key={row.label}
              style={styles.row}
              onPress={() => navigation.navigate(row.screen)}
              activeOpacity={0.78}
            >
              <Feather name={row.icon} size={28} color="#17192B" />
              <Text style={styles.rowLabel}>{row.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.row} onPress={handleLogout} activeOpacity={0.78}>
            <Feather name="log-out" size={28} color="#17192B" />
            <Text style={styles.rowLabel}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDEFF7" },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 16,
  },
  header: {
    alignItems: "center",
    paddingBottom: 8,
  },
  userName: {
    marginTop: 2,
    fontSize: 46,
    lineHeight: 53,
    color: "#1F2D64",
    fontWeight: "800",
  },
  memberText: {
    marginTop: 2,
    color: "#6E7284",
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "500",
  },
  editButton: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: "#2B4DA7",
    borderRadius: 50,
    paddingHorizontal: 26,
    paddingVertical: 6,
  },
  editButtonText: {
    color: "#2B4DA7",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionTitle: {
    marginTop: 6,
    paddingHorizontal: 24,
    marginBottom: 4,
    color: "#757A8A",
    fontSize: 22,
    fontWeight: "800",
  },
  sectionList: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D8DCE8",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 62,
    paddingHorizontal: 24,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#D8DCE8",
  },
  rowLabel: {
    fontSize: 24,
    lineHeight: 30,
    color: "#141729",
    fontWeight: "800",
  },
});
