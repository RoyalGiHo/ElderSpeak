import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const MOCK_OTP = '1234';
const IS_LOGGED_IN_KEY = "is_logged_in";

export default function OTPScreen({ navigation, route }) {
  const { mode, phone } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handlePress = (digit) => {
    const idx = otp.findIndex((d) => d === '');
    if (idx === -1) return;
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (idx < 3) inputs.current[idx + 1]?.focus();
  };

  const handleDelete = () => {
    const idx = [...otp].reverse().findIndex((d) => d !== '');
    if (idx === -1) return;
    const realIdx = 3 - idx;
    const next = [...otp];
    next[realIdx] = '';
    setOtp(next);
  };

  const handleConfirm = async () => {
    const entered = otp.join('');
    if (entered === MOCK_OTP) {
      await AsyncStorage.setItem(IS_LOGGED_IN_KEY, "true");
      if (mode === 'register') {
        navigation.replace('MainTabs');
      } else {
        // forgotPassword — TODO: navigate sang CreateNewPassword
        navigation.replace('MainTabs');
      }
    }
  };

  const keys = ['1','2','3','4','5','6','7','8','9','*','0','⌫'];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Mã OTP</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Nhập mật mã được gửi SMS{'\n'}tới điện thoại của bạn
        </Text>

        {phone && (
          <Text style={styles.phoneHint}>
            Mã đã được gửi tới {phone}
          </Text>
        )}

        {/* 4 ô OTP */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <View key={i} style={[styles.otpBox, digit && styles.otpBoxFilled]}>
              <Text style={styles.otpDigit}>{digit || '*'}</Text>
            </View>
          ))}
        </View>

        {/* Nút tiếp tục */}
        <TouchableOpacity
          style={[styles.primaryButton, otp.join('').length < 4 && styles.disabled]}
          onPress={handleConfirm}
          disabled={otp.join('').length < 4}
        >
          <Text style={styles.primaryButtonText}>Tiếp tục</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.resend}>Resend Code in <Text style={styles.resendTimer}>59s</Text></Text>
      </View>

      {/* Bàn phím số */}
      <View style={styles.keypad}>
        {keys.map((k) => (
          <TouchableOpacity
            key={k}
            style={styles.key}
            onPress={() => k === '⌫' ? handleDelete() : handlePress(k)}
          >
            <Text style={styles.keyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { paddingHorizontal: 24, paddingTop: 16 },
  backText: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  content: { paddingHorizontal: 32, paddingTop: 32, alignItems: 'center' },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  phoneHint: { fontSize: 13, color: '#666', marginBottom: 24 },
  otpRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  otpBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: { backgroundColor: '#E8EAFF' },
  otpDigit: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3D5CFF',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 12,
  },
  disabled: { backgroundColor: '#A0A8E0' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  arrow: { color: '#fff', fontSize: 18, fontWeight: '600' },
  resend: { fontSize: 13, color: '#999' },
  resendTimer: { color: '#3D5CFF', fontWeight: '600' },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  key: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  keyText: { fontSize: 26, fontWeight: '500', color: '#1a1a1a' },
});
