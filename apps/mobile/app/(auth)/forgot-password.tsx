import { useState } from "react";
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";
import { LedgerInput } from "../../src/components/LedgerInput";
import { supabase } from "../../src/lib/supabase";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setAuthError(undefined);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email);
    if (error) {
      setAuthError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            We&apos;ll email you a link to get back into your ledger.
          </Text>

          {sent ? (
            <Text style={styles.confirmation}>Check your inbox for a password reset link.</Text>
          ) : (
            <>
              <View style={styles.form}>
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
              </View>

              {authError ? <Text style={styles.authError}>{authError}</Text> : null}

              <Pressable
                style={styles.primaryButton}
                accessibilityRole="button"
                accessibilityLabel="Send reset link"
                accessibilityState={{ disabled: isSubmitting }}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryLabel}>Send reset link</Text>
              </Pressable>
            </>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to sign in"
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={styles.link}>Back to sign in</Text>
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
  authError: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.red,
    marginTop: -8,
  },
  confirmation: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.ink,
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
