import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "../../components/AppText";
import { useAppSettings } from "../../store/AppSettingsContext";
import {
  getSentenceExercise,
  advanceLessonPosition,
  countTotalSentencesInTopic,
  countLessonUnits,
  countSentencesInUnit,
  getGlobalSentenceStep,
} from "../../data/mockData";

const C = {
  bg: "#FFFFFF",
  primary: "#92400E",
  primaryDark: "#78350F",
  progressTrack: "#EFE8DC",
  backCircle: "#FFF0E8",
  instructionBg: "#FFF5EB",
  instructionIcon: "#92400E",
  instructionText: "#5C3D2E",
  cardBg: "#F5F5F0",
  cardBorder: "#E0E0E0",
  muted: "#757575",
  navy: "#1A1A1A",
  pillIdleBg: "#EEEEEE",
  pillIdleText: "#757575",
  pillActiveBg: "#FFF0E8",
  pillActiveText: "#78350F",
  inputBorder: "#92400E",
  successBg: "#E8F5E9",
  successIcon: "#639922",
  successTitle: "#2E7D32",
  successDetail: "#1B5E20",
  errorBg: "#FFEBEE",
  errorIcon: "#C62828",
  errorTitle: "#B71C1C",
  errorDetail: "#6D1B1B",
  divider: "#E5E7EB",
};

function answersMatch(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (String(a[i]).toLowerCase() !== String(b[i]).toLowerCase()) return false;
  }
  return true;
}

