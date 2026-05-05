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
import { HISTORY, USER } from "../../data/mockData";
import { useAppSettings } from "../../store/AppSettingsContext";
import { THEME } from "../../data/themePalette";

const WEB_SCROLL_STYLE = Platform.OS === "web" ? { overflowY: "auto" } : null;

const HEATMAP_ROWS = [
  [0, 1, 0, 1, 0, 1, 2, 0, 1, 0, 1, 0, 2, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 2, 0, 1, 0, 1, 0, 1, 2, 1],
  [0, 1, 2, 1, 0, 1, 0, 1, 2, 0, 1, 0, 1, 2, 1, 2],
  [1, 2, 1, 0, 1, 0, 1, 0, 1, 2, 0, 1, 0, 1, 0, 2],
  [0, 1, 0, 1, 2, 0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 2],
  [1, 0, 1, 0, 1, 2, 0, 1, 0, 1, 2, 1, 0, 1, 2, 1],
];

const WEEK_LABELS = ["Th.1", "Th.2", "Th.3"];
const DAY_LABELS = ["T3", "T5", "T7"];

const LEVEL_COLORS = {
  0: "#E6EEF9",
  1: "#ACC3EE",
  2: "#1D6AE8",
};

function getDotColor(date, itemIndex) {
  if (date.includes("29/03") && itemIndex === 0) {
    return "#B07A1E";
  }
  return "#1D6AE8";
}

function levelColor(level) {
  return LEVEL_COLORS[level] ?? LEVEL_COLORS[0];
}

export default function HistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const palette = isDark ? THEME.dark : THEME.light;

  const stats = useMemo(
    () => [
      { label: "Buổi học", value: 18 },
      { label: "Từ đã học", value: USER.totalWords },
      { label: "Ngày liên tiếp", value: USER.streak },
    ],
    []
  );

  const handleBack = () => {
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
        { paddingTop: insets.top + 6, backgroundColor: palette.page },
      ]}
    >
      <ScrollView
        style={[styles.pageScroll, WEB_SCROLL_STYLE]}
        contentContainerStyle={[
          styles.pageContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, isDark && { backgroundColor: palette.primary }]}
            activeOpacity={0.85}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.title, { color: isDark ? palette.text : "#16172A" }]}>Tiến độ</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, isDark && { backgroundColor: palette.soft }]}>
              <Text style={[styles.statLabel, isDark && { color: palette.textMuted }]}>{stat.label}</Text>
              <Text style={[styles.statValue, isDark && { color: palette.text }]}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.blockLabel, isDark && { color: palette.textMuted }]}>HOẠT ĐỘNG 3 THÁNG QUA</Text>
        <View style={[styles.heatmapCard, isDark && { backgroundColor: palette.card }]}>
          <View style={styles.monthLabels}>
            {WEEK_LABELS.map((label) => (
              <Text key={label} style={[styles.monthLabelText, isDark && { color: "#64748B" }]}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.heatmapGrid}>
            <View style={styles.dayLabelsColumn}>
              {DAY_LABELS.map((label) => (
                <Text key={label} style={[styles.dayLabelText, isDark && { color: "#64748B" }]}>
                  {label}
                </Text>
              ))}
            </View>

            <View style={styles.rowsWrap}>
              {HEATMAP_ROWS.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.row}>
                  {row.map((level, colIndex) => (
                    <View
                      key={`cell-${rowIndex}-${colIndex}`}
                      style={[styles.cell, { backgroundColor: levelColor(level) }]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.legend}>
            <Text style={[styles.legendText, isDark && { color: "#94A3B8" }]}>Ít</Text>
            {[0, 1, 1, 2, 2].map((level, index) => (
              <View
                key={`legend-cell-${index}`}
                style={[styles.legendCell, { backgroundColor: levelColor(level) }]}
              />
            ))}
            <Text style={[styles.legendText, isDark && { color: "#94A3B8" }]}>Nhiều</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, isDark && { color: "#94A3B8" }]}>CHI TIẾT TỪNG NGÀY</Text>

        <View style={styles.list}>
          {HISTORY.map((dayItem) => (
            <View key={dayItem.date} style={styles.dayGroup}>
              <Text style={[styles.dayDate, isDark && { color: "#E2E8F0" }]}>{dayItem.date}</Text>
              {dayItem.items.map((entry, entryIndex) => (
                <View key={`${dayItem.date}-${entry}`} style={styles.entryRow}>
                  <View
                    style={[
                      styles.entryDot,
                      { backgroundColor: getDotColor(dayItem.date, entryIndex) },
                    ]}
                  />
                  <Text style={[styles.entryText, isDark && { color: "#CBD5E1" }]}>{entry}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ECEEF4",
  },
  pageScroll: {
    flex: 1,
  },
  pageContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    minHeight: 48,
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
  title: {
    fontSize: 56,
    lineHeight: 62,
    fontWeight: "800",
    color: "#16172A",
    letterSpacing: -0.8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#B4C8EE",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    minHeight: 84,
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: "#717A99",
    fontWeight: "500",
  },
  statValue: {
    marginTop: 2,
    fontSize: 42,
    lineHeight: 46,
    color: "#16172A",
    fontWeight: "800",
  },
  blockLabel: {
    fontSize: 27,
    lineHeight: 31,
    color: "#8E95AC",
    fontWeight: "800",
    marginBottom: 8,
  },
  heatmapCard: {
    borderRadius: 14,
    backgroundColor: "#EEF2F8",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 10,
  },
  monthLabels: {
    paddingLeft: 44,
    paddingRight: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  monthLabelText: {
    fontSize: 11,
    lineHeight: 14,
    color: "#A0A7BB",
    fontWeight: "600",
  },
  heatmapGrid: {
    flexDirection: "row",
  },
  dayLabelsColumn: {
    width: 26,
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  dayLabelText: {
    fontSize: 11,
    lineHeight: 14,
    color: "#A0A7BB",
    fontWeight: "700",
  },
  rowsWrap: {
    flex: 1,
    paddingTop: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
    gap: 4,
  },
  cell: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legend: {
    marginTop: 6,
    paddingRight: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 4,
  },
  legendText: {
    fontSize: 12,
    lineHeight: 14,
    color: "#8F96AC",
    fontWeight: "600",
  },
  legendCell: {
    width: 13,
    height: 13,
    borderRadius: 3,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 40,
    lineHeight: 46,
    color: "#8E95AC",
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  list: {
    marginTop: 2,
  },
  dayGroup: {
    marginTop: 6,
  },
  dayDate: {
    marginBottom: 4,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "800",
    color: "#151629",
    letterSpacing: -0.6,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingLeft: 10,
  },
  entryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 13,
  },
  entryText: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800",
    color: "#151629",
    letterSpacing: -0.2,
  },
});
