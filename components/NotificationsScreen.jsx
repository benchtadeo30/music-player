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

const initialNotifications = [
  { id: 'release', category: 'Music', title: 'A new album is here', message: 'SZA released a new album. Give it a listen.', time: '2 hours ago', image: greenChristmas, unread: true },
  { id: 'playlist', category: 'Music', title: 'Your holiday playlist is ready', message: 'Christmas favorites picked for your next cozy evening.', time: 'Yesterday', image: redChristmas, unread: true },
  { id: 'podcast', category: 'Podcast', title: 'New episode available', message: 'The Joe Rogan Experience has a new episode.', time: '2 days ago', image: snowyChristmas, unread: false },
];

const categories = ['All', 'Music', 'Podcast'];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [notifications, setNotifications] = useState(initialNotifications);
  const visibleNotifications = useMemo(
    () => activeCategory === 'All'
      ? notifications
      : notifications.filter((notification) => notification.category === activeCategory),
    [activeCategory, notifications],
  );
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const markRead = (id) => {
    setNotifications((current) => current.map((notification) => (
      notification.id === id ? { ...notification, unread: false } : notification
    )));
  };

  return (
    <ImageBackground source={christmasBackground} contentFit="cover" style={styles.background}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={25} color={COLORS.ink} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.heading}>Notifications</Text>
            <Text style={styles.subtitle}>{unreadCount ? `${unreadCount} new updates` : 'You’re all caught up'}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read"
            disabled={!unreadCount}
            onPress={() => setNotifications((current) => current.map((item) => ({ ...item, unread: false })))}
            style={styles.readAllButton}
          >
            <Ionicons name="checkmark-done-outline" size={21} color={unreadCount ? COLORS.green : COLORS.muted} />
          </Pressable>
        </View>

        <View style={styles.filters}>
          {categories.map((category) => {
            const selected = activeCategory === category;
            return (
              <Pressable
                key={category}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setActiveCategory(category)}
                style={[styles.filter, selected && styles.filterSelected]}
              >
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{category}</Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          style={styles.listViewport}
          contentContainerStyle={[styles.list, { paddingBottom: Math.max(insets.bottom, 12) }]}
          showsVerticalScrollIndicator={false}
        >
          {visibleNotifications.length ? visibleNotifications.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}. ${item.message}. ${item.unread ? 'Unread' : 'Read'}`}
              onPress={() => markRead(item.id)}
              style={[styles.notification, item.unread && styles.notificationUnread]}
            >
              <Image source={item.image} contentFit="cover" style={styles.art} />
              <View style={styles.notificationText}>
                <View style={styles.titleLine}>
                  <Text numberOfLines={1} style={styles.notificationTitle}>{item.title}</Text>
                  {item.unread ? <View style={styles.unreadDot} /> : null}
                </View>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time} · {item.category}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
            </Pressable>
          )) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}><Ionicons name="notifications-off-outline" size={28} color={COLORS.green} /></View>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptyMessage}>New music and podcast updates will show up here.</Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          {[
            { label: 'Home', icon: 'home', route: '/Music' },
            { label: 'Search', icon: 'search', route: '/Search' },
            { label: 'Your Library', icon: 'library', route: '/Library' },
            { label: 'Settings', icon: 'settings', route: '/Settings' },
          ].map((tab) => (
            <Pressable key={tab.label} accessibilityRole="button" onPress={() => router.replace(tab.route)} style={styles.navItem}>
              <Ionicons name={`${tab.icon}-outline`} size={21} color={COLORS.muted} />
              <Text style={styles.navLabel}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const COLORS = { green: '#174d38', red: '#a62224', ink: '#28251f', muted: '#817764', cream: '#fff8e9' };

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10, marginTop: 20 },
  backButton: { width: 36, height: 40, justifyContent: 'center' },
  headerText: { flex: 1, marginLeft: 4 },
  heading: { color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 23 },
  subtitle: { color: COLORS.muted, fontFamily: 'NunitoSemiBold', fontSize: 12 },
  readAllButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: COLORS.cream },
  filters: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 8 },
  filter: { minWidth: 75, height: 36, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 18, backgroundColor: COLORS.cream },
  filterSelected: { backgroundColor: COLORS.green },
  filterText: { color: COLORS.ink, fontFamily: 'NunitoBold', fontSize: 12 },
  filterTextSelected: { color: COLORS.cream },
  listViewport: { flex: 1, minHeight: 0, marginTop: 7, overflow: 'hidden' },
  list: { gap: 10, paddingHorizontal: 16, paddingTop: 4 },
  notification: { minHeight: 94, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12, borderRadius: 15, backgroundColor: COLORS.cream },
  notificationUnread: { borderWidth: 1, borderColor: 'rgba(23, 77, 56, 0.22)' },
  art: { width: 54, height: 54, borderRadius: 10 },
  notificationText: { flex: 1, minWidth: 0 },
  titleLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notificationTitle: { flex: 1, color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 13 },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.red },
  message: { color: '#5c554a', fontFamily: 'NunitoRegular', fontSize: 11, lineHeight: 15, marginTop: 3 },
  time: { color: COLORS.muted, fontFamily: 'NunitoSemiBold', fontSize: 10, marginTop: 5 },
  emptyState: { alignItems: 'center', paddingHorizontal: 30, paddingTop: 75 },
  emptyIcon: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 29, backgroundColor: COLORS.cream },
  emptyTitle: { color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 16, marginTop: 13 },
  emptyMessage: { color: COLORS.muted, fontFamily: 'NunitoRegular', fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: 5 },
  bottomBar: { minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 7, backgroundColor: COLORS.cream, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(75, 59, 37, 0.2)' },
  navItem: { flex: 1, minWidth: 0, alignItems: 'center', gap: 1 },
  navLabel: { color: COLORS.muted, fontFamily: 'NunitoSemiBold', fontSize: 10 },
});
