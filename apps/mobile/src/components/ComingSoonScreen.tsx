import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, fontSize, spacing } from "../design-system";

type ComingSoonScreenProps = {
  title: string;
};

// Placeholder for screens not yet designed in the ledger world. Not a
// finished screen — swap for the real build per IMPLEMENTATION_PLAN.md's
// Phase 1 screen list.
export function ComingSoonScreen({ title }: ComingSoonScreenProps) {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>Not yet designed.</Text>
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
    flex: 1,
    paddingHorizontal: spacing.screenX,
    paddingTop: 24,
    gap: 8,
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
  },
});
