import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { StampTag } from "../../src/components/StampTag";
import { DocumentsIcon, ScanIcon } from "../../src/components/icons";

type DocStatus = "verified" | "analyzing" | "expiring" | "expired";

const STATUS_LABEL: Record<DocStatus, string> = {
  verified: "Verified",
  analyzing: "Analyzing",
  expiring: "Expiring soon",
  expired: "Expired",
};

const STATUS_COLOR: Record<DocStatus, string> = {
  verified: colors.stamp,
  analyzing: colors.inkSoft,
  expiring: colors.red,
  expired: colors.red,
};

// Placeholder data — replace with the document-vault service. Never mark a
// document verified here without a real extraction/validation result; see
// .claude/CLAUDE.md §12.
const documents: {
  name: string;
  category: string;
  status: DocStatus;
  meta: string;
}[] = [
  {
    name: "DTI Business Name Certificate",
    category: "Registration",
    status: "verified",
    meta: "Uploaded Jul 3",
  },
  {
    name: "Fire Safety Inspection Certificate",
    category: "Fire Safety",
    status: "expiring",
    meta: "Expires in 12 days",
  },
  {
    name: "Business Permit (previous year)",
    category: "Permit",
    status: "expired",
    meta: "Expired Jun 30",
  },
  {
    name: "Sanitary Permit Application",
    category: "Health",
    status: "analyzing",
    meta: "Uploaded 2 hours ago",
  },
];

export default function DocumentsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>

        <View>
          <View style={styles.rowBetween}>
            <Text style={styles.softLabel}>On file</Text>
            <Text style={styles.totalValue}>{documents.length} documents</Text>
          </View>
          <View style={styles.ruleThin} />
          <View style={styles.ruleStrong} />
        </View>

        <Pressable
          style={styles.uploadTag}
          accessibilityRole="button"
          accessibilityLabel="Scan or upload a document"
        >
          <ScanIcon color={colors.ink} size={14} />
          <Text style={styles.uploadLabel}>Scan or upload a document</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {documents.map((d) => (
          <View
            key={d.name}
            style={styles.row}
            accessible
            accessibilityLabel={`${d.name}, ${d.category}, ${STATUS_LABEL[d.status]}, ${d.meta}`}
          >
            <View style={styles.rowTop}>
              <DocumentsIcon color={colors.inkSoft} size={18} />
              <View style={styles.textGroup}>
                <Text style={styles.docName}>{d.name}</Text>
                <Text style={styles.docCategory}>{d.category}</Text>
              </View>
            </View>
            <View style={styles.rowBottom}>
              <View style={styles.rowBaseline}>
                <Text style={[styles.statusLabel, { color: STATUS_COLOR[d.status] }]}>
                  {STATUS_LABEL[d.status]}
                </Text>
                <Text style={styles.faintText}>{d.meta}</Text>
              </View>
              {d.status === "verified" ? <StampTag label="VERIFIED" rotateDeg={-1.5} /> : null}
            </View>
          </View>
        ))}
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
  uploadTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
    borderWidth: 1.4,
    borderColor: colors.ink,
    borderRadius: 3,
    alignSelf: "flex-start",
  },
  uploadLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: colors.ink,
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
  docName: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  docCategory: {
    fontFamily: fontFamily.medium,
    fontSize: 11.5,
    color: colors.inkFaint,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 30,
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
