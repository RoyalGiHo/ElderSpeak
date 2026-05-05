import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "../../components/AppText";
import {
  TOPICS,
  lessonTopicSummaryLine,
} from "../../data/mockData";
import {
  useTopicProgress,
  TOPIC_KIND,
} from "../../store/TopicProgressContext";
import { useAppSettings } from "../../store/AppSettingsContext";
import { playSfx } from "../../utils/soundEffects";

const C = {
  pageBg: "#F5F9FF",
  white: "#FFFFFF",
  primary: "#0961F5",
  primaryDeep: "#1E3A8A",
  title: "#111827",
  muted: "#4B5563",
  itemBorder: "#E5E7EB",
  itemBg: "#FFFFFF",
  hoverBg: "#F1F7FF",
  hoverBorder: "#1E6BDE",
  doneBg: "#ECFDF3",
  doneBorder: "#16A34A",
  doneBadgeBg: "#16A34A",
  doneBadgeText: "#FFFFFF",
  inactive: "#D1D5DB",
};

function buildLessonMeta(topic, completed) {
  const line = lessonTopicSummaryLine(topic.id);
  const status = completed ? "Hoàn thành ✓" : "Chưa bắt đầu";
  if (line === "Sắp có dữ liệu") return `Sắp ra mắt · ${status}`;
  return `${line} · ${status}`;
}

export default function LessonTopicsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isCompleted, resetTopic } = useTopicProgress();
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;

  const completedCount = useMemo(
    () => TOPICS.filter((t) => isCompleted(t.id, TOPIC_KIND.LESSON)).length,
    [isCompleted]
  );

  const handleOpenTopic = (topic) => {
    playSfx("tap", settings.soundFx);
    const summary = lessonTopicSummaryLine(topic.id);
    if (summary === "Sắp có dữ liệu") {
      Alert.alert("Sắp ra mắt", `Chưa có bài học cho chủ đề "${topic.name}".`);
      return;
    }
    navigation.navigate("ChooseMode", {
      topicTitle: topic.name,
      lessonMeta: buildLessonMeta(topic, isCompleted(topic.id, TOPIC_KIND.LESSON)),
      lessonTopicId: topic.id,
    });
  };

  const handleLongPress = (topic) => {
    playSfx("tap", settings.soundFx);
    if (!isCompleted(topic.id, TOPIC_KIND.LESSON)) return;
    Alert.alert(
      "Học lại chủ đề?",
      `Đặt lại tiến độ luyện tập "${topic.name}".`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Đặt lại",
          style: "destructive",
          onPress: () => resetTopic(topic.id, TOPIC_KIND.LESSON),
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + 6, backgroundColor: isDark ? "#0F172A" : C.pageBg },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            playSfx("tap", settings.soundFx);
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate("MainTabs", { screen: "Home" });
          }}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          activeOpacity={0.75}
        >
          <Ionicons name="chevron-back" size={22} color={isDark ? "#93C5FD" : C.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && { color: "#93C5FD" }]}>Bài học theo chủ đề</Text>
      </View>

      <Text style={[styles.mainTitle, isDark && { color: "#E2E8F0" }]}>Chọn chủ đề luyện tập</Text>
      <Text style={[styles.subTitle, isDark && { color: "#94A3B8" }]}>
        Học mẫu câu qua nghe – đọc – viết. Đã hoàn thành{" "}
        {completedCount}/{TOPICS.length} chủ đề
        {completedCount > 0 ? "  ·  Nhấn giữ để học lại" : ""}
      </Text>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator
        style={styles.list}
      >
        {TOPICS.map((topic) => {
          const summary = lessonTopicSummaryLine(topic.id);
          const hasData = summary !== "Sắp có dữ liệu";
          const done = isCompleted(topic.id, TOPIC_KIND.LESSON);
          return (
            <Pressable
              key={topic.id}
              style={({ pressed }) => [
                styles.row,
                done && styles.rowDone,
                pressed && styles.rowPressed,
              ]}
              onPress={() => handleOpenTopic(topic)}
              onLongPress={() => handleLongPress(topic)}
              delayLongPress={400}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.icon}>{topic.icon}</Text>
                <View style={styles.textCol}>
                  <Text style={styles.name} numberOfLines={1}>
                    {topic.name}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.meta}>
                      {hasData ? summary : "Sắp ra mắt"}
                    </Text>
                    {done ? (
                      <View style={styles.doneBadge}>
                        <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                        <Text style={styles.doneBadgeLabel}>Đã học xong</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.chevronCircle,
                  done && styles.chevronCircleDone,
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={done ? "#FFFFFF" : C.primaryDeep}
                />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.pageBg,
    paddingHorizontal: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#E3F0FF",
  },
  headerTitle: {
    fontSize: 22,
    color: C.primaryDeep,
    fontWeight: "700",
  },
  mainTitle: {
    marginTop: 18,
    fontSize: 30,
    color: C.title,
    fontWeight: "800",
    lineHeight: 40,
    letterSpacing: -0.4,
  },
  subTitle: {
    marginTop: 6,
    fontSize: 15,
    color: C.muted,
    fontWeight: "500",
    lineHeight: 22,
  },
  list: {
    marginTop: 14,
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    minHeight: 88,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: C.itemBorder,
    backgroundColor: C.itemBg,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowDone: {
    borderColor: C.doneBorder,
    backgroundColor: C.doneBg,
  },
  rowPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.997 }],
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  icon: {
    width: 44,
    textAlign: "center",
    fontSize: 30,
    marginRight: 8,
  },
  textCol: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 28,
  },
  metaRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  meta: {
    fontSize: 15,
    color: C.muted,
    fontWeight: "500",
    lineHeight: 21,
  },
  doneBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.doneBadgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  doneBadgeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.doneBadgeText,
    letterSpacing: 0.2,
  },
  chevronCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F0FF",
  },
  chevronCircleDone: {
    backgroundColor: C.doneBorder,
  },
});
