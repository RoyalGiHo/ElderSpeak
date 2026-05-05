import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { useAppSettings } from "../../store/AppSettingsContext";
import { THEME } from "../../data/themePalette";

export default function FillProfileScreen({ navigation, route }) {
  const { phone } = route.params || {};
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const palette = isDark ? THEME.dark : THEME.light;

  const handleConfirm = () => {
    if (!name) return;
    // Mock: đi sang OTP
    navigation.navigate("OTP", { mode: "register", phone });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.page }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.backText, { color: palette.text }]}>← Cập nhật thông tin</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Avatar placeholder */}
        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Họ và tên */}
        <View style={[styles.inputRow, { backgroundColor: isDark ? palette.card : "#F5F5F5" }]}>
          <Text style={styles.inputIcon}>👤</Text>
          <TextInput
            style={[styles.input, { color: palette.text }]}
            placeholder="Họ và tên"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Sinh nhật */}
        <View style={[styles.inputRow, { backgroundColor: isDark ? palette.card : "#F5F5F5" }]}>
          <Text style={styles.inputIcon}>📅</Text>
          <TextInput
            style={[styles.input, { color: palette.text }]}
            placeholder="Sinh nhật của bạn"
            value={birthday}
            onChangeText={setBirthday}
          />
        </View>

        {/* Email */}
        <View style={[styles.inputRow, { backgroundColor: isDark ? palette.card : "#F5F5F5" }]}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={[styles.input, { color: palette.text }]}
            placeholder="Email (Tùy chọn)"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <PrimaryButton
          label="Xác nhận"
          onPress={handleConfirm}
          disabled={!name}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: { paddingHorizontal: 24, paddingTop: 16 },
  backText: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 32 },
  avatarArea: { alignItems: "center", marginBottom: 32, position: "relative" },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E8EAFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: { fontSize: 40 },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#4CAF50",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: { fontSize: 14 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 52,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#1a1a1a" },
});
