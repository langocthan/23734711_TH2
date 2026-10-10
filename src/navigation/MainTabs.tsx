import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ShopStack from '@navigation/ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { COLORS } from '@constants/theme';
import { VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';
import type { MainTabParamList } from '@models/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs(): React.JSX.Element {
  const totalQuantity = useCartStore(state => state.totalQuantity());
  const shopFirst = VARIANT.tabOrder === 'shopFirst';
  const tabBarStyle = { backgroundColor: COLORS.surface, borderTopColor: COLORS.border };

  const shopTab = (
    <Tab.Screen
      key="shop"
      name="Shop"
      component={ShopStack}
      options={({ route }) => ({
        title: 'Cửa hàng',
        tabBarStyle:
          getFocusedRouteNameFromRoute(route) === 'Detail'
            ? { display: 'none' }
            : tabBarStyle,
      })}
    />
  );
  const cartTab = (
    <Tab.Screen
      key="cart"
      name="Cart"
      component={CartScreen}
      options={{
        title: 'Giỏ',
        tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
      }}
    />
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarIcon: () => null,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle,
        tabBarBadgeStyle: { backgroundColor: COLORS.secondary },
      }}
    >
      {shopFirst ? shopTab : cartTab}
      {shopFirst ? cartTab : shopTab}
      <Tab.Screen
        name="Me"
        component={MeScreen}
        options={{ title: 'Tôi' }}
      />
    </Tab.Navigator>
  );
}
