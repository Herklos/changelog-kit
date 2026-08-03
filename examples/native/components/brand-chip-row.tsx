import { Pressable, ScrollView, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { brandPresets } from '@changelog-kit/brand';
import { colors, fonts } from '../lib/theme';

interface Props {
  value: string;
  onChange: (key: string) => void;
}

/**
 * The design brief's "brand chips": a row of always-visible pill buttons
 * with a color swatch + name, one active at a time. Kept as plain
 * `Pressable`s (not `@expo/ui`'s `Picker`) — the universal `Picker` only
 * offers `'menu'`/`'wheel'` appearances, neither of which can show a swatch
 * per option or all five brands at a glance; `Picker` is used instead on the
 * template detail screen, where a compact native menu is the better fit.
 */
export function BrandChipRow({ value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {Object.entries(brandPresets).map(([key, brand]) => {
        const on = key === value;
        return (
          <Pressable
            key={key}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(key);
            }}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: on ? colors.ink : colors.surface,
                borderColor: on ? colors.ink : colors.chipBorder,
                opacity: pressed ? 0.7 : 1
              }
            ]}
          >
            <View style={[styles.swatch, { backgroundColor: brand.colors.accent }]} />
            <Text style={[styles.label, { color: on ? '#ffffff' : colors.ink }]}>{brand.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = {
  row: { gap: 10, paddingRight: 8 },
  chip: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1
  },
  swatch: { width: 12, height: 12, borderRadius: 99 },
  label: { fontFamily: fonts.displayMedium, fontSize: 14 }
};
