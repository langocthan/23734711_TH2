import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export const CAMPUS_GATE: Coordinates = {
  latitude: 10.8231,
  longitude: 106.689,
};

export function haversineKm(from: Coordinates, to: Coordinates): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6_371;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const fromLatitude = radians(from.latitude);
  const toLatitude = radians(to.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function estimateShippingFee(km: number): number {
  if (!Number.isFinite(km) || km < 0) {
    throw new RangeError('Khoảng cách giao hàng phải là số không âm.');
  }

  return VARIANT.shipFormula === 'A'
    ? BASE_SHIP_FEE + Math.round(km * 2_000)
    : BASE_SHIP_FEE + Math.round(km * 1_500) + 2_000;
}
