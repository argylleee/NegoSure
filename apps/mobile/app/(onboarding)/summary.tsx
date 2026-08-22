import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { useOnboardingStore } from "../../src/store/onboardingStore";

const FOLLOW_UP_LABELS: Record<string, string> = {
  physicalStore: "Physical store or stall",
  foodPreparation: "Prepares food on-site",
  onlineSelling: "Sells online",
};

export default function SummaryScreen() {
  const router = useRouter();
  const facts = useOnboardingStore((s) => s.facts);
  const followUps = useOnboardingStore((s) => s.followUps);
  const complete = useOnboardingStore((s) => s.complete);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>Step 3 of 3</Text>
        <Text style={styles.title}>Your ledger is open</Text>
        <Text style={styles.subtitle}>
          We&apos;ll use this to work out what applies to your business.
        </Text>

        <View style={styles.summaryCard}>
          {facts.map((f) => (
            <View key={f.key} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{f.label}</Text>
              <Text style={styles.summaryValue}>{f.value}</Text>
            </View>
          ))}
          {Object.entries(followUps).map(([key, value]) => (
            <View key={key} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{FOLLOW_UP_LABELS[key] ?? key}</Text>
              <Text style={styles.summaryValue}>{value ? "Yes" : "No"}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.caveat}>
          You can correct any of this later from your business profile.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.primaryButton}
          accessibilityRole="button"
          accessibilityLabel="Enter NegoSure"
          onPress={() => {
            complete();
            router.replace("/(tabs)");
          }}
        >
          <Text style={styles.primaryLabel}>Enter NegoSure</Text>
        </Pressable>
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
    paddingHorizontal: spacing.screenX,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 6,
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
    marginBottom: 20,
  },
  summaryCard: {
    borderTopWidth: 2,
    borderTopColor: colors.ink,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  summaryLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkSoft,
  },
  summaryValue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  caveat: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.inkFaint,
    marginTop: 16,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: spacing.screenX,
    paddingVertical: 16,
    borderTopWidth: 1.5,
    borderTopColor: colors.ink,
    backgroundColor: colors.paperRaised,
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
});
