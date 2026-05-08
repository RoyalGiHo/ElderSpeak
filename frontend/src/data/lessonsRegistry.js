/**
 * Dữ liệu bài học (LESSONS) lấy từ lessons.json — chỉnh trong admin hoặc sửa file JSON.
 */

import LESSONS_JSON from "./lessons.json";

export const LESSONS = LESSONS_JSON;

export function getLessonUnits(topicId) {
  const tid = topicId != null ? String(topicId) : "1";
  return LESSONS[tid] ?? LESSONS["1"] ?? [];
}

export function countLessonUnits(topicId) {
  return getLessonUnits(topicId).length;
}

export function countSentencesInUnit(topicId, lessonIndex) {
  const units = getLessonUnits(topicId);
  return units[lessonIndex]?.sentences?.length ?? 0;
}

export function countTotalSentencesInTopic(topicId) {
  return getLessonUnits(topicId).reduce(
    (n, u) => n + (u.sentences?.length ?? 0),
    0
  );
}

export function getSentenceExercise(topicId, lessonIndex, sentenceIndex) {
  return getLessonUnits(topicId)?.[lessonIndex]?.sentences?.[sentenceIndex] ?? null;
}

export function getOffsetBeforeUnit(topicId, lessonIndex) {
  const units = getLessonUnits(topicId);
  let off = 0;
  const cap = Math.min(lessonIndex, units.length);
  for (let i = 0; i < cap; i++) off += units[i].sentences?.length ?? 0;
  return off;
}

/** Bước hiện tại (1…T) trong cả chủ đề */
export function getGlobalSentenceStep(topicId, lessonIndex, sentenceIndex) {
  return getOffsetBeforeUnit(topicId, lessonIndex) + sentenceIndex + 1;
}

/**
 * Sang câu kế trong chủ đề. Trả về { lessonIndex, sentenceIndex }
 * hoặc { done: true } nếu vừa hoàn thành câu cuối.
 */
export function advanceLessonPosition(topicId, lessonIndex, sentenceIndex) {
  const units = getLessonUnits(topicId);
  const inUnit =
    lessonIndex >= 0 && lessonIndex < units.length
      ? units[lessonIndex].sentences?.length ?? 0
      : 0;
  if (sentenceIndex + 1 < inUnit) {
    return { lessonIndex, sentenceIndex: sentenceIndex + 1, topicComplete: false };
  }
  if (lessonIndex + 1 < units.length) {
    return {
      lessonIndex: lessonIndex + 1,
      sentenceIndex: 0,
      topicComplete: false,
    };
  }
  return {
    lessonIndex,
    sentenceIndex,
    topicComplete: true,
  };
}

/** Chuỗi meta cho footer / ChooseMode — ví dụ: "2 phần · 15 câu" */
export function lessonTopicSummaryLine(topicId) {
  const u = countLessonUnits(topicId);
  const s = countTotalSentencesInTopic(topicId);
  if (!u || !s) return "Sắp có dữ liệu";
  return `${u} phần · ${s} câu`;
}
