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
export * from './base.js';
export * from './components.js';

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
