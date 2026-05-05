import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Platform, TouchableOpacity } from "react-native";

// Onboarding
import OnboardingScreen from "./src/screens/Onboarding/OnboardingScreen";

// Auth
import LetLogInScreen from "./src/screens/Auth/LetLogInScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import LoginScreen from "./src/screens/Auth/LoginScreen";
import FillProfileScreen from "./src/screens/Auth/FillProfileScreen";
import OTPScreen from "./src/screens/Auth/OTPScreen";

// Main tabs
import HomeScreen from "./src/screens/Main/HomeScreen";
import FlashCardTopicsScreen from "./src/screens/Flashcard/FlashCardTopicsScreen";
import ProfileScreen from "./src/screens/Main/ProfileScreen";

// Lesson
import ChooseModeScreen from "./src/screens/Lesson/ChooseModeScreen";
import ReadingScreen from "./src/screens/Lesson/ReadingScreen";
import ListeningScreen from "./src/screens/Lesson/ListeningScreen";
import WritingScreen from "./src/screens/Lesson/WritingScreen";
import ResultScreen from "./src/screens/Lesson/ResultScreen";

// Flashcard
import FlashCardScreen from "./src/screens/Flashcard/FlashCardScreen";

// Profile sub
import SettingsScreen from "./src/screens/Main/SettingsScreen";
import HistoryScreen from "./src/screens/Main/HistoryScreen";
import FeedbackScreen from "./src/screens/Main/FeedbackScreen";
import MedalsScreen from "./src/screens/Main/MedalsScreen";

import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ONBOARDING_DONE_KEY = "onboarding_done";
const IS_LOGGED_IN_KEY = "is_logged_in";
const LAST_TAB_KEY = "last_main_tab";

function MainTabs() {
  const tabBarBottomPad = Platform.OS === "ios" ? 22 : 16;
  const tabBarHeight = Platform.OS === "ios" ? 96 : 88;
  const [tabReady, setTabReady] = useState(false);
  const [initialTab, setInitialTab] = useState("Home");

  useEffect(() => {
    const loadLastTab = async () => {
      try {
        const savedTab = await AsyncStorage.getItem(LAST_TAB_KEY);
        if (savedTab === "Home" || savedTab === "Vocabulary" || savedTab === "Profile") {
          setInitialTab(savedTab);
        }
      } finally {
        setTabReady(true);
      }
    };
    loadLastTab();
  }, []);

  if (!tabReady) {
    return null;
  }

  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      detachInactiveScreens={false}
      screenListeners={({ route }) => ({
        tabPress: () => {
          AsyncStorage.setItem(LAST_TAB_KEY, route.name).catch(() => {});
        },
      })}
      screenOptions={({ route }) => ({
        headerShown: false,
        unmountOnBlur: false,
        tabBarActiveTintColor: "#0961F5",
        tabBarInactiveTintColor: "#A0A4AB",
        tabBarStyle: {
          paddingTop: 12,
          paddingBottom: tabBarBottomPad,
          height: tabBarHeight,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          paddingTop: 4,
          paddingBottom: 2,
          minHeight: 56,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            activeOpacity={0.65}
            hitSlop={{ top: 12, bottom: 10, left: 8, right: 8 }}
            style={props.style}
          />
        ),
        tabBarLabel: ({ color, focused }) => {
          const labels = {
            Home: "Trang chủ",
            Vocabulary: "Học từ vựng",
            Profile: "Thông tin",
          };
          return (
            <Text
              allowFontScaling
              maxFontSizeMultiplier={1.35}
              style={{
                color,
                fontSize: 16,
                fontWeight: focused ? "800" : "600",
                letterSpacing: 0.2,
                marginTop: 2,
              }}
            >
              {labels[route.name]}
            </Text>
          );
        },
        tabBarIcon: ({ focused }) => {
          const icons = { Home: "🏠", Vocabulary: "📖", Profile: "👤" };
          return (
            <Text
              allowFontScaling
              maxFontSizeMultiplier={1.2}
              style={{ fontSize: focused ? 34 : 32, lineHeight: 40 }}
            >
              {icons[route.name]}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Vocabulary" component={FlashCardTopicsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Audiowide_400Regular,
    ...Ionicons.font,
    ...Feather.font,
  });
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState("Onboarding");

  useEffect(() => {
    const loadInitialRoute = async () => {
      try {
        const onboardingDone = await AsyncStorage.getItem(ONBOARDING_DONE_KEY);
        const isLoggedIn = await AsyncStorage.getItem(IS_LOGGED_IN_KEY);
        if (isLoggedIn === "true") {
          setInitialRouteName("MainTabs");
        } else if (onboardingDone === "true") {
          setInitialRouteName("LetLogIn");
        } else {
          setInitialRouteName("Onboarding");
        }
      } catch (error) {
        setInitialRouteName("Onboarding");
      } finally {
        setIsBootstrapping(false);
      }
    };
    loadInitialRoute();
  }, []);

  if (!fontsLoaded || isBootstrapping) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={initialRouteName}
        >
          {/* Onboarding */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />

          {/* Auth */}
          <Stack.Screen name="LetLogIn" component={LetLogInScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="FillProfile" component={FillProfileScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />

          {/* Main */}
          <Stack.Screen name="MainTabs" component={MainTabs} />

          {/* Lesson */}
          <Stack.Screen name="ChooseMode" component={ChooseModeScreen} />
          <Stack.Screen name="Reading" component={ReadingScreen} />
          <Stack.Screen name="Listening" component={ListeningScreen} />
          <Stack.Screen name="Writing" component={WritingScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />

          {/* Flashcard */}
          <Stack.Screen name="FlashCard" component={FlashCardScreen} />

          {/* Profile sub */}
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="Medals" component={MedalsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
