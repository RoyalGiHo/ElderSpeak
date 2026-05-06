import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import Text from "../../components/AppText";
import PrimaryButton from "../../components/PrimaryButton";
import { useAppSettings } from "../../store/AppSettingsContext";
import { useSession } from "../../store/SessionContext";
import { THEME } from "../../data/themePalette";
import { playSfx } from "../../utils/soundEffects";

export default function LetLogInScreen({ navigation }) {
  const { enterGuestMode } = useSession();
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
        <TouchableOpacity
          style={[
            styles.socialButton,
            styles.googleButton,
            isDark && styles.socialButtonDark,
            isDark && styles.googleButtonDark,
          ]}
        >
          <FontAwesome name="google" size={22} color="#EA4335" />
          <Text style={[styles.socialText, isDark && styles.socialTextDark]}>
            Đăng nhập với Google
          </Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity
          style={[
            styles.socialButton,
            styles.appleButton,
            isDark && styles.socialButtonDark,
            isDark && styles.appleButtonDark,
          ]}
        >
          <FontAwesome name="apple" size={22} color={isDark ? "#E2E8F0" : "#000"} />
          <Text style={[styles.socialText, isDark && styles.socialTextDark]}>
            Đăng nhập với Apple
          </Text>
        </TouchableOpacity>

        <Text style={[styles.orText, isDark && { color: "#94A3B8" }]}>(hoặc)</Text>

        {/* Đăng nhập với tài khoản */}
        <PrimaryButton
          label="Đăng nhập tài khoản"
          onPress={() => navigation.navigate("Login")}
        />

        <TouchableOpacity
          style={[
            styles.guestRow,
            isDark && {
              backgroundColor: "#111827",
              borderColor: "#334155",
            },
          ]}
          onPress={async () => {
            playSfx("tap", settings.soundFx);
            await enterGuestMode();
            navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.guestText, isDark && styles.guestTextDark]}>
            Dùng thử với tư cách khách
          </Text>
          <Text style={[styles.guestHint, isDark && { color: "#94A3B8" }]}>
            Không lưu tiến độ · Học thử mọi bài có sẵn
          </Text>
        </TouchableOpacity>

        {/* Chưa có tài khoản */}
        <TouchableOpacity
          style={styles.registerRow}
          onPress={() => {
            playSfx("tap", settings.soundFx);
            navigation.navigate("Register");
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.registerText}>Chưa có tài khoản? </Text>
          <Text style={styles.registerLink}>Đăng kí</Text>
        </TouchableOpacity>

        {/* Debug: xem lại Onboarding */}
        <TouchableOpacity
          style={styles.debugButton}
          onPress={() => {
            playSfx("tap", settings.soundFx);
            navigation.navigate("Onboarding");
          }}
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
    borderWidth: 1.5,
    borderColor: "#D6DCEB",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  socialButtonDark: {
    borderColor: "#334155",
    backgroundColor: "#111827",
    shadowOpacity: 0.22,
  },
  googleButton: {
    borderColor: "#F6C8C4",
    backgroundColor: "#FFF7F6",
  },
  googleButtonDark: {
    borderColor: "#7F1D1D",
    backgroundColor: "#1F1616",
  },
  appleButton: {
    borderColor: "#D4D8E4",
    backgroundColor: "#F8FAFC",
  },
  appleButtonDark: {
    borderColor: "#475569",
    backgroundColor: "#111827",
  },
  socialText: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "700",
  },
  socialTextDark: {
    color: "#E2E8F0",
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
    alignItems: "center",
    marginTop: 24,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minHeight: 48,
  },
  registerText: {
    color: "#666",
    fontSize: 16,
  },
  registerLink: {
    color: "#3D5CFF",
    fontSize: 19,
    fontWeight: "700",
  },
  guestRow: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#C7DCF7",
    backgroundColor: "#F0F7FF",
    alignItems: "center",
  },
  guestText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  guestTextDark: {
    color: "#93C5FD",
  },
  guestHint: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
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
