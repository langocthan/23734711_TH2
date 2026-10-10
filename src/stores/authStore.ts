import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STUDENT, examStamp } from '@constants/student';

type AuthState = {
  token: string | null;
  hasHydrated: boolean;
  login: () => void;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      hasHydrated: false,
      login: () => set({ token: `ktxgo-${STUDENT.mssv}-${examStamp()}` }),
      logout: () => set({ token: null }),
      setHasHydrated: hasHydrated => set({ hasHydrated }),
    }),
    {
      name: `ktxgo-auth-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ token: state.token }),
      onRehydrateStorage: () => state => state?.setHasHydrated(true),
    },
  ),
);
