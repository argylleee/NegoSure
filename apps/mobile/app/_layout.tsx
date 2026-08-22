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
import { LoadingState } from "../src/components/LoadingState";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Client-side route gate. Session state comes from Supabase Auth via
// authStore (server remains authoritative — see .claude/CLAUDE.md §13);
// this only decides which screen group to show. Priority: session
// restoring -> hold; unauthenticated -> (auth); authenticated but not
// onboarded -> (onboarding); otherwise -> (tabs).
function useAuthGate(ready: boolean) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const hasOnboarded = useOnboardingStore((s) => s.hasOnboarded);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready || isInitializing) return;
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!isAuthenticated) {
      if (!inAuthGroup) router.replace("/(auth)/welcome");
    } else if (!hasOnboarded) {
      if (!inOnboardingGroup) router.replace("/(onboarding)/describe");
    } else if (inAuthGroup || inOnboardingGroup) {
      router.replace("/(tabs)");
    }
  }, [ready, isInitializing, isAuthenticated, hasOnboarded, segments, router]);

  return isInitializing;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_500Medium,
    SchibstedGrotesk_600SemiBold,
    SchibstedGrotesk_700Bold,
  });
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => initialize(), [initialize]);

  const isInitializing = useAuthGate(fontsLoaded);

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
        {isInitializing ? (
          <LoadingState label="Restoring your session" />
        ) : (
          <Stack screenOptions={{ headerShown: false }} />
        )}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
