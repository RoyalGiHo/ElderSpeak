import fs from "fs";

const p = "src/data/mockData.js";
let s = fs.readFileSync(p, "utf8");

if (s.includes("lessonsRegistry")) {
  console.log("Already migrated");
  process.exit(0);
}

const inject = `export {
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

`;

const start = s.indexOf("export const LESSONS = ");
const end = s.indexOf("\nexport const MEDALS");
if (start === -1 || end === -1) {
  console.error("markers not found", start, end);
  process.exit(1);
}

s = inject + s.slice(0, start) + s.slice(end);
fs.writeFileSync(p, s);
console.log("mockData.js LESSONS migrated");
