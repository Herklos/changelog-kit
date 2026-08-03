/**
 * Metro resolves this file for every React Native platform (ios, android,
 * and Expo/Metro web — which itself remaps the bare `react-native` specifier
 * to `react-native-web`), via the "react-native" export condition on
 * `@changelog-kit/templates/rn`. Never imported under plain Node.
 */
export { View, Text, Image, ScrollView, StyleSheet, Platform } from 'react-native';
