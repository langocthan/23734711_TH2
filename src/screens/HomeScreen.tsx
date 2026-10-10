import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ProductCard from '@components/ProductCard';
import ScreenWatermark from '@components/ScreenWatermark';
import { DEBOUNCE_MS, ROOM_LABEL, STALE_TIME_MS, STUDENT } from '@constants/student';
import { COLORS, SPACING } from '@constants/theme';
import useDebouncedValue from '@hooks/useDebouncedValue';
import { getProducts } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import type { ShopStackParamList } from '@models/navigation';
import type { Product } from '@models/product';
import { triggerAddHaptic } from '@utils/haptics';

type Props = NativeStackScreenProps<ShopStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props): React.JSX.Element {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, DEBOUNCE_MS);
  const addToCart = useCartStore(state => state.add);
  const query = useQuery({
    queryKey: ['products', STUDENT.mssv],
    queryFn: getProducts,
    staleTime: STALE_TIME_MS,
  });

  const filteredProducts = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLocaleLowerCase('vi-VN');
    return (query.data ?? []).filter(product =>
      `${product.title} ${product.category}`
        .toLocaleLowerCase('vi-VN')
        .includes(normalizedSearch),
    );
  }, [debouncedSearch, query.data]);

  const addProduct = (product: Product) => {
    addToCart(product);
    triggerAddHaptic();
  };

  return (
    <ScreenWatermark>
      {query.isPending ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.stateText}>Đang tải món...</Text>
        </View>
      ) : query.isError ? (
        <View style={styles.state}>
          <Text style={styles.errorStudent}>{STUDENT.mssv}</Text>
          <Text style={styles.stateTitle}>Không tải được dữ liệu món.</Text>
          <Pressable disabled={query.isFetching} onPress={() => query.refetch()} style={styles.retry}>
            <Text style={styles.retryText}>{query.isFetching ? 'Đang thử...' : 'Thử lại'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.shop}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>KTXGO</Text>
              <Text style={styles.delivery}>Giao tận {ROOM_LABEL}</Text>
            </View>
          </View>
          <TextInput
            accessibilityLabel="Tìm món"
            onChangeText={setSearch}
            placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
            placeholderTextColor={COLORS.textLight}
            style={styles.search}
            value={search}
          />
          <Text style={styles.listLabel}>(C) FlashList ×2</Text>
          <FlashList
            contentContainerStyle={styles.listContent}
            data={filteredProducts}
            estimatedItemSize={170}
            keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
            numColumns={2}
            onRefresh={() => query.refetch()}
            refreshing={query.isFetching}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onAdd={() => addProduct(item)}
                onPress={() => navigation.navigate('Detail', { id: String(item.id) })}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.stateText}>Không tìm thấy món phù hợp.</Text>
            }
          />
        </View>
      )}
    </ScreenWatermark>
  );
}

const styles = StyleSheet.create({
  shop: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: COLORS.primary,
  },
  brand: { color: COLORS.surface, fontSize: 16, fontWeight: '900' },
  delivery: { marginTop: 2, color: '#DBEAFE', fontSize: 12 },
  search: {
    minHeight: 38,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 18,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  listLabel: {
    alignSelf: 'flex-end',
    marginRight: SPACING.md,
    marginBottom: SPACING.xs,
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  listContent: { paddingHorizontal: SPACING.sm, paddingBottom: SPACING.lg },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  errorStudent: { color: COLORS.error, fontSize: 13, fontWeight: '700' },
  stateTitle: {
    maxWidth: 230,
    marginTop: 4,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateText: { marginTop: SPACING.sm, color: COLORS.textLight, textAlign: 'center' },
  retry: {
    width: 148,
    minHeight: 36,
    marginTop: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: COLORS.error,
  },
  retryText: { color: COLORS.surface, fontSize: 13, fontWeight: '800' },
});
