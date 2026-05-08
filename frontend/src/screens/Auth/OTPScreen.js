import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/AppText";
import PrimaryButton from "../../components/PrimaryButton";
import { useAppSettings } from "../../store/AppSettingsContext";
import { useSession } from "../../store/SessionContext";
import { THEME } from "../../data/themePalette";
import { playSfx } from "../../utils/soundEffects";
const MOCK_OTP = "1234";
/** Chỉ hiện hướng dẫn SMS + luồng điền OTP ngẫu nhiên một lần (đã xem gợi ý). */
const OTP_SMS_HINT_SEEN_KEY = "otp_sms_hint_seen";

function randomOtpDigits() {
  return Array.from({ length: 4 }, () =>
    String(Math.floor(Math.random() * 10)),
  );
}

export default function OTPScreen({ navigation, route }) {
  const { enterAccountSession } = useSession();
  const { phone } = route.params || {};
  const [otp, setOtp] = useState(["", "", "", ""]);
  /** false đến khi đọc AsyncStorage xong — tránh bấm Tiếp tục nhầm luồng. */
  const [otpHintReady, setOtpHintReady] = useState(false);
  const [smsHintSeen, setSmsHintSeen] = useState(false);
  const inputs = useRef([]);
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const palette = isDark ? THEME.dark : THEME.light;

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(OTP_SMS_HINT_SEEN_KEY)
      .then((v) => {
        if (!cancelled) {
          setSmsHintSeen(v === "true");
          setOtpHintReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setOtpHintReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const completeOtpSuccess = useCallback(async () => {
    await enterAccountSession();
    navigation.replace("MainTabs");
  }, [enterAccountSession, navigation]);

  const handlePress = (digit) => {
    const idx = otp.findIndex((d) => d === "");
    if (idx === -1) return;
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (idx < 3) inputs.current[idx + 1]?.focus();
  };

  const handleDelete = () => {
    const idx = [...otp].reverse().findIndex((d) => d !== "");
    if (idx === -1) return;
    const realIdx = 3 - idx;
    const next = [...otp];
    next[realIdx] = "";
    setOtp(next);
  };

  const handleConfirm = async () => {
    const entered = otp.join("");
    if (entered.length < 4) return;

    if (!smsHintSeen) {
      Alert.alert(
        "Mã OTP",
        "Đọc tin nhắn SMS để lấy mã OTP.",
        [
          {
            text: "OK",
            onPress: async () => {
              try {
                await AsyncStorage.setItem(OTP_SMS_HINT_SEEN_KEY, "true");
                setSmsHintSeen(true);
                const digits = randomOtpDigits();
                setOtp(digits);
                playSfx("tap", settings.soundFx);
                await completeOtpSuccess();
              } catch (e) {
                console.warn("OTP demo flow failed:", e);
              }
            },
          },
        ],
        { cancelable: true },
      );
      return;
    }

    if (entered === MOCK_OTP) {
      await completeOtpSuccess();
    }
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "⌫"];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.page }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          playSfx("tap", settings.soundFx);
          navigation.goBack();
        }}
      >
        <Text style={[styles.backText, { color: palette.text }]}>← Mã OTP</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: palette.text }]}>
          Nhập mật mã được gửi SMS{"\n"}tới điện thoại của bạn
        </Text>

        {phone && (
          <Text style={[styles.phoneHint, { color: palette.textMuted }]}>
            Mã đã được gửi tới {phone}
          </Text>
        )}

        {/* 4 ô OTP */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <View
              key={i}
              style={[
                styles.otpBox,
                isDark && { backgroundColor: palette.card },
                digit && styles.otpBoxFilled,
              ]}
            >
              <Text style={[styles.otpDigit, { color: palette.text }]}>{digit || "*"}</Text>
            </View>
          ))}
        </View>

        {/* Nút tiếp tục */}
        <PrimaryButton
          label="Tiếp tục"
          onPress={handleConfirm}
          disabled={!otpHintReady || otp.join("").length < 4}
          style={{ width: "100%" }}
        />

        <Text style={styles.resend}>
          Resend Code in <Text style={styles.resendTimer}>59s</Text>
        </Text>
      </View>

      {/* Bàn phím số */}
      <View style={styles.keypad}>
        {keys.map((k) => (
          <TouchableOpacity
            key={k}
            style={styles.key}
            onPress={() => {
              playSfx("tap", settings.soundFx);
              k === "⌫" ? handleDelete() : handlePress(k);
            }}
          >
            <Text style={[styles.keyText, { color: palette.text }]}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: { paddingHorizontal: 24, paddingTop: 16 },
  backText: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  content: { paddingHorizontal: 32, paddingTop: 32, alignItems: "center" },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  phoneHint: { fontSize: 13, color: "#666", marginBottom: 24 },
  otpRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  otpBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxFilled: { backgroundColor: "#E8EAFF" },
  otpDigit: { fontSize: 22, fontWeight: "700", color: "#1a1a1a" },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3D5CFF",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    marginBottom: 12,
  },
  disabled: { backgroundColor: "#A0A8E0" },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  arrow: { color: "#fff", fontSize: 18, fontWeight: "600" },
  resend: { fontSize: 13, color: "#999" },
  resendTimer: { color: "#3D5CFF", fontWeight: "600" },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  key: {
    width: "33.33%",
    alignItems: "center",
    paddingVertical: 16,
  },
  keyText: { fontSize: 26, fontWeight: "500", color: "#1a1a1a" },
});
