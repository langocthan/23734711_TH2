import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STUDENT } from '@constants/student';
import type { Coordinates } from '@utils/delivery';

type LocationState = {
  coordinates: Coordinates | null;
  setCoordinates: (coordinates: Coordinates) => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    set => ({
      coordinates: null,
      setCoordinates: coordinates => set({ coordinates }),
    }),
    {
      name: `ktxgo-location-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ coordinates: state.coordinates }),
    },
  ),
);
