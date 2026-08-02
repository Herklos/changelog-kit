import { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, DMSans_900Black } from '@expo-google-fonts/dm-sans';
import { StatusBar } from 'expo-status-bar';
import { Changelog } from '@changelog-kit/templates';
import { brandPresets } from '@changelog-kit/brand';
import doc from './changelog.json';

// The brand kit's fonts are Google-loaded via a <link> on the web/export
// path (see @changelog-kit/brand's fontHead()) — a native app can't do
// that, so it loads and names its own fonts and passes them through.
const FONT_FAMILIES = { display: 'DMSans_700Bold', body: 'DMSans_400Regular' };

const TEMPLATES = ['whats-new-sheet', 'hero-sandwich', 'feature-grid', 'timeline-rail'];

export default function App() {
  const [fontsLoaded] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, DMSans_900Black });
  const [templateId, setTemplateId] = useState(TEMPLATES[0]);
  const [scroll, setScroll] = useState(true);

  if (!fontsLoaded) return null;

  // whats-new-sheet is authored for the 750-wide `in-app` preset — baseWidth
  // matching that gives near-native type sizes. Poster layouts default to
  // baseWidth 1080 (a faithful, smaller-looking thumbnail on a phone).
  const baseWidth = templateId === 'whats-new-sheet' ? 750 : 1080;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="auto" />
      <View style={styles.tabs}>
        {TEMPLATES.map((id) => (
          <Pressable key={id} onPress={() => setTemplateId(id)} style={[styles.tab, id === templateId && styles.tabActive]}>
            <Text style={[styles.tabText, id === templateId && styles.tabTextActive]}>{id}</Text>
          </Pressable>
        ))}
        <Pressable onPress={() => setScroll((s) => !s)} style={styles.tab}>
          <Text style={styles.tabText}>scroll: {String(scroll)}</Text>
        </Pressable>
      </View>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Changelog
          doc={doc}
          brand={brandPresets.octobotDark}
          template={templateId}
          baseWidth={baseWidth}
          scroll={scroll}
          fontFamilies={FONT_FAMILIES}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f1237' },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.1)' },
  tabActive: { backgroundColor: '#85d6d7' },
  tabText: { color: '#fff', fontSize: 13 },
  tabTextActive: { color: '#0f1237', fontWeight: '700' },
  content: { flexGrow: 1, alignItems: 'stretch' }
});
