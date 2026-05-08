/**
 * One-shot / maintenance: đọc export FLASHCARDS trong mockData.js,
 * thay require(...) bằng tên file (qua stub), ghi flashcards.json.
 */
import fs from "fs";
import vm from "vm";

const mockPath = new URL("../src/data/mockData.js", import.meta.url);
const src = fs.readFileSync(mockPath, "utf8");
const marker = "export const FLASHCARDS = ";
const start = src.indexOf(marker);
if (start === -1) throw new Error("FLASHCARDS marker not found");
let depth = 0;
let i = start + marker.length;
while (i < src.length && /\s/.test(src[i])) i++;
const objStart = i;
if (src[objStart] !== "{") throw new Error("Expected { after FLASHCARDS =");
for (i = objStart; i < src.length; i++) {
  const c = src[i];
  if (c === "{") depth++;
  else if (c === "}") {
    depth--;
    if (depth === 0) {
      const expr = src.slice(objStart, i + 1);
      const sandbox = {
        require: (p) => {
          const m = String(p).match(/flashcardPics\/([^'"]+)$/);
          return m ? m[1] : null;
        },
      };
      const FLASHCARDS = vm.runInNewContext(`(${expr})`, vm.createContext(sandbox));
      const out = new URL("../src/data/flashcards.json", import.meta.url);
      fs.writeFileSync(out, JSON.stringify(FLASHCARDS, null, 2));
      console.log("Wrote flashcards.json, topics:", Object.keys(FLASHCARDS).length);
      process.exit(0);
    }
  }
}
throw new Error("Unbalanced braces");
