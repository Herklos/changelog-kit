import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Changelog, getTemplate } from '@changelog-kit/templates';
import type { BrandKit } from '@changelog-kit/brand';
import doc from '../changelog.json';
import { fontFamiliesFor } from '../lib/brand-fonts';
import { colors, fonts, shadow } from '../lib/theme';

// The design brief's per-template format tags: release-notes/terminal-notes
// export pdf, everything else exports the raster trio.
const PDF_ONLY = new Set(['release-notes', 'terminal-notes']);

interface Props {
  id: string;
  brand: BrandKit;
  width: number;
}

/**
 * One gallery cell: a live-rendered thumbnail (via the same `<Changelog>`
 * component a consuming RN app installs directly — no scaled iframe hack
 * needed, `baseWidth` already gives a faithful poster thumbnail at any
 * measured width) wrapped in a `Link` that pushes to a full-screen preview.
 */
export function TemplateCard({ id, brand, width }: Props) {
  const template = getTemplate(id);
  const [aw, ah] = template.aspect ?? [4, 5];
  const previewHeight = Math.round(width * (ah / aw));
  const tags = [`${aw}:${ah}`, `≤${template.maxEntries ?? 6} entries`, PDF_ONLY.has(id) ? 'pdf · png' : 'png · jpg · webp'];

  return (
    <Link href={{ pathname: '/template/[id]', params: { id } }} asChild>
      <Pressable style={({ pressed }) => [styles.card, { width, opacity: pressed ? 0.92 : 1 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {template.name}
          </Text>
          <Text style={styles.id}>{template.id}</Text>
        </View>
        <View
          style={[styles.frame, { height: previewHeight, backgroundColor: brand.colors.canvas, pointerEvents: 'none' }]}
        >
          <Changelog doc={doc} brand={brand} template={id} baseWidth={1080} fontFamilies={fontFamiliesFor(brand)} />
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {template.description}
        </Text>
        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = {
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    gap: 12,
    boxShadow: shadow.card
  },
  headerRow: { flexDirection: 'row' as const, alignItems: 'baseline' as const, justifyContent: 'space-between' as const, gap: 10 },
  name: { flexShrink: 1, fontFamily: fonts.displayBold, fontSize: 18, color: colors.ink, letterSpacing: -0.2 },
  id: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMuted },
  frame: { borderRadius: 14, overflow: 'hidden' as const },
  description: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.inkMuted, minHeight: 36 },
  tagRow: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 6 },
  tag: { backgroundColor: colors.tagBg, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  tagText: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.inkMuted }
};
