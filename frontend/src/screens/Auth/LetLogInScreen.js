import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function LetLogInScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoArea}>
        <Text style={styles.logoText}>ElderSpeak</Text>
        <Text style={styles.tagline}>EASY TO BETTER EVERYDAY</Text>
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.title}>Bắt đầu nào</Text>

        {/* Google */}
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialIcon}>G</Text>
          <Text style={styles.socialText}>Đăng nhập với Google</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialIcon}></Text>
          <Text style={styles.socialText}>Đăng nhập với Apple</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>(hoặc)</Text>

        {/* Đăng nhập với tài khoản */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Đăng nhập với tài khoản</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Chưa có tài khoản */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Đăng kí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoArea: {
    alignItems: 'center',
    marginTop: 48,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D5CFF',
  },
  tagline: {
    fontSize: 11,
    color: '#999',
    letterSpacing: 1,
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 28,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  socialText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  orText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 16,
    fontSize: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3D5CFF',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  arrow: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#3D5CFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
