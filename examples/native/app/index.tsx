import { ScrollView, Text, View } from 'react-native';
import { builtinTemplates } from '@changelog-kit/templates';
import { BrandChipRow } from '../components/brand-chip-row';
import { CliSnippet } from '../components/cli-snippet';
import { PackageCard } from '../components/package-card';
import { SectionLabel } from '../components/section-label';
import { TemplateCard } from '../components/template-card';
import { useBrand } from '../lib/brand-context';
import { PACKAGES } from '../lib/packages-info';
import { colors, fonts } from '../lib/theme';
import { OUTER_PADDING, useGridColumnWidth } from '../lib/use-grid';

const CARD_GAP = 16;
const PACKAGE_GAP = 12;

export default function Gallery() {
  const { brand, brandKey, setBrandKey } = useBrand();
  const templateWidth = useGridColumnWidth(340, CARD_GAP);
  const packageWidth = useGridColumnWidth(250, PACKAGE_GAP);
  const templateIds = Object.keys(builtinTemplates);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>pnpm monorepo · 7 packages · 20 templates</Text>
        <Text style={styles.h1}>changelog-kit</Text>
        <Text style={styles.subtitle}>
          One changelog document → any template, any resolution, any target. These previews are
          rendered by the actual template packages in this repo, live on your device.
        </Text>
      </View>

      <View style={styles.section}>
        <SectionLabel>Brand kit</SectionLabel>
        <BrandChipRow value={brandKey} onChange={setBrandKey} />
      </View>

      <View style={[styles.grid, { gap: CARD_GAP }]}>
        {templateIds.map((id) => (
          <TemplateCard key={id} id={id} brand={brand} width={templateWidth} />
        ))}
      </View>

      <View style={[styles.grid, { gap: PACKAGE_GAP }]}>
        {PACKAGES.map((pkg) => (
          <PackageCard key={pkg.name} pkg={pkg} width={packageWidth} />
        ))}
      </View>

      <CliSnippet />
    </ScrollView>
  );
}

const styles = {
  root: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: OUTER_PADDING, paddingBottom: 56, gap: 40 },
  header: { gap: 14, maxWidth: 640 },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 12.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase' as const,
    color: colors.inkMuted
  },
  h1: { fontFamily: fonts.display, fontSize: 40, color: colors.ink, letterSpacing: -1.2 },
  subtitle: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23, color: colors.inkMuted },
  section: { gap: 14 },
  grid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const }
};
