import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MOCK_USERS } from "../../data/mockData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import Text from "../../components/AppText";
import PrimaryButton from "../../components/PrimaryButton";
import { useAppSettings } from "../../store/AppSettingsContext";
import { THEME } from "../../data/themePalette";

const IS_LOGGED_IN_KEY = "is_logged_in";

export default function LoginScreen({ navigation }) {
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const palette = isDark ? THEME.dark : THEME.light;
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const cleanedPhone = phone.trim();
    const cleanedPassword = password.trim();
    const user = MOCK_USERS.find(
      (u) => u.phone === cleanedPhone && u.password === cleanedPassword,
    );
    if (!user) {
      setError("Số điện thoại hoặc mật khẩu không đúng");
      return;
    }
    try {
      await AsyncStorage.setItem(IS_LOGGED_IN_KEY, "true");
    } catch (e) {
      // AsyncStorage có thể fail trên Expo Go nếu version sai – vẫn cho vào app
      console.warn("AsyncStorage setItem failed:", e);
    }
    navigation.replace("MainTabs");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.page }]}>
      {/* Logo */}
      <View style={styles.logoArea}>
        <Text style={styles.logoText}>ElderSpeak</Text>
        <Text style={[styles.tagline, { color: palette.textMuted }]}>EASY TO BETTER EVERYDAY</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: palette.text }]}>Đăng nhập nào</Text>

        {/* Số điện thoại */}
        <View style={[styles.inputRow, { backgroundColor: isDark ? palette.card : "#F5F5F5" }]}>
          <Text style={styles.inputIcon}>📞</Text>
          <TextInput
            style={[styles.input, { color: palette.text }]}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              setError("");
            }}
          />
        </View>

        {/* Mật khẩu */}
        <View style={[styles.inputRow, { backgroundColor: isDark ? palette.card : "#F5F5F5" }]}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={[styles.input, { color: palette.text }]}
            placeholder="Mật khẩu"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError("");
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        </View>

        {/* Ghi nhớ + Quên mật khẩu */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
            >
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("OTP", { mode: "forgotPassword" })
            }
          >
            <Text style={styles.forgotText}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Nút đăng nhập */}
        <PrimaryButton label="Đăng nhập" onPress={handleLogin} />

        <Text style={styles.continueWith}>Tiếp tục với</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialCircle}>
            <FontAwesome name="google" size={20} color="#EA4335" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialCircle}>
            <FontAwesome name="apple" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Đăng kí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  logoArea: { alignItems: "center", marginTop: 48 },
  logoText: {
    fontFamily: "Audiowide_400Regular",
    fontSize: 28,
    color: "#3D5CFF",
  },
  tagline: { fontSize: 11, color: "#999", letterSpacing: 1, marginTop: 4 },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24,
  },
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
  eyeIcon: { fontSize: 16 },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rememberRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: "#999",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#3D5CFF", borderColor: "#3D5CFF" },
  checkmark: { color: "#fff", fontSize: 12, fontWeight: "700" },
  rememberText: { fontSize: 13, color: "#666" },
  forgotText: { fontSize: 13, color: "#1a1a1a", fontWeight: "500" },
  errorText: { color: "red", fontSize: 13, marginBottom: 8 },
  continueWith: {
    textAlign: "center",
    color: "#999",
    fontSize: 13,
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: { fontSize: 18, fontWeight: "700" },
  registerRow: { flexDirection: "row", justifyContent: "center" },
  registerText: { color: "#666", fontSize: 14 },
  registerLink: { color: "#3D5CFF", fontSize: 14, fontWeight: "600" },
});
