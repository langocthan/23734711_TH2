import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { STUDENT_WATERMARK } from '@constants/student';
import { COLORS } from '@constants/theme';

export default function Watermark(): React.JSX.Element {
  return (
    <Text
      pointerEvents="none"
      numberOfLines={1}
      style={styles.watermark}
    >
      {STUDENT_WATERMARK}
    </Text>
  );
}

const styles = StyleSheet.create({
  watermark: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    textAlign: 'center',
    color: COLORS.text,
    backgroundColor: COLORS.border,
    fontSize: 12,
    fontWeight: '700',
  },
});
