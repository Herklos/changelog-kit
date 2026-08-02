import { inlineTokens } from '@changelog-kit/core';
import { Text } from '@changelog-kit/templates/rn';
import { h } from './h.js';

const DEFAULT_TOKEN_STYLE = {
  bold: { fontWeight: '700' },
  italic: { fontStyle: 'italic' },
  code: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }
};

/**
 * Renders the same inline-markdown spec `inlineMd()` renders to HTML
 * (`**bold**`, `*italic*`, `` `code` ``, line breaks) into nested `<Text>`.
 * Never use `esc()`/`inlineMd()` here — `<Text>` renders its children
 * literally, so HTML-escaping would print visible `&amp;`.
 * @param {{value?: string, style?: object, tokenStyle?: {bold?, italic?, code?}}} props
 */
export function RichText({ value = '', style, tokenStyle = {} }) {
  // RN has no `em` unit — `code` was `font-size:0.92em` in CSS (relative to
  // the surrounding text), so it's scaled off the root style's own fontSize
  // here instead, only when that's a plain number (a `u(n)` result).
  const inheritedFontSize = typeof style?.fontSize === 'number' ? style.fontSize : undefined;
  const defaultTokenStyle = {
    ...DEFAULT_TOKEN_STYLE,
    code: { ...DEFAULT_TOKEN_STYLE.code, ...(inheritedFontSize != null ? { fontSize: inheritedFontSize * 0.92 } : null) }
  };
  const style2 = { ...defaultTokenStyle, ...tokenStyle };
  const children = inlineTokens(value).map((tok, i) => {
    if (tok.type === 'break') return '\n';
    if (tok.type === 'text') return tok.value;
    return h(Text, { key: i, style: style2[tok.type] }, tok.value);
  });
  return h(Text, { style }, ...children);
}
