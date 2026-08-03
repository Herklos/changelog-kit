import { Text, View } from 'react-native';
import { CLI_SNIPPET } from '../lib/packages-info';
import { colors, fonts } from '../lib/theme';

export function CliSnippet() {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Generate</Text>
      <Text style={styles.code}>{CLI_SNIPPET}</Text>
    </View>
  );
}

const styles = {
  card: { backgroundColor: colors.darkCard, borderRadius: 22, padding: 26, gap: 14 },
  label: {
    fontFamily: fonts.displayMedium,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,.6)'
  },
  code: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 22, color: colors.darkCardInk }
};
