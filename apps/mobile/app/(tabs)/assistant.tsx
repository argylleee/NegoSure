import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, fontSize, spacing } from "../../src/design-system";

type Confidence = "High" | "Medium" | "Low";

// Placeholder — replace with the AI orchestration service (AIService, per
// .claude/CLAUDE.md §10). Never render a fabricated answer here; this
// shape (answer + sources + confidence) is the contract every real answer
// must satisfy, not sample copy to keep.
const sampleAnswer = {
  question: "Do I need a Fire Safety Inspection Certificate?",
  answer:
    "Based on the official sources retrieved for your business location, this requirement appears applicable because your business prepares food on-site.",
  confidence: "High" as Confidence,
  sources: ["Bureau of Fire Protection — Fire Code IRR", "LGU Dasmariñas ordinance"],
  warning: "Verify with BFP before your inspection date — requirements can change by locality.",
};

const CONFIDENCE_COLOR: Record<Confidence, string> = {
  High: colors.stamp,
  Medium: colors.inkSoft,
  Low: colors.red,
};

export default function AssistantScreen() {
  const [draft, setDraft] = useState("");

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Assistant</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.questionRow}>
            <Text style={styles.questionText}>{sampleAnswer.question}</Text>
          </View>

          <View style={styles.answerBlock}>
            <Text style={styles.answerText}>{sampleAnswer.answer}</Text>

            <View style={styles.rowBaseline}>
              <Text style={styles.softLabel}>Confidence</Text>
              <Text
                style={[
                  styles.confidenceValue,
                  { color: CONFIDENCE_COLOR[sampleAnswer.confidence] },
                ]}
              >
                {sampleAnswer.confidence}
              </Text>
            </View>

            <View style={styles.sourcesGroup}>
              <Text style={styles.softLabel}>Sources</Text>
              {sampleAnswer.sources.map((s) => (
                <Text key={s} style={styles.sourceItem}>
                  · {s}
                </Text>
              ))}
            </View>

            <View style={styles.warningRow}>
              <Text style={styles.warningText}>{sampleAnswer.warning}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask about a requirement..."
            placeholderTextColor={colors.inkFaint}
            style={styles.input}
          />
          <Pressable style={styles.sendButton}>
            <Text style={styles.sendLabel}>Ask</Text>
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
  header: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.ink,
  },
  scroll: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: 20,
    gap: 16,
  },
  questionRow: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  questionText: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
    color: colors.ink,
    textAlign: "right",
  },
  answerBlock: {
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    paddingTop: 12,
    gap: 12,
  },
  answerText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    color: colors.ink,
    lineHeight: 21,
  },
  rowBaseline: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  softLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.inkSoft,
  },
  confidenceValue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
  },
  sourcesGroup: {
    gap: 3,
  },
  sourceItem: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.ink,
  },
  warningRow: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
  },
  warningText: {
    fontFamily: fontFamily.medium,
    fontSize: 11.5,
    color: colors.red,
    lineHeight: 16,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.screenX,
    paddingVertical: 12,
    borderTopWidth: 1.5,
    borderTopColor: colors.ink,
    backgroundColor: colors.paperRaised,
  },
  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    borderWidth: 1.4,
    borderColor: colors.ink,
    borderRadius: 3,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.ink,
  },
  sendButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
    borderRadius: 3,
  },
  sendLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.paper,
  },
});
