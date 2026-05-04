import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#3D5CFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { paddingBottom: 8, height: 60 },
        tabBarLabel: ({ color }) => {
          const labels = {
            Home: "Trang chủ",
            Vocabulary: "Học từ vựng",
            Profile: "Thông tin",
          };
          return (
            <Text style={{ color, fontSize: 11 }}>{labels[route.name]}</Text>
          );
        },
        tabBarIcon: ({ color }) => {
          const icons = { Home: "🏠", Vocabulary: "📖", Profile: "👤" };
          return <Text style={{ fontSize: 22 }}>{icons[route.name]}</Text>;
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
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Onboarding"
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
  );
}
