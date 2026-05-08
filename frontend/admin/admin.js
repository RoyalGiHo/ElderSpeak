/**
 * ElderSpeak — panel chỉnh JSON (mockContent, lessons, flashcards).
 * Chạy: npm run admin → mở URL trong console.
 */

const PATHS = {
  mock: "src/data/mockContent.json",
  lessons: "src/data/lessons.json",
  flashcards: "src/data/flashcards.json",
};

let mockContent = null;
let lessons = null;
let flashcards = null;

let activeLessonTopic = "1";

async function fetchJson(path) {
  const r = await fetch(`/${path}?t=${Date.now()}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function saveJson(relativePath, data) {
  const r = await fetch("/api/save-json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ relativePath, data }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.ok) throw new Error(j.error || r.statusText);
  return j;
}

function setStatus(elId, msg, ok) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.className = `status ${ok ? "ok" : "err"}`;
  el.classList.remove("hidden");
}

function downloadBlob(filename, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function showPanel(id) {
  document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById(`panel-${id}`)?.classList.add("active");
  document.querySelector(`[data-panel="${id}"]`)?.classList.add("active");
}

async function init() {
  try {
    [mockContent, lessons, flashcards] = await Promise.all([
      fetchJson(PATHS.mock),
      fetchJson(PATHS.lessons),
      fetchJson(PATHS.flashcards),
    ]);
    renderMockForms();
    renderLessonEditor();
    syncRawEditors();
    setStatus("status-global", "Đã tải dữ liệu.", true);
  } catch (e) {
    setStatus("status-global", `Lỗi tải: ${e.message}`, false);
  }
}

function syncRawEditors() {
  const taMock = document.getElementById("raw-mock");
  const taLessons = document.getElementById("raw-lessons");
  const taFlash = document.getElementById("raw-flash");
  if (taMock) taMock.value = JSON.stringify(mockContent, null, 2);
  if (taLessons) taLessons.value = JSON.stringify(lessons, null, 2);
  if (taFlash) taFlash.value = JSON.stringify(flashcards, null, 2);
}

function renderMockForms() {
  const root = document.getElementById("mock-forms");
  if (!root || !mockContent) return;

  const u = mockContent.USER || {};
  root.innerHTML = `
    <div class="mock-sections">
      <div class="mock-card">
        <h3>Người dùng (USER)</h3>
        <div class="field-grid">
          <label>Tên <input type="text" data-user="name" value="${escapeAttr(u.name)}" /></label>
          <label>Số điện thoại <input type="text" data-user="phone" value="${escapeAttr(u.phone)}" /></label>
          <label>Thành viên từ <input type="text" data-user="memberSince" value="${escapeAttr(u.memberSince)}" /></label>
          <label>Streak <input type="number" data-user="streak" value="${Number(u.streak) || 0}" /></label>
          <label>Tổng từ <input type="number" data-user="totalWords" value="${Number(u.totalWords) || 0}" /></label>
          <label>Huy chương <input type="number" data-user="medals" value="${Number(u.medals) || 0}" /></label>
        </div>
      </div>
      <div class="mock-card">
        <h3>Bài hiện tại trang chủ</h3>
        <div class="field-grid">
          <label>lessonTopicId <input type="text" data-hcl="lessonTopicId" value="${escapeAttr(mockContent.HOME_CURRENT_LESSON?.lessonTopicId)}" /></label>
          <label>Tiêu đề <input type="text" data-hcl="title" value="${escapeAttr(mockContent.HOME_CURRENT_LESSON?.title)}" /></label>
          <label>Phụ đề <input type="text" data-hcl="subtitle" value="${escapeAttr(mockContent.HOME_CURRENT_LESSON?.subtitle)}" /></label>
          <label>current <input type="number" data-hcl="current" value="${Number(mockContent.HOME_CURRENT_LESSON?.current) || 0}" /></label>
          <label>total <input type="number" data-hcl="total" value="${Number(mockContent.HOME_CURRENT_LESSON?.total) || 0}" /></label>
        </div>
      </div>
      <div class="mock-card">
        <h3>Đăng nhập thử (MOCK_USERS)</h3>
        <table class="row-table"><thead><tr><th>SĐT</th><th>Mật khẩu</th></tr></thead>
        <tbody id="mock-users-body"></tbody></table>
        <button type="button" class="btn btn-secondary" id="btn-add-mock-user">+ Thêm dòng</button>
      </div>
      <div class="mock-card">
        <h3>Chủ đề (TOPICS)</h3>
        <div id="topics-table-wrap"></div>
        <button type="button" class="btn btn-secondary" id="btn-add-topic">+ Chủ đề</button>
      </div>
      <div class="mock-card">
        <h3>Thẻ trang chủ (HOME_TOPIC_CARDS)</h3>
        <div id="home-cards-wrap"></div>
        <button type="button" class="btn btn-secondary" id="btn-add-home-card">+ Thẻ</button>
      </div>
      <div class="mock-card">
        <h3>Huy chương (MEDALS)</h3>
        <div id="medals-wrap"></div>
        <button type="button" class="btn btn-secondary" id="btn-add-medal">+ Huy chương</button>
      </div>
      <div class="mock-card">
        <h3>Lịch sử (HISTORY)</h3>
        <div id="history-wrap"></div>
        <button type="button" class="btn btn-secondary" id="btn-add-history">+ Mục ngày</button>
      </div>
    </div>`;

  fillMockUsers();
  fillTopicsTable();
  fillHomeCards();
  fillMedals();
  fillHistory();

  root.querySelectorAll("[data-user]").forEach((inp) => {
    inp.addEventListener("change", () => {
      const k = inp.getAttribute("data-user");
      mockContent.USER = mockContent.USER || {};
      mockContent.USER[k] =
        inp.type === "number" ? Number(inp.value) || 0 : inp.value;
      syncRawEditors();
    });
  });
  root.querySelectorAll("[data-hcl]").forEach((inp) => {
    inp.addEventListener("change", () => {
      const k = inp.getAttribute("data-hcl");
      mockContent.HOME_CURRENT_LESSON = mockContent.HOME_CURRENT_LESSON || {};
      const v =
        inp.type === "number" ? Number(inp.value) || 0 : inp.value;
      mockContent.HOME_CURRENT_LESSON[k] = v;
      syncRawEditors();
    });
  });

  document.getElementById("btn-add-mock-user")?.addEventListener("click", () => {
    mockContent.MOCK_USERS.push({ phone: "", password: "" });
    fillMockUsers();
    syncRawEditors();
  });
  document.getElementById("btn-add-topic")?.addEventListener("click", () => {
    mockContent.TOPICS = mockContent.TOPICS || [];
    const tops = mockContent.TOPICS;
    const id = String(Math.max(0, ...tops.map((t) => Number(t.id) || 0)) + 1);
    mockContent.TOPICS.push({
      id,
      name: "Chủ đề mới",
      icon: "📌",
      totalWords: 0,
      done: false,
    });
    fillTopicsTable();
    syncRawEditors();
  });
  document.getElementById("btn-add-home-card")?.addEventListener("click", () => {
    mockContent.HOME_TOPIC_CARDS.push({
      id: `home-${Date.now()}`,
      lessonTopicId: "1",
      label: "MỚI",
      footer: "",
      badge: null,
      theme: "blue",
    });
    fillHomeCards();
    syncRawEditors();
  });
  document.getElementById("btn-add-medal")?.addEventListener("click", () => {
    const id = String(
      Math.max(0, ...mockContent.MEDALS.map((m) => Number(m.id) || 0)) + 1
    );
    mockContent.MEDALS.push({
      id,
      name: "",
      desc: "",
      earned: false,
      icon: "🏅",
    });
    fillMedals();
    syncRawEditors();
  });
  document.getElementById("btn-add-history")?.addEventListener("click", () => {
    mockContent.HISTORY.push({ date: "", items: [""] });
    fillHistory();
    syncRawEditors();
  });
}

function escapeAttr(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function fillMockUsers() {
  const body = document.getElementById("mock-users-body");
  if (!body) return;
  body.innerHTML = (mockContent.MOCK_USERS || [])
    .map(
      (row, i) => `
    <tr>
      <td><input type="text" value="${escapeAttr(row.phone)}" data-mu="${i}" data-f="phone" /></td>
      <td><input type="text" value="${escapeAttr(row.password)}" data-mu="${i}" data-f="password" /></td>
    </tr>`
    )
    .join("");
  body.querySelectorAll("input[data-mu]").forEach((inp) => {
    inp.addEventListener("change", () => {
      const i = Number(inp.getAttribute("data-mu"));
      const f = inp.getAttribute("data-f");
      mockContent.MOCK_USERS[i][f] = inp.value;
      syncRawEditors();
    });
  });
}

function fillTopicsTable() {
  const wrap = document.getElementById("topics-table-wrap");
  if (!wrap) return;
  wrap.innerHTML = `<table class="row-table"><thead><tr>
    <th>id</th><th>Tên</th><th>Icon</th><th>Từ</th><th>Xong</th><th></th>
  </tr></thead><tbody id="topics-body"></tbody></table>`;
  const body = document.getElementById("topics-body");
  body.innerHTML = (mockContent.TOPICS || [])
    .map(
      (t, i) => `
    <tr>
      <td><input type="text" data-ti="${i}" data-f="id" value="${escapeAttr(t.id)}" /></td>
      <td><input type="text" data-ti="${i}" data-f="name" value="${escapeAttr(t.name)}" /></td>
      <td><input type="text" data-ti="${i}" data-f="icon" value="${escapeAttr(t.icon)}" /></td>
      <td><input type="number" data-ti="${i}" data-f="totalWords" value="${Number(t.totalWords) || 0}" /></td>
      <td><input type="checkbox" data-ti="${i}" data-f="done" ${t.done ? "checked" : ""} /></td>
      <td><button type="button" class="btn btn-danger btn-remove-topic" data-ti="${i}">Xoá</button></td>
    </tr>`
    )
    .join("");

  body.querySelectorAll('input[data-ti]:not([type="checkbox"])').forEach((inp) => {
    inp.addEventListener("change", () => {
      const i = Number(inp.getAttribute("data-ti"));
      const f = inp.getAttribute("data-f");
      let v = inp.value;
      if (f === "totalWords") v = Number(v) || 0;
      mockContent.TOPICS[i][f] = v;
      syncRawEditors();
    });
  });
  body.querySelectorAll('input[data-ti][type="checkbox"]').forEach((inp) => {
    inp.addEventListener("change", () => {
      const i = Number(inp.getAttribute("data-ti"));
      mockContent.TOPICS[i].done = inp.checked;
      syncRawEditors();
    });
  });
  body.querySelectorAll(".btn-remove-topic").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-ti"));
      mockContent.TOPICS.splice(i, 1);
      fillTopicsTable();
      syncRawEditors();
    });
  });
}

function fillHomeCards() {
  const wrap = document.getElementById("home-cards-wrap");
  if (!wrap) return;
  wrap.innerHTML = (mockContent.HOME_TOPIC_CARDS || [])
    .map(
      (c, i) => `
    <div class="mock-card" style="margin-bottom:0.5rem;padding:0.75rem">
      <div class="field-grid">
        <label>id <input type="text" data-hi="${i}" data-f="id" value="${escapeAttr(c.id)}" /></label>
        <label>lessonTopicId <input type="text" data-hi="${i}" data-f="lessonTopicId" value="${escapeAttr(c.lessonTopicId)}" /></label>
        <label>label <input type="text" data-hi="${i}" data-f="label" value="${escapeAttr(c.label)}" /></label>
        <label>footer <input type="text" data-hi="${i}" data-f="footer" value="${escapeAttr(c.footer)}" /></label>
        <label>badge <input type="text" data-hi="${i}" data-f="badge" value="${c.badge == null ? "" : escapeAttr(c.badge)}" placeholder="null" /></label>
        <label>theme <input type="text" data-hi="${i}" data-f="theme" value="${escapeAttr(c.theme)}" /></label>
        <label>chooseModeTopicTitle <input type="text" data-hi="${i}" data-f="chooseModeTopicTitle" value="${escapeAttr(c.chooseModeTopicTitle || "")}" /></label>
      </div>
      <button type="button" class="btn btn-danger btn-remove-home" data-hi="${i}" style="margin-top:0.5rem">Xoá thẻ</button>
    </div>`
    )
    .join("");

  wrap.querySelectorAll("input[data-hi]").forEach((inp) => {
    inp.addEventListener("change", () => {
      const i = Number(inp.getAttribute("data-hi"));
      const f = inp.getAttribute("data-f");
      let v = inp.value;
      if (f === "badge" && v.trim() === "") v = null;
      mockContent.HOME_TOPIC_CARDS[i][f] = v;
      syncRawEditors();
    });
  });
  wrap.querySelectorAll(".btn-remove-home").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-hi"));
      mockContent.HOME_TOPIC_CARDS.splice(i, 1);
      fillHomeCards();
      syncRawEditors();
    });
  });
}

function fillMedals() {
  const wrap = document.getElementById("medals-wrap");
  if (!wrap) return;
  wrap.innerHTML = (mockContent.MEDALS || [])
    .map(
      (m, i) => `
    <div class="field-grid" style="margin-bottom:0.75rem;padding:0.5rem;border:1px solid var(--border);border-radius:8px">
      <label>id <input type="text" data-mi="${i}" data-f="id" value="${escapeAttr(m.id)}" /></label>
      <label>Tên <input type="text" data-mi="${i}" data-f="name" value="${escapeAttr(m.name)}" /></label>
      <label>Mô tả <input type="text" data-mi="${i}" data-f="desc" value="${escapeAttr(m.desc)}" /></label>
      <label>icon <input type="text" data-mi="${i}" data-f="icon" value="${escapeAttr(m.icon)}" /></label>
      <label style="flex-direction:row;align-items:center;gap:0.5rem"><input type="checkbox" data-mi="${i}" data-f="earned" ${m.earned ? "checked" : ""} /> Đã đạt</label>
      <button type="button" class="btn btn-danger btn-remove-medal" data-mi="${i}">Xoá</button>
    </div>`
    )
    .join("");

  wrap.querySelectorAll("input[data-mi]").forEach((inp) => {
    inp.addEventListener("change", () => {
      const i = Number(inp.getAttribute("data-mi"));
      const f = inp.getAttribute("data-f");
      if (inp.type === "checkbox") {
        mockContent.MEDALS[i][f] = inp.checked;
      } else {
        mockContent.MEDALS[i][f] = inp.value;
      }
      syncRawEditors();
    });
  });
  wrap.querySelectorAll(".btn-remove-medal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-mi"));
      mockContent.MEDALS.splice(i, 1);
      fillMedals();
      syncRawEditors();
    });
  });
}

function fillHistory() {
  const wrap = document.getElementById("history-wrap");
  if (!wrap) return;
  wrap.innerHTML = (mockContent.HISTORY || [])
    .map(
      (h, hi) => `
    <div class="mock-card" style="margin-bottom:0.5rem">
      <label>Ngày / nhãn <input type="text" data-hist="${hi}" data-part="date" value="${escapeAttr(h.date)}" style="width:100%;max-width:400px" /></label>
      <p style="font-size:0.75rem;color:var(--muted);margin:0.5rem 0">Mục (mỗi dòng một hoạt động)</p>
      <textarea data-hist="${hi}" data-part="items" rows="3" style="width:100%;font-family:inherit">${(h.items || []).join("\n")}</textarea>
      <button type="button" class="btn btn-danger btn-remove-hist" data-hist="${hi}" style="margin-top:0.5rem">Xoá ngày này</button>
    </div>`
    )
    .join("");

  wrap.querySelectorAll("[data-hist]").forEach((el) => {
    el.addEventListener("change", () => {
      const hi = Number(el.getAttribute("data-hist"));
      const part = el.getAttribute("data-part");
      if (part === "date") mockContent.HISTORY[hi].date = el.value;
      else if (part === "items") {
        mockContent.HISTORY[hi].items = el.value
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      syncRawEditors();
    });
  });
  wrap.querySelectorAll(".btn-remove-hist").forEach((btn) => {
    btn.addEventListener("click", () => {
      const hi = Number(btn.getAttribute("data-hist"));
      mockContent.HISTORY.splice(hi, 1);
      fillHistory();
      syncRawEditors();
    });
  });
}

function renderLessonEditor() {
  const chips = document.getElementById("lesson-topic-chips");
  const detail = document.getElementById("lesson-detail");
  if (!chips || !detail || !lessons) return;

  const topicIds = Object.keys(lessons).sort((a, b) => Number(a) - Number(b));
  chips.innerHTML = topicIds
    .map(
      (tid) =>
        `<button type="button" class="chip ${tid === activeLessonTopic ? "active" : ""}" data-tid="${tid}">Chủ đề ${tid}</button>`
    )
    .join("");

  chips.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeLessonTopic = btn.getAttribute("data-tid");
      renderLessonEditor();
    });
  });

  const units = lessons[activeLessonTopic] || [];
  detail.innerHTML = units
    .map((unit, ui) => {
      const sentences = unit.sentences || [];
      return `
      <div class="unit-block">
        <h4>Phần ${ui + 1} — id: <input type="text" value="${escapeAttr(unit.id)}" data-lu="${ui}" data-lf="id" style="width:180px;font-weight:600" /></h4>
        <label style="font-size:0.75rem;color:var(--muted)">Tiêu đề phần</label>
        <input type="text" value="${escapeAttr(unit.title)}" data-lu="${ui}" data-lf="title" style="width:100%;max-width:560px;margin-bottom:0.75rem" />
        ${sentences
          .map(
            (sent, si) => `
          <details class="sentence-row" ${si < 2 ? "open" : ""}>
            <summary>Câu ${si + 1} · ${escapeAttr(sent.id)}</summary>
            <div class="sentence-fields">
              <div><label>id</label><input type="text" data-lu="${ui}" data-si="${si}" data-sf="id" value="${escapeAttr(sent.id)}" /></div>
              <div><label>Câu EN</label><textarea data-lu="${ui}" data-si="${si}" data-sf="sentence" rows="2">${escapeAttr(sent.sentence)}</textarea></div>
              <div><label>Dịch VI</label><textarea data-lu="${ui}" data-si="${si}" data-sf="sentenceVi" rows="2">${escapeAttr(sent.sentenceVi)}</textarea></div>
              <div><label>Phiên âm</label><input data-lu="${ui}" data-si="${si}" data-sf="phonetic" value="${escapeAttr(sent.phonetic || "")}" /></div>
              <div><label>listenAnswer (index)</label><input type="number" data-lu="${ui}" data-si="${si}" data-sf="listenAnswer" value="${Number(sent.listenAnswer) || 0}" /></div>
              <div><label>listenOptions (mỗi dòng một lựa chọn)</label><textarea data-lu="${ui}" data-si="${si}" data-sf="listenOptions" rows="4">${(sent.listenOptions || []).join("\n")}</textarea></div>
              <div><label>writeAnswer (từ, cách nhau bằng dấu phẩy hoặc xuống dòng)</label><textarea data-lu="${ui}" data-si="${si}" data-sf="writeAnswer" rows="2">${(sent.writeAnswer || []).join(", ")}</textarea></div>
              <div><label>writeWords (tuỳ chọn; để trống sẽ gộp từ đáp án + nhiễu)</label><textarea data-lu="${ui}" data-si="${si}" data-sf="writeWords" rows="2">${(sent.writeWords || []).join(", ")}</textarea></div>
              <button type="button" class="btn btn-danger btn-remove-sentence" data-lu="${ui}" data-si="${si}">Xoá câu</button>
            </div>
          </details>`
          )
          .join("")}
        <button type="button" class="btn btn-secondary btn-add-sentence" data-lu="${ui}">+ Thêm câu vào phần này</button>
        <button type="button" class="btn btn-danger btn-remove-unit" data-lu="${ui}" style="margin-left:0.5rem">Xoá cả phần</button>
      </div>`;
    })
    .join("");

  detail.querySelectorAll("input[data-lu][data-lf], textarea[data-lu][data-lf]").forEach((el) => {
    el.addEventListener("change", () => {
      const ui = Number(el.getAttribute("data-lu"));
      const f = el.getAttribute("data-lf");
      lessons[activeLessonTopic][ui][f] = el.value;
      syncRawEditors();
    });
  });

  detail.querySelectorAll("input[data-lu][data-si][data-sf], textarea[data-lu][data-si][data-sf]").forEach((el) => {
    el.addEventListener("change", () => {
      const ui = Number(el.getAttribute("data-lu"));
      const si = Number(el.getAttribute("data-si"));
      const f = el.getAttribute("data-sf");
      const sent = lessons[activeLessonTopic][ui].sentences[si];
      let v = el.value;
      if (f === "listenAnswer") sent[f] = Number(v) || 0;
      else if (f === "listenOptions") {
        sent[f] = v.split("\n").map((s) => s.trim()).filter(Boolean);
      } else if (f === "writeAnswer") {
        const parts = v.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
        sent.writeAnswer = parts;
      } else if (f === "writeWords") {
        const parts = v.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
        if (parts.length) sent.writeWords = parts;
      } else {
        sent[f] = v;
      }
      syncRawEditors();
    });
  });

  detail.querySelectorAll(".btn-remove-sentence").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ui = Number(btn.getAttribute("data-lu"));
      const si = Number(btn.getAttribute("data-si"));
      lessons[activeLessonTopic][ui].sentences.splice(si, 1);
      renderLessonEditor();
      syncRawEditors();
    });
  });

  detail.querySelectorAll(".btn-add-sentence").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ui = Number(btn.getAttribute("data-lu"));
      const list = lessons[activeLessonTopic][ui].sentences;
      const nid = `${activeLessonTopic}-${list.length + 1}`;
      list.push({
        id: nid,
        sentence: "",
        sentenceVi: "",
        phonetic: "",
        listenOptions: ["", "", "", ""],
        listenAnswer: 0,
        writeWords: [],
        writeAnswer: [],
      });
      renderLessonEditor();
      syncRawEditors();
    });
  });

  detail.querySelectorAll(".btn-remove-unit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ui = Number(btn.getAttribute("data-lu"));
      if (!confirm("Xoá hết phần học này?")) return;
      lessons[activeLessonTopic].splice(ui, 1);
      renderLessonEditor();
      syncRawEditors();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => showPanel(btn.getAttribute("data-panel")));
  });

  document.getElementById("btn-reload")?.addEventListener("click", () => init());

  document.getElementById("btn-save-mock")?.addEventListener("click", async () => {
    try {
      await saveJson(PATHS.mock, mockContent);
      setStatus("status-mock", "Đã lưu mockContent.json", true);
    } catch (e) {
      setStatus("status-mock", e.message, false);
    }
  });

  document.getElementById("btn-download-mock")?.addEventListener("click", () => {
    downloadBlob("mockContent.json", JSON.stringify(mockContent, null, 2));
  });

  document.getElementById("btn-apply-raw-mock")?.addEventListener("click", () => {
    try {
      mockContent = JSON.parse(document.getElementById("raw-mock").value);
      renderMockForms();
      setStatus("status-mock", "Đã áp dụng JSON (RAM). Nhấn Lưu để ghi đĩa.", true);
    } catch (e) {
      setStatus("status-mock", `JSON không hợp lệ: ${e.message}`, false);
    }
  });

  document.getElementById("btn-clear-history")?.addEventListener("click", () => {
    mockContent.HISTORY = [];
    fillHistory();
    syncRawEditors();
  });

  document.getElementById("btn-save-lessons")?.addEventListener("click", async () => {
    try {
      await saveJson(PATHS.lessons, lessons);
      setStatus("status-lessons", "Đã lưu lessons.json", true);
    } catch (e) {
      setStatus("status-lessons", e.message, false);
    }
  });

  document.getElementById("btn-download-lessons")?.addEventListener("click", () => {
    downloadBlob("lessons.json", JSON.stringify(lessons, null, 2));
  });

  document.getElementById("btn-apply-raw-lessons")?.addEventListener("click", () => {
    try {
      lessons = JSON.parse(document.getElementById("raw-lessons").value);
      renderLessonEditor();
      setStatus("status-lessons", "Đã áp dụng JSON.", true);
    } catch (e) {
      setStatus("status-lessons", e.message, false);
    }
  });

  document.getElementById("btn-add-lesson-topic")?.addEventListener("click", () => {
    const ids = Object.keys(lessons).map(Number).filter(Boolean);
    const next = String(Math.max(0, ...ids, 0) + 1);
    lessons[next] = [
      {
        id: `t${next}-u1`,
        title: "Phần mới",
        sentences: [],
      },
    ];
    activeLessonTopic = next;
    renderLessonEditor();
    syncRawEditors();
  });

  document.getElementById("btn-save-flash")?.addEventListener("click", async () => {
    try {
      await saveJson(PATHS.flashcards, flashcards);
      setStatus("status-flash", "Đã lưu flashcards.json", true);
    } catch (e) {
      setStatus("status-flash", e.message, false);
    }
  });

  document.getElementById("btn-download-flash")?.addEventListener("click", () => {
    downloadBlob("flashcards.json", JSON.stringify(flashcards, null, 2));
  });

  document.getElementById("btn-apply-raw-flash")?.addEventListener("click", () => {
    try {
      flashcards = JSON.parse(document.getElementById("raw-flash").value);
      setStatus("status-flash", "Đã áp dụng JSON.", true);
    } catch (e) {
      setStatus("status-flash", e.message, false);
    }
  });

  init();
});
