import { useCallback, useState } from 'react';
import { Linking, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
  type Permission,
  type PermissionStatus,
} from 'react-native-permissions';
import { useLocationStore } from '@stores/locationStore';
import type { Coordinates } from '@utils/delivery';

export type LocationPermissionState = 'granted' | 'denied' | 'blocked';

function locationPermission(): Permission {
  return Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
}

function toPermissionState(status: PermissionStatus): LocationPermissionState {
  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
    return 'granted';
  }
  return status === RESULTS.BLOCKED ? 'blocked' : 'denied';
}

export default function useCampusLocation() {
  const coordinates = useLocationStore(state => state.coordinates);
  const setCoordinates = useLocationStore(state => state.setCoordinates);
  const [permissionState, setPermissionState] =
    useState<LocationPermissionState>('denied');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAppSettings = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        await openSettings();
      } else {
        await Linking.openSettings();
      }
    } catch (settingsError) {
      setError(
        settingsError instanceof Error
          ? settingsError.message
          : 'Không mở được Cài đặt ứng dụng.',
      );
    }
  }, []);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const permission = locationPermission();
      let status = await check(permission);

      if (status !== RESULTS.GRANTED && status !== RESULTS.LIMITED) {
        status = await request(permission);
      }

      const nextPermissionState = toPermissionState(status);
      setPermissionState(nextPermissionState);

      if (nextPermissionState !== 'granted') {
        setIsLoading(false);
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const nextCoordinates: Coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates(nextCoordinates);
          setIsLoading(false);
        },
        locationError => {
          setError(`Không lấy được vị trí: ${locationError.message}`);
          setIsLoading(false);
        },
        { enableHighAccuracy: false, timeout: 15_000, maximumAge: 60_000 },
      );
    } catch (permissionError) {
      setIsLoading(false);
      setError(
        permissionError instanceof Error
          ? permissionError.message
          : 'Không thể kiểm tra quyền vị trí.',
      );
    }
  }, [setCoordinates]);

  return {
    coordinates,
    permissionState,
    isLoading,
    error,
    requestLocation,
    openAppSettings,
  };
}
