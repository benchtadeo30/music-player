import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ImageBackground, Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { registerAccount } from '../components/authStorage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import backgroundImage from '../assets/reg_bg.gif';
import santaHat from '../assets/snowy3.png';

export default function Registration() {
  const insets = useSafeAreaInsets();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageIsSuccess, setMessageIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegistration = async () => {
    setIsSubmitting(true);
    setMessage('');
    setMessageIsSuccess(false);
    try {
      await registerAccount({ name, email, password });
      setMessageIsSuccess(true);
      setMessage('Account created. You can log in now.');
    } catch (error) {
      setMessage(error.message || 'Could not create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground   
      source={backgroundImage}
      contentFit="cover"
      style={styles.screen}
    >
      <View pointerEvents="none" style={styles.backgroundWash} />
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 2, paddingBottom: insets.bottom + 12 },
          ]}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#593a31" />
          </Pressable>

          <View style={styles.form}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Join and start listening.</Text>

            <View style={styles.fields}>
              <View style={styles.inputShell}>
                <Ionicons name="person-outline" size={20} color="#80594b" />
                <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor="#92796c" autoComplete="name" returnKeyType="next" style={styles.input} />
              </View>
              <View style={styles.inputShell}>
                <Ionicons name="mail-outline" size={20} color="#80594b" />
                <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#92796c" keyboardType="email-address" autoCapitalize="none" autoComplete="email" returnKeyType="next" style={styles.input} />
              </View>
              <View style={styles.inputShell}>
                <Ionicons name="lock-closed-outline" size={20} color="#80594b" />
                <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#92796c" secureTextEntry={!passwordVisible} autoComplete="new-password" returnKeyType="done" style={styles.input} />
                <Pressable accessibilityRole="button" accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'} onPress={() => setPasswordVisible((visible) => !visible)} hitSlop={8}>
                  <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color="#80594b" />
                </Pressable>
              </View>
            </View>

            {message ? <Text accessibilityRole="alert" style={[styles.message, messageIsSuccess && styles.successMessage]}>{message}</Text> : null}

            <Pressable accessibilityRole="button" disabled={isSubmitting} style={({ pressed }) => [styles.signupButton, pressed && styles.pressed, isSubmitting && styles.disabled, {marginTop: message === "" ? 40 : 20}]} onPress={handleRegistration}>
              <Text style={styles.signupText}>{isSubmitting ? 'Creating account…' : 'Sign Up'}</Text>
              <Image source={santaHat} contentFit="contain" style={styles.santaHat} />
            </Pressable>

            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>Already have an account?</Text>
              <Pressable accessibilityRole="button" onPress={() => router.replace('/Login')} hitSlop={8}>
                <Text style={styles.loginLink}>Log In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, width: '100%', backgroundColor: '#fff2dc' },
  backgroundWash: { ...StyleSheet.absoluteFillObject,  backgroundColor: 'rgba(255, 244, 225, 0.88)' },
  keyboardArea: { flex: 1 },
  scrollView: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 22 },
  backButton: { width: 38, height: 38, justifyContent: 'center', marginLeft: -3 },
  form: { marginTop: 26 },
  title: { color: '#59382f', fontFamily: 'NunitoExtraBold', fontSize: 26, lineHeight: 34 },
  subtitle: { color: '#76584a', fontFamily: 'NunitoSemiBold', fontSize: 16, marginTop: 3 },
  fields: { gap: 12, marginTop: 22 },
  inputShell: {
    minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 13,
    paddingHorizontal: 16, borderRadius: 14, borderWidth: 1,
    borderColor: '#ead7bf', backgroundColor: 'rgba(255, 249, 238, 0.94)',
  },
  input: { flex: 1, minWidth: 0, paddingVertical: 10, color: '#59382f', fontFamily: 'NunitoSemiBold', fontSize: 17 },
  signupButton: {
    position: 'relative', height: 54, alignItems: 'center', justifyContent: 'center',
    borderRadius: 27, borderWidth: 1, borderColor: '#991d1b',
    backgroundColor: '#c62528', shadowColor: '#81251d', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 4, elevation: 3,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  signupText: { color: '#fffaf1', fontFamily: 'NunitoExtraBold', fontSize: 17 },
  message: { color: '#9c2424', fontFamily: 'NunitoBold', fontSize: 13, textAlign: 'center', marginTop: 14 },
  successMessage: { color: '#14593d' },
  disabled: { opacity: 0.7 },
  santaHat: { position: 'absolute', transform: 'scale(2.15)', width: "100%", height: "100%", right: -9, top: -15 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9, marginTop: 18 },
  loginPrompt: { color: '#745549', fontFamily: 'NunitoSemiBold', fontSize: 13 },
  loginLink: { color: '#57372f', fontFamily: 'NunitoExtraBold', fontSize: 14 },
});
