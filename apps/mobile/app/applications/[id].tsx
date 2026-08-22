import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { getApplicationByRequirementId } from "../../src/data/applications";
import { getRequirementById } from "../../src/data/requirements";
import { TallyBox } from "../../src/components/TallyBox";

export default function ApplicationTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const application = getApplicationByRequirementId(id);
  const requirement = getRequirementById(id);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
        >
          <Text style={styles.backLabel}>‹ Back</Text>
        </Pressable>
      </View>

      {!application || !requirement ? (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>No application on file yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{requirement.title}</Text>
          <Text style={styles.meta}>
            {application.provider} · Ref {application.referenceNumber}
          </Text>

          <View style={styles.timeline}>
            {application.events.map((event, i) => (
              <View
                key={event.label}
                style={styles.eventRow}
                accessible
                accessibilityLabel={`${event.label}, ${event.done ? "completed" : "pending"}, ${event.dateLabel}`}
              >
                <View style={styles.markerColumn}>
                  <TallyBox
                    state={event.done ? "checked" : "empty"}
                    color={event.done ? colors.stamp : colors.inkFaint}
                  />
                  {i < application.events.length - 1 ? (
                    <View
                      style={[
                        styles.connector,
                        { backgroundColor: event.done ? colors.stamp : colors.line },
                      ]}
                    />
                  ) : null}
                </View>
                <View style={styles.eventTextGroup}>
                  <Text
                    style={[
                      styles.eventLabel,
                      { color: event.done ? colors.ink : colors.inkFaint },
                    ]}
                  >
                    {event.label}
                  </Text>
                  <Text style={styles.eventDate}>{event.dateLabel}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
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
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.ink,
  },
  meta: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkFaint,
    marginBottom: 24,
  },
  timeline: {
    gap: 0,
  },
  eventRow: {
    flexDirection: "row",
    gap: 14,
  },
  markerColumn: {
    alignItems: "center",
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginVertical: 4,
  },
  eventTextGroup: {
    paddingBottom: 20,
    gap: 2,
  },
  eventLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
  },
  eventDate: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.inkFaint,
  },
});
