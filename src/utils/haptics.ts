import { Vibration } from 'react-native';
import { VARIANT } from '@constants/student';

export function triggerAddHaptic(): void {
  Vibration.vibrate(VARIANT.hapticOnAdd === 'impact' ? 24 : 12);
}
