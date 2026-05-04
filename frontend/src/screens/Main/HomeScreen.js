import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { USER, HOME_CURRENT_LESSON, HOME_TOPIC_CARDS } from "../../data/mockData";

const C = {
  bg: "#F5F9FF",
  white: "#FFFFFF",
  navy: "#202244",
  primary: "#0961F5",
  primaryDeep: "#1E3A8A",
  muted: "#A0A4AB",
  progressCard: "#BAD3FC",
  progressTrack: "#E2E8F0",
  statCard: "rgba(9, 97, 245, 0.25)",
  subtitleBlue: "#0961F5",
  avatarBg: "#0F172A",
};

function greetingLine() {
  const h = new Date().getHours();
  if (h < 12) return "Chào buổi sáng";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

const TOPIC_THEMES = {
  purple: {
    card: "#EEEDFE",
    badgeBg: "#CECBF6",
    badgeText: "#26215C",
    title: "#26215C",
    footer: "#534AB7",
    line: "#534AB7",
    iconSquare: "#CECBF6",
    iconAccent: "#534AB7",
    iconAccent2: "#7F77DD",
  },
  blue: {
    card: "#E6F1FB",
    badgeBg: "#B5D4F4",
    badgeText: "#0C447C",
    title: "#0C447C",
    footer: "#185FA5",
    line: "#378ADD",
    iconSquare: "#B5D4F4",
    iconCross: "#185FA5",
  },
  green: {
    card: "#E1F5EE",
    badgeBg: "#9FE1CB",
    badgeText: "#085041",
    title: "#085041",
    footer: "#0F6E56",
    line: "#9FE1CB",
    iconSquare: "#9FE1CB",
    iconArrow: "#0F6E56",
  },
  amber: {
    card: "#FFF6E5",
    badgeBg: "#FFD699",
    badgeText: "#7C4A03",
    title: "#5C4033",
    footer: "#B45309",
    line: "#F59E0B",
    iconSquare: "#FFDFA8",
    iconAccent: "#B45309",
  },
  rose: {
    card: "#FDF2F8",
    badgeBg: "#FBCFE8",
    badgeText: "#9D174D",
    title: "#831843",
    footer: "#BE185D",
    line: "#EC4899",
    iconSquare: "#FCE7F3",
    iconAccent: "#BE185D",
  },
};

function LessonChatIcon() {
  return (
    <View style={lessonIconStyles.wrap}>
      <View style={lessonIconStyles.bubbleL} />
      <View style={lessonIconStyles.bubbleR} />
    </View>
  );
}

const lessonIconStyles = StyleSheet.create({
  wrap: { width: 36, height: 28, justifyContent: "center" },
  bubbleL: {
    position: "absolute",
    left: 0,
    top: 2,
    width: 20,
    height: 15,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
  bubbleR: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 20,
    height: 15,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
});

function TopicIcon({ theme }) {
  const t = TOPIC_THEMES[theme];
  if (theme === "purple") {
    return (
      <View style={[topicIconStyles.square, { backgroundColor: t.iconSquare }]}>
        <View style={topicIconStyles.faceRow}>
          <View style={[topicIconStyles.eye, { backgroundColor: t.iconAccent }]} />
          <View
            style={[topicIconStyles.eye, { backgroundColor: t.iconAccent2 }]}
          />
        </View>
        <View style={[topicIconStyles.mouth, { backgroundColor: t.iconAccent }]} />
      </View>
    );
  }
  if (theme === "blue") {
    return (
      <View style={[topicIconStyles.square, { backgroundColor: t.iconSquare }]}>
        <View style={[topicIconStyles.plusH, { backgroundColor: t.iconCross }]} />
        <View style={[topicIconStyles.plusV, { backgroundColor: t.iconCross }]} />
      </View>
    );
  }
  if (theme === "green") {
    return (
      <View style={[topicIconStyles.square, { backgroundColor: t.iconSquare }]}>
        <View style={[topicIconStyles.arrow, { borderLeftColor: t.iconArrow }]} />
      </View>
    );
  }
  if (theme === "amber") {
    return (
      <View style={[topicIconStyles.square, { backgroundColor: t.iconSquare }]}>
        <View
          style={[
            topicIconStyles.cartHandle,
            { borderColor: t.iconAccent },
          ]}
        />
        <View
          style={[
            topicIconStyles.cartBody,
            { backgroundColor: t.iconAccent },
          ]}
        />
      </View>
    );
  }
  if (theme === "rose") {
    return (
      <View style={[topicIconStyles.square, { backgroundColor: t.iconSquare }]}>
        <View style={topicIconStyles.waveRow}>
          <View
            style={[topicIconStyles.waveBar, { height: 16, backgroundColor: t.iconAccent }]}
          />
          <View
            style={[topicIconStyles.waveBar, { height: 26, backgroundColor: t.iconAccent }]}
          />
          <View
            style={[topicIconStyles.waveBar, { height: 20, backgroundColor: t.iconAccent }]}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={[topicIconStyles.square, { backgroundColor: t.iconSquare }]}>
      <View style={[topicIconStyles.arrow, { borderLeftColor: t.iconArrow }]} />
    </View>
  );
}

const topicIconStyles = StyleSheet.create({
  square: {
    width: 58,
    height: 58,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  faceRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 7,
  },
  eye: { width: 9, height: 9, borderRadius: 5 },
  mouth: { width: 17, height: 5, borderRadius: 3 },
  plusH: {
    position: "absolute",
    width: 28,
    height: 5,
    borderRadius: 2,
  },
  plusV: {
    position: "absolute",
    width: 5,
    height: 28,
    borderRadius: 2,
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 17,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    marginLeft: 5,
  },
  cartHandle: {
    position: "absolute",
    top: 10,
    width: 16,
    height: 10,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cartBody: {
    marginTop: 14,
    width: 34,
    height: 22,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  waveRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
    height: 34,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
  },
});

function TopicCard({ item, onPress }) {
  const th = TOPIC_THEMES[item.theme];
  return (
    <Pressable
      style={({ pressed }) => [
        styles.topicCardOuter,
        { backgroundColor: th.card, opacity: pressed ? 0.92 : 1 },
      ]}
      onPress={onPress}
    >
      {item.badge ? (
        <View
          style={[
            styles.topicBadge,
            { backgroundColor: th.badgeBg },
          ]}
        >
          <Text style={[styles.topicBadgeText, { color: th.badgeText }]}>
            {item.badge}
          </Text>
        </View>
      ) : (
        <View style={styles.topicBadgePlaceholder} />
      )}
      <TopicIcon theme={item.theme} />
      <Text style={[styles.topicTitle, { color: th.title }]}>{item.label}</Text>
      <View style={[styles.topicLine, { backgroundColor: th.line }]} />
      <Text style={[styles.topicFooter, { color: th.footer }]}>{item.footer}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const progress = useMemo(() => {
    const { current, total } = HOME_CURRENT_LESSON;
    return Math.min(1, current / total);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <View style={styles.headerRow}>
            <Text style={styles.greeting}>
              {greetingLine()}
              {", "}
              <Text style={styles.greetingName}>{USER.name}</Text>
            </Text>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate("Profile")}
              accessibilityRole="button"
              accessibilityLabel="Hồ sơ"
            >
              <Text style={styles.avatarLetter}>
                {USER.name.replace(/\s/g, "").slice(-1)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.lessonCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("ChooseMode")}
        >
          <View style={styles.lessonIconBox}>
            <LessonChatIcon />
          </View>
          <View style={styles.lessonTextCol}>
            <Text style={styles.lessonTitle}>{HOME_CURRENT_LESSON.title}</Text>
            <Text style={styles.lessonSubtitle}>{HOME_CURRENT_LESSON.subtitle}</Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{USER.streak}</Text>
            <Text style={styles.statLabel}>Ngày liên tiếp</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{USER.totalWords}</Text>
            <Text style={styles.statLabel}>Từ đã học</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{USER.medals}</Text>
            <Text style={styles.statLabel}>Huy chương</Text>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Chọn chủ đề</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Vocabulary")}>
            <Text style={styles.seeAll}>XEM TẤT CẢ</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          nestedScrollEnabled
          contentContainerStyle={styles.topicStrip}
        >
          {HOME_TOPIC_CARDS.map((item) => (
            <TopicCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate("ChooseMode")}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  headerBlock: {
    backgroundColor: C.white,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    flex: 1,
    fontSize: 32,
    fontWeight: "800",
    color: C.navy,
    lineHeight: 40,
    paddingRight: 14,
  },
  greetingName: {
    color: C.navy,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: C.avatarBg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: C.white,
    fontSize: 28,
    fontWeight: "700",
  },
  lessonCard: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginTop: 22,
    backgroundColor: C.progressCard,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
    minHeight: 124,
  },
  lessonIconBox: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  lessonTextCol: {
    flex: 1,
    minWidth: 0,
  },
  lessonTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "rgba(0,0,0,0.85)",
    marginBottom: 6,
  },
  lessonSubtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: C.subtitleBlue,
    marginBottom: 14,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: C.progressTrack,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: C.primary,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginTop: 18,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.statCard,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 6,
    alignItems: "center",
    minHeight: 128,
    justifyContent: "center",
  },
  statNum: {
    fontSize: 38,
    fontWeight: "800",
    color: C.primaryDeep,
    marginBottom: 8,
    lineHeight: 44,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.primaryDeep,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 2,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 22,
    marginTop: 32,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: C.navy,
  },
  seeAll: {
    fontSize: 18,
    fontWeight: "800",
    color: C.primary,
    textDecorationLine: "underline",
    letterSpacing: 0.4,
  },
  topicStrip: {
    paddingLeft: 18,
    paddingRight: 28,
    paddingBottom: 12,
    gap: 14,
    flexGrow: 0,
  },
  topicCardOuter: {
    width: 176,
    minHeight: 196,
    borderRadius: 18,
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 16,
    marginRight: 14,
    alignItems: "center",
  },
  topicBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 10,
  },
  topicBadgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  topicBadgePlaceholder: {
    height: 30,
    marginBottom: 10,
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    letterSpacing: 0.6,
    lineHeight: 26,
    alignSelf: "stretch",
  },
  topicLine: {
    height: 3,
    borderRadius: 2,
    marginTop: 14,
    marginBottom: 10,
    alignSelf: "stretch",
  },
  topicFooter: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 17,
    alignSelf: "stretch",
  },
});
