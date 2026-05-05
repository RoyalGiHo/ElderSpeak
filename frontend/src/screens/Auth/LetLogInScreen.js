import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Text from "../../components/AppText";
import PrimaryButton from "../../components/PrimaryButton";
import { useAppSettings } from "../../store/AppSettingsContext";
import { THEME } from "../../data/themePalette";

export default function LetLogInScreen({ navigation }) {
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const palette = isDark ? THEME.dark : THEME.light;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.page }]}>
      {/* Logo */}
      <View style={styles.logoArea}>
        <Text style={styles.logoText}>ElderSpeak</Text>
        <Text style={[styles.tagline, { color: palette.textMuted }]}>EASY TO BETTER EVERYDAY</Text>
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: palette.text }]}>Bắt đầu nào</Text>

        {/* Google */}
        <TouchableOpacity style={[styles.socialButton, isDark && { borderColor: "#334155", backgroundColor: "#111827" }]}>
          <FontAwesome name="google" size={22} color="#EA4335" />
          <Text style={[styles.socialText, isDark && { color: "#E2E8F0" }]}> Đăng nhập với Google</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity style={[styles.socialButton, isDark && { borderColor: "#334155", backgroundColor: "#111827" }]}>
          <FontAwesome name="apple" size={22} color="#000" />
          <Text style={[styles.socialText, isDark && { color: "#E2E8F0" }]}> Đăng nhập với Apple</Text>
        </TouchableOpacity>

        <Text style={[styles.orText, isDark && { color: "#94A3B8" }]}>(hoặc)</Text>

        {/* Đăng nhập với tài khoản */}
        <PrimaryButton
          label="Đăng nhập tài khoản"
          onPress={() => navigation.navigate("Login")}
        />

        {/* Chưa có tài khoản */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Đăng kí</Text>
          </TouchableOpacity>
        </View>

        {/* Debug: xem lại Onboarding */}
        <TouchableOpacity
          style={styles.debugButton}
          onPress={() => navigation.navigate("Onboarding")}
        >
          <Text style={styles.debugButtonText}>Xem lại Onboarding</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoArea: {
    alignItems: "center",
    marginTop: 48,
  },
  logoText: {
    fontFamily: "Audiowide_400Regular",
    fontSize: 28,
    color: "#3D5CFF",
  },
  tagline: {
    fontSize: 11,
    color: "#999",
    letterSpacing: 1,
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 28,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  socialText: {
    fontSize: 15,
    color: "#1a1a1a",
  },
  orText: {
    textAlign: "center",
    color: "#999",
    marginVertical: 16,
    fontSize: 14,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#3D5CFF",
    fontSize: 14,
    fontWeight: "600",
  },
  debugButton: {
    marginTop: 16,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderStyle: "dashed",
  },
  debugButtonText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "500",
  },
});
