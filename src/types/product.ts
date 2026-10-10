export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  artwork: {
    emoji: string;
    backgroundColor: string;
  };
};

export type CartItem = Product & {
  quantity: number;
};
