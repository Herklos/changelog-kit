import { defineBrandKit, octobotDark } from '@changelog-kit/brand';

/**
 * Project-owned brand kit — the OctoBot charte graphique (Drakkar Software),
 * extended with the assets this repo ships.
 *
 *   bleu-sombre #0f1237 · blanc-perle #f3f6f8 · bleu-givré #85d6d7
 *   turquoise   #65e7cf · bleu-octobot #5ba0cc · DM Sans (Black / Bold / Regular)
 */
export default defineBrandKit({
  extends: octobotDark,
  id: 'octobot',
  name: 'OctoBot',
  colors: {
    canvas: '#0f1237',
    surface: '#19283e',
    ink: '#f3f6f8',
    primary: '#85d6d7',
    secondary: '#65e7cf',
    accent: '#5ba0cc',
    heroFrom: '#26448e',
    heroTo: '#0f1237'
  },
  fonts: {
    display: { family: 'DM Sans', source: 'google', weights: [700, 900] },
    body: { family: 'DM Sans', source: 'google', weights: [400, 500, 700] }
  },
  logo: { src: './assets/octobot-logo.svg', width: 200 },
  imagery: {
    style: '3D render, stylised octopus mascot with the OctoBot helmet, turquoise and frosted-blue materials, trading charts',
    background: 'bleu-sombre gradient with a turquoise halo glow',
    negative: 'text, lettering, watermark, extra limbs'
  }
});
