import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ImageBackground } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deleteCurrentAccount, getCurrentAccount, logoutAccount, updateCurrentAccount } from './authStorage';

import christmasBackground from '../assets/christmas_bg4.png';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('Bench');
  const [email, setEmail] = useState('');
  const [musicPath, setMusicPath] = useState('/Music');
  const [statusMessage, setStatusMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getCurrentAccount()
      .then((account) => {
        if (!isMounted || !account) return;
        setName(account.name);
        setEmail(account.email);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const confirmTitle = confirmAction === 'logout' ? 'Log out?' : 'Delete account?';
  const confirmMessage = confirmAction === 'logout'
    ? 'You can log back in any time.'
    : 'This removes the account saved on this device. You can register again later.';

  const confirm = async () => {
    if (confirmAction === 'logout') {
      await logoutAccount();
      router.replace('/Login');
      return;
    }

    await deleteCurrentAccount();
    router.replace('/Login');
  };

  const saveProfile = async () => {
    try {
      const account = await updateCurrentAccount({ name, email });
      setName(account.name);
      setEmail(account.email);
      setStatusMessage('Profile details saved.');
    } catch (error) {
      setStatusMessage(error.message || 'Could not save profile details.');
    }
  };

  return (
    <ImageBackground source={christmasBackground} contentFit="cover" style={styles.background}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to your library"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={25} color={COLORS.ink} />
            </Pressable>
            <Text style={styles.heading}>Settings</Text>
          </View>

          <Text style={styles.intro}>Manage your profile and music library.</Text>
        </View>

        <ScrollView
          style={styles.settingsScroll}
          contentContainerStyle={[styles.settingsScrollContent, { paddingBottom: Math.max(insets.bottom, 8) + 76 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              accessibilityLabel="Profile name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              accessibilityLabel="Profile email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Pressable
              accessibilityRole="button"
              onPress={saveProfile}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>Save profile</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Music folder</Text>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Folder path</Text>
            <TextInput
              accessibilityLabel="Music folder path"
              value={musicPath}
              onChangeText={setMusicPath}
              placeholder="Enter a folder path"
              placeholderTextColor={COLORS.muted}
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={styles.helperText}>Choose where your music files are stored.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setStatusMessage(`Rescan requested for ${musicPath || 'the music folder'}. Device storage scanning is not connected yet.`)}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Ionicons name="refresh-outline" size={18} color={COLORS.green} />
              <Text style={styles.secondaryButtonText}>Rescan music</Text>
            </Pressable>
          </View>

          {statusMessage ? (
            <View accessibilityRole="text" style={styles.statusBox}>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Account</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setConfirmAction('logout')}
            style={({ pressed }) => [styles.accountButton, pressed && styles.pressed]}
          >
            <Ionicons name="log-out-outline" size={19} color={COLORS.ink} />
            <Text style={styles.accountButtonText}>Log out</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setConfirmAction('delete')}
            style={({ pressed }) => [styles.accountButton, styles.deleteButton, pressed && styles.pressed]}
          >
            <Ionicons name="trash-outline" size={19} color={COLORS.red} />
            <Text style={styles.deleteButtonText}>Delete account</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.red} />
          </Pressable>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          {[
            { label: 'Home', icon: 'home' },
            { label: 'Search', icon: 'search' },
            { label: 'Your Library', icon: 'library' },
            { label: 'Settings', icon: 'settings' },
          ].map((tab) => {
            const selected = tab.label === 'Settings';
            return (
              <Pressable
                key={tab.label}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  if (tab.label === 'Home') router.replace('/Music');
                  if (tab.label === 'Search') router.replace('/Search');
                  if (tab.label === 'Your Library') router.replace('/Library');
                  if (tab.label === 'Settings') router.replace('/Settings');
                }}
                style={styles.navItem}
              >
                <Ionicons
                  name={selected ? tab.icon : `${tab.icon}-outline`}
                  size={21}
                  color={selected ? COLORS.red : COLORS.muted}
                />
                <Text style={[styles.navLabel, selected && styles.navLabelSelected]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {confirmAction ? (
          <View style={styles.dialogBackdrop}>
            <View style={styles.dialog}>
              <Text style={styles.dialogTitle}>{confirmTitle}</Text>
              <Text style={styles.dialogMessage}>{confirmMessage}</Text>
              <View style={styles.dialogActions}>
                <Pressable accessibilityRole="button" onPress={() => setConfirmAction(null)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={confirm}
                  style={[styles.confirmButton, confirmAction === 'delete' && styles.deleteConfirmButton]}
                >
                  <Text style={styles.confirmButtonText}>{confirmAction === 'logout' ? 'Log out' : 'Continue'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}
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
  line: '#e9dcc4',
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingHorizontal: 20 },
  settingsScroll: { flex: 1, marginHorizontal: 20, overflow: 'hidden' },
  settingsScrollContent: { paddingBottom: 84 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 7, backgroundColor: COLORS.cream, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(75, 59, 37, 0.2)' },
  navItem: { flex: 1, minWidth: 0, alignItems: 'center', gap: 1 },
  navLabel: { color: COLORS.muted, fontFamily: 'NunitoSemiBold', fontSize: 10 },
  navLabelSelected: { color: COLORS.red, fontFamily: 'NunitoExtraBold' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 30 },
  backButton: { width: 34, height: 36, justifyContent: 'center', marginRight: 4 },
  heading: { color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 22 },
  intro: { color: '#5c554a', fontFamily: 'NunitoSemiBold', fontSize: 13, marginBottom: 12 },
  sectionTitle: { color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 16, marginTop: 8, marginBottom: 7 },
  card: { padding: 14, borderRadius: 14, backgroundColor: COLORS.cream },
  fieldLabel: { color: COLORS.muted, fontFamily: 'NunitoBold', fontSize: 11, marginBottom: 3 },
  input: { minHeight: 38, paddingVertical: 5, color: COLORS.ink, fontFamily: 'NunitoSemiBold', fontSize: 14 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: COLORS.line, marginVertical: 7 },
  primaryButton: { minHeight: 40, alignItems: 'center', justifyContent: 'center', marginTop: 11, borderRadius: 11, backgroundColor: COLORS.green },
  primaryButtonText: { color: COLORS.cream, fontFamily: 'NunitoExtraBold', fontSize: 13 },
  helperText: { color: COLORS.muted, fontFamily: 'NunitoRegular', fontSize: 11, marginTop: 2, marginBottom: 9 },
  secondaryButton: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: COLORS.green, borderRadius: 11 },
  secondaryButtonText: { color: COLORS.green, fontFamily: 'NunitoExtraBold', fontSize: 13 },
  statusBox: { marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: COLORS.cream },
  statusText: { color: COLORS.green, fontFamily: 'NunitoSemiBold', fontSize: 12 },
  accountButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 14, marginBottom: 8, borderRadius: 12, backgroundColor: COLORS.cream },
  accountButtonText: { flex: 1, color: COLORS.ink, fontFamily: 'NunitoBold', fontSize: 13 },
  deleteButton: { borderWidth: 1, borderColor: '#d8a8a0' },
  deleteButtonText: { flex: 1, color: COLORS.red, fontFamily: 'NunitoBold', fontSize: 13 },
  pressed: { opacity: 0.82 },
  dialogBackdrop: { position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 100, elevation: 24, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(30, 25, 18, 0.58)' },
  dialog: { width: '100%', maxWidth: 315, padding: 20, borderRadius: 16, backgroundColor: COLORS.cream },
  dialogTitle: { color: COLORS.ink, fontFamily: 'NunitoExtraBold', fontSize: 19 },
  dialogMessage: { color: '#5c554a', fontFamily: 'NunitoRegular', fontSize: 13, lineHeight: 19, marginTop: 7 },
  dialogActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 9, marginTop: 18 },
  cancelButton: { minHeight: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 10, backgroundColor: '#eee4d2' },
  cancelButtonText: { color: COLORS.ink, fontFamily: 'NunitoBold', fontSize: 12 },
  confirmButton: { minHeight: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 10, backgroundColor: COLORS.green },
  deleteConfirmButton: { backgroundColor: COLORS.red },
  confirmButtonText: { color: COLORS.cream, fontFamily: 'NunitoExtraBold', fontSize: 12 },
});
