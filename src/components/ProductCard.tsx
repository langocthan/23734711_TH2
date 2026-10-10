import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ProductArtwork from '@components/ProductArtwork';
import { COLORS, RADIUS, SPACING } from '@constants/theme';
import { formatProductPrice } from '@utils/format';
import type { Product } from '@models/product';

type Props = {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
};

export default function ProductCard({
  product,
  onPress,
  onAdd,
}: Props): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Xem ${product.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <ProductArtwork product={product} style={styles.imageFrame} iconSize={38} />
      <Text numberOfLines={1} style={styles.title}>{product.title}</Text>
      <View style={styles.footer}>
        <Text numberOfLines={1} style={styles.price}>
          {formatProductPrice(product.price)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Thêm ${product.title} vào giỏ`}
          hitSlop={8}
          onPress={onAdd}
          style={styles.addButton}
        >
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    padding: 8,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  pressed: { opacity: 0.82 },
  imageFrame: {
    height: 72,
    marginBottom: SPACING.sm,
    borderRadius: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: { flex: 1, color: COLORS.primary, fontSize: 12, fontWeight: '800' },
  addButton: {
    width: 32,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  addText: { color: COLORS.surface, fontSize: 24, lineHeight: 28, fontWeight: '600' },
});
