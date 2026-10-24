import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import christmasBackground from '../assets/christmas_bg4.png';
import greenChristmas from '../assets/christmas_bg.png';
import redChristmas from '../assets/christmas_bg2.png';
import snowyChristmas from '../assets/christmas_bg3.png';

const filters = ['All', 'Popular', 'New'];
const collections = {
  Music: [
    { title: 'Midnights', artist: 'Taylor Swift', detail: 'Album • 13 songs', image: redChristmas, popular: true, isNew: false },
    { title: 'SOS', artist: 'SZA', detail: 'Album • 23 songs', image: greenChristmas, popular: true, isNew: true },
    { title: 'Un Verano Sin Ti', artist: 'Bad Bunny', detail: 'Album • 23 songs', image: snowyChristmas, popular: true, isNew: false },
    { title: 'IGOR', artist: 'Tyler, The Creator', detail: 'Album • 12 songs', image: redChristmas, popular: false, isNew: false },
    { title: 'Ctrl', artist: 'SZA', detail: 'Album • 14 songs', image: greenChristmas, popular: true, isNew: false },
    { title: '?', artist: 'XXXTENTACION', detail: 'Album • 18 songs', image: snowyChristmas, popular: false, isNew: true },
  ],
  Podcast: [
    { title: 'The Joe Rogan Experience', artist: 'Joe Rogan', detail: 'Podcast', image: greenChristmas, popular: true, isNew: false },
    { title: 'Call Her Daddy', artist: 'Alex Cooper', detail: 'Podcast', image: redChristmas, popular: true, isNew: false },
    { title: 'TED Talks Daily', artist: 'TED', detail: 'Podcast', image: snowyChristmas, popular: true, isNew: true },
    { title: 'Hardcore', artist: 'Dan Carlin', detail: 'Podcast', image: greenChristmas, popular: false, isNew: false },
  ],
};

export default function CollectionScreen({ collection }) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('All');
  const entries = useMemo(() => {
    const items = collections[collection];
    if (activeFilter === 'Popular') return items.filter((item) => item.popular);
    if (activeFilter === 'New') return items.filter((item) => item.isNew);
    return items;
  }, [activeFilter, collection]);

  return (
    <ImageBackground source={christmasBackground} contentFit="cover" style={styles.background}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: insets.top + 42 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to music home"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={25} color={COLORS.ink} />
          </Pressable>
          <Text style={styles.heading}>{collection === 'Music' ? 'Albums' : 'Podcasts'}</Text>
        </View>

        <View style={styles.filters}>
          {filters.map((filter) => {
            const selected = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setActiveFilter(filter)}
                style={[styles.filterButton, selected && styles.filterButtonSelected]}
              >
                <Text style={[styles.filterLabel, selected && styles.filterLabelSelected]}>{filter}</Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.list,
            { paddingBottom: Math.max(insets.bottom, 16) + 72 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {entries.map((entry) => (
            <Pressable key={entry.title} accessibilityRole="button" style={styles.row}>
              <Image source={entry.image} contentFit="cover" style={styles.art} />
              <View style={styles.details}>
                <Text numberOfLines={1} style={styles.title}>{entry.title}</Text>
                <Text numberOfLines={1} style={styles.artist}>{entry.artist}</Text>
                <Text numberOfLines={1} style={styles.meta}>{entry.detail}</Text>
              </View>
              <Ionicons name="chevron-forward" size={19} color={COLORS.green} />
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/Music')} style={styles.navItem}>
            <Ionicons name="home" size={21} color={COLORS.red} />
            <Text style={[styles.navLabel, styles.navLabelSelected]}>Home</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/Search')} style={styles.navItem}>
            <Ionicons name="search-outline" size={21} color={COLORS.muted} />
            <Text style={styles.navLabel}>Search</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/Library')} style={styles.navItem}>
            <Ionicons name="library-outline" size={21} color={COLORS.muted} />
            <Text style={styles.navLabel}>Your Library</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/Settings')} style={styles.navItem}>
            <Ionicons name="settings-outline" size={21} color={COLORS.muted} />
            <Text style={styles.navLabel}>Settings</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const COLORS = {
  green: '#174d38',
  red: '#a62224',
  ink: '#28251f',
  muted: '#817764',
  cream: '#fff8e9',
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  screen: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  backButton: { width: 34, height: 36, justifyContent: 'center', marginRight: 4 },
  heading: { color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 22 },
  filters: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 10 },
  filterButton: {
    minWidth: 76,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: COLORS.cream,
  },
  filterButtonSelected: { backgroundColor: COLORS.green },
  filterLabel: { color: COLORS.ink, fontFamily: 'NunitoBold', fontSize: 12 },
  filterLabelSelected: { color: COLORS.cream },
  list: { gap: 5, paddingHorizontal: 18, paddingTop: 1 },
  row: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  art: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#d9c7a4' },
  details: { flex: 1, minWidth: 0 },
  title: { color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 14 },
  artist: { color: '#5c554a', fontFamily: 'NunitoSemiBold', fontSize: 12 },
  meta: { color: COLORS.muted, fontFamily: 'NunitoRegular', fontSize: 11 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 7,
    backgroundColor: COLORS.cream,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(75, 59, 37, 0.2)',
  },
  navItem: { flex: 1, minWidth: 0, alignItems: 'center', gap: 1 },
  navLabel: { color: COLORS.muted, fontFamily: 'NunitoSemiBold', fontSize: 10 },
  navLabelSelected: { color: COLORS.red, fontFamily: 'NunitoExtraBold' },
});
