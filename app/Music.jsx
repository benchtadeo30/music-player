import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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
import { getCurrentAccount } from '../components/authStorage';

const recentAlbums = [
  { title: 'Midnight Dreams', subtitle: 'Song', image: greenChristmas },
  { title: 'After Hours', subtitle: 'Album', image: redChristmas },
  { title: 'The Daily', subtitle: 'Podcast', image: snowyChristmas },
];

const songs = [
  { title: 'Shopee', artist: 'SZA', image: greenChristmas },
  { title: 'Die With A Smile', artist: 'Lady Gaga, Bruno Mars', image: redChristmas },
  { title: 'Espresso', artist: 'Sabrina Carpenter', image: snowyChristmas },
  { title: 'Beautiful Things', artist: 'Benson Boone', image: greenChristmas },
];

const categories = ['All', 'Music', 'Podcast'];

function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Good morning,';
  if (hour >= 12 && hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

export default function Music() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [accountName, setAccountName] = useState('Bench');
  const [greeting, setGreeting] = useState(() => getTimeGreeting());

  useEffect(() => {
    const updateGreeting = () => setGreeting(getTimeGreeting());
    updateGreeting();
    const greetingTimer = setInterval(updateGreeting, 60_000);
    let isMounted = true;
    getCurrentAccount()
      .then((account) => {
        if (isMounted && account?.name) setAccountName(account.name);
      })
      .catch(() => {});

    return () => {
      clearInterval(greetingTimer);
      isMounted = false;
    };
  }, []);

  return (
    <ImageBackground
      source={christmasBackground}
      contentFit="cover"
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 42, paddingBottom: 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text numberOfLines={1} style={styles.name}>{accountName}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => router.push('/Notifications')}
              style={styles.notificationButton}
            >
              <Ionicons name="notifications-outline" size={22} color={COLORS.green} />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>

          <View style={styles.categories}>
            {categories.map((category) => {
              const isSelected = category === selectedCategory;
              return (
                <Pressable
                  key={category}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    setSelectedCategory(category);
                    if (category === 'Music') router.push('/Albums');
                    if (category === 'Podcast') router.push('/Podcasts');
                  }}
                  style={[styles.categoryPill, isSelected && styles.categoryPillSelected]}
                >
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            <Pressable accessibilityRole="button" hitSlop={8}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <View style={styles.recentRow}>
            {recentAlbums.map((album) => (
              <Pressable key={album.title} accessibilityRole="button" style={styles.albumCard}>
                <Image source={album.image} contentFit="cover" style={styles.albumArt} />
                <Text numberOfLines={1} style={styles.albumTitle}>{album.title}</Text>
                <Text style={styles.albumSubtitle}>{album.subtitle}</Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.sectionHeading, styles.popularHeading]}>
            <Text style={styles.sectionTitle}>Popular Songs</Text>
            <Pressable accessibilityRole="button" hitSlop={8}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <View style={styles.songList}>
            {songs.map((song) => (
              <Pressable key={song.title} accessibilityRole="button" style={styles.songRow}>
                <Image source={song.image} contentFit="cover" style={styles.songArt} />
                <View style={styles.songDetails}>
                  <Text numberOfLines={1} style={styles.songTitle}>{song.title}</Text>
                  <Text numberOfLines={1} style={styles.songArtist}>{song.artist}</Text>
                </View>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={14} color={COLORS.green} />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          {[
            { label: 'Home', icon: 'home' },
            { label: 'Search', icon: 'search' },
            { label: 'Your Library', icon: 'library' },
            { label: 'Settings', icon: 'settings' },
          ].map((tab) => {
            const isSelected = tab.label === 'Home';
            return (
              <Pressable
                key={tab.label}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  if (tab.label === 'Home') router.replace('/Music');
                  if (tab.label === 'Search') router.push('/Search');
                  if (tab.label === 'Your Library') router.push('/Library');
                  if (tab.label === 'Settings') router.push('/Settings');
                }}
                style={styles.tab}
              >
                <Ionicons
                  name={isSelected ? tab.icon : `${tab.icon}-outline`}
                  size={23}
                  color={isSelected ? COLORS.red : COLORS.muted}
                />
                <Text style={[styles.tabLabel, isSelected && styles.tabLabelSelected]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ImageBackground>
  );
}

const COLORS = {
  green: '#164d38',
  red: '#a62224',
  ink: '#29251e',
  muted: '#837866',
  cream: '#fff8e9',
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  greeting: { color: '#5b5141', fontFamily: 'NunitoSemiBold', fontSize: 14 },
  name: { color: COLORS.green, fontFamily: 'NunitoExtraBold', fontSize: 23, lineHeight: 27 },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 11,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.red,
  },
  categories: { flexDirection: 'row', gap: 10, marginBottom: 21 },
  categoryPill: {
    minWidth: 76,
    height: 36,
    paddingHorizontal: 17,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
  },
  categoryPillSelected: { backgroundColor: COLORS.green },
  categoryText: { color: '#665f50', fontFamily: 'NunitoBold', fontSize: 12 },
  categoryTextSelected: { color: '#fff8e9' },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  sectionTitle: { color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 17 },
  seeAll: { color: COLORS.green, fontFamily: 'NunitoBold', fontSize: 12 },
  recentRow: { flexDirection: 'row', gap: 11 },
  albumCard: { flex: 1, minWidth: 0 },
  albumArt: { width: '100%', aspectRatio: 1.05, borderRadius: 10, backgroundColor: '#d9c7a4' },
  albumTitle: { color: COLORS.ink, fontFamily: 'NunitoBold', fontSize: 12, marginTop: 6 },
  albumSubtitle: { color: '#5e5548', fontFamily: 'NunitoRegular', fontSize: 11 },
  popularHeading: { marginTop: 20, marginBottom: 10 },
  songList: { gap: 8 },
  songRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 10 },
  songArt: { width: 44, height: 44, borderRadius: 7, backgroundColor: '#d9c7a4' },
  songDetails: { flex: 1, minWidth: 0 },
  songTitle: { color: COLORS.ink, fontFamily: 'NunitoBold', fontSize: 12 },
  songArtist: { color: '#655c4e', fontFamily: 'NunitoRegular', fontSize: 11 },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
  },
  bottomBar: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(75, 59, 37, 0.22)',
    backgroundColor: COLORS.cream,
  },
  tab: { flex: 1, minWidth: 0, alignItems: 'center', gap: 2 },
  tabLabel: { color: COLORS.muted, fontFamily: 'NunitoSemiBold', fontSize: 11 },
  tabLabelSelected: { color: COLORS.red, fontFamily: 'NunitoExtraBold' },
});
