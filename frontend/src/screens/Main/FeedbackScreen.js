import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppSettings } from "../../store/AppSettingsContext";

const WEB_SCROLL_STYLE = Platform.OS === "web" ? { overflowY: "auto" } : null;

const RATING_LABELS = {
  1: "Rất không hài lòng — chạm để thay đổi",
  2: "Không hài lòng — chạm để thay đổi",
  3: "Bình thường — chạm để thay đổi",
  4: "Rất hài lòng — chạm để thay đổi",
  5: "Tuyệt vời — chạm để thay đổi",
};

const TOPICS = [
  { id: "ui", label: "Giao diện" },
  { id: "content", label: "Nội dung bài học" },
  { id: "pronunciation", label: "Phát âm" },
  { id: "notifications", label: "Thông báo" },
  { id: "performance", label: "Tốc độ ứng dụng" },
  { id: "offline", label: "Chế độ offline" },
  { id: "other", label: "Khác" },
];

const MAX_LENGTH = 300;

function StarRating({ value, onChange }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((index) => {
        const filled = index <= value;
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => onChange(index)}
            accessibilityRole="button"
            accessibilityLabel={`Chấm ${index} sao`}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            style={styles.starHit}
          >
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={36}
              color={filled ? "#1D6AE8" : "#C9D0DE"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TopicChip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function FeedbackScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const [rating, setRating] = useState(4);
  const [selectedTopics, setSelectedTopics] = useState(["ui"]);
  const [comment, setComment] = useState("");

  const ratingLabel = useMemo(() => RATING_LABELS[rating] ?? "", [rating]);
  const charCount = comment.length;
  const canSubmit = rating > 0;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("Profile");
  };

  const toggleTopic = (id) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    Alert.alert(
      "Cảm ơn bạn!",
      "Phản hồi của bạn đã được ghi nhận. Chúng tôi sẽ sớm cải thiện ứng dụng.",
      [
        {
          text: "Đóng",
          onPress: () => handleBack(),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
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
          <Text style={[styles.headerTitle, isDark && { color: "#E2E8F0" }]}>Gửi phản hồi</Text>
        </View>

        <ScrollView
          style={[styles.scroll, WEB_SCROLL_STYLE]}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.ratingBlock}>
            <StarRating value={rating} onChange={setRating} />
            <Text style={[styles.ratingLabel, isDark && { color: "#94A3B8" }]}>{ratingLabel}</Text>
          </View>

          <Text style={[styles.sectionTitle, isDark && { color: "#E2E8F0" }]}>Bạn muốn góp ý về điều gì?</Text>
          <View style={styles.chipsWrap}>
            {TOPICS.map((topic) => (
              <TopicChip
                key={topic.id}
                label={topic.label}
                selected={selectedTopics.includes(topic.id)}
                onPress={() => toggleTopic(topic.id)}
              />
            ))}
          </View>

          <Text style={[styles.sectionTitle, styles.sectionTitleSpaced, isDark && { color: "#E2E8F0" }]}>
            Cảm nhận của bạn
          </Text>
          <View style={[styles.textAreaWrap, isDark && { backgroundColor: "#111827", borderColor: "#334155" }]}>
            <TextInput
              value={comment}
              onChangeText={(text) =>
                setComment(text.length > MAX_LENGTH ? text.slice(0, MAX_LENGTH) : text)
              }
              placeholder="Ví dụ: Chữ hơi nhỏ, khó đọc ở ngoài trời..."
              placeholderTextColor={isDark ? "#64748B" : "#A8AEC2"}
              style={[styles.textArea, isDark && { color: "#E2E8F0" }]}
              multiline
              maxLength={MAX_LENGTH}
              textAlignVertical="top"
              accessibilityLabel="Nội dung phản hồi"
            />
            <Text style={[styles.counter, isDark && { color: "#64748B" }]}>
              {charCount} / {MAX_LENGTH}
            </Text>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[
              styles.submitButton,
              isDark && { backgroundColor: "#2563EB" },
              !canSubmit && styles.submitButtonDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Gửi phản hồi"
          >
            <Text style={styles.submitText}>Gửi phản hồi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
    paddingTop: 8,
    paddingBottom: 24,
  },
  ratingBlock: {
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starHit: {
    padding: 2,
  },
  ratingLabel: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#7E89A7",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: "#0F1330",
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  sectionTitleSpaced: {
    marginTop: 18,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#E0E4EE",
    backgroundColor: "#FFFFFF",
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  chipSelected: {
    borderColor: "#1D6AE8",
    backgroundColor: "#FFFFFF",
  },
  chipText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#5A6079",
    textAlign: "center",
  },
  chipTextSelected: {
    color: "#1D6AE8",
    fontWeight: "700",
  },
  textAreaWrap: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E0E4EE",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    minHeight: 150,
  },
  textArea: {
    flex: 1,
    minHeight: 110,
    fontSize: 16,
    lineHeight: 22,
    color: "#16172A",
    fontWeight: "500",
    padding: 0,
  },
  counter: {
    alignSelf: "flex-end",
    fontSize: 12,
    lineHeight: 16,
    color: "#A8AEC2",
    fontWeight: "500",
    marginTop: 6,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  submitButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1D6AE8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1D6AE8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#A8C0EB",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
