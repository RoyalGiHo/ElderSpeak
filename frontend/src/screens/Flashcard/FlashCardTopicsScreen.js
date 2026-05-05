import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "../../components/AppText";
import { TOPICS } from "../../data/mockData";
import { useTopicProgress } from "../../store/TopicProgressContext";
import { useAppSettings } from "../../store/AppSettingsContext";
import { playSfx } from "../../utils/soundEffects";

const C = {
  pageBg: "#EEF1F7",
  white: "#FFFFFF",
  primary: "#0961F5",
  title: "#111827",
  muted: "#4B5563",
  itemBorder: "#E5E7EB",
  itemBg: "#F8FAFC",
  selectedBg: "#F1F7FF",
  selectedBorder: "#1E6BDE",
  doneBg: "#ECFDF3",
  doneBorder: "#16A34A",
  doneBadgeBg: "#16A34A",
  doneBadgeText: "#FFFFFF",
  doneText: "#15803D",
  hintBg: "#EAF3FD",
  hintBorder: "#C7DCF7",
  inactive: "#D1D5DB",
};

export default function FlashCardTopicsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { progress, hydrated, isCompleted, resetTopic } = useTopicProgress();
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;

  const [selectedIds, setSelectedIds] = useState([]);

  // Khi store đã đọc xong từ AsyncStorage, tự động gợi ý chọn các chủ đề
  // CHƯA hoàn thành để người dùng học tiếp.
  useEffect(() => {
    if (!hydrated) return;
    setSelectedIds((prev) => {
      if (prev.length > 0) return prev;
      const suggested = TOPICS.filter(
        (t) => !isCompleted(t.id)
      ).map((t) => t.id);
      return suggested.length > 0 ? [suggested[0]] : [];
    });
  }, [hydrated, isCompleted]);

  const completedCount = useMemo(
    () => TOPICS.filter((t) => isCompleted(t.id)).length,
    [progress, isCompleted]
  );

  const toggleTopic = (topicId) => {
    playSfx("tap", settings.soundFx);
    setSelectedIds((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const onLongPressTopic = (topic) => {
    playSfx("tap", settings.soundFx);
    if (!isCompleted(topic.id)) return;
    Alert.alert(
      "Học lại chủ đề?",
      `Đặt lại tiến độ "${topic.name}" về chưa hoàn thành.`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Đặt lại",
          style: "destructive",
          onPress: () => resetTopic(topic.id),
        },
      ]
    );
  };

  const canConfirm = selectedIds.length > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    playSfx("tap", settings.soundFx);
    navigation.navigate("FlashCard", { topicIds: selectedIds });
  };

  const handleBack = () => {
    playSfx("tap", settings.soundFx);
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("MainTabs", { screen: "Home" });
  };

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + 6, backgroundColor: isDark ? "#0B1220" : C.pageBg },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          activeOpacity={0.75}
        >
          <Ionicons name="chevron-back" size={22} color={isDark ? "#93C5FD" : "#3B82F6"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && { color: "#93C5FD" }]}>Từ vựng</Text>
      </View>

      <Text style={[styles.mainTitle, isDark && { color: "#E2E8F0" }]}>Chọn chủ đề bạn muốn</Text>
      <Text style={[styles.subTitle, isDark && { color: "#94A3B8" }]}>
        Đã hoàn thành {completedCount}/{TOPICS.length} chủ đề
        {completedCount > 0 ? "  ·  Nhấn giữ để học lại" : ""}
      </Text>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator
        style={styles.list}
      >
        {TOPICS.map((topic) => {
          const selected = selectedIds.includes(topic.id);
          const done = isCompleted(topic.id);
          return (
            <Pressable
              key={topic.id}
              style={({ pressed }) => [
                styles.topicRow,
                done && !selected && styles.topicRowDone,
                selected && styles.topicRowSelected,
                pressed && styles.topicRowPressed,
              ]}
              onPress={() => toggleTopic(topic.id)}
              onLongPress={() => onLongPressTopic(topic)}
              delayLongPress={400}
            >
              <View style={styles.topicLeft}>
                <Text style={styles.topicIcon}>{topic.icon}</Text>
                <View style={styles.topicTextCol}>
                  <Text style={styles.topicName} numberOfLines={1}>
                    {topic.name}
                  </Text>
                  <View style={styles.topicMetaRow}>
                    <Text style={styles.topicMeta}>
                      {topic.totalWords} từ vựng
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
                  styles.checkCircle,
                  selected && styles.checkCircleSelected,
                  !selected && done && styles.checkCircleDone,
                ]}
              >
                {selected || (done && !selected) ? (
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View
        style={[
          styles.confirmWrap,
          { paddingBottom: Math.max(insets.bottom, 12) + 12 },
        ]}
      >
        <TouchableOpacity
          style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.85}
          disabled={!canConfirm}
        >
          <Text style={styles.confirmText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 39,
    color: "#2E7CC7",
    fontWeight: "700",
    lineHeight: 48,
  },
  mainTitle: {
    marginTop: 10,
    fontSize: 31,
    color: C.title,
    fontWeight: "800",
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  subTitle: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 15,
    color: C.muted,
    fontWeight: "500",
  },
  hintBox: {
    marginTop: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.hintBorder,
    backgroundColor: C.hintBg,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  hintText: {
    color: "#255F92",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 30,
  },
  list: {
    marginTop: 14,
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  topicRow: {
    minHeight: 88,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: C.itemBorder,
    backgroundColor: C.itemBg,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topicRowSelected: {
    borderColor: C.selectedBorder,
    backgroundColor: C.selectedBg,
  },
  topicRowDone: {
    borderColor: C.doneBorder,
    backgroundColor: C.doneBg,
  },
  topicRowPressed: {
    opacity: 0.95,
  },
  topicLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  topicIcon: {
    width: 44,
    textAlign: "center",
    fontSize: 30,
    marginRight: 8,
  },
  topicTextCol: {
    flex: 1,
  },
  topicName: {
    fontSize: 21,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 30,
  },
  topicMetaRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  topicMeta: {
    fontSize: 16,
    color: C.muted,
    fontWeight: "500",
    lineHeight: 22,
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
  checkCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: C.inactive,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleSelected: {
    borderColor: C.primary,
    backgroundColor: C.primary,
  },
  checkCircleDone: {
    borderColor: C.doneBorder,
    backgroundColor: C.doneBorder,
  },
  confirmWrap: {
    paddingTop: 10,
  },
  confirmBtn: {
    height: 64,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    width: "54%",
    minWidth: 210,
    shadowColor: "#0B56D0",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  confirmBtnDisabled: {
    opacity: 0.55,
  },
  confirmText: {
    color: C.white,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },
});
