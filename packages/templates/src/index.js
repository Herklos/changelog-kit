import { useCallback, useState } from 'react';
import { View, ScrollView } from '@changelog-kit/templates/rn';
import { normalizeDoc } from '@changelog-kit/core';
import { h } from './h.js';

import heroSandwich from './layouts/hero-sandwich.js';
import gradientHero from './layouts/gradient-hero.js';
import teaserPoster from './layouts/teaser-poster.js';
import featureGrid from './layouts/feature-grid.js';
import releaseNotes from './layouts/release-notes.js';
import bannerSplit from './layouts/banner-split.js';
import bentoMosaic from './layouts/bento-mosaic.js';
import spotlight from './layouts/spotlight.js';
import storyStack from './layouts/story-stack.js';
import terminalNotes from './layouts/terminal-notes.js';
import editorialSplit from './layouts/editorial-split.js';
import metricCards from './layouts/metric-cards.js';
import timelineRail from './layouts/timeline-rail.js';
import duotoneCover from './layouts/duotone-cover.js';
import cardDeck from './layouts/card-deck.js';
import splitDiagonal from './layouts/split-diagonal.js';
import deviceShowcase from './layouts/device-showcase.js';
import ticketStub from './layouts/ticket-stub.js';
import megaType from './layouts/mega-type.js';
import whatsNewSheet from './layouts/whats-new-sheet.js';

export {
  heroSandwich, gradientHero, teaserPoster, featureGrid, releaseNotes,
  bannerSplit, bentoMosaic, spotlight, storyStack, terminalNotes,
  editorialSplit, metricCards, timelineRail, duotoneCover, cardDeck,
  splitDiagonal, deviceShowcase, ticketStub, megaType, whatsNewSheet
};
export * from './scale.js';
export * from './theme.js';
export * from './components.js';
export * from './text.js';
export * from './image.js';
export * from './gradients.js';
export { Canvas } from './canvas.js';

/** @type {Record<string, import('@changelog-kit/core').Template>} */
export const builtinTemplates = Object.fromEntries(
  [
    heroSandwich, bentoMosaic, duotoneCover, splitDiagonal, editorialSplit,
    cardDeck, deviceShowcase, megaType, gradientHero, spotlight,
    storyStack, whatsNewSheet, metricCards, ticketStub, timelineRail,
    teaserPoster, featureGrid, bannerSplit, terminalNotes, releaseNotes
  ].map((t) => [t.id, t])
);

export function getTemplate(id) {
  const template = builtinTemplates[id];
  if (!template) throw new Error(`Unknown template "${id}". Known: ${Object.keys(builtinTemplates).join(', ')}`);
  return template;
}

/**
 * Define a custom template with defaults filled in.
 * @param {Partial<import('@changelog-kit/core').Template> & {id:string, render:Function}} spec
 */
export function defineTemplate(spec) {
  if (!spec?.id || typeof spec.render !== 'function') {
    throw new Error('defineTemplate requires { id, render }');
  }
  return { name: spec.id, aspect: [4, 5], maxEntries: 6, ...spec };
}

/**
 * Renders a changelog doc as live React Native UI.
 *
 * `unit` is derived from the *measured* container width (`onLayout`, never
 * `Dimensions.get()`) divided by `baseWidth`. Poster type is authored
 * against a 1080px canvas — at a phone's width that unit is tiny, so
 * `whats-new-sheet` (authored for the 750-wide `in-app` preset) should be
 * used with `baseWidth={750}` for near-native type sizes; the default 1080
 * gives a faithful poster thumbnail instead.
 *
 * `scroll` puts the rendered canvas in a `ScrollView` so a render taller
 * than the viewport (a small `baseWidth` on a tall device) stays reachable.
 * It does **not** bypass a layout's `maxEntries` cap or its own
 * `overflow:hidden` — every layout is still a fixed-size poster underneath;
 * `scroll` only changes whether the *device* can clip it.
 *
 * @param {{doc: object, brand: object, template: string, baseWidth?: number, scroll?: boolean,
 *   fontFamilies?: {display?: string, body?: string}, resolveImageSource?: (src: string) => object}} props
 */
export function Changelog({ doc, brand, template: templateId, baseWidth = 1080, scroll = false, fontFamilies, resolveImageSource }) {
  const [width, setWidth] = useState(0);
  const onLayout = useCallback((e) => setWidth(e.nativeEvent.layout.width), []);

  const template = getTemplate(templateId);
  const [aw, ah] = template.aspect ?? [4, 5];

  const content = width
    ? template.render({
        doc: normalizeDoc(doc),
        brand,
        size: { width, height: Math.round((width * ah) / aw) },
        target: { format: 'native' },
        template,
        baseWidth,
        fontFamilies,
        resolveImageSource
      })
    : null;

  const measured = h(View, { onLayout, style: { width: '100%' } }, content);
  return scroll ? h(ScrollView, { style: { width: '100%' } }, measured) : measured;
}
