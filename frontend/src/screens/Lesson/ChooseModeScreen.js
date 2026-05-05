import React from "react";
import {
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "../../components/AppText";
import { useAppSettings } from "../../store/AppSettingsContext";
import { useTopicProgress, TOPIC_KIND } from "../../store/TopicProgressContext";
import { TOPICS, getLessonUnits } from "../../data/mockData";
const C = {
  bg: "#FFFFFF",
  pageBg: "#F7FAFC",
  navy: "#111827",
  muted: "#6B7280",
  primary: "#0961F5",
  backCircle: "#E3F0FF",
  divider: "#E5E7EB",
  footerGreyBg: "#EEF1F5",
  footerGreyIcon: "#4B5563",
};

const MODE_CARDS = [
  {
    key: "reading",
    title: "Luyện đọc",
    description: "Nói to câu tiếng Anh AI chấm phát âm ngay",
    navigate: "Reading",
    icon: "mic",
    bg: "#E8F4FC",
    circle: "#185FA5",
    titleColor: "#0C447C",
    descColor: "#185FA5",
  },
  {
    key: "listening",
    title: "Luyện nghe",
    description: "Nghe câu / từ rồi chọn đáp án đúng",
    navigate: "Listening",
    icon: "volume-high",
    bg: "#E6F6EF",
    circle: "#0F6E56",
    titleColor: "#085041",
    descColor: "#0F6E56",
  },
  {
    key: "writing",
    title: "Luyện viết",
    description: "Nhìn nghĩa tiếng Việt gõ câu tiếng Anh",
    navigate: "Writing",
    icon: "pencil",
    bg: "#FFF0E8",
    circle: "#92400E",
    titleColor: "#78350F",
    descColor: "#92400E",
  },
];

const REVIEW_MODES = ["Reading", "Listening", "Writing"];
const REVIEW_QUESTION_COUNT = 12;

function shuffleArray(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function randomPick(list) {
  if (!Array.isArray(list) || list.length === 0) return undefined;
  return list[Math.floor(Math.random() * list.length)];
}

function buildRandomReviewQueue(topicIds, totalCount = REVIEW_QUESTION_COUNT) {
  const queue = [];
  const safeTopicIds = Array.isArray(topicIds) ? topicIds : [];
  if (safeTopicIds.length === 0) return queue;

  const attempts = Math.max(totalCount * 8, 40);
  for (let i = 0; i < attempts && queue.length < totalCount; i += 1) {
    const topicId = randomPick(safeTopicIds);
    if (!topicId) continue;
    const units = getLessonUnits(String(topicId));
    if (!Array.isArray(units) || units.length === 0) continue;

    const lessonIndex = Math.floor(Math.random() * units.length);
    const sentences = units[lessonIndex]?.sentences ?? [];
    if (!Array.isArray(sentences) || sentences.length === 0) continue;

    const sentenceIndex = Math.floor(Math.random() * sentences.length);
    const mode = randomPick(REVIEW_MODES);
    if (!mode) continue;

    queue.push({
      mode,
      lessonTopicId: String(topicId),
      lessonIndex,
      sentenceIndex,
    });
  }
  return queue;
}

export default function ChooseModeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { settings } = useAppSettings();
  const { progress } = useTopicProgress();
  const isDark = settings.darkMode;

  const params = route.params ?? {};
  const topicTitle =
    typeof params.topicTitle === "string"
      ? params.topicTitle
      : "Đi khám bệnh";
  const lessonMeta =
    typeof params.lessonMeta === "string"
      ? params.lessonMeta
      : "6 bài · Chưa bắt đầu";
  const lessonTopicId =
    params.lessonTopicId != null ? String(params.lessonTopicId) : undefined;
  const completedTopicIds = React.useMemo(() => {
    const lessonProgress = progress?.[TOPIC_KIND.LESSON] ?? {};
    return Object.entries(lessonProgress)
      .filter(([, value]) => Boolean(value?.completed))
      .map(([id]) => String(id));
  }, [progress]);

  const onStartRandomReview = React.useCallback(() => {
    const eligibleTopics = lessonTopicId
      ? completedTopicIds.includes(lessonTopicId)
        ? [lessonTopicId]
        : []
      : completedTopicIds;

    if (eligibleTopics.length === 0) {
      Alert.alert(
        "Chưa có dữ liệu ôn",
        "Bác cần hoàn thành ít nhất 1 chủ đề trong bài học trước khi ôn ngẫu nhiên."
      );
      return;
    }

    const reviewQueue = buildRandomReviewQueue(eligibleTopics);
    if (reviewQueue.length === 0) {
      Alert.alert(
        "Không tạo được bài ôn",
        "Hiện chưa có đủ câu trong các chủ đề đã học. Bác thử lại sau nhé."
      );
      return;
    }

    const first = reviewQueue[0];
    const topicName =
      TOPICS.find((t) => String(t.id) === String(first.lessonTopicId))?.name ??
      topicTitle;
    navigation.navigate(first.mode, {
      topicTitle: `${topicName} · Ôn ngẫu nhiên`,
      lessonMeta: `${reviewQueue.length} câu · Trộn 3 chế độ`,
      lessonTopicId: first.lessonTopicId,
      lessonIndex: first.lessonIndex,
      sentenceIndex: first.sentenceIndex,
      reviewQueue,
      reviewCursor: 0,
      reviewTotal: reviewQueue.length,
      fromRandomReview: true,
    });
  }, [completedTopicIds, lessonTopicId, navigation, topicTitle]);

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
      >
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            activeOpacity={0.75}
          >
            <Ionicons name="chevron-back" size={22} color={isDark ? "#93C5FD" : C.primary} />
          </TouchableOpacity>
          <Text style={[styles.topicPill, isDark && { color: "#93C5FD" }]} numberOfLines={1}>
            {topicTitle}
          </Text>
        </View>

        <Text style={[styles.mainTitle, isDark && { color: "#E2E8F0" }]}>CHỌN CHẾ ĐỘ HỌC</Text>
        <Text style={[styles.meta, isDark && { color: "#94A3B8" }]}>{lessonMeta}</Text>

        <View style={styles.cards}>
          {MODE_CARDS.map((m) => (
            <Pressable
              key={m.key}
              style={({ pressed }) => [
                styles.modeCard,
                { backgroundColor: m.bg },
                pressed && styles.modeCardPressed,
              ]}
              onPress={() =>
                navigation.navigate(m.navigate, {
                  topicTitle,
                  lessonMeta,
                  ...(lessonTopicId ? { lessonTopicId } : {}),
                })
              }
            >
              <View style={[styles.iconCircle, { backgroundColor: m.circle }]}>
                <Ionicons name={m.icon} size={26} color="#FFFFFF" />
              </View>
              <View style={styles.modeTextCol}>
                <Text style={[styles.modeTitle, { color: m.titleColor }]}>
                  {m.title}
                </Text>
                <Text style={[styles.modeDesc, { color: m.descColor }]}>
                  {m.description}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, 14),
            backgroundColor: C.bg,
            borderTopColor: C.divider,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.footerHome}
          onPress={() =>
            navigation.navigate("MainTabs", { screen: "Home" })
          }
          activeOpacity={0.85}
        >
          <Ionicons name="home-outline" size={22} color={C.footerGreyIcon} />
          <Text style={styles.footerHomeText}>Về trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerRandom}
          onPress={onStartRandomReview}
          activeOpacity={0.85}
        >
          <Ionicons name="shuffle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.footerRandomText}>Ôn ngẫu nhiên</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.backCircle,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  topicPill: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: C.primary,
  },
  mainTitle: {
    marginTop: 28,
    fontSize: 26,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: 0.3,
  },
  meta: {
    marginTop: 8,
    fontSize: 15,
    color: C.muted,
    fontWeight: "500",
  },
  cards: {
    marginTop: 28,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    minHeight: 104,
    marginBottom: 16,
  },
  modeCardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  modeTextCol: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  modeDesc: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerHome: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    backgroundColor: C.footerGreyBg,
    paddingVertical: 14,
    borderRadius: 16,
  },
  footerHomeText: {
    fontSize: 15,
    fontWeight: "600",
    color: C.footerGreyIcon,
    marginLeft: 8,
  },
  footerRandom: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    backgroundColor: C.primary,
    paddingVertical: 14,
    borderRadius: 16,
  },
  footerRandomText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});
