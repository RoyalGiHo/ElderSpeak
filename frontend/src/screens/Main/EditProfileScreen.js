import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Text from "../../components/AppText";
import PrimaryButton from "../../components/PrimaryButton";
import { useAppSettings } from "../../store/AppSettingsContext";
import { THEME } from "../../data/themePalette";
import { USER } from "../../data/mockData";

const USER_PROFILE_KEY = "user_profile";

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState(USER.name);
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState(USER.memberSince);
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const palette = isDark ? THEME.dark : THEME.light;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const raw = await AsyncStorage.getItem(USER_PROFILE_KEY);
        if (!raw) {
          setName(USER.name);
          setBirthday("");
          setEmail("");
          setMemberSince(USER.memberSince);
          return;
        }
        const profile = JSON.parse(raw);
        setName(profile.name || USER.name);
        setBirthday(profile.birthday || "");
        setEmail(profile.email || "");
        setMemberSince(profile.memberSince || USER.memberSince);
      } catch {
        setName(USER.name);
        setBirthday("");
        setEmail("");
        setMemberSince(USER.memberSince);
      }
    };
    loadProfile();
  }, []);

  const handleConfirm = async () => {
    if (!name.trim()) return;
    const trimmedName = name.trim();
    const profile = {
      name: trimmedName,
      birthday: birthday.trim(),
      email: email.trim(),
      memberSince,
    };
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } finally {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.page }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, { color: palette.text }]}>← Chỉnh sửa thông tin</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.avatarArea}>
          <View style={[styles.avatar, { backgroundColor: isDark ? "#1C2340" : "#E8EAFF" }]}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.inputRow, { backgroundColor: isDark ? palette.card : "#F5F5F5" }]}>
          <Text style={styles.inputIcon}>👤</Text>
          <TextInput
            style={[styles.input, { color: palette.text }]}
            placeholder="Họ và tên"
            placeholderTextColor={isDark ? palette.textMuted : "#8A8E9A"}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={[styles.inputRow, { backgroundColor: isDark ? palette.card : "#F5F5F5" }]}>
          <Text style={styles.inputIcon}>📅</Text>
          <TextInput
            style={[styles.input, { color: palette.text }]}
            placeholder="Sinh nhật của bạn"
            placeholderTextColor={isDark ? palette.textMuted : "#8A8E9A"}
            value={birthday}
            onChangeText={setBirthday}
          />
        </View>

        <View style={[styles.inputRow, { backgroundColor: isDark ? palette.card : "#F5F5F5" }]}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={[styles.input, { color: palette.text }]}
            placeholder="Email (Tùy chọn)"
            placeholderTextColor={isDark ? palette.textMuted : "#8A8E9A"}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <PrimaryButton label="Lưu thay đổi" onPress={handleConfirm} disabled={!name.trim()} />
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
