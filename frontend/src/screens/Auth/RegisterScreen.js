import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";

export default function RegisterScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const handleRegister = () => {
    if (!phone || !password) return;
    if (!agreed) return;
    // Mock: không cần backend, đi thẳng sang FillProfile
    navigation.navigate("FillProfile", { phone });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoArea}>
        <Text style={styles.logoText}>ElderSpeak</Text>
        <Text style={styles.tagline}>EASY TO BETTER EVERYDAY</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Bắt đầu với chúng tôi</Text>

        {/* Số điện thoại */}
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>📞</Text>
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Mật khẩu */}
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        </View>

        {/* Đồng ý điều khoản */}
        <TouchableOpacity
          style={styles.agreeRow}
          onPress={() => setAgreed(!agreed)}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.agreeText}>Đồng ý các điều khoản</Text>
        </TouchableOpacity>

        <PrimaryButton
          label="Đăng kí"
          onPress={handleRegister}
          disabled={!phone || !password || !agreed}
        />

        <Text style={styles.continueWith}>Tiếp tục với</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialCircle}>
            <FontAwesome name="google" size={22} color="#EA4335" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialCircle}>
            <FontAwesome name="apple" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Đăng nhập</Text>
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
  agreeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  agreeIcon: { fontSize: 20, marginRight: 10 },
  agreeText: { fontSize: 14, color: "#333" },
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
  loginRow: { flexDirection: "row", justifyContent: "center" },
  loginText: { color: "#666", fontSize: 14 },
  loginLink: { color: "#3D5CFF", fontSize: 14, fontWeight: "600" },
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
});
