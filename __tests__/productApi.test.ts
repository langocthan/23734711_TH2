import { AxiosHeaders, type AxiosResponse } from 'axios';
import apiClient from '../src/services/apiClient';
import { PRODUCT_CATALOG } from '../src/services/productCatalog';
import { getProducts } from '../src/services/productApi';

jest.mock('../src/services/apiClient', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

type ProductAvailability = { id: number };

function apiResponse(data: ProductAvailability[]): AxiosResponse<ProductAvailability[]> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  };
}

describe('getProducts network availability', () => {
  const mockGet = jest.mocked(apiClient.get);

  beforeEach(() => {
    mockGet.mockReset();
  });

  it('returns the four curated products after API connectivity succeeds', async () => {
    mockGet.mockResolvedValue(
      apiResponse(PRODUCT_CATALOG.map(({ id }) => ({ id }))),
    );

    await expect(getProducts()).resolves.toEqual(PRODUCT_CATALOG);
    expect(mockGet).toHaveBeenCalledWith('/products', {
      params: { limit: 12 },
    });
  });

  it('propagates network errors so Home can display its retry state', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));

    await expect(getProducts()).rejects.toThrow('Network Error');
  });

  it('rejects an incomplete API response instead of opening the shop', async () => {
    mockGet.mockResolvedValue(apiResponse([{ id: 1 }]));

    await expect(getProducts()).rejects.toThrow(
      'API không trả về sản phẩm có mã 2.',
    );
  });
});
