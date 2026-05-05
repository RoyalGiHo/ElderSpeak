import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
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
  pageBg: "#F7FAFC",
  primary: "#1D61D8",
  primaryLight: "#E3F0FF",
  progressTrack: "#E8E8E4",
  navy: "#111827",
  muted: "#6B7280",
  instructionBg: "#E8F5E9",
  instructionIcon: "#2E7D32",
  instructionText: "#1B5E20",
  cardBeige: "#F5F5F1",
  ipaPillBg: "#E3F2FD",
  ipaPillText: "#1565C0",
  successGreen: "#4C8435",
  successBg: "#E8F5E9",
  errorBg: "#F8D7DA",
  errorText: "#721C24",
  divider: "#E5E7EB",
  micRing: "#B3D4FC",
};

const MOCK_FEEDBACK = {
  score: 82,
  label: "Khá tốt!",
  segments: [
    { text: "I have", ok: true },
    { text: " ", ok: null },
    { text: "a", ok: null },
    { text: " ", ok: null },
    { text: "stomacheck", ok: false },
  ],
  hint: "Từ 'stomachache' cần phát âm lại",
};

export default function ReadingScreen() {
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
  const reviewQueue = Array.isArray(params.reviewQueue) ? params.reviewQueue : null;
  const reviewCursor =
    typeof params.reviewCursor === "number" ? params.reviewCursor : -1;
  const isRandomReview = Boolean(params.fromRandomReview) && !!reviewQueue;
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

  const [isHoldingMic, setIsHoldingMic] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const textScale =
    settings.fontSize === "A+" ? 1.08 : settings.fontSize === "A-" ? 0.92 : 1;

  const phonetic =
    lesson?.phonetic ??
    (lesson?.sentence
      ? lesson.sentence
          .toLowerCase()
          .replace(/[^a-z\s]/g, "")
          .split(/\s+/)
          .join(" · ")
      : "");

  const onMicPressIn = useCallback(() => {
    setIsHoldingMic(true);
    setShowFeedback(false);
  }, []);

  const onMicPressOut = useCallback(() => {
    setIsHoldingMic(false);
    setShowFeedback(true);
  }, []);

  const onRetry = useCallback(() => {
    setShowFeedback(false);
  }, []);

  const onNext = useCallback(() => {
    if (isRandomReview && reviewQueue) {
      const nextCursor = reviewCursor + 1;
      const nextItem = reviewQueue[nextCursor];
      if (!nextItem) {
        navigation.navigate("ChooseMode", {
          topicTitle,
          lessonMeta: "Ôn ngẫu nhiên hoàn tất",
          lessonTopicId: topicId,
        });
        return;
      }
      navigation.replace(nextItem.mode, {
        ...params,
        topicTitle,
        lessonMeta: `Ôn ngẫu nhiên · ${nextCursor + 1}/${reviewQueue.length}`,
        lessonTopicId: String(nextItem.lessonTopicId),
        lessonIndex: nextItem.lessonIndex,
        sentenceIndex: nextItem.sentenceIndex,
        reviewCursor: nextCursor,
        fromRandomReview: true,
      });
      setShowFeedback(false);
      return;
    }

    const next = advanceLessonPosition(topicId, lessonIndex, sentenceIndex);
    if (next.topicComplete) {
      const total = countTotalSentencesInTopic(topicId);
      navigation.navigate("Result", {
        mode: "reading",
        topicTitle,
        lessonTopicId: topicId,
        lessonMeta,
        lessonCurrent: total,
        lessonTotal: total,
      });
    } else {
      navigation.replace("Reading", {
        ...params,
        lessonTopicId: topicId,
        lessonIndex: next.lessonIndex,
        sentenceIndex: next.sentenceIndex,
      });
      setShowFeedback(false);
    }
  }, [
    navigation,
    params,
    lessonIndex,
    sentenceIndex,
    topicId,
    topicTitle,
    lessonMeta,
    isRandomReview,
    reviewQueue,
    reviewCursor,
  ]);

  if (!lesson) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Text style={styles.fallbackText}>Không có bài luyện đọc.</Text>
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
        { paddingTop: insets.top, backgroundColor: isDark ? "#0F172A" : C.pageBg },
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
            style={[styles.backBtn, isDark && { backgroundColor: "#1E293B" }]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="chevron-back" size={22} color={isDark ? "#93C5FD" : C.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && { color: "#93C5FD" }]} numberOfLines={1}>
            {topicTitle} · Luyện đọc
          </Text>
          <Text style={[styles.progressText, isDark && { color: "#93C5FD" }]}>
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
            <Ionicons name="mic" size={18} color="#FFFFFF" />
          </View>
          <Text style={[styles.instructionText, isDark && { color: "#D1FAE5" }]}>
            Đọc to câu bên dưới rồi bấm nút mic
          </Text>
        </View>

        <View style={[styles.sentenceCard, isDark && { backgroundColor: "#111827" }]}>
          <Text style={[styles.sentenceEn, { fontSize: 22 * textScale }, isDark && { color: "#F3F4F6" }]}>
            {lesson.sentence}
          </Text>
          <Text style={[styles.sentenceVi, { fontSize: 17 * textScale }, isDark && { color: "#CBD5E1" }]}>
            {lesson.sentenceVi}
          </Text>
        </View>
        {!!phonetic && (
          <View style={styles.ipaRow}>
            <View style={[styles.ipaPill, isDark && { backgroundColor: "#1E3A8A" }]}>
              <Text style={[styles.ipaText, isDark && { color: "#DBEAFE" }]}>{phonetic}</Text>
            </View>
          </View>
        )}

        <View style={styles.micSection}>
          <Pressable
            onPressIn={onMicPressIn}
            onPressOut={onMicPressOut}
            style={({ pressed }) => [
              styles.micOuter,
              (pressed || isHoldingMic) && styles.micOuterActive,
            ]}
          >
            <View style={styles.micInner}>
              <Ionicons name="mic" size={40} color="#FFFFFF" />
            </View>
          </Pressable>
          <Text style={[styles.micHint, isDark && { color: "#94A3B8" }]}>Giữ để nói</Text>
        </View>

        {showFeedback && (
          <View style={[styles.feedbackCard, isDark && { backgroundColor: "#14532D" }]}>
            <View style={styles.feedbackHeader}>
              <View style={styles.feedbackCheckCircle}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              </View>
              <Text style={[styles.feedbackScore, isDark && { color: "#DCFCE7" }]}>
                {MOCK_FEEDBACK.label} {MOCK_FEEDBACK.score} / 100
              </Text>
            </View>
            <Text style={[styles.feedbackLabel, isDark && { color: "#DCFCE7" }]}>Bạn đã nói:</Text>
            <View style={styles.feedbackWords}>
              {MOCK_FEEDBACK.segments.map((seg, i) => {
                if (seg.text === " ") {
                  return <Text key={`sp-${i}`}> </Text>;
                }
                if (seg.ok === true) {
                  return (
                    <View key={i} style={styles.wordOk}>
                      <Text style={styles.wordOkText}>{seg.text}</Text>
                    </View>
                  );
                }
                if (seg.ok === false) {
                  return (
                    <View key={i} style={styles.wordBad}>
                      <Text style={styles.wordBadText}>{seg.text}</Text>
                    </View>
                  );
                }
                return (
                  <Text key={i} style={[styles.wordPlain, isDark && { color: "#E5E7EB" }]}>
                    {seg.text}
                  </Text>
                );
              })}
            </View>
            <View style={styles.hintRow}>
              <Ionicons name="arrow-back" size={14} color={C.successGreen} />
              <Text style={[styles.hintText, isDark && { color: "#DCFCE7" }]}>{MOCK_FEEDBACK.hint}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {showFeedback && (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: Math.max(insets.bottom, 14),
              borderTopColor: isDark ? "#1E293B" : C.divider,
            },
          ]}
        >
          <TouchableOpacity style={styles.btnRetry} onPress={onRetry} activeOpacity={0.85}>
            <Text style={styles.btnRetryText}>Thử lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnNext, isDark && { backgroundColor: "#2563EB" }]}
            onPress={onNext}
            activeOpacity={0.85}
          >
            <Text style={styles.btnNextText}>Tiếp theo</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: C.primary,
    textAlign: "center",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.primary,
    minWidth: 52,
    textAlign: "right",
  },
  lessonPartMeta: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: C.navy,
    paddingHorizontal: 2,
    opacity: 0.92,
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
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 20,
  },
  instructionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.instructionIcon,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: C.instructionText,
    lineHeight: 22,
  },
  sentenceCard: {
    backgroundColor: C.cardBeige,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  sentenceEn: {
    fontSize: 22,
    fontWeight: "700",
    color: C.navy,
    lineHeight: 30,
  },
  sentenceVi: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "500",
    color: C.muted,
  },
  ipaRow: { marginTop: 14, alignItems: "center" },
  ipaPill: {
    backgroundColor: C.ipaPillBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ipaText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.ipaPillText,
  },
  micSection: { alignItems: "center", marginTop: 28, marginBottom: 8 },
  micOuter: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 6,
    borderColor: C.micRing,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  micOuterActive: { borderColor: C.primary, opacity: 0.95 },
  micInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  micHint: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "500",
    color: C.muted,
  },
  feedbackCard: {
    backgroundColor: C.successBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  feedbackCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.successGreen,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  feedbackScore: {
    fontSize: 17,
    fontWeight: "700",
    color: C.successGreen,
    flex: 1,
  },
  feedbackLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: C.instructionText,
    marginBottom: 8,
  },
  feedbackWords: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  wordOk: {
    backgroundColor: "#C8E6C9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  wordOkText: {
    fontSize: 16,
    fontWeight: "600",
    color: C.successGreen,
  },
  wordBad: {
    backgroundColor: C.errorBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  wordBadText: {
    fontSize: 16,
    fontWeight: "600",
    color: C.errorText,
  },
  wordPlain: {
    fontSize: 16,
    fontWeight: "500",
    color: C.navy,
    marginRight: 2,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: C.successGreen,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: C.bg,
    gap: 12,
  },
  btnRetry: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnRetryText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.primary,
  },
  btnNext: {
    flex: 1.4,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnNextText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  fallbackText: {
    fontSize: 16,
    color: C.muted,
    textAlign: "center",
    marginTop: 40,
  },
  fallbackLink: {
    marginTop: 16,
    fontSize: 16,
    color: C.primary,
    textAlign: "center",
    fontWeight: "600",
  },
});
