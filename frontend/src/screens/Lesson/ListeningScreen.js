import React, { useMemo, useState, useCallback, useEffect } from "react";
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
import * as Speech from "expo-speech";
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
  pageBg: "#F7FAF4",
  bg: "#FFFFFF",
  primary: "#669922",
  primaryDark: "#3D5C20",
  progressTrack: "#E8F5E9",
  backCircle: "#E8F5CE",
  instructionBg: "#F1F8E9",
  instructionIconBg: "#446B1F",
  instructionText: "#2E4A16",
  audioCardBg: "#E8EDE3",
  audioCardInner: "#DCE5D6",
  waveformMuted: "#A5C07A",
  waveformAccent: "#669922",
  navy: "#111827",
  muted: "#9E9E9E",
  optionIdleBg: "#F5F5F5",
  optionIdleBorder: "#E0E0E0",
  successBg: "#E8F5E9",
  successBorder: "#669922",
  errorBg: "#FFEBEE",
  errorBorder: "#D32F2F",
  errorText: "#C62828",
  pillOutlineBorder: "#669922",
  divider: "#E5E7EB",
};

const LABELS = ["A", "B", "C", "D"];

function listeningKeywords(sentence, sentenceVi) {
  const en =
    sentence
      ?.replace(/[.,!?']/g, "")
      .split(/\s+/)
      .filter((w) => w && !["I", "a", "an", "the", "to", "have", "need", "see"].includes(w))
      .pop() ?? "";
  const viMatch = typeof sentenceVi === "string" ? sentenceVi.match(/bị\s+(.+?)\.?$/i) : null;
  const vi = viMatch ? viMatch[1].trim() : (sentenceVi ?? "").replace(/^Tôi bị\s*/i, "").replace(/\.$/, "");
  return { en: en.toLowerCase(), vi };
}

function waveformHeights(seed, count = 28) {
  const bars = [];
  let s =
    String(seed)
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0) || 7;
  for (let i = 0; i < count; i++) {
    s = (s * 9301 + 49297) % 233280;
    bars.push(6 + (s % 22));
  }
  return bars;
}

export default function ListeningScreen() {
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

  const options = lesson?.listenOptions ?? [];
  const answerIndex =
    typeof lesson?.listenAnswer === "number" ? lesson.listenAnswer : 0;

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const textScale =
    settings.fontSize === "A+" ? 1.08 : settings.fontSize === "A-" ? 0.92 : 1;
  const speechLanguage = settings.voiceAccent === "uk" ? "en-GB" : "en-US";

  const bars = useMemo(
    () => waveformHeights(`${lessonIndex}-${sentenceIndex}-${lesson?.id ?? ""}`, 28),
    [lesson?.id, lessonIndex, sentenceIndex]
  );

  useEffect(() => {
    Speech.stop();
    setSelectedIndex(null);
    setRevealed(false);
    setIsSpeaking(false);
  }, [lesson?.id, lessonIndex, sentenceIndex]);

  const { en: keywordEn, vi: keywordVi } = useMemo(
    () => listeningKeywords(lesson?.sentence, lesson?.sentenceVi),
    [lesson?.sentence, lesson?.sentenceVi]
  );

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speak = useCallback(
    (slow) => {
      if (!lesson?.sentence) return;
      Speech.stop();
      setIsSpeaking(true);
      Speech.speak(lesson.sentence, {
        language: speechLanguage,
        rate: slow ? 0.45 : 0.92,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [lesson?.sentence, speechLanguage]
  );

  const onPlay = useCallback(() => speak(false), [speak]);
  const onSlowPlay = useCallback(() => speak(true), [speak]);

  const onSelectOption = useCallback(
    (idx) => {
      if (revealed) return;
      setSelectedIndex(idx);
      setRevealed(true);
    },
    [revealed]
  );

  const onListenAgain = useCallback(() => {
    Speech.stop();
    onPlay();
  }, [onPlay]);

  const onNext = useCallback(() => {
    if (!revealed) return;
    Speech.stop();
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
      return;
    }

    const next = advanceLessonPosition(topicId, lessonIndex, sentenceIndex);
    if (next.topicComplete) {
      const total = countTotalSentencesInTopic(topicId);
      navigation.navigate("Result", {
        mode: "listening",
        topicTitle,
        lessonTopicId: topicId,
        lessonMeta,
        lessonCurrent: total,
        lessonTotal: total,
      });
    } else {
      navigation.replace("Listening", {
        ...params,
        lessonTopicId: topicId,
        lessonIndex: next.lessonIndex,
        sentenceIndex: next.sentenceIndex,
      });
    }
  }, [
    revealed,
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

  if (!lesson || options.length === 0) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Text style={styles.fallbackText}>Không có bài luyện nghe.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.fallbackLink}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const correctOption = options[answerIndex] ?? "";
  const isCorrect = revealed && selectedIndex === answerIndex;

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, backgroundColor: isDark ? "#0B1220" : C.pageBg },
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
            activeOpacity={0.75}
          >
            <Ionicons name="chevron-back" size={22} color={isDark ? "#A7F3D0" : C.primaryDark} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && { color: "#A7F3D0" }]} numberOfLines={1}>
            {topicTitle} • Luyện nghe
          </Text>
          <Text style={[styles.progressText, isDark && { color: "#86EFAC" }]}>
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
            <Ionicons name="volume-high" size={18} color="#FFFFFF" />
          </View>
          <Text style={[styles.instructionText, isDark && { color: "#D1FAE5" }]}>
            Nghe câu rồi chọn nghĩa đúng
          </Text>
        </View>

        <View style={[styles.audioCard, isDark && { backgroundColor: "#111827" }]}>
          <View style={styles.audioRow}>
            <TouchableOpacity
              style={[
                styles.playCircle,
                isSpeaking && styles.playCircleActive,
                isDark && { backgroundColor: "#16A34A" },
              ]}
              onPress={onPlay}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Phát âm thanh"
            >
              <Ionicons name="play" size={28} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            <View style={[styles.waveform, isDark && { backgroundColor: "#1F2937" }]}>
              {bars.map((h, i) => {
                const active = isSpeaking && i % 3 === 0;
                return (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      {
                        height: h + (active ? 6 : 0),
                        backgroundColor:
                          i % 4 === 0 ? C.waveformAccent : C.waveformMuted,
                        opacity: isSpeaking ? 1 : 0.85,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.slowPill, isDark && { backgroundColor: "#0F172A", borderColor: "#22C55E" }]}
            onPress={onSlowPlay}
            activeOpacity={0.85}
          >
            <Text style={[styles.slowPillText, isDark && { color: "#86EFAC" }]}>Nghe chậm lại</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.question, { fontSize: 17 * textScale }, isDark && { color: "#E5E7EB" }]}>
          Câu vừa nghe có nghĩa là gì?
        </Text>

        <View style={styles.options}>
          {options.map((label, idx) => {
            const letter = LABELS[idx] ?? String(idx + 1);
            let cardStyle = styles.optionCard;
            let letterCircleStyle = styles.optionLetterIdle;
            let letterTextStyle = styles.optionLetterTextIdle;
            let labelStyle = styles.optionLabel;

            if (revealed) {
              const isThisCorrect = idx === answerIndex;
              const isThisWrong = idx === selectedIndex && idx !== answerIndex;
              if (isThisCorrect) {
                cardStyle = { ...styles.optionCard, ...styles.optionCorrect };
                letterCircleStyle = styles.optionLetterOk;
                letterTextStyle = styles.optionLetterTextOk;
                labelStyle = styles.optionLabelActive;
              } else if (isThisWrong) {
                cardStyle = { ...styles.optionCard, ...styles.optionWrong };
                letterCircleStyle = styles.optionLetterBad;
                letterTextStyle = styles.optionLetterTextBad;
                labelStyle = styles.optionLabelActive;
              } else {
                cardStyle = { ...styles.optionCard, ...styles.optionDisabled };
                labelStyle = styles.optionLabelMuted;
              }
            }

            const showCheck = revealed && idx === answerIndex;
            const showX =
              revealed && idx === selectedIndex && idx !== answerIndex;

            return (
              <Pressable
                key={`${idx}-${label}`}
                style={({ pressed }) => [
                  cardStyle,
                  !revealed && pressed && { opacity: 0.92 },
                ]}
                onPress={() => onSelectOption(idx)}
                disabled={revealed}
              >
                <View style={letterCircleStyle}>
                  {showCheck ? (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  ) : showX ? (
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  ) : (
                    <Text style={letterTextStyle}>{letter}</Text>
                  )}
                </View>
                <Text
                  style={[
                    labelStyle,
                    { fontSize: 16 * textScale },
                    isDark && !revealed && { color: "#E5E7EB" },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {revealed && !isCorrect && (
          <View style={[styles.feedbackBox, isDark && { backgroundColor: "#3F1D1D" }]}>
            <Text style={[styles.feedbackText, isDark && { color: "#FECACA" }]}>
              Chưa đúng. Đáp án đúng là{" "}
              <Text style={styles.feedbackBold}>“{correctOption}”</Text>
              {keywordEn && keywordVi ? (
                <>
                  {" "}
                  – <Text style={styles.feedbackBold}>{keywordEn}</Text> ={" "}
                  <Text style={styles.feedbackBold}>{keywordVi}</Text>.
                </>
              ) : (
                "."
              )}
            </Text>
          </View>
        )}
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
          style={[
            styles.btnListenAgain,
            isDark && { borderColor: "#22C55E", backgroundColor: "#0F172A" },
          ]}
          onPress={onListenAgain}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnListenAgainText, isDark && { color: "#86EFAC" }]}>Nghe lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnNext, !revealed && styles.btnNextDisabled]}
          onPress={onNext}
          activeOpacity={0.85}
          disabled={!revealed}
        >
          <Text style={styles.btnNextText}>Tiếp theo</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 28 },
  fallbackText: { fontSize: 16, color: C.muted, textAlign: "center", marginTop: 40 },
  fallbackLink: {
    marginTop: 16,
    fontSize: 16,
    color: C.primary,
    textAlign: "center",
    fontWeight: "600",
  },
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
    backgroundColor: C.backCircle,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: C.primaryDark,
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
    fontSize: 14,
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
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 20,
    gap: 12,
  },
  instructionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.instructionIconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: C.instructionText,
  },
  audioCard: {
    backgroundColor: C.audioCardBg,
    borderRadius: 16,
    padding: 18,
    marginTop: 18,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  playCircleActive: {
    backgroundColor: C.primaryDark,
  },
  waveform: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    backgroundColor: C.audioCardInner,
    borderRadius: 12,
    paddingHorizontal: 8,
    overflow: "hidden",
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    alignSelf: "center",
  },
  slowPill: {
    alignSelf: "center",
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: C.pillOutlineBorder,
    backgroundColor: C.bg,
  },
  slowPillText: {
    fontSize: 15,
    fontWeight: "600",
    color: C.primary,
  },
  question: {
    marginTop: 22,
    fontSize: 17,
    fontWeight: "700",
    color: C.navy,
  },
  options: {
    marginTop: 14,
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: C.optionIdleBg,
    borderColor: C.optionIdleBorder,
    gap: 12,
  },
  optionCorrect: {
    backgroundColor: C.successBg,
    borderColor: C.successBorder,
  },
  optionWrong: {
    backgroundColor: C.errorBg,
    borderColor: C.errorBorder,
  },
  optionDisabled: {
    opacity: 0.72,
    backgroundColor: "#EEEEEE",
    borderColor: "#E0E0E0",
  },
  optionLetterIdle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.optionIdleBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLetterOk: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLetterBad: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.errorBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLetterTextIdle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.muted,
  },
  optionLetterTextOk: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  optionLetterTextBad: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: C.navy,
  },
  optionLabelActive: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: C.navy,
  },
  optionLabelMuted: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: C.muted,
  },
  feedbackBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: C.errorBg,
    borderWidth: 1.5,
    borderColor: C.errorBorder,
  },
  feedbackText: {
    fontSize: 15,
    lineHeight: 22,
    color: C.errorText,
    fontWeight: "500",
  },
  feedbackBold: {
    fontWeight: "700",
    color: C.errorText,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: C.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  btnListenAgain: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  btnListenAgainText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.primary,
  },
  btnNext: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnNextDisabled: {
    opacity: 0.45,
  },
  btnNextText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
