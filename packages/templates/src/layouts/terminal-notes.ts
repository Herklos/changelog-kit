import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { RichText } from '../text.js';
import type { ReactElement } from 'react';
import type { EntryKind } from '@changelog-kit/core';
import type { Ctx, TemplateDef } from '../context.js';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const SIGIL: Record<EntryKind, string> = { new: '+', update: '~', improvement: '^', bugfix: '!', removed: '-', soon: '>' };

/**
 * Developer-flavoured release note: a window chrome, a `git log`-ish header and
 * changes as monospace lines with kind sigils. Reads well on GitHub, Discord
 * and in a docs site — and prints cleanly.
 */
export const terminalNotes: TemplateDef = {
  id: 'terminal-notes',
  name: 'Terminal notes',
  description: 'Monospace release note in a window chrome — sigil-prefixed change lines for dev audiences.',
  aspect: [4, 5],
  maxEntries: 14,
  render(ctx: Ctx): ReactElement {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const onDark = theme.colors.onDark;
    const productLower = (doc.product || 'changelog').toLowerCase();

    const dot = (color: string): ReactElement =>
      h(View, { style: { width: u(14), height: u(14), borderRadius: 99, backgroundColor: color } });

    const win = h(
      View,
      { style: { flex: 1, overflow: 'hidden', backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.hero, boxShadow: theme.shadow.hero } },
      h(
        View,
        { style: { flexDirection: 'row', alignItems: 'center', gap: u(10), paddingVertical: u(20), paddingHorizontal: u(26), borderBottomWidth: u(1), borderBottomColor: 'rgba(255,255,255,.1)' } },
        dot(theme.colors.accent),
        dot(theme.colors.secondary),
        dot(theme.colors.primary),
        h(Text, { style: { marginLeft: u(12), fontFamily: MONO, fontSize: u(20), color: 'rgba(255,255,255,.55)' } }, `${productLower || 'changelog'} — release ${doc.version}`)
      ),
      h(
        View,
        { style: { flex: 1, paddingVertical: u(34), paddingHorizontal: u(36), gap: u(16) } },
        h(
          Text,
          { style: { fontFamily: MONO, fontSize: u(22), color: 'rgba(255,255,255,.5)' } },
          h(Text, { style: { color: theme.colors.secondary } }, '$'),
          ` ${productLower || 'app'} changelog --version ${doc.version}`
        ),
        h(
          View,
          { style: { flexDirection: 'row', alignItems: 'baseline', gap: u(20) } },
          h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(96), lineHeight: u(96), letterSpacing: u(-3), color: onDark } }, `v${doc.version}`),
          doc.date ? h(Text, { style: { fontFamily: MONO, fontSize: u(22), color: 'rgba(255,255,255,.45)' } }, doc.date) : null
        ),
        doc.tagline ? h(Text, { style: { fontSize: u(24), color: 'rgba(255,255,255,.7)' } }, doc.tagline) : null,
        h(
          View,
          { style: { gap: u(12), marginTop: u(8), flex: 1 } },
          ...doc.entries.slice(0, 14).map((entry, i) =>
            h(
              View,
              { key: i, style: { flexDirection: 'row', gap: u(14) } },
              h(
                View,
                {
                  style: {
                    width: u(34),
                    height: u(34),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: u(9),
                    backgroundColor: theme.colors.badge[entry.kind as EntryKind] ?? 'rgba(255,255,255,.08)'
                  }
                },
                h(Text, { style: { fontWeight: '700', fontFamily: MONO, color: theme.colors.badgeInk[entry.kind as EntryKind] ?? onDark } }, SIGIL[entry.kind as EntryKind] ?? '*')
              ),
              h(
                Text,
                { style: { flex: 1, fontFamily: MONO, fontSize: u(23), lineHeight: u(23) * 1.35, color: 'rgba(255,255,255,.9)' } },
                h(RichText, { value: entry.title ?? '', style: { fontWeight: '700', color: onDark } }),
                entry.body ? h(RichText, { value: ` ${entry.body}`, style: { color: 'rgba(255,255,255,.6)' } }) : null
              )
            )
          )
        ),
        h(
          Text,
          { style: { fontFamily: MONO, fontSize: u(22), color: 'rgba(255,255,255,.5)', marginTop: 'auto' } },
          h(Text, { style: { color: theme.colors.secondary } }, '$'),
          ' ',
          h(Text, { style: { color: theme.colors.secondary } }, '▌')
        )
      )
    );

    return h(Canvas, { size: ctx.size, theme, style: { gap: u(20) } }, win, doc.footer ? h(Text, { style: { fontSize: u(18), color: theme.colors.inkMuted, textAlign: 'center' } }, doc.footer) : null);
  }
};

export default terminalNotes;
