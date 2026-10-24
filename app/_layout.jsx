import { Stack } from 'expo-router';
import { useFonts } from '@expo-google-fonts/nunito';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    NunitoRegular: Nunito_400Regular,
    NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold,
    NunitoBold: Nunito_700Bold,
    NunitoExtraBold: Nunito_800ExtraBold,
  });


  return (
    <Stack screenOptions={{
        headerTransparent: true,
        headerTintColor: '#fff',
        headerShadowVisible: true
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="Registration" options={{ headerShown: false }} />
      <Stack.Screen name="Music" options={{ headerShown: false }} />
      <Stack.Screen name="Albums" options={{ headerShown: false }} />
      <Stack.Screen name="Podcasts" options={{ headerShown: false }} />
      <Stack.Screen name="Search" options={{ headerShown: false }} />
      <Stack.Screen name="Library" options={{ headerShown: false }} />
      <Stack.Screen name="Settings" options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" options={{ headerShown: false }} />
    </Stack>
  );
}
