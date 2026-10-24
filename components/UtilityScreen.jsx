import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import christmasBackground from '../assets/christmas_bg4.png';
import greenChristmas from '../assets/christmas_bg.png';
import redChristmas from '../assets/christmas_bg2.png';
import snowyChristmas from '../assets/christmas_bg3.png';

const searchCategories = ['All', 'Music', 'Podcast'];
const libraryCategories = ['Playlists', 'Artists', 'Albums', 'Podcasts'];

const searchItems = [
  { title: 'Midnights', subtitle: 'Taylor Swift • Album', type: 'Music', image: redChristmas },
  { title: 'SOS', subtitle: 'SZA • Album', type: 'Music', image: greenChristmas },
  { title: 'Un Verano Sin Ti', subtitle: 'Bad Bunny • Album', type: 'Music', image: snowyChristmas },
  { title: 'IGOR', subtitle: 'Tyler, The Creator • Album', type: 'Music', image: redChristmas },
  { title: 'Ctrl', subtitle: 'SZA • Album', type: 'Music', image: greenChristmas },
  { title: 'The Joe Rogan Experience', subtitle: 'Joe Rogan • Podcast', type: 'Podcast', image: greenChristmas },
  { title: 'Call Her Daddy', subtitle: 'Alex Cooper • Podcast', type: 'Podcast', image: redChristmas },
  { title: 'TED Talks Daily', subtitle: 'TED • Podcast', type: 'Podcast', image: snowyChristmas },
  { title: 'Hardcore', subtitle: 'Dan Carlin • Podcast', type: 'Podcast', image: greenChristmas },
];

const savedItems = {
  Playlists: [
    { title: 'Liked Songs', subtitle: 'Playlist • 42 songs', image: redChristmas },
    { title: 'Christmas Favorites', subtitle: 'Playlist • 18 songs', image: greenChristmas },
    { title: 'Late Night Listening', subtitle: 'Playlist • 26 songs', image: snowyChristmas },
  ],
  Artists: [
    { title: 'SZA', subtitle: 'Artist', image: greenChristmas },
    { title: 'Taylor Swift', subtitle: 'Artist', image: redChristmas },
    { title: 'Bad Bunny', subtitle: 'Artist', image: snowyChristmas },
  ],
  Albums: [
    { title: 'Midnights', subtitle: 'Taylor Swift • Album', image: redChristmas },
    { title: 'SOS', subtitle: 'SZA • Album', image: greenChristmas },
    { title: 'Un Verano Sin Ti', subtitle: 'Bad Bunny • Album', image: snowyChristmas },
    { title: 'Ctrl', subtitle: 'SZA • Album', image: greenChristmas },
  ],
  Podcasts: [
    { title: 'The Joe Rogan Experience', subtitle: 'Joe Rogan • Podcast', image: greenChristmas },
    { title: 'Call Her Daddy', subtitle: 'Alex Cooper • Podcast', image: redChristmas },
    { title: 'TED Talks Daily', subtitle: 'TED • Podcast', image: snowyChristmas },
  ],
};

