import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppSettings } from "../../store/AppSettingsContext";
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

export default function ChooseModeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { settings } = useAppSettings();
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
          onPress={() => navigation.navigate("FlashCard")}
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
