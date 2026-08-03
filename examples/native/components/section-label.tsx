import { Text } from 'react-native';
import { colors, fonts } from '../lib/theme';

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = {
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: colors.inkMuted
  }
};
