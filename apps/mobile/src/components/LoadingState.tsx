import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, fontFamily, fontSize } from "../design-system";

type LoadingStateProps = {
  label?: string;
};

// Shared loading state per MOBILE_UI.md §10/§15 — every network-driven
// screen must show this instead of a blank area while data is in flight.
export function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <View testID="loading-state" style={styles.container}>
      <ActivityIndicator color={colors.ink} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 40,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkFaint,
  },
});
