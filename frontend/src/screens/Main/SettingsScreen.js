import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Modal,
  Pressable,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "../../components/AppText";
import { useAppSettings } from "../../store/AppSettingsContext";
import { THEME } from "../../data/themePalette";

const WEB_SCROLL_STYLE = Platform.OS === "web" ? { overflowY: "auto" } : null;

const FONT_SIZE_OPTIONS = ["A-", "A", "A+"];
const REMINDER_TIME_OPTIONS = ["06:00", "07:00", "08:00", "09:00", "18:00", "20:00"];

function SectionTitle({ children, style }) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const systemScheme = useColorScheme();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const {
    settings,
    setFontSize,
    setUseSystemTheme,
    setDarkMode,
    setDailyReminder,
    setReminderTime,
    setSoundFx,
    setVoiceAccent,
  } = useAppSettings();
  const isDark = settings.darkMode;
  const palette = isDark ? THEME.dark : THEME.light;

  const trackColor = useMemo(
    () => ({ false: "#D3D6DC", true: "#2D5BDB" }),
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
      style={[styles.root, { paddingTop: insets.top + 8, backgroundColor: palette.page }]}
    >
      <ScrollView
        style={[styles.scroll, WEB_SCROLL_STYLE]}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 26, 32) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: palette.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            activeOpacity={0.82}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.title, { color: palette.text }]}>Cài đặt</Text>
        </View>

        <SectionTitle style={{ color: palette.textMuted }}>HIỂN THỊ</SectionTitle>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: palette.text }]}>Cỡ chữ</Text>
          <View style={styles.fontSizeGroup}>
            {FONT_SIZE_OPTIONS.map((item) => {
              const selected = item === settings.fontSize;
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.fontButton,
                    { backgroundColor: palette.soft },
                    selected && styles.fontButtonSelected,
                  ]}
                  onPress={() => setFontSize(item)}
                  activeOpacity={0.86}
                >
                  <Text
                    style={[
                      styles.fontButtonText,
                      { color: isDark ? "#CBD5E1" : "#4A5172" },
                      selected && styles.fontButtonTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <Divider style={{ borderBottomColor: palette.border }} />

        <View style={[styles.row, settings.useSystemTheme && styles.rowDisabled]}>
          <Text style={[styles.rowLabel, { color: palette.text }]}>Chế độ tối</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={setDarkMode}
            disabled={settings.useSystemTheme}
            thumbColor="#FFFFFF"
            trackColor={trackColor}
          />
        </View>
        <Divider style={{ borderBottomColor: palette.border }} />
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: palette.text }]}>Theo giao diện hệ thống</Text>
          <View style={styles.rightInline}>
            <Text style={[styles.systemSchemeText, { color: palette.accentText }]}>
              {systemScheme === "dark" ? "Đang tối" : "Đang sáng"}
            </Text>
            <Switch
              value={settings.useSystemTheme}
              onValueChange={setUseSystemTheme}
              thumbColor="#FFFFFF"
              trackColor={trackColor}
            />
          </View>
        </View>
        <Divider style={{ borderBottomColor: palette.border }} />

        <SectionTitle style={{ color: palette.textMuted }}>THÔNG BÁO</SectionTitle>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: palette.text }]}>Nhắc nhở học hằng ngày</Text>
          <Switch
            value={settings.dailyReminder}
            onValueChange={setDailyReminder}
            thumbColor="#FFFFFF"
            trackColor={trackColor}
          />
        </View>
        <Divider style={{ borderBottomColor: palette.border }} />

        <TouchableOpacity
          style={[styles.row, !settings.dailyReminder && styles.rowDisabled]}
          activeOpacity={0.78}
          disabled={!settings.dailyReminder}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={[styles.rowLabel, { color: palette.text }]}>Giờ thông báo</Text>
          <View style={styles.rightInline}>
            <Text
              style={[
                styles.timeText,
                { color: palette.accentText },
                !settings.dailyReminder && styles.timeTextDisabled,
              ]}
            >
              {settings.reminderTime}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#B2B7C2" />
          </View>
        </TouchableOpacity>
        <Divider style={{ borderBottomColor: palette.border }} />

        <SectionTitle style={{ color: palette.textMuted }}>ÂM THANH & GIỌNG NÓI</SectionTitle>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: palette.text }]}>Hiệu ứng âm thanh</Text>
          <Switch
            value={settings.soundFx}
            onValueChange={setSoundFx}
            thumbColor="#FFFFFF"
            trackColor={trackColor}
          />
        </View>
        <Divider style={{ borderBottomColor: palette.border }} />

        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: palette.text }]}>Anh - Mỹ</Text>
          <Switch
            value={settings.voiceAccent === "us"}
            onValueChange={(value) => setVoiceAccent(value ? "us" : "uk")}
            thumbColor="#FFFFFF"
            trackColor={trackColor}
          />
        </View>
        <Divider style={{ borderBottomColor: palette.border }} />

        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: palette.text }]}>Anh - Anh</Text>
          <Switch
            value={settings.voiceAccent === "uk"}
            onValueChange={(value) => setVoiceAccent(value ? "uk" : "us")}
            thumbColor="#FFFFFF"
            trackColor={trackColor}
          />
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={showTimePicker}
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowTimePicker(false)}
        >
          <Pressable style={[styles.modalCard, { backgroundColor: palette.card }]} onPress={() => {}}>
            <Text style={[styles.modalTitle, { color: palette.text }]}>Chọn giờ thông báo</Text>
            {REMINDER_TIME_OPTIONS.map((time) => {
              const active = time === settings.reminderTime;
              return (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeOption, { borderBottomColor: palette.border }]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setReminderTime(time);
                    setShowTimePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      { color: isDark ? "#CBD5E1" : "#25314F" },
                      active && styles.timeOptionTextActive,
                    ]}
                  >
                    {time}
                  </Text>
                  {active ? <Ionicons name="checkmark" size={18} color="#2C56C9" /> : null}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ECEEF4",
  },
  rowDisabled: {
    opacity: 0.55,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
  },
  header: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 62,
    marginBottom: 18,
  },
  backButton: {
    position: "absolute",
    left: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D5BDB",
  },
  title: {
    fontSize: 52,
    lineHeight: 58,
    color: "#191B2E",
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  sectionTitle: {
    marginTop: 6,
    marginBottom: 4,
    fontSize: 18,
    lineHeight: 24,
    color: "#9AA0AE",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  row: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 24,
    lineHeight: 31,
    color: "#151729",
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9DCE5",
  },
  fontSizeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fontButton: {
    width: 52,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9ECF4",
  },
  fontButtonSelected: {
    backgroundColor: "#FFFFFF",
  },
  fontButtonText: {
    color: "#4A5172",
    fontWeight: "700",
    fontSize: 27,
    lineHeight: 30,
  },
  fontButtonTextSelected: {
    color: "#0F1433",
  },
  rightInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    color: "#2C56C9",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  timeTextDisabled: {
    color: "#8F95A8",
  },
  systemSchemeText: {
    color: "#5A6AA0",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    color: "#151729",
    marginBottom: 4,
  },
  timeOption: {
    minHeight: 46,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E8EF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeOptionText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#25314F",
    fontWeight: "600",
  },
  timeOptionTextActive: {
    color: "#2C56C9",
    fontWeight: "800",
  },
});
