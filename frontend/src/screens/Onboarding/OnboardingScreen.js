import React, { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import Text from "../../components/AppText";
import { useAppSettings } from "../../store/AppSettingsContext";
import { THEME } from "../../data/themePalette";
import { playSfx } from "../../utils/soundEffects";
import Onboarding1Svg from "../../design/onboarding1.svg";
import Onboarding2Svg from "../../design/onboarding2.svg";
import Onboarding3Svg from "../../design/onboarding3.svg";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: Onboarding1Svg,
    title: "Nói chuyện với cháu",
    titleHighlight: "Tự tin hơn mỗi ngày",
    description:
      "Học tiếng Anh qua các tình huống quen thuộc, từng bước một — không cần vội.",
  },
  {
    id: "2",
    image: Onboarding2Svg,
    title: "Học lúc nào cũng được",
    titleHighlight: "Không cần mạng",
    description:
      "Tải bài về máy, học ở nhà hay đi khám bệnh đều được — không lo hết dữ liệu",
  },
  {
    id: "3",
    image: Onboarding3Svg,
    title: "Ghi nhận",
    titleHighlight: "Từng bước tiến của bạn",
    description:
      "Mỗi bài hoàn thành là một nhánh cây lớn thêm — không áp lực, không so sánh",
  },
];

export default function OnboardingScreen({ navigation }) {
  const { settings } = useAppSettings();
  const isDark = settings.darkMode;
  const palette = isDark ? THEME.dark : THEME.light;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const ONBOARDING_DONE_KEY = "onboarding_done";

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_DONE_KEY, "true");
    } catch (error) {
      // Keep navigation flow even if persistence fails on this device.
    } finally {
      navigation.replace("LetLogIn");
    }
  };

  const handleNext = () => {
    playSfx("tap", settings.soundFx);
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleSkip = () => {
    playSfx("tap", settings.soundFx);
    finishOnboarding();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderSlide = ({ item }) => {
    const SlideSvg = item.image;

    return (
      <View style={styles.slide}>
        <View style={styles.imagePlaceholder}>
          <SlideSvg width="100%" height="100%" />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, isDark && { color: palette.text }]}>{item.title}</Text>
          <Text style={styles.titleHighlight}>{item.titleHighlight}</Text>
          <Text style={[styles.description, isDark && { color: palette.textMuted }]}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: palette.page }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Nút bỏ qua */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, isDark && { color: "#E2E8F0" }]}>Bỏ qua</Text>
        </TouchableOpacity>
      )}

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEnabled={true}
      />

      {/* Footer: dots + nút */}
      <View style={styles.footer}>
        {/* Dot indicators */}
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* Nút tiếp theo / bắt đầu */}
        {isLastSlide ? (
          <TouchableOpacity style={styles.startButton} onPress={handleNext}>
            <Text style={styles.startButtonText}>Bắt đầu</Text>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  skipButton: {
    position: "absolute",
    top: 56,
    right: 24,
    zIndex: 10,
    backgroundColor: "#3D5CFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skipText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  slide: {
    width,
    flex: 1,
    paddingTop: 60,
  },
  imagePlaceholder: {
    marginHorizontal: 24,
    height: 400,
    width: width - 48,
    borderRadius: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  textContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  titleHighlight: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3D5CFF",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D0D0",
  },
  dotActive: {
    width: 24,
    backgroundColor: "#3D5CFF",
  },
  nextButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#3D5CFF",
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3D5CFF",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  arrowText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
