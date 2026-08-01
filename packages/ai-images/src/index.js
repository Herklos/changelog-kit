import { registerProvider } from './registry.js';
import { OpenAIImageProvider } from './providers/openai.js';
import { StabilityImageProvider } from './providers/stability.js';
import { ReplicateImageProvider } from './providers/replicate.js';
import { GeminiImageProvider } from './providers/gemini.js';
import { MockImageProvider } from './providers/mock.js';

registerProvider('openai', (config) => new OpenAIImageProvider(config));
registerProvider('stability', (config) => new StabilityImageProvider(config));
registerProvider('replicate', (config) => new ReplicateImageProvider(config));
registerProvider('gemini', (config) => new GeminiImageProvider(config));
registerProvider('mock', (config) => new MockImageProvider(config));

export * from './provider.js';
export * from './registry.js';
export { OpenAIImageProvider, StabilityImageProvider, ReplicateImageProvider, GeminiImageProvider, MockImageProvider };
