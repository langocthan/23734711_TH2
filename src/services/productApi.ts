import apiClient from '@services/apiClient';
import { PRODUCT_CATALOG } from '@services/productCatalog';
import type { Product } from '@models/product';

export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get<Array<{ id: number }>>('/products', {
    params: { limit: 12 },
  });
  const availableIds = new Set(response.data.map(product => product.id));
  const missingProduct = PRODUCT_CATALOG.find(product => !availableIds.has(product.id));

  if (missingProduct) {
    throw new Error(`API không trả về sản phẩm có mã ${missingProduct.id}.`);
  }

  return PRODUCT_CATALOG;
}

export async function getProduct(id: string): Promise<Product> {
  const product = PRODUCT_CATALOG.find(item => String(item.id) === id);
  if (!product) {
    throw new Error(`Không tìm thấy sản phẩm có mã ${id}.`);
  }
  return product;
}
