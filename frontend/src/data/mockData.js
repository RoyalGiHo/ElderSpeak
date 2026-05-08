import mockContent from "./mockContent.json";
import flashcardsRaw from "./flashcards.json";
import { FLASHCARD_ASSET_BY_FILE } from "./flashcardAssets";

export {
  LESSONS,
  getLessonUnits,
  countLessonUnits,
  countSentencesInUnit,
  countTotalSentencesInTopic,
  getSentenceExercise,
  getOffsetBeforeUnit,
  getGlobalSentenceStep,
  advanceLessonPosition,
  lessonTopicSummaryLine,
} from "./lessonsRegistry";

export const MOCK_USERS = mockContent.MOCK_USERS;
export const USER = mockContent.USER;
export const HOME_CURRENT_LESSON = mockContent.HOME_CURRENT_LESSON;
export const HOME_TOPIC_CARDS = mockContent.HOME_TOPIC_CARDS;
export const TOPICS = mockContent.TOPICS;
export const MEDALS = mockContent.MEDALS;
export const HISTORY = mockContent.HISTORY;

function hydrateFlashcards(raw) {
  const out = {};
  for (const [topicId, cards] of Object.entries(raw)) {
    out[topicId] = (cards ?? []).map((c) => {
      const file = c.image;
      const asset =
        typeof file === "string" && file.length > 0
          ? FLASHCARD_ASSET_BY_FILE[file] ?? null
          : null;
      return { ...c, image: asset };
    });
  }
  return out;
}

export const FLASHCARDS = hydrateFlashcards(flashcardsRaw);
