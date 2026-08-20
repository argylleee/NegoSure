import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, fontFamily } from "../design-system";

type StampTagProps = {
  label: string;
  tone?: "stamp" | "ink";
  rotateDeg?: number;
  style?: ViewStyle;
};

// Rotated bordered/tinted tag for verified/official marks and quick
// actions. Slight rotation, varied per instance, so a row doesn't read as
// mechanically tiled. See /DESIGN.md's "Stamp tag" component pattern.
export function StampTag({ label, tone = "stamp", rotateDeg = -1.5, style }: StampTagProps) {
  const isStamp = tone === "stamp";
  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: isStamp ? colors.stampSoft : "transparent",
          borderColor: isStamp ? "transparent" : colors.ink,
          borderWidth: isStamp ? 0 : 1.4,
          transform: [{ rotate: `${rotateDeg}deg` }],
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: isStamp ? colors.stamp : colors.ink }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 3,
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
