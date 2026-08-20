import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { TallyBox } from "../../src/components/TallyBox";
import { StampTag } from "../../src/components/StampTag";
import { ScanIcon, RequirementsIcon, GovIcon, AssistantIcon } from "../../src/components/icons";
import { requirements } from "../../src/data/requirements";

// Placeholder data — replace with the business-profile service once it
// exists. Never invent a real government status here; see
// .claude/CLAUDE.md §0. Alerts derive from the same shared requirements
// data the Requirements tab and detail screens use, not a separate copy.
const business = {
  name: "Juan's Coffee Shop",
  location: "Dasmariñas, Cavite",
};
const progressPct = 80;
const settledCount = 4;
const totalCount = 5;
const alerts = requirements
  .filter((r) => r.status === "ACTION_REQUIRED")
  .map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.urgencyNote ?? r.reason,
    source: r.source,
  }));

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const quickActions = [
  { label: "Scan document", Icon: ScanIcon, rotate: -1.2 },
  { label: "Requirements", Icon: RequirementsIcon, rotate: 0.8 },
  { label: "Gov't services", Icon: GovIcon, rotate: -0.6 },
  { label: "Ask NegoSure", Icon: AssistantIcon, rotate: 1.4 },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.metaText}>{greeting()}</Text>
          </View>

          <View style={styles.ledgerHeader}>
            <Text style={styles.businessName}>{business.name}</Text>
            <Text style={styles.metaText}>{business.location}</Text>
          </View>

          <View>
            <View style={[styles.rowBetween, { paddingBottom: 10 }]}>
              <Text style={styles.softLabel}>Compliance balance</Text>
              <View style={styles.rowBaseline}>
                <Text style={styles.balanceValue}>{progressPct}</Text>
                <Text style={styles.softLabelBold}>% settled</Text>
              </View>
            </View>
            <View style={styles.ruleThin} />
            <View style={styles.ruleStrong} />
            <View style={[styles.rowBetween, { paddingTop: 6 }]}>
              <Text style={styles.faintText}>
                {settledCount} of {totalCount} requirements settled
              </Text>
              <StampTag label="ON TRACK" rotateDeg={-2} />
            </View>
          </View>
        </View>

        <View style={styles.alertsSection}>
          <View
            style={[styles.rowBaseline, { justifyContent: "space-between", paddingVertical: 6 }]}
          >
            <Text style={styles.sectionTitle}>Needs attention</Text>
            <Pressable onPress={() => router.push("/(tabs)/requirements")}>
              <Text style={styles.softLabelBold}>View all</Text>
            </Pressable>
          </View>

          {alerts.map((item) => (
            <Pressable
              key={item.id}
              style={styles.alertRow}
              onPress={() => router.push(`/requirements/${item.id}`)}
            >
              <TallyBox state="empty" color={colors.red} />
              <View style={styles.alertTextGroup}>
                <Text style={styles.alertTitle}>{item.title}</Text>
                <Text style={[styles.alertSubtitle, { color: colors.red }]}>{item.subtitle}</Text>
              </View>
              <Text style={styles.faintTextNoWrap}>{item.source}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.actionsRow}>
            {quickActions.map(({ label, Icon, rotate }) => (
              <View
                key={label}
                style={[styles.actionTag, { transform: [{ rotate: `${rotate}deg` }] }]}
              >
                <Icon color={colors.ink} size={14} />
                <Text style={styles.actionLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scroll: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 24,
    paddingBottom: 8,
  },
  section: {
    gap: 22,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  rowBaseline: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  metaText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkFaint,
  },
  ledgerHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    paddingBottom: 8,
  },
  businessName: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.ink,
  },
  softLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkSoft,
  },
  softLabelBold: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.base,
    color: colors.inkSoft,
  },
  balanceValue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.display,
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
  faintText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.inkFaint,
  },
  faintTextNoWrap: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.inkFaint,
  },
  alertsSection: {
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.ink,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  alertTextGroup: {
    flex: 1,
    gap: 2,
  },
  alertTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    color: colors.ink,
  },
  alertSubtitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 11.5,
  },
  actionsSection: {
    marginTop: 16,
    marginBottom: 26,
    gap: 12,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 12,
    borderWidth: 1.4,
    borderColor: colors.ink,
    borderRadius: 3,
  },
  actionLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 11.5,
    color: colors.ink,
  },
});
