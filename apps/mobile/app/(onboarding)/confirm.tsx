import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { TallyBox } from "../../src/components/TallyBox";
import { useOnboardingStore } from "../../src/store/onboardingStore";

type FollowUpKey = "physicalStore" | "foodPreparation" | "onlineSelling";

const FOLLOW_UPS: { key: FollowUpKey; question: string }[] = [
  { key: "physicalStore", question: "Do you have a physical store or stall?" },
  { key: "foodPreparation", question: "Do you prepare or cook food on-site?" },
  { key: "onlineSelling", question: "Do you also sell online?" },
];

function YesNoRow({
  question,
  value,
  onChange,
}: {
  question: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.followUpRow}>
      <Text style={styles.followUpQuestion}>{question}</Text>
      <View style={styles.followUpButtons}>
        <Pressable
          style={[styles.pillButton, value === true && styles.pillButtonActive]}
          accessibilityRole="button"
          accessibilityLabel={`${question}: Yes`}
          accessibilityState={{ selected: value === true }}
          onPress={() => onChange(true)}
        >
          <Text style={[styles.pillLabel, value === true && styles.pillLabelActive]}>Yes</Text>
        </Pressable>
        <Pressable
          style={[styles.pillButton, value === false && styles.pillButtonActive]}
          accessibilityRole="button"
          accessibilityLabel={`${question}: No`}
          accessibilityState={{ selected: value === false }}
          onPress={() => onChange(false)}
        >
          <Text style={[styles.pillLabel, value === false && styles.pillLabelActive]}>No</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function ConfirmScreen() {
  const router = useRouter();
  const facts = useOnboardingStore((s) => s.facts);
  const toggleFactConfirmed = useOnboardingStore((s) => s.toggleFactConfirmed);
  const followUps = useOnboardingStore((s) => s.followUps);
  const setFollowUp = useOnboardingStore((s) => s.setFollowUp);

  const allFactsConfirmed = facts.length > 0 && facts.every((f) => f.confirmed);
  const allFollowUpsAnswered = FOLLOW_UPS.every((f) => followUps[f.key] !== null);
  const canContinue = allFactsConfirmed && allFollowUpsAnswered;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>Step 2 of 3</Text>
        <Text style={styles.title}>Confirm what we understood</Text>
        <Text style={styles.subtitle}>
          These are guesses, not facts yet — check each one before we use it.
        </Text>

        <View style={styles.factsGroup}>
          {facts.map((f) => (
            <Pressable
              key={f.key}
              style={styles.factRow}
              accessibilityRole="checkbox"
              accessibilityLabel={`${f.label}: ${f.value}`}
              accessibilityState={{ checked: f.confirmed }}
              onPress={() => toggleFactConfirmed(f.key)}
            >
              <TallyBox state={f.confirmed ? "checked" : "empty"} color={colors.ink} />
              <View style={styles.factTextGroup}>
                <Text style={styles.factLabel}>{f.label}</Text>
                <Text style={styles.factValue}>{f.value}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.followUpsGroup}>
          <Text style={styles.groupTitle}>A few more questions</Text>
          {FOLLOW_UPS.map((f) => (
            <YesNoRow
              key={f.key}
              question={f.question}
              value={followUps[f.key]}
              onChange={(v) => setFollowUp(f.key, v)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.primaryButton, !canContinue && styles.disabledButton]}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          accessibilityState={{ disabled: !canContinue }}
          onPress={() => router.push("/(onboarding)/summary")}
          disabled={!canContinue}
        >
          <Text style={styles.primaryLabel}>Continue</Text>
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
    marginBottom: 18,
  },
  factsGroup: {
    gap: 2,
    marginBottom: 26,
  },
  factRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  factTextGroup: {
    gap: 1,
  },
  factLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 11.5,
    color: colors.inkFaint,
  },
  factValue: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  followUpsGroup: {
    gap: 4,
  },
  groupTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.ink,
    marginBottom: 8,
  },
  followUpRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 10,
  },
  followUpQuestion: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  followUpButtons: {
    flexDirection: "row",
    gap: 10,
  },
  pillButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.4,
    borderColor: colors.ink,
    borderRadius: 3,
  },
  pillButtonActive: {
    backgroundColor: colors.ink,
  },
  pillLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.ink,
  },
  pillLabelActive: {
    color: colors.paper,
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
  disabledButton: {
    backgroundColor: colors.lineStrong,
  },
  primaryLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.paper,
  },
});
