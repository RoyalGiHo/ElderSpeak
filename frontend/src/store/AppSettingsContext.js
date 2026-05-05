import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const APP_SETTINGS_KEY = "app_settings_v1";
const FONT_SIZE_VALUES = new Set(["A-", "A", "A+"]);
const DEFAULT_SETTINGS = {
  fontSize: "A",
  useSystemTheme: true,
  darkMode: false,
  dailyReminder: true,
  reminderTime: "08:00",
  soundFx: true,
  voiceAccent: "us",
};

const AppSettingsContext = createContext({
  isReady: false,
  settings: DEFAULT_SETTINGS,
  setFontSize: () => {},
  setUseSystemTheme: () => {},
  setDarkMode: () => {},
  setDailyReminder: () => {},
  setReminderTime: () => {},
  setSoundFx: () => {},
  setVoiceAccent: () => {},
});

export function AppSettingsProvider({ children }) {
  const systemScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(APP_SETTINGS_KEY);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        // Ignore malformed settings and continue with defaults.
      } finally {
        setIsReady(true);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings)).catch(() => {});
  }, [isReady, settings]);

  useEffect(() => {
    if (!isReady || !settings.useSystemTheme) return;
    const systemDark = systemScheme === "dark";
    setSettings((prev) => (prev.darkMode === systemDark ? prev : { ...prev, darkMode: systemDark }));
  }, [isReady, settings.useSystemTheme, systemScheme]);

  const value = useMemo(
    () => ({
      isReady,
      settings,
      setFontSize: (fontSize) => {
        if (!FONT_SIZE_VALUES.has(fontSize)) return;
        setSettings((prev) => ({ ...prev, fontSize }));
      },
      setUseSystemTheme: (useSystemTheme) => {
        setSettings((prev) => ({ ...prev, useSystemTheme: Boolean(useSystemTheme) }));
      },
      setDarkMode: (darkMode) => {
        setSettings((prev) => ({ ...prev, darkMode: Boolean(darkMode) }));
      },
      setDailyReminder: (dailyReminder) => {
        setSettings((prev) => ({ ...prev, dailyReminder: Boolean(dailyReminder) }));
      },
      setReminderTime: (reminderTime) => {
        if (typeof reminderTime !== "string") return;
        setSettings((prev) => ({ ...prev, reminderTime }));
      },
      setSoundFx: (soundFx) => {
        setSettings((prev) => ({ ...prev, soundFx: Boolean(soundFx) }));
      },
      setVoiceAccent: (voiceAccent) => {
        if (voiceAccent !== "us" && voiceAccent !== "uk") return;
        setSettings((prev) => ({ ...prev, voiceAccent }));
      },
    }),
    [isReady, settings]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  return useContext(AppSettingsContext);
}

