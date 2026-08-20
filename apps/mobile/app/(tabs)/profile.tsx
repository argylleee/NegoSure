import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { useAuthStore } from "../../src/store/authStore";

// Placeholder — business profile has no service yet (onboarding isn't
// built). User identity now comes from the real (in-memory) auth store.
const business = { name: "Juan's Coffee Shop", location: "Dasmariñas, Cavite" };

const settingsGroups: { title: string; items: string[] }[] = [
  { title: "Business", items: ["Business profile", "Requirement preferences"] },
  { title: "Account", items: ["Notifications", "Language", "Privacy & security"] },
  { title: "Support", items: ["Help & support", "About NegoSure"] },
];

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.ledgerHeader}>
          <Text style={styles.userName}>{user?.name ?? "—"}</Text>
          <Text style={styles.metaText}>{user?.email ?? ""}</Text>
        </View>

        <View style={styles.businessCard}>
          <Text style={styles.softLabel}>Current business</Text>
          <Text style={styles.businessName}>{business.name}</Text>
          <Text style={styles.metaText}>{business.location}</Text>
        </View>

        {settingsGroups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map((item) => (
              <Pressable key={item} style={styles.row}>
                <Text style={styles.rowLabel}>{item}</Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>
        ))}

        <Pressable
          style={styles.signOut}
          onPress={() => {
            signOut();
            router.replace("/(auth)/welcome");
          }}
        >
          <Text style={styles.signOutLabel}>Sign out</Text>
        </Pressable>
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
    paddingBottom: 32,
    gap: 26,
  },
  ledgerHeader: {
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    paddingBottom: 8,
    gap: 2,
  },
  userName: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.ink,
  },
  metaText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkFaint,
  },
  businessCard: {
    borderWidth: 1.4,
    borderColor: colors.ink,
    borderRadius: 4,
    padding: 16,
    gap: 2,
  },
  softLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.inkSoft,
  },
  businessName: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.ink,
    marginTop: 2,
  },
  group: {
    gap: 2,
  },
  groupTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.ink,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  chevron: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: colors.inkFaint,
  },
  signOut: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    borderWidth: 1.4,
    borderColor: colors.red,
    borderRadius: 3,
  },
  signOutLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.red,
  },
});
