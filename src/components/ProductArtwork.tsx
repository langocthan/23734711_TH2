import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Product } from '@models/product';

type Props = {
  product: Product;
  style?: StyleProp<ViewStyle>;
  iconSize: number;
};

export default function ProductArtwork({
  product,
  style,
  iconSize,
}: Props): React.JSX.Element {
  return (
    <View style={[styles.frame, { backgroundColor: product.artwork.backgroundColor }, style]}>
      <Text style={{ fontSize: iconSize }}>{product.artwork.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
