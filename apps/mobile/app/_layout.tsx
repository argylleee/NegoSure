import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  SchibstedGrotesk_400Regular,
  SchibstedGrotesk_500Medium,
  SchibstedGrotesk_600SemiBold,
  SchibstedGrotesk_700Bold,
} from "@expo-google-fonts/schibsted-grotesk";
import { queryClient } from "../src/lib/queryClient";
import { useAuthStore } from "../src/store/authStore";
import { useOnboardingStore } from "../src/store/onboardingStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Placeholder client-side gate — no real session to verify yet. Once a
// backend exists, route protection must happen there too; this only
// prevents an unauthenticated or not-yet-onboarded user from seeing the
// tabs UI in dev. Priority: unauthenticated -> (auth); authenticated but
// not onboarded -> (onboarding); otherwise -> (tabs).
function useAuthGate(ready: boolean) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasOnboarded = useOnboardingStore((s) => s.hasOnboarded);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!isAuthenticated) {
      if (!inAuthGroup) router.replace("/(auth)/welcome");
    } else if (!hasOnboarded) {
      if (!inOnboardingGroup) router.replace("/(onboarding)/describe");
    } else if (inAuthGroup || inOnboardingGroup) {
      router.replace("/(tabs)");
    }
  }, [ready, isAuthenticated, hasOnboarded, segments, router]);
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_500Medium,
    SchibstedGrotesk_600SemiBold,
    SchibstedGrotesk_700Bold,
  });

  useAuthGate(fontsLoaded);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
