import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Watermark from '@components/Watermark';
import { VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export default function ScreenWatermark({
  children,
}: PropsWithChildren): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        {VARIANT.watermarkAtTop ? <Watermark /> : null}
        <View style={styles.screen}>{children}</View>
        {VARIANT.watermarkAtTop ? null : <Watermark />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1 },
  screen: { flex: 1 },
});
