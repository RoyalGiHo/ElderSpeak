import React, { useMemo, useState, useCallback } from "react";
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
import { FLASHCARDS, TOPICS } from "../../data/mockData";
import { useTopicProgress } from "../../store/TopicProgressContext";
import { useAppSettings } from "../../store/AppSettingsContext";

const C = {
  pageBg: "#F7F8FA",
  white: "#FFFFFF",
  textMain: "#111827",
  textMuted: "#6B7280",
  primary: "#1661D8",
  progressTrack: "#E5E7EB",
  cardBorder: "#C9D4E5",
  cardDivider: "#E7E9EE",
  danger: "#BC3A44",
  dangerBg: "#FCEFF1",
  success: "#2E6A23",
  successBg: "#EEF6E8",
  actionMuted: "#E7E8E5",
};

function getFlashcardsFromTopics(topicIds) {
  if (!Array.isArray(topicIds) || topicIds.length === 0) {
    return FLASHCARDS["1"] ?? [];
  }

  const allCards = topicIds.flatMap((id) => FLASHCARDS[String(id)] ?? []);
  return allCards.length > 0 ? allCards : FLASHCARDS["1"] ?? [];
}

export default function FlashCardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const params = route.params ?? {};
  const { markTopicsCompleted } = useTopicProgress();
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;

  const topicIds = Array.isArray(params.topicIds) ? params.topicIds : ["1"];
  const cards = useMemo(() => getFlashcardsFromTopics(topicIds), [topicIds]);
  const topicTitle = useMemo(() => {
    const firstTopic = TOPICS.find((t) => topicIds.includes(t.id));
    return firstTopic?.name ? `Flashcard · ${firstTopic.name}` : "Flashcard · Đi khám bệnh";
  }, [topicIds]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);
  const [rememberedIds, setRememberedIds] = useState([]);
  const [forgottenIds, setForgottenIds] = useState([]);
  const [completionSaved, setCompletionSaved] = useState(false);

  const total = cards.length;
  const card = cards[currentIndex];
  const progress = total > 0 ? (currentIndex + 1) / total : 0;
  const isLastCard = total > 0 && currentIndex + 1 >= total;
  const textScale =
    settings.fontSize === "A+" ? 1.08 : settings.fontSize === "A-" ? 0.92 : 1;
  const speechLanguage = settings.voiceAccent === "uk" ? "en-GB" : "en-US";

  const moveNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1 < total ? prev + 1 : prev));
    setIsFront(true);
  }, [total]);

  const handleRemember = useCallback(() => {
    if (!card) return;
    setRememberedIds((prev) => (prev.includes(card.id) ? prev : [...prev, card.id]));
    setForgottenIds((prev) => prev.filter((id) => id !== card.id));
    moveNext();
  }, [card, moveNext]);

  const handleForget = useCallback(() => {
    if (!card) return;
    setForgottenIds((prev) => (prev.includes(card.id) ? prev : [...prev, card.id]));
    setRememberedIds((prev) => prev.filter((id) => id !== card.id));
    moveNext();
  }, [card, moveNext]);

  const finishSession = useCallback(() => {
    if (!completionSaved && topicIds.length > 0) {
      markTopicsCompleted(topicIds, {
        remembered: rememberedIds.length,
        forgotten: forgottenIds.length,
        total,
      });
      setCompletionSaved(true);
    }
    navigation.navigate("MainTabs", { screen: "Vocabulary" });
  }, [
    completionSaved,
    topicIds,
    markTopicsCompleted,
    rememberedIds.length,
    forgottenIds.length,
    total,
    navigation,
  ]);

  const speakCurrentCard = useCallback(() => {
    if (!card || settings.soundFx === false) return;
    Speech.stop();
    Speech.speak(`${card.word}. ${card.example ?? ""}`.trim(), {
      language: speechLanguage,
      rate: 0.88,
    });
  }, [card, settings.soundFx, speechLanguage]);

  if (!card) {
    return (
      <View
        style={[
          styles.root,
          { paddingTop: insets.top + 16, backgroundColor: isDark ? "#0B1220" : C.pageBg },
        ]}
      >
        <Text style={[styles.emptyText, isDark && { color: "#94A3B8" }]}>
          Chưa có flashcard cho chủ đề này.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + 6, backgroundColor: isDark ? "#0B1220" : C.pageBg },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.backBtn, isDark && { backgroundColor: "#1E293B" }]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={22} color={isDark ? "#93C5FD" : C.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={[styles.headerTitle, isDark && { color: "#E5E7EB" }]} numberOfLines={1}>
              {topicTitle}
            </Text>
            <Text style={[styles.headerMeta, isDark && { color: "#94A3B8" }]}>
              {currentIndex + 1} / {total} thẻ
            </Text>
          </View>
        </View>

        <View style={[styles.progressTrack, isDark && { backgroundColor: "#1E293B" }]}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        <Pressable
          style={[styles.cardWrap, isDark && { backgroundColor: "#111827", borderColor: "#334155" }]}
          onPress={() => setIsFront((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel="Lật thẻ"
        >
          {isFront ? (
            <View style={styles.cardContent}>
              <View style={styles.imageArea}>
                <Ionicons name="image-outline" size={44} color="#AAA9A3" />
                <Text style={[styles.imageHint, isDark && { color: "#CBD5E1" }]}>Xem ảnh</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.wordRow}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.word,
                      { fontSize: 46 * textScale },
                      isDark && { color: "#BFDBFE" },
                    ]}
                  >
                    {card.word}
                  </Text>
                  <Text
                    style={[
                      styles.phonetic,
                      isDark && { backgroundColor: "#1E3A8A", color: "#DBEAFE" },
                    ]}
                  >
                    {card.phonetic}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.audioBtn,
                    isDark && { backgroundColor: "#1E293B" },
                    settings.soundFx === false && styles.audioBtnDisabled,
                  ]}
                  activeOpacity={0.8}
                  onPress={speakCurrentCard}
                  disabled={settings.soundFx === false}
                >
                  <Ionicons name="volume-high" size={24} color={C.primary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.flipHint} activeOpacity={0.85}>
                <Ionicons name="hand-left-outline" size={18} color={C.primary} />
                <Text style={[styles.flipHintText, isDark && { color: "#93C5FD" }]}>Chạm để lật</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardContent}>
              <View style={styles.divider} />
              <View style={styles.wordCenter}>
                <Text style={[styles.meaningLabel, isDark && { color: "#94A3B8" }]}>Nghĩa tiếng Việt</Text>
                <Text style={[styles.meaning, { fontSize: 48 * textScale }, isDark && { color: "#F8FAFC" }]}>
                  {card.meaning}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.exampleWrap}>
                <Text style={[styles.exampleLabel, isDark && { color: "#94A3B8" }]}>Ví dụ trong bài</Text>
                <Text style={[styles.example, { fontSize: 34 * textScale }, isDark && { color: "#93C5FD" }]}>
                  {card.example}
                </Text>
                <Text
                  style={[
                    styles.exampleVi,
                    { fontSize: 30 * textScale },
                    isDark && { color: "#CBD5E1" },
                  ]}
                >
                  {card.exampleVi}
                </Text>
              </View>
            </View>
          )}
        </Pressable>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.forgetBtn} onPress={handleForget} activeOpacity={0.85}>
            <Ionicons name="arrow-back" size={21} color={C.danger} />
            <Text style={styles.forgetText}>Chưa nhớ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rememberBtn} onPress={handleRemember} activeOpacity={0.85}>
            <Text style={styles.rememberText}>Đã nhớ</Text>
            <Ionicons name="arrow-forward" size={21} color={C.success} />
          </TouchableOpacity>
        </View>

        <View style={[styles.counterBar, isDark && { backgroundColor: "#111827", borderColor: "#334155" }]}>
          <View style={styles.counterItem}>
            <Text style={styles.counterRemember}>✓ {rememberedIds.length} đã nhớ</Text>
          </View>
          <View style={styles.counterDivider} />
          <View style={styles.counterItem}>
            <Text style={styles.counterForget}>✗ {forgottenIds.length} chưa nhớ</Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, 12),
            backgroundColor: isDark ? "#0B1220" : C.pageBg,
            borderTopColor: isDark ? "#1E293B" : "#E8E9EC",
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.homeBtn, isDark && { backgroundColor: "#1F2937" }]}
          onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
          activeOpacity={0.85}
        >
          <Text style={[styles.homeText, isDark && { color: "#CBD5E1" }]}>Về trang chủ</Text>
        </TouchableOpacity>
        {isLastCard ? (
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={finishSession}
            activeOpacity={0.85}
          >
            <Text style={styles.nextText}>Hoàn thành</Text>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={moveNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextText}>Tiếp thẻ</Text>
            <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.pageBg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F1FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTextWrap: { flex: 1, alignItems: "center", marginRight: 50 },
  headerTitle: { fontSize: 28, fontWeight: "700", color: C.textMain },
  headerMeta: { marginTop: 2, fontSize: 16, color: C.textMuted, fontWeight: "500" },
  progressTrack: {
    marginTop: 10,
    height: 6,
    borderRadius: 4,
    backgroundColor: C.progressTrack,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: C.primary, borderRadius: 4 },
  cardWrap: {
    marginTop: 12,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: C.cardBorder,
    backgroundColor: C.white,
    padding: 14,
    marginHorizontal: 8,
  },
  cardContent: { minHeight: 430 },
  imageArea: {
    height: 145,
    borderRadius: 24,
    backgroundColor: "#A8D5CD",
    alignItems: "center",
    justifyContent: "center",
  },
  imageHint: { marginTop: 4, fontSize: 17, color: "#6B6A63", fontWeight: "500" },
  divider: { marginTop: 14, marginBottom: 14, borderBottomWidth: 1, borderBottomColor: C.cardDivider },
  wordRow: { flexDirection: "row", alignItems: "center" },
  word: { fontSize: 46, fontWeight: "800", color: "#063A9A", lineHeight: 54 },
  phonetic: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#E8F1FF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 24,
    color: "#2D5EB8",
    fontWeight: "500",
  },
  audioBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EDF3FD",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  audioBtnDisabled: {
    opacity: 0.4,
  },
  flipHint: {
    marginTop: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF4FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  flipHintText: { color: C.primary, fontSize: 18, fontWeight: "500" },
  wordCenter: { alignItems: "center", justifyContent: "center", marginTop: 8 },
  meaningLabel: { fontSize: 40, color: "#6D6D6D", marginBottom: 2 },
  meaning: { fontSize: 48, color: "#121212", fontWeight: "700" },
  exampleWrap: { alignItems: "center", marginTop: 4, paddingHorizontal: 8 },
  exampleLabel: { fontSize: 28, color: "#6D6D6D", marginBottom: 6 },
  example: {
    fontSize: 34,
    color: "#0A3F97",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 42,
  },
  exampleVi: {
    marginTop: 4,
    fontSize: 30,
    color: "#5B5D60",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 38,
  },
  actionRow: { marginTop: 16, flexDirection: "row", gap: 12 },
  forgetBtn: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E8A7B0",
    backgroundColor: C.dangerBg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 6,
  },
  forgetText: { fontSize: 21, fontWeight: "700", color: C.danger },
  rememberBtn: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#C6DDAC",
    backgroundColor: C.successBg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 6,
  },
  rememberText: { fontSize: 21, fontWeight: "700", color: C.success },
  counterBar: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E3E5E8",
    backgroundColor: "#F7F7F3",
    flexDirection: "row",
    overflow: "hidden",
  },
  counterItem: { flex: 1, paddingVertical: 11, alignItems: "center" },
  counterDivider: { width: 1, backgroundColor: "#E3E5E8" },
  counterRemember: { fontSize: 18, color: C.success, fontWeight: "600" },
  counterForget: { fontSize: 18, color: C.danger, fontWeight: "600" },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E8E9EC",
    backgroundColor: C.pageBg,
    paddingHorizontal: 18,
    paddingTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  homeBtn: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: C.actionMuted,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  homeText: { fontSize: 20, color: "#7C7E77", fontWeight: "600" },
  nextBtn: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    flexDirection: "row",
    gap: 8,
  },
  finishBtn: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    flexDirection: "row",
    gap: 8,
  },
  nextText: { fontSize: 20, color: "#FFFFFF", fontWeight: "700" },
  emptyText: { marginTop: 28, textAlign: "center", fontSize: 16, color: C.textMuted },
});