export default function WritingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const params = route.params ?? {};
  const topicTitle =
    typeof params.topicTitle === "string" ? params.topicTitle : "Đi khám bệnh";
  const lessonMeta =
    typeof params.lessonMeta === "string"
      ? params.lessonMeta
      : "6 bài · Chưa bắt đầu";

  const topicId = params.lessonTopicId != null ? String(params.lessonTopicId) : "1";
  const lessonIndex =
    typeof params.lessonIndex === "number" ? params.lessonIndex : 0;
  const sentenceIndex =
    typeof params.sentenceIndex === "number" ? params.sentenceIndex : 0;

  const lesson = getSentenceExercise(topicId, lessonIndex, sentenceIndex);
  const unitsCount = countLessonUnits(topicId);
  const inUnitCount = countSentencesInUnit(topicId, lessonIndex);
  const totalSteps = countTotalSentencesInTopic(topicId);
  const globalStep = getGlobalSentenceStep(topicId, lessonIndex, sentenceIndex);
  const progressRatio = totalSteps > 0 ? Math.min(globalStep / totalSteps, 1) : 0;

  const writeWords = lesson?.writeWords ?? [];
  const writeAnswer = lesson?.writeAnswer ?? [];

  const [pickedIndices, setPickedIndices] = useState([]);
  /** null | 'correct' | 'incorrect' */
  const [submitResult, setSubmitResult] = useState(null);
  const [isResultModalVisible, setResultModalVisible] = useState(false);
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const textScale =
    settings.fontSize === "A+" ? 1.08 : settings.fontSize === "A-" ? 0.92 : 1;

  useEffect(() => {
    setSubmitResult(null);
    setResultModalVisible(false);
  }, [pickedIndices]);

  const userWords = useMemo(
    () => pickedIndices.map((i) => writeWords[i]).filter(Boolean),
    [pickedIndices, writeWords]
  );

  const composed = useMemo(() => userWords.join(" "), [userWords]);

  const onTapWord = useCallback(
    (index) => {
      if (!writeWords.length) return;
      setPickedIndices((prev) => {
        if (prev.includes(index)) return prev;
        return [...prev, index];
      });
    },
    [writeWords.length]
  );

  const onClear = useCallback(() => {
    setPickedIndices([]);
    setSubmitResult(null);
  }, []);

  const onNext = useCallback(() => {
    if (submitResult === "correct") {
      const next = advanceLessonPosition(topicId, lessonIndex, sentenceIndex);
      if (next.topicComplete) {
        const total = countTotalSentencesInTopic(topicId);
        navigation.navigate("Result", {
          mode: "writing",
          topicTitle,
          lessonTopicId: topicId,
          lessonMeta,
          lessonCurrent: total,
          lessonTotal: total,
        });
      } else {
        navigation.replace("Writing", {
          ...params,
          lessonTopicId: topicId,
          lessonIndex: next.lessonIndex,
          sentenceIndex: next.sentenceIndex,
        });
        setPickedIndices([]);
        setSubmitResult(null);
      }
      return;
    }

    const ok = answersMatch(userWords, writeAnswer);
    setSubmitResult(ok ? "correct" : "incorrect");
    setResultModalVisible(true);
  }, [
    submitResult,
    userWords,
    writeAnswer,
    lessonIndex,
    sentenceIndex,
    navigation,
    params,
    topicId,
    topicTitle,
    lessonMeta,
  ]);

  if (!lesson || !writeWords.length || !writeAnswer.length) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, backgroundColor: C.bg }]}>
        <Text style={styles.fallbackText}>Chưa có dữ liệu luyện viết.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.fallbackLink}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, backgroundColor: isDark ? "#0F172A" : C.bg },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.backBtn, isDark && { backgroundColor: "#1F2937" }]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="chevron-back" size={26} color={isDark ? "#FDBA74" : C.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && { color: "#FDBA74" }]} numberOfLines={1}>
            {topicTitle} · Luyện viết
          </Text>
          <Text style={[styles.progressText, isDark && { color: "#FDBA74" }]}>
            {globalStep}/{totalSteps}
          </Text>
        </View>

        <Text style={[styles.lessonPartMeta, isDark && { color: "#CBD5E1" }]} numberOfLines={1}>
          Phần {lessonIndex + 1}/{Math.max(unitsCount, 1)} · Câu {sentenceIndex + 1}/
          {Math.max(inUnitCount, 1)}
        </Text>

        <View style={[styles.progressBarTrack, isDark && { backgroundColor: "#1E293B" }]}>
          <View
            style={[styles.progressBarFill, { width: `${progressRatio * 100}%` }]}
          />
        </View>

        <View style={[styles.instructionBanner, isDark && { backgroundColor: "#1F2937" }]}>
          <View style={styles.instructionIconCircle}>
            <Ionicons name="pencil" size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.instructionText, isDark && { color: "#FED7AA" }]}>
            Nhìn nghĩa tiếng Việt rồi gõ tiếng Anh
          </Text>
        </View>

        <View style={[styles.questionCard, isDark && { backgroundColor: "#111827", borderColor: "#334155" }]}>
          <Text style={[styles.questionLabel, isDark && { color: "#94A3B8" }]}>Dịch câu này sang tiếng Anh:</Text>
          <Text style={[styles.questionVi, { fontSize: 22 * textScale }, isDark && { color: "#F8FAFC" }]}>
            {lesson.sentenceVi}
          </Text>
        </View>

        <Text style={[styles.hintLabel, isDark && { color: "#94A3B8" }]}>Gợi ý – chạm để thêm từ:</Text>
        <View style={styles.wordBank}>
          {writeWords.map((word, i) => {
            const used = pickedIndices.includes(i);
            return (
              <Pressable
                key={`${word}-${i}`}
                onPress={() => onTapWord(i)}
                style={({ pressed }) => [
                  styles.wordPill,
                  used ? styles.wordPillActive : styles.wordPillIdle,
                  pressed && styles.wordPillPressed,
                ]}
              >
                <Text
                  style={used ? styles.wordPillTextActive : styles.wordPillTextIdle}
                >
                  {word}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.inputBox, isDark && { backgroundColor: "#0B1220", borderColor: "#FB923C" }]}>
          <Text style={[styles.inputText, { fontSize: 20 * textScale }, isDark && { color: "#FED7AA" }]}>
            {composed}
            <Text style={styles.inputCursor}>|</Text>
          </Text>
        </View>

      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, 14),
              borderTopColor: isDark ? "#1E293B" : C.divider,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.btnClear, isDark && { borderColor: "#FB923C" }]}
          onPress={onClear}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnClearText, isDark && { color: "#FDBA74" }]}>Xoá</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnNext} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.btnNextText}>Tiếp theo</Text>
          <Ionicons name="arrow-forward" size={22} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isResultModalVisible && submitResult != null}
        transparent
        animationType="fade"
        onRequestClose={() => setResultModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setResultModalVisible(false)}
        >
          <Pressable
            style={[
              styles.modalCard,
              submitResult === "correct" ? styles.feedbackOk : styles.feedbackBad,
              isDark && submitResult === "correct" && { backgroundColor: "#14532D" },
              isDark && submitResult === "incorrect" && { backgroundColor: "#3F1D1D" },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {submitResult === "correct" ? (
              <>
                <View style={styles.feedbackOkHeader}>
                  <View style={styles.feedbackOkIcon}>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.feedbackOkTitle, isDark && { color: "#DCFCE7" }]}>
                    Đúng rồi!
                  </Text>
                </View>
                <Text style={[styles.feedbackDetail, isDark && { color: "#DCFCE7" }]}>
                  Đáp án: {lesson.sentence}
                </Text>
                <Text style={[styles.feedbackDetail, isDark && { color: "#DCFCE7" }]}>
                  Bạn gõ: {composed}.
                </Text>
              </>
            ) : (
              <>
                <View style={styles.feedbackBadHeader}>
                  <View style={styles.feedbackBadIcon}>
                    <Ionicons name="close" size={18} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.feedbackBadTitle, isDark && { color: "#FECACA" }]}>
                    Chưa đúng
                  </Text>
                </View>
                <Text style={[styles.feedbackBadDetail, isDark && { color: "#FECACA" }]}>
                  Hãy dùng gợi ý, sắp xếp lại câu rồi thử lại.
                </Text>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  fallbackText: { fontSize: 16, color: C.muted, padding: 24 },
  fallbackLink: { fontSize: 16, color: C.primary, fontWeight: "600", paddingHorizontal: 24 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.backCircle,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: C.primaryDark,
    textAlign: "center",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.primaryDark,
    minWidth: 52,
    textAlign: "right",
  },
  lessonPartMeta: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: C.primaryDark,
    paddingHorizontal: 2,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: C.progressTrack,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: C.primary,
    borderRadius: 3,
  },
  instructionBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.instructionBg,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 14,
  },
  instructionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.instructionIcon,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: C.instructionText,
    lineHeight: 22,
  },
  questionCard: {
    backgroundColor: C.cardBg,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.cardBorder,
    padding: 20,
    marginTop: 18,
  },
  questionLabel: {
    fontSize: 15,
    color: C.muted,
    marginBottom: 10,
  },
  questionVi: {
    fontSize: 22,
    fontWeight: "700",
    color: C.navy,
    lineHeight: 30,
  },
  hintLabel: {
    fontSize: 13,
    color: C.muted,
    marginTop: 18,
    marginBottom: 10,
  },
  wordBank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  wordPill: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 26,
    justifyContent: "center",
  },
  wordPillIdle: {
    backgroundColor: C.pillIdleBg,
  },
  wordPillActive: {
    backgroundColor: C.pillActiveBg,
  },
  wordPillPressed: { opacity: 0.85 },
  wordPillTextIdle: {
    fontSize: 17,
    fontWeight: "600",
    color: C.pillIdleText,
  },
  wordPillTextActive: {
    fontSize: 17,
    fontWeight: "700",
    color: C.pillActiveText,
  },
  inputBox: {
    marginTop: 18,
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: C.inputBorder,
    backgroundColor: C.bg,
    paddingVertical: 18,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 20,
    fontWeight: "600",
    color: C.primaryDark,
    lineHeight: 28,
  },
  inputCursor: {
    color: C.primary,
    fontWeight: "400",
  },
  feedbackOk: {
    backgroundColor: C.successBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  feedbackOkHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  feedbackOkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.successIcon,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackOkTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: C.successTitle,
  },
  feedbackDetail: {
    fontSize: 14,
    fontWeight: "600",
    color: C.successDetail,
    marginTop: 4,
    lineHeight: 20,
  },
  feedbackBad: {
    backgroundColor: C.errorBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  feedbackBadHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  feedbackBadIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.errorIcon,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackBadTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: C.errorTitle,
  },
  feedbackBadDetail: {
    fontSize: 14,
    color: C.errorDetail,
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: C.bg,
  },
  btnClear: {
    flex: 0.9,
    minHeight: 56,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnClearText: {
    fontSize: 18,
    fontWeight: "700",
    color: C.primaryDark,
  },
  btnNext: {
    flex: 1.25,
    flexDirection: "row",
    minHeight: 56,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnNextText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
