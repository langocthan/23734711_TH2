import type { NavigatorScreenParams } from '@react-navigation/native';

export type ShopStackParamList = {
  Home: undefined;
  Detail: { id: string };
};

export type MainTabParamList = {
  Shop: NavigatorScreenParams<ShopStackParamList> | undefined;
  Cart: undefined;
  Me: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};
