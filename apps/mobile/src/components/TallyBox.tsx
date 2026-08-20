import { View, StyleSheet } from "react-native";
import { colors } from "../design-system";
import { CheckArrowIcon } from "./icons";

type TallyBoxState = "empty" | "dotted" | "checked";

type TallyBoxProps = {
  state: TallyBoxState;
  color?: string;
};

// The ledger world's status mark: an empty ruled box (not started / action
// required, distinguished by border color), a dot (in motion — in progress,
// ready, submitted), or a check (settled). Never color alone — pair with a
// text status label at the call site. See /DESIGN.md.
export function TallyBox({ state, color = colors.ink }: TallyBoxProps) {
  return (
    <View style={[styles.box, { borderColor: color }]}>
      {state === "checked" ? (
        <CheckArrowIcon color={color} size={12} />
      ) : state === "dotted" ? (
        <View style={[styles.dot, { backgroundColor: color }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 20,
    height: 20,
    borderWidth: 1.6,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
