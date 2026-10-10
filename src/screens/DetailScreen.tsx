import React from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import ProductArtwork from '@components/ProductArtwork';
import ScreenWatermark from '@components/ScreenWatermark';
import { STUDENT, STALE_TIME_MS } from '@constants/student';
import { COLORS, SPACING } from '@constants/theme';
import { getProduct } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import type { ShopStackParamList } from '@models/navigation';
import { formatProductPrice } from '@utils/format';
import { triggerAddHaptic } from '@utils/haptics';

type Props = NativeStackScreenProps<ShopStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props): React.JSX.Element {
  const { id } = route.params;
  const addToCart = useCartStore(state => state.add);
  const query = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    staleTime: STALE_TIME_MS,
  });

  const handleAdd = () => {
    if (!query.data) {
      return;
    }
    addToCart(query.data);
    triggerAddHaptic();
    Alert.alert('Đã thêm vào giỏ', `MSSV ${STUDENT.mssv} · ${query.data.title}`);
  };

  return (
    <ScreenWatermark>
      {query.isPending ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.stateText}>Đang tải thông tin món...</Text>
        </View>
      ) : query.isError ? (
        <View style={styles.state}>
          <Text style={styles.title}>Không tải được món này</Text>
          <Text style={styles.stateText}>MSSV {STUDENT.mssv} · Vui lòng thử lại.</Text>
          <Pressable onPress={() => query.refetch()} style={styles.button}>
            <Text style={styles.buttonText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={styles.navBar}
          >
            <Text style={styles.back}>‹  Chi tiết món</Text>
          </Pressable>
          <ProductArtwork product={query.data} style={styles.hero} iconSize={82} />
          <Text numberOfLines={2} style={styles.title}>{query.data.title}</Text>
          <Text style={styles.price}>{formatProductPrice(query.data.price)}</Text>
          <Text style={styles.delivery}>Giao nội khu · nhận tận phòng</Text>
          <Text numberOfLines={3} style={styles.description}>{query.data.description}</Text>
          <Pressable onPress={handleAdd} style={styles.button}>
            <Text style={styles.buttonText}>Thêm vào giỏ · Haptic</Text>
          </Pressable>
        </ScrollView>
      )}
    </ScreenWatermark>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: SPACING.xl },
  navBar: { minHeight: 46, justifyContent: 'center', paddingHorizontal: SPACING.md, backgroundColor: COLORS.surface },
  back: { color: COLORS.primary, fontSize: 16, fontWeight: '800' },
  hero: {
    height: 180,
    marginHorizontal: 36,
    marginTop: SPACING.sm,
    borderRadius: 12,
  },
  title: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  price: { marginTop: 4, color: COLORS.primary, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  delivery: { marginTop: 6, color: COLORS.textLight, textAlign: 'center' },
  description: { marginHorizontal: SPACING.md, marginTop: SPACING.lg, color: COLORS.textLight, lineHeight: 22 },
  button: {
    minHeight: 50,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: COLORS.primary,
  },
  buttonText: { color: COLORS.surface, fontSize: 16, fontWeight: '800' },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  stateText: { marginTop: SPACING.sm, color: COLORS.textLight, textAlign: 'center' },
});
