import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "topic_progress_v1";

const KIND_FLASHCARD = "flashcard";
const KIND_LESSON = "lesson";
const VALID_KINDS = new Set([KIND_FLASHCARD, KIND_LESSON]);

const TopicProgressContext = createContext(null);

const emptyState = () => ({ [KIND_FLASHCARD]: {}, [KIND_LESSON]: {} });

/**
 * Migrate dữ liệu cũ (chỉ có 1 bảng phẳng = flashcard) sang shape mới
 * { flashcard: {...}, lesson: {...} }.
 */
function normalize(raw) {
  if (!raw || typeof raw !== "object") return emptyState();
  const hasNamespaces =
    KIND_FLASHCARD in raw || KIND_LESSON in raw;
  if (hasNamespaces) {
    return {
      [KIND_FLASHCARD]:
        raw[KIND_FLASHCARD] && typeof raw[KIND_FLASHCARD] === "object"
          ? raw[KIND_FLASHCARD]
          : {},
      [KIND_LESSON]:
        raw[KIND_LESSON] && typeof raw[KIND_LESSON] === "object"
          ? raw[KIND_LESSON]
          : {},
    };
  }
  // Bảng phẳng cũ → giả định là flashcard.
  return { [KIND_FLASHCARD]: raw, [KIND_LESSON]: {} };
}

/**
 * Lưu trữ trạng thái học tập (FE-only, dùng AsyncStorage như một mini DB).
 *
 * Cấu trúc:
 *   {
 *     flashcard: { [topicId]: { completed, completedAt, lastSession? } },
 *     lesson:    { [topicId]: { completed, completedAt, lastSession? } },
 *   }
 *
 * `kind` mặc định là "flashcard" để giữ tương thích với code cũ.
 */
export function TopicProgressProvider({ children }) {
  const [progress, setProgress] = useState(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (raw) {
          try {
            setProgress(normalize(JSON.parse(raw)));
          } catch {
            // bỏ qua dữ liệu lỗi
          }
        }
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next) => {
    setProgress(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore — vẫn giữ state trong memory
    }
  }, []);

  const getKind = (kind) => (VALID_KINDS.has(kind) ? kind : KIND_FLASHCARD);

  const markTopicCompleted = useCallback(
    (topicId, summary, kind = KIND_FLASHCARD) => {
      const k = getKind(kind);
      const key = String(topicId);
      const slice = progress[k] ?? {};
      const next = {
        ...progress,
        [k]: {
          ...slice,
          [key]: {
            ...(slice[key] ?? {}),
            completed: true,
            completedAt: Date.now(),
            ...(summary ? { lastSession: summary } : {}),
          },
        },
      };
      persist(next);
    },
    [progress, persist]
  );

  const markTopicsCompleted = useCallback(
    (topicIds, summary, kind = KIND_FLASHCARD) => {
      if (!Array.isArray(topicIds) || topicIds.length === 0) return;
      const k = getKind(kind);
      const now = Date.now();
      const slice = { ...(progress[k] ?? {}) };
      for (const id of topicIds) {
        const key = String(id);
        slice[key] = {
          ...(slice[key] ?? {}),
          completed: true,
          completedAt: now,
          ...(summary ? { lastSession: summary } : {}),
        };
      }
      persist({ ...progress, [k]: slice });
    },
    [progress, persist]
  );

  const resetTopic = useCallback(
    (topicId, kind = KIND_FLASHCARD) => {
      const k = getKind(kind);
      const key = String(topicId);
      const slice = progress[k] ?? {};
      if (!(key in slice)) return;
      const nextSlice = { ...slice };
      delete nextSlice[key];
      persist({ ...progress, [k]: nextSlice });
    },
    [progress, persist]
  );

  const resetAll = useCallback(
    (kind) => {
      if (kind && VALID_KINDS.has(kind)) {
        persist({ ...progress, [kind]: {} });
      } else {
        persist(emptyState());
      }
    },
    [progress, persist]
  );

  const isCompleted = useCallback(
    (topicId, kind = KIND_FLASHCARD) => {
      const k = getKind(kind);
      return Boolean(progress[k]?.[String(topicId)]?.completed);
    },
    [progress]
  );

  const value = useMemo(
    () => ({
      progress,
      hydrated,
      isCompleted,
      markTopicCompleted,
      markTopicsCompleted,
      resetTopic,
      resetAll,
    }),
    [
      progress,
      hydrated,
      isCompleted,
      markTopicCompleted,
      markTopicsCompleted,
      resetTopic,
      resetAll,
    ]
  );

  return (
    <TopicProgressContext.Provider value={value}>
      {children}
    </TopicProgressContext.Provider>
  );
}

export function useTopicProgress() {
  const ctx = useContext(TopicProgressContext);
  if (!ctx) {
    throw new Error(
      "useTopicProgress phải dùng trong TopicProgressProvider"
    );
  }
  return ctx;
}

export const TOPIC_KIND = {
  FLASHCARD: KIND_FLASHCARD,
  LESSON: KIND_LESSON,
};
