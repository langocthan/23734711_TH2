import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ScreenWatermark from '@components/ScreenWatermark';
import { STUDENT, VARIANT } from '@constants/student';
import { COLORS, SPACING } from '@constants/theme';
import { useAuthStore } from '@stores/authStore';

export default function LoginScreen(): React.JSX.Element {
  const login = useAuthStore(state => state.login);
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const isPhoneLogin = VARIANT.authField === 'phone';

  const handleLogin = () => {
    const value = contact.trim();
    const isValid = isPhoneLogin
      ? /^\+?\d{9,15}$/.test(value.replace(/[\s()-]/g, ''))
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValid) {
      setError(isPhoneLogin ? 'Vui lòng nhập số điện thoại hợp lệ.' : 'Vui lòng nhập email hợp lệ.');
      return;
    }

    setError('');
    login();
  };

  return (
    <ScreenWatermark>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.logo}>KTX<Text style={styles.logoAccent}>GO</Text></Text>
          <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>
          <View>
            <TextInput
              accessibilityLabel={isPhoneLogin ? 'Số điện thoại' : 'Email'}
              autoCapitalize="none"
              keyboardType={isPhoneLogin ? 'phone-pad' : 'email-address'}
              onChangeText={value => {
                setContact(value);
                setError('');
              }}
              placeholder={
                isPhoneLogin
                  ? `Số điện thoại — ${STUDENT.mssv}`
                  : `Email — ${STUDENT.mssv}@iuh.edu.vn`
              }
              placeholderTextColor={COLORS.textLight}
              style={[styles.input, error ? styles.inputError : null]}
              value={contact}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Vào cửa hàng</Text>
            </Pressable>
            <Text style={styles.authState}>Auth Stack · chưa có token</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWatermark>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  content: { flex: 1, justifyContent: 'flex-start', paddingHorizontal: 26, paddingTop: 42 },
  logo: { color: COLORS.primary, fontSize: 38, fontWeight: '900', textAlign: 'center' },
  logoAccent: { color: COLORS.primary },
  subtitle: { marginTop: 4, marginBottom: 40, color: COLORS.textLight, textAlign: 'center' },
  input: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  inputError: { borderColor: COLORS.error },
  error: { marginTop: SPACING.xs, color: COLORS.error },
  button: {
    minHeight: 52,
    marginTop: SPACING.md,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D4ED8',
  },
  buttonText: { color: COLORS.surface, fontSize: 16, fontWeight: '800' },
  authState: { marginTop: SPACING.md, color: COLORS.textLight, textAlign: 'center', fontSize: 12 },
});
