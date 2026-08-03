import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { Badge } from '../components.js';
import { ArtSlot } from '../image.js';
import { RichText } from '../text.js';
import type { ReactElement } from 'react';
import type { ChangelogEntry, EntryKind } from '@changelog-kit/core';
import type { Ctx, TemplateDef } from '../context.js';

/**
 * Document layout: title block, optional hero strip, then a typographic list
 * of changes. Built for A4/Letter PDF release notes — flows, no fixed slots.
 */
export const releaseNotes: TemplateDef = {
  id: 'release-notes',
  name: 'Release notes',
  description: 'Editorial one-pager for PDF release notes: title block plus a list of changes.',
  aspect: [794, 1123],
  maxEntries: 24,
  render(ctx: Ctx): ReactElement {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const groups = new Map<EntryKind | undefined, ChangelogEntry[]>();
    for (const entry of doc.entries) {
      if (!groups.has(entry.kind)) groups.set(entry.kind, []);
      groups.get(entry.kind)!.push(entry);
    }

    const header = h(
      View,
      { style: { borderBottomWidth: u(2), borderBottomColor: theme.colors.ink, paddingBottom: u(16) } },
      h(
        Text,
        { style: { fontSize: u(18), letterSpacing: u(2), textTransform: 'uppercase', color: theme.colors.inkMuted } },
        `${doc.product || 'Release notes'}${doc.date ? ` · ${doc.date}` : ''}`
      ),
      h(Text, { style: { fontFamily: theme.fonts.display, fontSize: u(72), lineHeight: u(72), letterSpacing: u(-2), marginTop: u(8), color: theme.colors.ink } }, `Version ${doc.version}`),
      doc.tagline
        ? h(Text, { style: { fontSize: u(24), color: theme.colors.inkMuted, marginTop: u(10), maxWidth: u(640) } }, doc.tagline)
        : null
    );

    const body = h(
      View,
      { style: { flex: 1, gap: u(28) } },
      ...[...groups.entries()].map(([kind, list], gi) =>
        h(
          View,
          { key: gi },
          h(
            View,
            { style: { flexDirection: 'row', alignItems: 'center', gap: u(10), marginBottom: u(12) } },
            h(Badge, { entry: { kind, badge: list[0].badge }, theme, u }),
            h(Text, { style: { fontSize: u(18), color: theme.colors.inkMuted } }, String(list.length))
          ),
          h(
            View,
            { style: { gap: u(14) } },
            ...list.map((entry, i) =>
              h(
                View,
                { key: i, style: { paddingLeft: u(18), borderLeftWidth: u(3), borderLeftColor: theme.colors.primary, gap: u(4) } },
                entry.title
                  ? h(RichText, { value: entry.title, style: { fontFamily: theme.fonts.display, fontSize: u(26), lineHeight: u(26) * 1.2, color: theme.colors.ink } })
                  : null,
                entry.body
                  ? h(RichText, { value: entry.body, style: { fontSize: u(20), lineHeight: u(20) * 1.45, color: theme.colors.inkMuted } })
                  : null
              )
            )
          )
        )
      )
    );

    return h(
      Canvas,
      { size: ctx.size, theme, style: { gap: u(26) } },
      header,
      doc.hero?.src
        ? h(ArtSlot, { image: doc.hero, theme, resolveImageSource: ctx.resolveImageSource, borderRadius: theme.radius.image, style: { position: 'relative', height: u(260) } })
        : null,
      body,
      doc.footer
        ? h(Text, { style: { borderTopWidth: u(1), borderTopColor: theme.colors.inkMuted, paddingTop: u(12), fontSize: u(16), color: theme.colors.inkMuted } }, doc.footer)
        : null
    );
  }
};

export default releaseNotes;
