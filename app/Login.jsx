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
import { loginAccount } from '../components/authStorage';
import snowy from '../assets/snowy2.png'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import bg from '../assets/login_bg.gif';

export default function Login() {
  const insets = useSafeAreaInsets();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    setMessage('');
    try {
      await loginAccount({ email, password });
      router.replace('/Music');
    } catch (error) {
      setMessage(error.message || 'Could not log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground  
      source={bg}
      contentFit="fill"
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 },
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
            <Ionicons name="arrow-back" size={25} color="#fff8ed" />
          </Pressable>

          <View style={styles.form}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to continue</Text>

            <View style={styles.fields}>
              <View style={styles.inputShell}>
                <Ionicons name="mail-outline" size={23} color="#713b34" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor="#967d70"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  style={styles.input}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputShell}>
                <Ionicons name="lock-closed-outline" size={23} color="#713b34" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#967d70"
                  secureTextEntry={!passwordVisible}
                  autoComplete="password"
                  style={styles.input}
                  returnKeyType="done"
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  onPress={() => setPasswordVisible((visible) => !visible)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="#713b34"
                  />
                </Pressable>
              </View>
            </View>

            {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}

            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              style={({ pressed }) => [styles.loginButton, pressed && styles.buttonPressed, isSubmitting && styles.disabledButton, {marginTop: message === "" ? 30 : 20}]}
              onPress={handleLogin}
            >
              <Text style={styles.loginText}>{isSubmitting ? 'Logging in…' : 'Log In'}</Text>
              <Image source={snowy} contentFit="contain" style={styles.bow}/>
            </Pressable>

            <View style={styles.signupRow}>
              <Text style={styles.signupPrompt}>Don’t have an account?</Text>
              <Pressable accessibilityRole="button" onPress={() => router.push('/Registration')} hitSlop={8}>
                <Text style={styles.signupLink}>Sign up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  keyboardArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 30,
  },
  backButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    marginLeft: -5,
  },
  form: {
    marginTop: 60,
  },
  title: {
    color: '#fffaf2',
    fontFamily: 'NunitoExtraBold',
    fontSize: 27,
    lineHeight: 34,
    textShadowColor: 'rgba(50, 0, 0, 0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#fff3e7',
    fontFamily: 'NunitoSemiBold',
    fontSize: 16,
    marginTop: 1,
    textShadowColor: 'rgba(50, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  fields: {
    gap: 15,
    marginTop: 19,
  },
  inputShell: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 15,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#f6dfc5',
    backgroundColor: '#fff0dc',
    shadowColor: '#3b0805',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    color: '#4f2926',
    fontFamily: 'NunitoSemiBold',
    fontSize: 15,
  },
  loginButton: {
    position: 'relative',
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#d7c38d',
    backgroundColor: '#075b3e',
    shadowColor: '#1c1006',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  loginText: {
    color: '#fffaf1',
    fontFamily: 'NunitoExtraBold',
    fontSize: 17,
  },
  message: { color: '#fff3e7', fontFamily: 'NunitoBold', fontSize: 13, textAlign: 'center', marginTop: 12, textShadowColor: 'rgba(50, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  disabledButton: { opacity: 0.7 },
  bow: {
    width: "150%",
    height: "150%",
    transform: 'scale(1.35)',
    position: 'absolute',
    right: -73,
    top: -35,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 23,
  },
  signupPrompt: {
    color: '#fff3e7',
    fontFamily: 'NunitoSemiBold',
    fontSize: 13,
    textShadowColor: 'rgba(50, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  signupLink: {
    color: '#fffaf2',
    fontFamily: 'NunitoExtraBold',
    fontSize: 14,
    textShadowColor: 'rgba(50, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
