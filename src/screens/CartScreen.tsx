import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ProductArtwork from '@components/ProductArtwork';
import ScreenWatermark from '@components/ScreenWatermark';
import { ROOM_LABEL } from '@constants/student';
import { COLORS, SPACING } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';
import { useLocationStore } from '@stores/locationStore';
import { estimateShippingFee, haversineKm, CAMPUS_GATE } from '@utils/delivery';
import { formatProductPrice, formatVnd } from '@utils/format';

export default function CartScreen(): React.JSX.Element {
  const items = useCartStore(state => state.items);
  const changeQty = useCartStore(state => state.changeQty);
  const remove = useCartStore(state => state.remove);
  const totalAmount = useCartStore(state => state.totalAmount());
  const coordinates = useLocationStore(state => state.coordinates);
  const shippingFee = useMemo(
    () =>
      coordinates
        ? estimateShippingFee(haversineKm(coordinates, CAMPUS_GATE))
        : null,
    [coordinates],
  );

  return (
    <ScreenWatermark>
      <View style={styles.header}>
        <Text style={styles.title}>GIỎ HÀNG</Text>
      </View>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {items.map(item => (
            <View key={item.id} style={styles.item}>
              <ProductArtwork product={item} style={styles.imageFrame} iconSize={30} />
              <View style={styles.itemInfo}>
                <Text numberOfLines={2} style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>
                  ×{item.quantity} · {formatProductPrice(item.price * item.quantity)}
                </Text>
                <View style={styles.quantityRow}>
                  <Pressable accessibilityLabel={`Giảm số lượng ${item.title}`} onPress={() => changeQty(item.id, item.quantity - 1)} style={styles.quantityButton}>
                    <Text style={styles.quantityText}>−</Text>
                  </Pressable>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <Pressable accessibilityLabel={`Tăng số lượng ${item.title}`} onPress={() => changeQty(item.id, item.quantity + 1)} style={styles.quantityButton}>
                    <Text style={styles.quantityText}>+</Text>
                  </Pressable>
                  <Pressable onPress={() => remove(item.id)} style={styles.removeButton}>
                    <Text style={styles.removeText}>Xóa</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Giao đến {ROOM_LABEL}</Text>
            <Text style={styles.accent}>
              Phí ship: {shippingFee == null ? 'cấp quyền vị trí để tính' : `${formatVnd(shippingFee)} (công thức B)`}
            </Text>
          </View>
          <Text style={styles.total}>Tổng hàng: {formatVnd(totalAmount)}</Text>
        </ScrollView>
      )}
    </ScreenWatermark>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 46, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.md, backgroundColor: COLORS.primary },
  title: { color: COLORS.surface, fontSize: 16, fontWeight: '900', textAlign: 'center' },
  content: { padding: SPACING.md, paddingTop: SPACING.sm, paddingBottom: SPACING.xl },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  emptyTitle: { color: COLORS.textLight, fontSize: 15, fontWeight: '600' },
  item: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  imageFrame: { width: 58, height: 58, borderRadius: 10 },
  itemInfo: { flex: 1, justifyContent: 'center', paddingLeft: SPACING.sm },
  itemTitle: { color: COLORS.text, fontSize: 12, fontWeight: '700' },
  itemPrice: { marginTop: 2, color: COLORS.primary, fontSize: 12, fontWeight: '800' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  quantityButton: {
    width: 24,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#DBEAFE',
  },
  quantityText: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
  quantity: { minWidth: 28, color: COLORS.text, textAlign: 'center', fontSize: 12, fontWeight: '700' },
  removeButton: { marginLeft: 'auto', paddingHorizontal: SPACING.sm, paddingVertical: 6 },
  removeText: { color: COLORS.error, fontSize: 11, fontWeight: '700' },
  summary: {
    marginTop: SPACING.md,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },
  summaryLabel: { color: COLORS.text, fontSize: 12, fontWeight: '700' },
  accent: { marginTop: 3, color: COLORS.secondary, fontSize: 12, fontWeight: '800' },
  total: { marginTop: SPACING.sm, color: COLORS.primary, fontSize: 14, fontWeight: '900', textAlign: 'center' },
});
