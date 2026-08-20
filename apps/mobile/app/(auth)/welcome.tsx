import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.cover}>
          <Text style={styles.kicker}>Your business, settled</Text>
          <Text style={styles.wordmark}>NegoSure</Text>
          <View style={styles.rule} />
          <Text style={styles.tagline}>
            Understand what your business owes the government — permits, renewals, and requirements
            — tracked like your own ledger.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={() => router.push("/(auth)/sign-up")}>
            <Text style={styles.primaryLabel}>Get started</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push("/(auth)/sign-in")}>
            <Text style={styles.secondaryLabel}>I already have an account</Text>
          </Pressable>
          <Text style={styles.disclaimer}>
            NegoSure is an independent app, not a government service.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenX,
    justifyContent: "space-between",
    paddingVertical: 32,
  },
  cover: {
    marginTop: 60,
    gap: 14,
  },
  kicker: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    color: colors.inkSoft,
  },
  wordmark: {
    fontFamily: fontFamily.bold,
    fontSize: 42,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  rule: {
    height: 3,
    width: 64,
    backgroundColor: colors.ink,
    borderRadius: 2,
  },
  tagline: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xl,
    color: colors.inkSoft,
    lineHeight: 26,
    maxWidth: 320,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
    borderRadius: 4,
  },
  primaryLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.paper,
  },
  secondaryButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.6,
    borderColor: colors.ink,
    borderRadius: 4,
  },
  secondaryLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  disclaimer: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.inkFaint,
    textAlign: "center",
    marginTop: 4,
  },
});
