import { useLocalSearchParams, Stack } from 'expo-router';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Host, Picker } from '@expo/ui';
import { Changelog, getTemplate } from '@changelog-kit/templates';
import { brandPresets } from '@changelog-kit/brand';
import doc from '../../changelog.json';
import { useBrand } from '../../lib/brand-context';
import { fontFamiliesFor } from '../../lib/brand-fonts';
import { colors, fonts, shadow } from '../../lib/theme';
import { OUTER_PADDING } from '../../lib/use-grid';

// `whats-new-sheet` is authored for the 750-wide `in-app` preset — baseWidth
// matching that gives near-native type sizes here, same as the poster
// templates default to 1080 (see `@changelog-kit/templates`' `Changelog` doc
// comment).
function baseWidthFor(id: string): number {
  return id === 'whats-new-sheet' ? 750 : 1080;
}

export default function TemplateDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { brand, brandKey, setBrandKey } = useBrand();
  const { width } = useWindowDimensions();
  const template = getTemplate(id);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: template.name }} />

      <View style={styles.intro}>
        <Text style={styles.id}>{template.id}</Text>
        <Text style={styles.description}>{template.description}</Text>
      </View>

      <View style={styles.pickerRow}>
        <Text style={styles.pickerLabel}>Brand</Text>
        <Host matchContents>
          <Picker selectedValue={brandKey} onValueChange={setBrandKey} appearance="menu">
            {Object.entries(brandPresets).map(([key, b]) => (
              <Picker.Item key={key} label={b.name} value={key} />
            ))}
          </Picker>
        </Host>
      </View>

      <View style={[styles.frame, { width: width - OUTER_PADDING * 2, backgroundColor: brand.colors.canvas }]}>
        <Changelog
          doc={doc}
          brand={brand}
          template={id}
          baseWidth={baseWidthFor(id)}
          fontFamilies={fontFamiliesFor(brand)}
        />
      </View>
    </ScrollView>
  );
}

const styles = {
  root: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: OUTER_PADDING, paddingBottom: 56, gap: 20, alignItems: 'center' as const },
  intro: { gap: 6, alignSelf: 'stretch' as const },
  id: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkMuted },
  description: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.ink },
  pickerRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, alignSelf: 'flex-start' as const },
  pickerLabel: { fontFamily: fonts.displayMedium, fontSize: 13, color: colors.inkMuted },
  frame: { borderRadius: 18, overflow: 'hidden' as const, boxShadow: shadow.card }
};
