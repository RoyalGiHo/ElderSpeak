import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "../../components/AppText";
import { MEDALS } from "../../data/mockData";
import { useAppSettings } from "../../store/AppSettingsContext";
import { playSfx } from "../../utils/soundEffects";

const WEB_SCROLL_STYLE = Platform.OS === "web" ? { overflowY: "auto" } : null;

function MedalRow({ medal }) {
  const { name, desc, icon, earned } = medal;
  return (
    <View style={[styles.row, !earned && styles.rowDimmed]}>
      <View style={[styles.iconWrap, !earned && styles.iconWrapDimmed]}>
        <Text
          allowFontScaling={false}
          style={[styles.iconText, !earned && styles.iconTextDimmed]}
        >
          {icon}
        </Text>
      </View>
      <View style={styles.rowTextWrap}>
        <Text
          numberOfLines={1}
          style={[styles.rowTitle, !earned && styles.rowTitleDimmed]}
        >
          {name}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.rowDesc, !earned && styles.rowDescDimmed]}
        >
          {desc}
        </Text>
      </View>
    </View>
  );
}

export default function MedalsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;

  const { earnedList, lockedList, earnedCount, total } = useMemo(() => {
    const earnedList = MEDALS.filter((m) => m.earned);
    const lockedList = MEDALS.filter((m) => !m.earned);
    return {
      earnedList,
      lockedList,
      earnedCount: earnedList.length,
      total: MEDALS.length,
    };
  }, []);

  const handleBack = () => {
    playSfx("tap", settings.soundFx);
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("Profile");
  };

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + 6, backgroundColor: isDark ? "#0F172A" : "#FFFFFF" },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.85}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && { color: "#E2E8F0" }]}>Thành tích</Text>
      </View>

      <ScrollView
        style={[styles.scroll, WEB_SCROLL_STYLE]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summary}>
          <Text style={[styles.summaryCount, isDark && { color: "#E2E8F0" }]}>
            {earnedCount} / {total}
          </Text>
          <Text style={[styles.summaryLabel, isDark && { color: "#94A3B8" }]}>huy chương đã nhận</Text>
        </View>

        <Text style={styles.sectionLabel}>Đã nhận</Text>
        <View style={styles.section}>
          {earnedList.map((medal) => (
            <MedalRow key={medal.id} medal={medal} />
          ))}
        </View>

        <Text style={[styles.sectionLabel, styles.sectionLabelLocked]}>
          Chưa đạt
        </Text>
        <View style={styles.section}>
          {lockedList.map((medal) => (
            <MedalRow key={medal.id} medal={medal} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
  },
  header: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    marginBottom: 8,
  },
  backButton: {
    position: "absolute",
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1D6AE8",
  },
  headerTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    color: "#16172A",
    letterSpacing: -0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 6,
  },
  summary: {
    alignItems: "center",
    paddingVertical: 6,
    marginBottom: 12,
  },
  summaryCount: {
    fontSize: 64,
    lineHeight: 72,
    fontWeight: "800",
    color: "#0F1330",
    letterSpacing: -1,
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 18,
    lineHeight: 24,
    color: "#5A6079",
    fontWeight: "500",
  },
  sectionLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: "#7E89A7",
    marginTop: 6,
    marginBottom: 6,
    paddingLeft: 4,
  },
  sectionLabelLocked: {
    color: "#A1A8BC",
    marginTop: 14,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: "#E4E7EF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E7EF",
    gap: 14,
  },
  rowDimmed: {
    opacity: 1,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EAF1FA",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapDimmed: {
    backgroundColor: "#EDEFF4",
  },
  iconText: {
    fontSize: 30,
    lineHeight: 34,
  },
  iconTextDimmed: {
    opacity: 0.55,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: "#0F1330",
    letterSpacing: -0.3,
  },
  rowTitleDimmed: {
    color: "#A8AEC2",
  },
  rowDesc: {
    marginTop: 2,
    fontSize: 16,
    lineHeight: 22,
    color: "#5A6079",
    fontWeight: "500",
  },
  rowDescDimmed: {
    color: "#B6BCCC",
  },
});
