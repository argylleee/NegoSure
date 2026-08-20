import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { TallyBox } from "../../src/components/TallyBox";
import { StampTag } from "../../src/components/StampTag";
import { requirements, type RequirementStatus } from "../../src/data/requirements";

const STATUS: Record<
  RequirementStatus,
  { label: string; color: string; box: "empty" | "dotted" | "checked" }
> = {
  NOT_STARTED: { label: "Not started", color: colors.inkFaint, box: "empty" },
  IN_PROGRESS: { label: "In progress", color: colors.inkSoft, box: "dotted" },
  READY: { label: "Ready to submit", color: colors.ink, box: "dotted" },
  SUBMITTED: { label: "Submitted", color: colors.stamp, box: "dotted" },
  COMPLETED: { label: "Settled", color: colors.stamp, box: "checked" },
  ACTION_REQUIRED: { label: "Action required", color: colors.red, box: "empty" },
};

// Illustrative placeholder totals — the shared placeholder list only has 4
// rows, but the totals line represents the full (unmocked) requirement set.
// Replace both with real counts once the requirements service exists.
const settledCount = 4;
const totalCount = 8;

const filters = ["All", "Action required", "In progress", "Settled"];

export default function RequirementsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Requirements</Text>

        <View>
          <View style={styles.rowBetween}>
            <Text style={styles.softLabel}>Total settled</Text>
            <Text style={styles.totalValue}>
              {settledCount} / {totalCount}
            </Text>
          </View>
          <View style={styles.ruleThin} />
          <View style={styles.ruleStrong} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {filters.map((label, i) => (
            <View
              key={label}
              style={[
                styles.filterItem,
                { borderBottomColor: i === 0 ? colors.ink : "transparent" },
              ]}
            >
              <Text style={[styles.filterLabel, { color: i === 0 ? colors.ink : colors.inkSoft }]}>
                {label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {requirements.map((r) => {
          const s = STATUS[r.status];
          return (
            <Pressable
              key={r.id}
              style={styles.row}
              onPress={() => router.push(`/requirements/${r.id}`)}
            >
              <View style={styles.rowTop}>
                <TallyBox state={s.box} color={s.color} />
                <View style={styles.textGroup}>
                  <Text style={styles.reqTitle}>{r.title}</Text>
                  <Text style={styles.reqReason}>{r.reason}</Text>
                </View>
              </View>
              <View style={styles.rowBottom}>
                <View style={styles.rowBaseline}>
                  <Text style={[styles.statusLabel, { color: s.color }]}>{s.label}</Text>
                  <Text style={styles.faintText}>{r.source}</Text>
                </View>
                {r.govService.available ? <StampTag label="eLGU SYNCED" rotateDeg={-1.5} /> : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
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
    paddingTop: 24,
    gap: 16,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.ink,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  softLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.inkSoft,
  },
  totalValue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.ink,
    fontVariant: ["tabular-nums"],
  },
  ruleThin: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lineStrong,
  },
  ruleStrong: {
    borderBottomWidth: 2.5,
    borderBottomColor: colors.ink,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: "row",
  },
  filterItem: {
    marginRight: 18,
    paddingBottom: 8,
    borderBottomWidth: 2,
  },
  filterLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
  },
  list: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 6,
    paddingBottom: 20,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 14,
    gap: 8,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  reqTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  reqReason: {
    fontFamily: fontFamily.medium,
    fontSize: 11.5,
    color: colors.inkFaint,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 32,
  },
  rowBaseline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 11.5,
  },
  faintText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.inkFaint,
  },
});
