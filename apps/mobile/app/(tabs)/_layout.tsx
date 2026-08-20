import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fontFamily } from "../../src/design-system";
import {
  HomeIcon,
  RequirementsIcon,
  DocumentsIcon,
  AssistantIcon,
  ProfileIcon,
} from "../../src/components/icons";

const TAB_ICONS: Record<string, (color: string) => React.ReactNode> = {
  index: (color) => <HomeIcon color={color} />,
  requirements: (color) => <RequirementsIcon color={color} />,
  documents: (color) => <DocumentsIcon color={color} />,
  assistant: (color) => <AssistantIcon color={color} />,
  profile: (color) => <ProfileIcon color={color} />,
};

const TAB_LABELS: Record<string, string> = {
  index: "Home",
  requirements: "Requirements",
  documents: "Documents",
  assistant: "Assistant",
  profile: "Profile",
};

// Active tab is marked by an ink underline beneath the label, never a
// color change or pill — status/state is never color-only. See
// /DESIGN.md's "Tab bar" component pattern.
function LedgerTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) + 8 }]}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const color = isFocused ? colors.ink : colors.inkFaint;
        const label = TAB_LABELS[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={label}
          >
            {TAB_ICONS[route.name]?.(color)}
            <Text
              style={[
                styles.label,
                { color, fontFamily: isFocused ? fontFamily.bold : fontFamily.semibold },
              ]}
            >
              {label}
            </Text>
            <View
              style={[
                styles.underline,
                { backgroundColor: isFocused ? colors.ink : "transparent" },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <LedgerTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="requirements" />
      <Tabs.Screen name="documents" />
      <Tabs.Screen name="assistant" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.paperRaised,
    borderTopWidth: 1.5,
    borderTopColor: colors.ink,
  },
  tab: {
    alignItems: "center",
    gap: 5,
  },
  label: {
    fontSize: 10,
  },
  underline: {
    width: 16,
    height: 2,
    borderRadius: 2,
    marginTop: 1,
  },
});