export default function UtilityScreen({ page }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [libraryCategory, setLibraryCategory] = useState('Playlists');
  const isSearch = page === 'Search';

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return searchItems.filter((item) => {
      const matchesCategory = searchCategory === 'All' || item.type === searchCategory;
      const matchesQuery = !normalizedQuery
        || `${item.title} ${item.subtitle}`.toLocaleLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, searchCategory]);

  const items = isSearch ? results : savedItems[libraryCategory];

  return (
    <ImageBackground source={christmasBackground} contentFit="cover" style={styles.background}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        <View style={[styles.header, !isSearch && styles.libraryHeader, { paddingTop: insets.top + 42 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to previous screen"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={25} color={COLORS.ink} />
          </Pressable>
          <Text style={styles.heading}>{isSearch ? 'Search' : 'Your Library'}</Text>
        </View>

        {isSearch ? (
          <>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={20} color={COLORS.green} />
              <TextInput
                accessibilityLabel="Search music and podcasts"
                value={query}
                onChangeText={setQuery}
                placeholder="What do you want to listen to?"
                placeholderTextColor={COLORS.muted}
                returnKeyType="search"
                style={styles.searchInput}
              />
              {query.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  onPress={() => setQuery('')}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={19} color={COLORS.muted} />
                </Pressable>
              )}
            </View>

            <View style={styles.filters}>
              {searchCategories.map((category) => {
                const selected = searchCategory === category;
                return (
                  <Pressable
                    key={category}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setSearchCategory(category)}
                    style={[styles.filterButton, selected && styles.filterButtonSelected]}
                  >
                    <Text style={[styles.filterLabel, selected && styles.filterLabelSelected]}>{category}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>
              {query.trim()
                ? 'Search results'
                : searchCategory === 'Podcast'
                  ? 'Podcasts'
                  : searchCategory === 'Music'
                    ? 'Albums'
                    : 'Browse music'}
            </Text>
            {query.trim() || searchCategory !== 'All' ? (
              <ItemList items={items} bottomInset={insets.bottom} />
            ) : (
              <View style={styles.browseCards}>
                <Pressable accessibilityRole="button" onPress={() => router.push('/Albums')} style={[styles.browseCard, styles.musicCard]}>
                  <Text style={styles.browseCardTitle}>Music</Text>
                  <Text style={styles.browseCardSubtitle}>Browse albums</Text>
                  <Ionicons name="musical-notes" size={42} color="#fff8e9" style={styles.browseIcon} />
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => router.push('/Podcasts')} style={[styles.browseCard, styles.podcastCard]}>
                  <Text style={styles.browseCardTitle}>Podcasts</Text>
                  <Text style={styles.browseCardSubtitle}>Find a show</Text>
                  <Ionicons name="mic" size={40} color="#fff8e9" style={styles.browseIcon} />
                </Pressable>
              </View>
            )}
          </>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.libraryFilters}
              style={styles.libraryFilterScroll}
            >
              {libraryCategories.map((category) => {
                const selected = libraryCategory === category;
                return (
                  <Pressable
                    key={category}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setLibraryCategory(category)}
                    style={[styles.filterButton, selected && styles.filterButtonSelected]}
                  >
                    <Text style={[styles.filterLabel, selected && styles.filterLabelSelected]}>{category}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={styles.librarySection}>
              <Text style={[styles.sectionTitle, styles.librarySectionTitle]}>Recently played</Text>
              <ItemList items={items} bottomInset={insets.bottom} compact />
            </View>
          </>
        )}

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <NavItem label="Home" icon="home" selected={false} onPress={() => router.replace('/Music')} />
          <NavItem label="Search" icon="search" selected={isSearch} onPress={() => isSearch ? null : router.replace('/Search')} />
          <NavItem label="Your Library" icon="library" selected={!isSearch} onPress={() => isSearch ? router.replace('/Library') : null} />
          <NavItem label="Settings" icon="settings" selected={false} onPress={() => router.replace('/Settings')} />
        </View>
      </View>
    </ImageBackground>
  );
}

function ItemList({ items, bottomInset, compact = false }) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.itemList,
        compact && styles.compactItemList,
        { paddingBottom: Math.max(bottomInset, 8) + (compact ? 60 : 72) },
      ]}
      style={compact && styles.libraryList}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {items.length > 0 ? items.map((item) => (
        <Pressable key={`${item.title}-${item.subtitle}`} accessibilityRole="button" style={[styles.itemRow, compact && styles.compactItemRow]}>
          <Image source={item.image} contentFit="cover" style={[styles.itemArt, compact && styles.compactItemArt]} />
          <View style={styles.itemDetails}>
            <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.itemSubtitle}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={19} color={COLORS.green} />
        </Pressable>
      )) : (
        <Text style={styles.emptyMessage}>No results found. Try another search.</Text>
      )}
    </ScrollView>
  );
}

function NavItem({ label, icon, selected, onPress }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={styles.navItem}>
      <Ionicons
        name={selected ? icon : `${icon}-outline`}
        size={21}
        color={selected ? COLORS.red : COLORS.muted}
      />
      <Text style={[styles.navLabel, selected && styles.navLabelSelected]}>{label}</Text>
    </Pressable>
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
  libraryHeader: { paddingBottom: 4 },
  backButton: { width: 34, height: 36, justifyContent: 'center', marginRight: 4 },
  heading: { color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 22 },
  searchBox: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 18,
    paddingHorizontal: 14,
    borderRadius: 13,
    backgroundColor: COLORS.cream,
  },
  searchInput: { flex: 1, minWidth: 0, paddingVertical: 8, color: COLORS.ink, fontFamily: 'NunitoSemiBold', fontSize: 13 },
  filters: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 14, marginBottom: 18 },
  libraryFilterScroll: { flexGrow: 0, flexShrink: 0, height: 34 },
  libraryFilters: { gap: 9, paddingHorizontal: 20, paddingBottom: 0 },
  filterButton: {
    minWidth: 72,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: COLORS.cream,
  },
  filterButtonSelected: { backgroundColor: COLORS.green },
  filterLabel: { color: COLORS.ink, fontFamily: 'NunitoBold', fontSize: 12 },
  filterLabelSelected: { color: COLORS.cream },
  sectionTitle: { marginHorizontal: 20, marginBottom: 10, color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 17 },
  librarySectionTitle: { marginTop: 0, marginBottom: 2 },
  librarySection: { flex: 1, minHeight: 0, marginTop: 12 },
  libraryList: { flex: 1 },
  itemList: { gap: 5, paddingHorizontal: 18, paddingTop: 1 },
  compactItemList: { gap: 2, paddingTop: 0 },
  itemRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 5, paddingVertical: 5 },
  compactItemRow: { minHeight: 56, gap: 10, paddingVertical: 3 },
  itemArt: { width: 54, height: 54, borderRadius: 8, backgroundColor: '#d9c7a4' },
  compactItemArt: { width: 46, height: 46 },
  compactItemArt: { width: 46, height: 46 },
  itemDetails: { flex: 1, minWidth: 0 },
  itemTitle: { color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 14 },
  itemSubtitle: { color: '#5c554a', fontFamily: 'NunitoSemiBold', fontSize: 12 },
  emptyMessage: { marginHorizontal: 5, marginTop: 15, color: COLORS.muted, fontFamily: 'NunitoSemiBold', fontSize: 13 },
  browseCards: { flexDirection: 'row', gap: 12, paddingHorizontal: 18 },
  browseCard: { flex: 1, minHeight: 132, justifyContent: 'flex-end', overflow: 'hidden', padding: 14, borderRadius: 15 },
  musicCard: { backgroundColor: COLORS.green },
  podcastCard: { backgroundColor: '#a12b2a' },
  browseCardTitle: { color: COLORS.cream, fontFamily: 'NunitoExtraBold', fontSize: 17 },
  browseCardSubtitle: { color: COLORS.cream, fontFamily: 'NunitoSemiBold', fontSize: 11 },
  browseIcon: { position: 'absolute', right: 11, top: 12, opacity: 0.82 },
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
