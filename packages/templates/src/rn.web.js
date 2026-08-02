/**
 * Only reachable under plain Node (server-side render + `node --test`) via
 * the "default" branch of the `@changelog-kit/templates/rn` export map.
 * Metro never loads this file — see rn.native.js.
 */
export { View, Text, Image, ScrollView, StyleSheet, Platform } from 'react-native-web';
