import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, fontFamily, fontSize } from "../design-system";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

// Shared empty state per MOBILE_UI.md §10/§15 — never a blank area with
// no explanation. A ruled-off page rather than an illustration/card, to
// match the ledger world's own vocabulary.
export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View testID="empty-state" style={styles.container}>
      <View style={styles.rule} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable style={styles.action} onPress={onAction}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  rule: {
    width: 40,
    height: 2,
    backgroundColor: colors.line,
    borderRadius: 2,
    marginBottom: 6,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.ink,
    textAlign: "center",
  },
  description: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkFaint,
    textAlign: "center",
  },
  action: {
    marginTop: 10,
    minHeight: 44,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.4,
    borderColor: colors.ink,
    borderRadius: 4,
  },
  actionLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.ink,
  },
});
