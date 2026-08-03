/**
 * Only reachable under plain Node (server-side render + `node --test`) via
 * the "default" branch of the `@changelog-kit/templates/rn` export map.
 * Metro never loads this file — see rn.native.ts.
 */
export { View, Text, Image, ScrollView } from 'react-native-web';

// `@types/react-native-web` (the only types available — the real package
// ships none of its own) models `StyleSheet`/`Platform` as types only, not
// runtime values, even though the actual module exports both as real
// objects. Pull them back out through the namespace object + a cast so the
// re-export keeps working at runtime instead of silently being erased by
// `verbatimModuleSyntax`.
import * as ReactNativeWeb from 'react-native-web';
const runtime = ReactNativeWeb as unknown as { StyleSheet: unknown; Platform: unknown };
export const StyleSheet = runtime.StyleSheet;
export const Platform = runtime.Platform;
