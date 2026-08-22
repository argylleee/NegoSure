import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { useOnboardingStore } from "../../src/store/onboardingStore";
import { extractBusinessFacts } from "../../src/lib/extractBusinessFacts";

const EXAMPLE = "I'm opening a small coffee shop in Dasmariñas.";

export default function DescribeScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const setDescription = useOnboardingStore((s) => s.setDescription);
  const setFacts = useOnboardingStore((s) => s.setFacts);

  const canContinue = text.trim().length > 0;

  const onContinue = () => {
    setDescription(text.trim());
    setFacts(extractBusinessFacts(text.trim()));
    router.push("/(onboarding)/confirm");
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.kicker}>Step 1 of 3</Text>
          <Text style={styles.title}>Tell us about your business</Text>
          <Text style={styles.subtitle}>
            Describe it in your own words — we&apos;ll work out what applies to you.
          </Text>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={EXAMPLE}
            placeholderTextColor={colors.inkFaint}
            accessibilityLabel="Describe your business"
            multiline
            style={styles.textarea}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.primaryButton, !canContinue && styles.disabledButton]}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            accessibilityState={{ disabled: !canContinue }}
            onPress={onContinue}
            disabled={!canContinue}
          >
            <Text style={styles.primaryLabel}>Continue</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenX,
    paddingTop: 24,
    gap: 10,
  },
  kicker: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.base,
    color: colors.inkSoft,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkFaint,
    marginBottom: 12,
  },
  textarea: {
    minHeight: 140,
    borderWidth: 1.6,
    borderColor: colors.ink,
    borderRadius: 4,
    padding: 14,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    color: colors.ink,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: 20,
  },
  primaryButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: colors.lineStrong,
  },
  primaryLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.paper,
  },
});
