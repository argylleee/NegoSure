import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { getRequirementById, type RequirementStatus } from "../../src/data/requirements";
import { getApplicationByRequirementId } from "../../src/data/applications";

const STATUS_LABEL: Record<RequirementStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  READY: "Ready to submit",
  SUBMITTED: "Submitted",
  COMPLETED: "Settled",
  ACTION_REQUIRED: "Action required",
};

const STATUS_COLOR: Record<RequirementStatus, string> = {
  NOT_STARTED: colors.inkFaint,
  IN_PROGRESS: colors.inkSoft,
  READY: colors.ink,
  SUBMITTED: colors.stamp,
  COMPLETED: colors.stamp,
  ACTION_REQUIRED: colors.red,
};

export default function RequirementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const requirement = getRequirementById(id);
  const application = requirement ? getApplicationByRequirementId(requirement.id) : undefined;

  if (!requirement) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Requirement not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.statusLabel, { color: STATUS_COLOR[requirement.status] }]}>
          {STATUS_LABEL[requirement.status]}
        </Text>
        <Text style={styles.title}>{requirement.title}</Text>
        <Text style={styles.reason}>{requirement.reason}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Source</Text>
          <Text style={styles.sectionValue}>{requirement.source}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Document requirement</Text>
          <Text style={styles.sectionValue}>{requirement.documentRequirement}</Text>
        </View>

        <View style={styles.govCard}>
          {requirement.govService.available ? (
            <>
              <Text style={styles.govTitle}>Official government service</Text>
              <Text style={styles.govMeta}>Provider: {requirement.govService.provider}</Text>
              <Text style={styles.govMeta}>
                Status synced: {requirement.govService.statusSyncedLabel}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.govTitle}>Official portal</Text>
              <Text style={styles.govMeta}>No direct NegoSure integration</Text>
            </>
          )}
        </View>

        {application ? (
          <Pressable
            style={styles.trackButton}
            accessibilityRole="button"
            accessibilityLabel="Track application"
            onPress={() => router.push(`/applications/${requirement.id}`)}
          >
            <Text style={styles.trackLabel}>Track application</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      style={styles.backButton}
      accessibilityRole="button"
      accessibilityLabel="Back"
      onPress={onPress}
    >
      <Text style={styles.backLabel}>‹ Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 12,
  },
  backButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
  },
  backLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    color: colors.inkFaint,
  },
  content: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 4,
  },
  statusLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.ink,
    marginTop: 2,
  },
  reason: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkFaint,
    marginBottom: 18,
  },
  section: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: 3,
  },
  sectionLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.base,
    color: colors.inkSoft,
  },
  sectionValue: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    color: colors.ink,
    lineHeight: 22,
  },
  govCard: {
    marginTop: 18,
    padding: 16,
    borderWidth: 1.6,
    borderColor: colors.ink,
    borderRadius: 4,
    gap: 3,
  },
  govTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  govMeta: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.inkSoft,
  },
  trackButton: {
    marginTop: 16,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
    borderRadius: 4,
  },
  trackLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.paper,
  },
});
