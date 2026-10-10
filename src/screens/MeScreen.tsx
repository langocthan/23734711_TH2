import React, { useMemo } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenWatermark from '@components/ScreenWatermark';
import { STUDENT } from '@constants/student';
import { COLORS, SPACING } from '@constants/theme';
import useCampusLocation from '@hooks/useCampusLocation';
import { useAuthStore } from '@stores/authStore';
import { CAMPUS_GATE, estimateShippingFee, haversineKm } from '@utils/delivery';
import { formatVnd } from '@utils/format';

export default function MeScreen(): React.JSX.Element {
  const logout = useAuthStore(state => state.logout);
  const {
    coordinates,
    permissionState,
    isLoading,
    error,
    requestLocation,
    openAppSettings,
  } = useCampusLocation();

  const distanceKm = useMemo(
    () => (coordinates ? haversineKm(coordinates, CAMPUS_GATE) : null),
    [coordinates],
  );
  const fee = distanceKm == null ? null : estimateShippingFee(distanceKm);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất khỏi KTXGo?', [
      { text: 'Ở lại', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScreenWatermark>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TÔI · LOCATION</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.profile}>
          <Text style={styles.name}>{STUDENT.hoTen}</Text>
          <Text style={styles.student}>MSSV {STUDENT.mssv}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vị trí giao hàng</Text>
          <Text style={styles.detail}>
            Quyền vị trí:{' '}
            <Text style={permissionState === 'granted' ? styles.granted : styles.pending}>
              {permissionState === 'granted' ? 'Đã cấp' : permissionState === 'blocked' ? 'Bị chặn' : 'Chưa cấp'}
            </Text>
          </Text>
          {coordinates && distanceKm != null ? (
            <>
              <Text style={styles.detail}>
                Khoảng cách đến cổng KTX: {distanceKm.toFixed(2)} km
              </Text>
              <Text style={styles.fee}>
                Phí ship: {formatVnd(fee ?? 0)} (công thức B)
              </Text>
            </>
          ) : (
            <Text style={styles.detail}>Cho phép vị trí để tính khoảng cách và phí giao đến cổng KTX.</Text>
          )}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          disabled={isLoading}
          onPress={permissionState === 'blocked' ? openAppSettings : requestLocation}
          style={styles.button}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.surface} />
          ) : (
            <Text style={styles.buttonText}>
              {permissionState === 'blocked' ? 'Mở Cài đặt' : 'Lấy vị trí ước tính ship'}
            </Text>
          )}
        </Pressable>
        <Pressable onPress={openAppSettings} style={styles.settingsButton}>
          <Text style={styles.settingsText}>
            Mở Cài đặt{permissionState === 'blocked' ? ' (blocked)' : ''}
          </Text>
        </Pressable>

        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
        </Pressable>
      </View>
    </ScreenWatermark>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 46, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.md, backgroundColor: COLORS.primary },
  headerTitle: { color: COLORS.surface, fontSize: 16, fontWeight: '900', textAlign: 'center' },
  content: { flex: 1, padding: SPACING.md, paddingTop: SPACING.sm },
  profile: {
    marginBottom: SPACING.md,
    paddingVertical: 2,
    alignItems: 'center',
  },
  card: {
    marginBottom: SPACING.md,
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },
  name: { color: COLORS.text, fontSize: 14, fontWeight: '800' },
  student: { marginTop: 4, color: COLORS.textLight, fontSize: 11, fontWeight: '600' },
  sectionTitle: { marginBottom: SPACING.sm, color: COLORS.text, fontSize: 15, fontWeight: '800' },
  detail: { marginTop: SPACING.xs, color: COLORS.textLight, lineHeight: 20 },
  granted: { color: COLORS.success, fontWeight: '800' },
  pending: { color: COLORS.secondary, fontWeight: '800' },
  fee: { marginTop: SPACING.sm, color: COLORS.primary, fontWeight: '800' },
  error: { marginTop: SPACING.sm, color: COLORS.error },
  button: {
    minHeight: 42,
    marginTop: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  buttonText: { color: COLORS.surface, fontSize: 13, fontWeight: '800' },
  settingsButton: {
    minHeight: 42,
    marginTop: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },
  settingsText: { color: COLORS.primary, fontSize: 13, fontWeight: '800' },
  logoutButton: {
    minHeight: 42,
    marginTop: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.error,
  },
  logoutText: { color: COLORS.surface, fontSize: 13, fontWeight: '800' },
});
