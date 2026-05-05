import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import Text from "../../components/AppText";
import { useAppSettings } from "../../store/AppSettingsContext";
import { THEME } from "../../data/themePalette";
import { USER } from "../../data/mockData";
import { playSfx } from "../../utils/soundEffects";

const IS_LOGGED_IN_KEY = "is_logged_in";
const LAST_TAB_KEY = "last_main_tab";
const USER_PROFILE_KEY = "user_profile";

export default function ProfileScreen({ navigation }) {
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const palette = isDark ? THEME.dark : THEME.light;
  const [profile, setProfile] = useState({
    name: USER.name,
    memberSince: USER.memberSince,
  });
  const achievementRows = [
    { label: "Thành tích", icon: "award", screen: "Medals" },
    { label: "Tiến độ", icon: "bar-chart-2", screen: "History" },
  ];

  const accountRows = [
    { label: "Cài đặt", icon: "settings", screen: "Settings" },
    { label: "Đánh giá ứng dụng", icon: "star" },
    { label: "Hỗ trợ / Phản hồi", icon: "tool", screen: "Feedback" },
  ];

  const handleLogout = async () => {
    playSfx("tap", settings.soundFx);
    await AsyncStorage.removeItem(IS_LOGGED_IN_KEY);
    await AsyncStorage.removeItem(LAST_TAB_KEY);
    navigation.reset({
      index: 0,
      routes: [{ name: "LetLogIn" }],
    });
  };

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const raw = await AsyncStorage.getItem(USER_PROFILE_KEY);
          if (!raw) {
            setProfile({ name: USER.name, memberSince: USER.memberSince });
            return;
          }
          const parsed = JSON.parse(raw);
          setProfile({
            name: parsed.name || USER.name,
            memberSince: parsed.memberSince || USER.memberSince,
          });
        } catch {
          setProfile({ name: USER.name, memberSince: USER.memberSince });
        }
      };
      loadProfile();
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.page }]}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={84} color={isDark ? "#93C5FD" : "#0A1A47"} />
          <Text style={[styles.userName, { color: isDark ? palette.text : "#1F2D64" }]}>
            {profile.name}
          </Text>
          <Text style={[styles.memberText, { color: isDark ? palette.textMuted : "#6E7284" }]}>
            Thành viên từ {profile.memberSince}
          </Text>
          <TouchableOpacity
            style={[styles.editButton, isDark && { borderColor: palette.accentText }]}
            activeOpacity={0.8}
            onPress={() => {
              playSfx("tap", settings.soundFx);
              navigation.navigate("EditProfile");
            }}
          >
            <Text style={[styles.editButtonText, isDark && { color: palette.accentText }]}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, isDark && { color: palette.textMuted }]}>THÀNH TÍCH</Text>
        <View style={[styles.sectionList, isDark && { borderColor: "#1E293B" }]}>
          {achievementRows.map((row) => (
            <TouchableOpacity
              key={row.label}
              style={[styles.row, isDark && { borderBottomColor: "#1E293B" }]}
              onPress={() => {
                playSfx("tap", settings.soundFx);
                navigation.navigate(row.screen);
              }}
              activeOpacity={0.78}
            >
              <Feather name={row.icon} size={28} color={isDark ? "#CBD5E1" : "#17192B"} />
              <Text style={[styles.rowLabel, isDark && { color: "#E2E8F0" }]}>{row.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, isDark && { color: palette.textMuted }]}>TÀI KHOẢN</Text>
        <View style={[styles.sectionList, isDark && { borderColor: "#1E293B" }]}>
          {accountRows.map((row) => (
            <TouchableOpacity
              key={row.label}
              style={[styles.row, isDark && { borderBottomColor: "#1E293B" }]}
              onPress={() => {
                playSfx("tap", settings.soundFx);
                if (row.screen) navigation.navigate(row.screen);
              }}
              activeOpacity={0.78}
            >
              <Feather name={row.icon} size={28} color={isDark ? "#CBD5E1" : "#17192B"} />
              <Text style={[styles.rowLabel, isDark && { color: "#E2E8F0" }]}>{row.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.row, isDark && { borderBottomColor: "#1E293B" }]}
            onPress={handleLogout}
            activeOpacity={0.78}
          >
            <Feather name="log-out" size={28} color={isDark ? "#FCA5A5" : "#17192B"} />
            <Text style={[styles.rowLabel, isDark && { color: "#FCA5A5" }]}>Đăng xuất</Text>
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
