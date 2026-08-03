import { Text, View } from 'react-native';
import type { PackageInfo } from '../lib/packages-info';
import { colors, fonts } from '../lib/theme';

export function PackageCard({ pkg, width }: { pkg: PackageInfo; width: number }) {
  return (
    <View style={[styles.card, { width }]}>
      <Text style={styles.name}>{pkg.name}</Text>
      <Text style={styles.what}>{pkg.what}</Text>
    </View>
  );
}

const styles = {
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 18, gap: 8 },
  name: { fontFamily: fonts.mono, fontSize: 13, color: colors.accent },
  what: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.inkMuted }
};
