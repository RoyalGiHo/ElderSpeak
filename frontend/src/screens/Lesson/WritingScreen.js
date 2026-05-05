import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LESSONS } from "../../data/mockData";

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

function parseLessonMeta(meta) {
  if (typeof meta !== "string") return { current: 3, total: 6 };
  const m = meta.match(/(\d+)\s*\/\s*(\d+)/);
  if (m) return { current: Number(m[1]), total: Number(m[2]) };
  const bai = meta.match(/(\d+)\s*bài/);
  if (bai) return { current: 1, total: Number(bai[1]) || 6 };
  return { current: 3, total: 6 };
}

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

  const lessonsList = LESSONS[topicId] ?? LESSONS["1"] ?? [];
  const lesson = lessonsList[lessonIndex] ?? lessonsList[0];

  const { current, total } = useMemo(
    () => parseLessonMeta(lessonMeta),
    [lessonMeta]
  );
  const progressRatio = total > 0 ? Math.min(current / total, 1) : 0;

  const writeWords = lesson?.writeWords ?? [];
  const writeAnswer = lesson?.writeAnswer ?? [];

  const [pickedIndices, setPickedIndices] = useState([]);
  /** null | 'correct' | 'incorrect' */
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    setSubmitResult(null);
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
      if (lessonIndex + 1 < lessonsList.length) {
        navigation.replace("Writing", {
          ...params,
          lessonTopicId: topicId,
          lessonIndex: lessonIndex + 1,
        });
        setPickedIndices([]);
        setSubmitResult(null);
      } else {
        navigation.navigate("Result", { mode: "writing", topicTitle });
      }
      return;
    }

    const ok = answersMatch(userWords, writeAnswer);
    setSubmitResult(ok ? "correct" : "incorrect");
  }, [
    submitResult,
    userWords,
    writeAnswer,
    lessonIndex,
    lessonsList.length,
    navigation,
    params,
    topicId,
    topicTitle,
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
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: C.bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="chevron-back" size={26} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {topicTitle} · Luyện viết
          </Text>
          <Text style={styles.progressText}>
            {current}/{total}
          </Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View
            style={[styles.progressBarFill, { width: `${progressRatio * 100}%` }]}
          />
        </View>

        <View style={styles.instructionBanner}>
          <View style={styles.instructionIconCircle}>
            <Ionicons name="pencil" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.instructionText}>
            Nhìn nghĩa tiếng Việt rồi gõ tiếng Anh
          </Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>Dịch câu này sang tiếng Anh:</Text>
          <Text style={styles.questionVi}>{lesson.sentenceVi}</Text>
        </View>

        <Text style={styles.hintLabel}>Gợi ý – chạm để thêm từ:</Text>
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

        <View style={styles.inputBox}>
          <Text style={styles.inputText}>
            {composed}
            <Text style={styles.inputCursor}>|</Text>
          </Text>
        </View>

        {submitResult === "correct" && (
          <View style={styles.feedbackOk}>
            <View style={styles.feedbackOkHeader}>
              <View style={styles.feedbackOkIcon}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.feedbackOkTitle}>Đúng rồi!</Text>
            </View>
            <Text style={styles.feedbackDetail}>
              Đáp án: {lesson.sentence}
            </Text>
            <Text style={styles.feedbackDetail}>Bạn gõ: {composed}.</Text>
          </View>
        )}

        {submitResult === "incorrect" && (
          <View style={styles.feedbackBad}>
            <View style={styles.feedbackBadHeader}>
              <View style={styles.feedbackBadIcon}>
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.feedbackBadTitle}>Chưa đúng</Text>
            </View>
            <Text style={styles.feedbackBadDetail}>
              Hãy dùng gợi ý, sắp xếp lại câu rồi thử lại.
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, 14),
            borderTopColor: C.divider,
          },
        ]}
      >
        <TouchableOpacity style={styles.btnClear} onPress={onClear} activeOpacity={0.85}>
          <Text style={styles.btnClearText}>Xoá</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnNext} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.btnNextText}>Tiếp theo</Text>
          <Ionicons name="arrow-forward" size={22} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
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
    minWidth: 40,
    textAlign: "right",
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
