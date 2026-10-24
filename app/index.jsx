import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import bg from '../assets/intro.gif';
import Logo from '../assets/waveform.svg';
import snowy from '../assets/snowy.png';

import { router } from 'expo-router';

export default function index() {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
  source={bg}
  contentFit="fill"
  style={styles.background}
>
      <StatusBar hidden />
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        contentInsetAdjustmentBehavior="never"
        bounces={false}
      >
        <Logo width={80} height={80} style={styles.logo} />
        <Text style={styles.title}>Music</Text>
        <Text style={styles.title}>for every mood</Text>
        <Text style={styles.description}>
          Discover, play and enjoy{ '\n' }
          your favorite music,{ '\n' }
          podcasts and more.
        </Text>
        <Pressable
          onPress={() => router.push('/Login')}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Image source={snowy} contentFit="contain" style={styles.santaHat} />
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
  shadowColor: '#3985ff',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 1,
  shadowRadius: 25,
  elevation: 20,
},
  title: {
    color: '#fff',
    fontFamily: 'NunitoExtraBold',
    fontSize: 30,
    lineHeight: 35,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },
  description: {
    color: '#fff',
    fontFamily: 'NunitoSemiBold',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 204,
    height: 48,
    marginTop: 32,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#f5e8d7',
    backgroundColor: '#c51c25',
    elevation: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  buttonPressed: {
    opacity: 0.88,
    elevation: 3,
    transform: [{ scale: 0.96 }],
  },
  santaHat: {
    position: 'absolute',
    width: '100%',
    height: 68,
    top: -30,
    right: -5,
    transform: [{ scale: 1.25 }],
    shadowColor: '#fff3a8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 22,
    elevation: 16,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'NunitoExtraBold',
    fontSize: 15,
  },
});
