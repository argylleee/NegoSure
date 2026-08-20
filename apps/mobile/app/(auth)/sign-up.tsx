import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { LedgerInput } from "../../src/components/LedgerInput";
import { useAuthStore } from "../../src/store/authStore";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function SignUpScreen() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  // Placeholder — replace with Supabase Auth. Business creation and
  // onboarding happen after a real account exists, not before.
  const onSubmit = (values: FormValues) => {
    signIn({ name: values.name, email: values.email });
    router.replace("/(onboarding)/describe");
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Get started</Text>
          <Text style={styles.subtitle}>Open your business&apos;s compliance ledger.</Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <LedgerInput
                  label="Full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <LedgerInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <LedgerInput
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  error={errors.password?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <LedgerInput
                  label="Confirm password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  error={errors.confirmPassword?.message}
                />
              )}
            />
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.primaryLabel}>Create account</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/(auth)/sign-in")}>
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenX,
    paddingTop: 32,
    gap: 24,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.inkFaint,
    marginTop: -16,
  },
  form: {
    gap: 20,
  },
  primaryButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
    borderRadius: 4,
  },
  primaryLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.paper,
  },
  link: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    color: colors.inkSoft,
    textAlign: "center",
  },
});
