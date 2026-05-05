import React, { useMemo, useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "../../components/AppText";
import { USER } from "../../data/mockData";
import {
  useTopicProgress,
  TOPIC_KIND,
} from "../../store/TopicProgressContext";
import { useAppSettings } from "../../store/AppSettingsContext";

/** Palette aligned with frontend/Design/ResultPage.png */
const C = {
  bg: "#FFFFFF",
  primary: "#2161D5",
  primaryRing: "#1A4DB8",
  navy: "#1A3B8B",
  lightBlue: "#EBF2FF",
  lightBlueSoft: "#E8F1FF",
  textBlue: "#2161D5",
  muted: "#7E8DA1",
  divider: "#D8DEE8",
  statBorder: "#C5D7F0",
  progressBg: "#F0F3F8",
};

function parseLessonMeta(meta) {
  if (typeof meta !== "string") return { current: 3, total: 6 };
  const m = meta.match(/(\d+)\s*\/\s*(\d+)/);
  if (m) return { current: Number(m[1]), total: Number(m[2]) };
  const bai = meta.match(/(\d+)\s*bài/);
  if (bai) return { current: 1, total: Number(bai[1]) || 6 };
  return { current: 3, total: 6 };
}

function formatDuration(totalSec) {
  const s = Math.max(0, Math.floor(totalSec ?? 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}'${String(r).padStart(2, "0")}"`;
}

const MODE_TO_SCREEN = {
  reading: "Reading",
  listening: "Listening",
  writing: "Writing",
};

const DEFAULT_WORDS = [
  "stomachache",
  "doctor",
  "appointment",
  "prescription",
];

export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { markTopicCompleted } = useTopicProgress();
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const savedRef = useRef(false);

  const p = route.params ?? {};
  const mode = typeof p.mode === "string" ? p.mode : "lesson";
  const topicTitle =
    typeof p.topicTitle === "string" ? p.topicTitle : "Đi khám bệnh";
  const lessonMeta =
    typeof p.lessonMeta === "string"
      ? p.lessonMeta
      : "6 bài · Chưa bắt đầu";
  const lessonTopicId =
    p.lessonTopicId != null ? String(p.lessonTopicId) : "1";

  const parsedMeta = useMemo(
    () => parseLessonMeta(lessonMeta),
    [lessonMeta]
  );
  const lessonCurrent =
    typeof p.lessonCurrent === "number"
      ? p.lessonCurrent
      : parsedMeta.current;
  const lessonTotal =
    typeof p.lessonTotal === "number"
      ? p.lessonTotal
      : parsedMeta.total;

  const scorePercent =
    typeof p.scorePercent === "number" ? p.scorePercent : 85;
  const correctCount =
    typeof p.correctCount === "number" ? p.correctCount : 5;
  const questionTotal =
    typeof p.questionTotal === "number" ? p.questionTotal : 6;
  const durationSec =
    typeof p.durationSec === "number" ? p.durationSec : 4 * 60 + 12;

  const newWords = Array.isArray(p.newWords) ? p.newWords : DEFAULT_WORDS;

  const feedbackMessage =
    typeof p.feedbackMessage === "string"
      ? p.feedbackMessage
      : "Bác làm tốt lắm!";

  const medalLabel =
    typeof p.medalLabel === "string" ? p.medalLabel : "Người học chăm chỉ";

  const streakDays =
    typeof p.streakDays === "number" ? p.streakDays : USER.streak + 1;

  const progressRatio =
    lessonTotal > 0 ? Math.min(lessonCurrent / lessonTotal, 1) : 0.5;

  const allDone = lessonTotal > 0 && lessonCurrent >= lessonTotal;

  // Khi người học đến màn Result và đã hoàn tất toàn bộ bài của chủ đề,
  // ghi tiến độ vào "DB" FE để màn LessonTopics phản ánh đã học xong.
  useEffect(() => {
    if (!allDone || savedRef.current) return;
    savedRef.current = true;
    markTopicCompleted(
      lessonTopicId,
      {
        mode,
        scorePercent,
        correctCount,
        questionTotal,
        durationSec,
        lessonTotal,
      },
      TOPIC_KIND.LESSON
    );
  }, [
    allDone,
    lessonTopicId,
    mode,
    scorePercent,
    correctCount,
    questionTotal,
    durationSec,
    lessonTotal,
    markTopicCompleted,
  ]);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onRedo = useCallback(() => {
    const screen = MODE_TO_SCREEN[mode];
    if (screen) {
      navigation.navigate(screen, {
        topicTitle,
        lessonMeta,
        lessonTopicId,
        lessonIndex: 0,
        sentenceIndex: 0,
      });
    } else {
      navigation.navigate("ChooseMode", {
        topicTitle,
        lessonMeta,
        lessonTopicId,
      });
    }
  }, [navigation, mode, topicTitle, lessonMeta, lessonTopicId]);

  const onNext = useCallback(() => {
    navigation.navigate("MainTabs");
  }, [navigation]);

  const bottomPad = Math.max(insets.bottom, 12);

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top },
        Platform.OS === "web" && styles.rootWeb,
        isDark && { backgroundColor: "#0B1220" },
      ]}
    >
      <View style={styles.decorTopLeft} pointerEvents="none" />
      <View style={styles.decorTopRight} pointerEvents="none" />
      <View style={styles.decorMidRight} pointerEvents="none" />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          activeOpacity={0.75}
        >
          <Ionicons name="chevron-back" size={22} color={isDark ? "#93C5FD" : C.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerCenter, isDark && { color: "#93C5FD" }]} numberOfLines={1}>
          {topicTitle} · Hoàn thành {lessonTotal} câu
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <View style={styles.topBlock}>
          <View style={styles.hero}>
            <View style={styles.badgeCluster}>
              <View style={styles.badgeGlow} />
              <View style={styles.badgeOuter}>
                <View style={styles.badgeInner}>
                  <Ionicons name="star" size={40} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.medalCaps}>HUY CHƯƠNG</Text>
          <Text style={styles.medalTitle} numberOfLines={2}>
            {medalLabel}
          </Text>
          <Text style={styles.medalSub} numberOfLines={1}>
            Hoàn thành bài · {topicTitle}
          </Text>
        </View>

        <View style={styles.midBlock}>
          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{scorePercent}%</Text>
              <Text style={styles.statLabel}>Điểm số</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statValue}>
                {correctCount}/{questionTotal}
              </Text>
              <Text style={styles.statLabel}>Câu đúng</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statValue}>
                {formatDuration(durationSec)}
              </Text>
              <Text style={styles.statLabel}>Thời gian</Text>
            </View>
          </View>

          <View style={styles.feedbackBanner}>
            <View style={styles.feedbackStripe} />
            <View style={styles.feedbackRow}>
              <View style={styles.feedbackIconCircle}>
                <Text style={styles.feedbackEmoji}>👏</Text>
              </View>
              <Text style={styles.feedbackText} numberOfLines={2}>
                {feedbackMessage}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Từ mới:</Text>
          <View style={styles.tagsRow}>
            {newWords.map((w) => (
              <View key={String(w)} style={styles.tag}>
                <Text style={styles.tagText}>{w}</Text>
              </View>
            ))}
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Tiến độ chủ đề</Text>
              <Text style={styles.progressMeta}>
                {lessonCurrent} / {lessonTotal} câu
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round(progressRatio * 100)}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.streakCard}>
            <View style={styles.streakIconCircle}>
              <Text style={styles.streakEmoji}>🔥</Text>
            </View>
            <View style={styles.streakTextCol}>
              <Text style={styles.streakTitle} numberOfLines={1}>
                {streakDays} ngày liên tiếp!
              </Text>
              <Text style={styles.streakSub} numberOfLines={2}>
                Học thêm ngày mai để giữ chuỗi nhé
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.footerArea, { paddingBottom: bottomPad }]}>
          <View style={styles.footerBtns}>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={onRedo}
              activeOpacity={0.85}
            >
              <Text style={styles.btnOutlineText}>Làm lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={onNext}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>Tiếp theo →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    overflow: "hidden",
  },
  rootWeb: {
    height: "100vh",
    maxHeight: "100vh",
  },
  body: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 20,
  },
  footerArea: {
    marginTop: "auto",
    paddingTop: 4,
    flexShrink: 0,
  },
  decorTopLeft: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: C.lightBlue,
    opacity: 0.5,
    top: -44,
    left: -64,
  },
  decorTopRight: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: C.lightBlue,
    opacity: 0.38,
    top: 56,
    right: -44,
  },
  decorMidRight: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: C.lightBlue,
    opacity: 0.22,
    top: 240,
    right: -72,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.statBorder,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A3B8B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: C.textBlue,
    paddingHorizontal: 8,
  },
  headerSpacer: { width: 44 },
  topBlock: {
    alignItems: "center",
  },
  hero: {
    alignItems: "center",
    marginBottom: 4,
  },
  badgeCluster: {
    width: 116,
    height: 116,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeGlow: {
    position: "absolute",
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: C.lightBlueSoft,
    opacity: 0.92,
    top: 4,
    left: 4,
  },
  badgeOuter: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: C.primaryRing,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#2B6FDC",
  },
  badgeInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  medalCaps: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: C.textBlue,
    letterSpacing: 1.2,
    marginTop: 4,
  },
  medalTitle: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "800",
    color: C.navy,
    marginTop: 6,
    paddingHorizontal: 6,
    lineHeight: 28,
  },
  medalSub: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: C.textBlue,
    marginTop: 4,
    paddingHorizontal: 6,
  },
  midBlock: {
    marginTop: 6,
    flexGrow: 0,
    flexShrink: 1,
    minHeight: 0,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.statBorder,
    backgroundColor: C.bg,
  },
  statCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: C.divider,
    marginVertical: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: C.primary,
  },
  statLabel: {
    fontSize: 12,
    color: C.muted,
    marginTop: 6,
    fontWeight: "500",
  },
  feedbackBanner: {
    flexDirection: "row",
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: C.lightBlue,
  },
  feedbackStripe: {
    width: 6,
    backgroundColor: C.primary,
  },
  feedbackRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  feedbackIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: C.statBorder,
  },
  feedbackEmoji: { fontSize: 24 },
  feedbackText: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: C.navy,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: C.muted,
    marginTop: 10,
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: C.lightBlue,
    borderWidth: 1,
    borderColor: C.statBorder,
    marginRight: 7,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 15,
    fontWeight: "600",
    color: C.primary,
  },
  progressCard: {
    marginTop: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: C.progressBg,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: C.muted,
  },
  progressMeta: {
    fontSize: 15,
    fontWeight: "600",
    color: C.textBlue,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: C.lightBlue,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: C.primary,
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: C.lightBlue,
  },
  streakIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: C.statBorder,
  },
  streakEmoji: { fontSize: 25 },
  streakTextCol: { flex: 1, minWidth: 0 },
  streakTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.navy,
  },
  streakSub: {
    fontSize: 15,
    fontWeight: "500",
    color: C.textBlue,
    marginTop: 3,
    lineHeight: 20,
  },
  footerBtns: {
    flexDirection: "row",
    gap: 12,
  },
  btnOutline: {
    flex: 0.92,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: C.primary,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutlineText: {
    fontSize: 17,
    fontWeight: "600",
    color: C.primary,
  },
  btnPrimary: {
    flex: 1.08,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
