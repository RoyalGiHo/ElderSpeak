import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ONBOARDING_DONE_KEY = "onboarding_done";
export const IS_LOGGED_IN_KEY = "is_logged_in";
export const IS_GUEST_KEY = "is_guest";

/** Tên hiển thị thống nhất khi dùng thử không tài khoản (trang chủ, hồ sơ, v.v.) */
export const GUEST_DISPLAY_NAME = "Khách thử nghiệm";

/** Dòng phụ dưới tên trên màn hồ sơ khách */
export const GUEST_PROFILE_DETAIL = "Không lưu tiến độ học tập";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [isGuest, setIsGuest] = useState(false);

  const refreshFromStorage = useCallback(async () => {
    const [logged, guest] = await Promise.all([
      AsyncStorage.getItem(IS_LOGGED_IN_KEY),
      AsyncStorage.getItem(IS_GUEST_KEY),
    ]);
    const isLogged = logged === "true";
    setIsGuest(!isLogged && guest === "true");
  }, []);

  const enterGuestMode = useCallback(async () => {
    await AsyncStorage.setItem(IS_GUEST_KEY, "true");
    await AsyncStorage.removeItem(IS_LOGGED_IN_KEY);
    setIsGuest(true);
  }, []);

  const enterAccountSession = useCallback(async () => {
    await AsyncStorage.removeItem(IS_GUEST_KEY);
    await AsyncStorage.setItem(IS_LOGGED_IN_KEY, "true");
    setIsGuest(false);
  }, []);

  const clearSession = useCallback(async () => {
    await AsyncStorage.multiRemove([IS_GUEST_KEY, IS_LOGGED_IN_KEY]);
    setIsGuest(false);
  }, []);

  const value = useMemo(
    () => ({
      isGuest,
      refreshFromStorage,
      enterGuestMode,
      enterAccountSession,
      clearSession,
    }),
    [
      isGuest,
      refreshFromStorage,
      enterGuestMode,
      enterAccountSession,
      clearSession,
    ]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession phải dùng trong SessionProvider");
  }
  return ctx;
}
