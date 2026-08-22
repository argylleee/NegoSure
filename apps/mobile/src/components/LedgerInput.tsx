import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { colors, fontFamily, fontSize } from "../design-system";

type LedgerInputProps = TextInputProps & {
  label: string;
  error?: string;
};

// A ledger "fill in the blank" line rather than a boxed input — the
// bottom rule IS the field, matching real ledger forms instead of a
// generic rounded-input default. See /DESIGN.md.
export function LedgerInput({ label, error, style, ...props }: LedgerInputProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={error ? `${label}, ${error}` : label}
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.inkFaint}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 6,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.base,
    color: colors.inkSoft,
  },
  input: {
    minHeight: 44,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xl,
    color: colors.ink,
  },
  inputError: {
    borderBottomColor: colors.red,
  },
  error: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.sm,
    color: colors.red,
  },
});
