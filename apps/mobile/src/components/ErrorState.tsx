import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, fontFamily, fontSize } from "../design-system";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

// Shared error state per MOBILE_UI.md §10/§15. Red is used here because
// this is a genuine error — the one case besides urgent ledger entries
// where red is earned, per /DESIGN.md's "red is a semantic reservation"
// rule.
export function ErrorState({
  title = "Something went wrong",
  description = "Check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View testID="error-state" style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onRetry ? (
        <Pressable style={styles.retry} onPress={onRetry}>
          <Text style={styles.retryLabel}>Try again</Text>
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
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.red,
    textAlign: "center",
  },
  description: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkFaint,
    textAlign: "center",
  },
  retry: {
    marginTop: 10,
    minHeight: 44,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.4,
    borderColor: colors.red,
    borderRadius: 4,
  },
  retryLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.red,
  },
});
