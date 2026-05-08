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
let activeFlashTopic = "1";

function topicDisplayName(tid) {
  const t = (mockContent?.TOPICS || []).find((x) => String(x.id) === String(tid));
  return t?.name ? `${t.name}` : `Chủ đề ${tid}`;
}

/** Xóa một mã chủ đề khỏi lessons, flashcards và danh sách chủ đề mock. */
function deleteTopicFully(tid) {
  const idStr = String(tid);
  delete lessons[idStr];
  delete flashcards[idStr];
  mockContent.TOPICS = (mockContent.TOPICS || []).filter((t) => String(t.id) !== idStr);

  const lIds = Object.keys(lessons).sort((a, b) => Number(a) - Number(b));
  activeLessonTopic = lIds.length ? lIds[0] : "1";
  const fIds = Object.keys(flashcards).sort((a, b) => Number(a) - Number(b));
  activeFlashTopic = fIds.length ? fIds[0] : "1";

  renderMockForms();
  renderFlashUi();
  renderLessonEditor();
  syncRawEditors();
}

function createNewLessonTopic() {
  const ids = Object.keys(lessons || {})
    .map((k) => Number(k))
    .filter((x) => !Number.isNaN(x));
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
  setStatus("status-lessons", "Đã thêm chủ đề bài học.", true);
}

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
  if (id === "flash" && flashcards) renderFlashUi();
  if (id === "lessons" && lessons) renderLessonEditor();
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
    renderFlashUi();
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
        <h3>Hồ sơ hiển thị</h3>
        <p class="helper-text">Thông tin hiển thị trong màn Cá nhân và phần tiến độ.</p>
        <div class="field-grid">
          <label>Tên hiển thị <input type="text" data-user="name" value="${escapeAttr(u.name)}" /></label>
          <label>Số điện thoại <input type="text" data-user="phone" value="${escapeAttr(u.phone)}" /></label>
          <label>Thành viên từ <input type="text" data-user="memberSince" value="${escapeAttr(u.memberSince)}" placeholder="vd. tháng 1 / 2025" /></label>
          <label>Chuỗi ngày học (streak) <input type="number" data-user="streak" value="${Number(u.streak) || 0}" /></label>
          <label>Tổng từ đã học <input type="number" data-user="totalWords" value="${Number(u.totalWords) || 0}" /></label>
          <label>Số huy chương <input type="number" data-user="medals" value="${Number(u.medals) || 0}" /></label>
        </div>
      </div>
      <div class="mock-card">
        <h3>Bài đang học (khối trên trang chủ)</h3>
        <p class="helper-text">Khớp với một chủ đề trong danh sách bên dưới (mã 1–6).</p>
        <div class="field-grid">
          <label>Mã chủ đề <input type="text" data-hcl="lessonTopicId" value="${escapeAttr(mockContent.HOME_CURRENT_LESSON?.lessonTopicId)}" placeholder="vd. 5" /></label>
          <label>Dòng tiêu đề <input type="text" data-hcl="title" value="${escapeAttr(mockContent.HOME_CURRENT_LESSON?.title)}" /></label>
          <label>Dòng phụ <input type="text" data-hcl="subtitle" value="${escapeAttr(mockContent.HOME_CURRENT_LESSON?.subtitle)}" placeholder="vd. Trò chuyện · Câu 3/14" /></label>
          <label>Câu đang làm (số) <input type="number" data-hcl="current" value="${Number(mockContent.HOME_CURRENT_LESSON?.current) || 0}" /></label>
          <label>Tổng số câu (số) <input type="number" data-hcl="total" value="${Number(mockContent.HOME_CURRENT_LESSON?.total) || 0}" /></label>
        </div>
      </div>
      <div class="mock-card">
        <div class="mock-card-head">
          <h3>Tài khoản thử đăng nhập</h3>
          <button type="button" class="btn btn-danger btn-sm" id="btn-clear-mock-users">Xoá hết</button>
        </div>
        <p class="helper-text">Chỉ dùng trong bản demo — không phải tài khoản thật.</p>
        <table class="row-table"><thead><tr><th>Số điện thoại</th><th>Mật khẩu</th><th></th></tr></thead>
        <tbody id="mock-users-body"></tbody></table>
        <button type="button" class="btn btn-secondary" id="btn-add-mock-user" style="margin-top:0.5rem">+ Thêm dòng</button>
      </div>
      <div class="mock-card">
        <h3>Danh sách chủ đề</h3>
        <p class="helper-text">Mã chủ đề phải khớp flashcard và bài học. Cột &quot;Số từ&quot; có thể đồng bộ từ tab Flashcard.</p>
        <div id="topics-table-wrap"></div>
        <button type="button" class="btn btn-secondary" id="btn-add-topic">+ Thêm chủ đề</button>
      </div>
      <div class="mock-card">
        <div class="mock-card-head">
          <h3>Thẻ cuộn trên trang chủ</h3>
          <button type="button" class="btn btn-danger btn-sm" id="btn-clear-all-home-cards">Xoá hết</button>
        </div>
        <p class="helper-text">Các thẻ chủ đề hiển thị ngang trên trang chủ.</p>
        <div id="home-cards-wrap"></div>
        <button type="button" class="btn btn-secondary" id="btn-add-home-card">+ Thêm thẻ</button>
      </div>
      <div class="mock-card">
        <div class="mock-card-head">
          <h3>Huy chương</h3>
          <button type="button" class="btn btn-danger btn-sm" id="btn-clear-all-medals">Xoá hết</button>
        </div>
        <div id="medals-wrap"></div>
        <button type="button" class="btn btn-secondary" id="btn-add-medal">+ Thêm huy chương</button>
      </div>
      <div class="mock-card">
        <div class="mock-card-head">
          <h3>Lịch sử hoạt động</h3>
          <button type="button" class="btn btn-danger btn-sm" id="btn-clear-all-history">Xoá hết</button>
        </div>
        <p class="helper-text">Mỗi khối là một ngày; trong ô lớn ghi từng hoạt động, mỗi dòng một mục.</p>
        <div id="history-wrap"></div>
        <button type="button" class="btn btn-secondary" id="btn-add-history">+ Thêm ngày</button>
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

  document.getElementById("btn-clear-mock-users")?.addEventListener("click", () => {
    if (!confirm("Xoá hết các tài khoản thử đăng nhập?")) return;
    mockContent.MOCK_USERS = [];
    fillMockUsers();
    syncRawEditors();
  });

  document.getElementById("btn-clear-all-home-cards")?.addEventListener("click", () => {
    if (!confirm("Xoá hết thẻ trên trang chủ?")) return;
    mockContent.HOME_TOPIC_CARDS = [];
    fillHomeCards();
    syncRawEditors();
  });

  document.getElementById("btn-clear-all-medals")?.addEventListener("click", () => {
    if (!confirm("Xoá hết huy chương?")) return;
    mockContent.MEDALS = [];
    fillMedals();
    syncRawEditors();
  });

  document.getElementById("btn-clear-all-history")?.addEventListener("click", () => {
    if (!confirm("Xoá hết lịch sử hoạt động?")) return;
    mockContent.HISTORY = [];
    fillHistory();
    syncRawEditors();
  });

  document.getElementById("btn-add-mock-user")?.addEventListener("click", () => {
    mockContent.MOCK_USERS = mockContent.MOCK_USERS || [];
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
    mockContent.HOME_TOPIC_CARDS = mockContent.HOME_TOPIC_CARDS || [];
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
    mockContent.MEDALS = mockContent.MEDALS || [];
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
    mockContent.HISTORY = mockContent.HISTORY || [];
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
      <td><button type="button" class="btn btn-danger btn-sm btn-remove-mu" data-mu="${i}">Xoá</button></td>
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
  body.querySelectorAll(".btn-remove-mu").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-mu"));
      mockContent.MOCK_USERS.splice(i, 1);
      fillMockUsers();
      syncRawEditors();
    });
  });
}

function fillTopicsTable() {
  const wrap = document.getElementById("topics-table-wrap");
  if (!wrap) return;
  wrap.innerHTML = `<table class="row-table"><thead><tr>
    <th>Mã</th><th>Tên chủ đề</th><th>Biểu tượng</th><th>Số từ</th><th>Đã học xong</th><th></th>
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
        <label>Mã thẻ <input type="text" data-hi="${i}" data-f="id" value="${escapeAttr(c.id)}" /></label>
        <label>Gắn chủ đề (mã) <input type="text" data-hi="${i}" data-f="lessonTopicId" value="${escapeAttr(c.lessonTopicId)}" /></label>
        <label>Chữ trên thẻ <input type="text" data-hi="${i}" data-f="label" value="${escapeAttr(c.label)}" /></label>
        <label>Dòng chữ nhỏ <input type="text" data-hi="${i}" data-f="footer" value="${escapeAttr(c.footer)}" /></label>
        <label>Nhãn góc (để trống = không có) <input type="text" data-hi="${i}" data-f="badge" value="${c.badge == null ? "" : escapeAttr(c.badge)}" placeholder="vd. Mới" /></label>
        <label>Màu giao diện <input type="text" data-hi="${i}" data-f="theme" value="${escapeAttr(c.theme)}" placeholder="vd. blue, purple" /></label>
        <label>Tiêu đề khi chọn chế độ (tuỳ chọn) <input type="text" data-hi="${i}" data-f="chooseModeTopicTitle" value="${escapeAttr(c.chooseModeTopicTitle || "")}" /></label>
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
      <label>Mã <input type="text" data-mi="${i}" data-f="id" value="${escapeAttr(m.id)}" /></label>
      <label>Tên <input type="text" data-mi="${i}" data-f="name" value="${escapeAttr(m.name)}" /></label>
      <label>Mô tả <input type="text" data-mi="${i}" data-f="desc" value="${escapeAttr(m.desc)}" /></label>
      <label>Emoji / icon <input type="text" data-mi="${i}" data-f="icon" value="${escapeAttr(m.icon)}" /></label>
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

function flashCardRowHtml(c, idx) {
  const imgVal = c.image == null || c.image === "" ? "" : escapeAttr(String(c.image));
  return `
    <div class="flash-card-panel" data-row-idx="${idx}">
      <div class="flash-card-panel-head">
        <span class="flash-card-id">Thẻ số ${escapeAttr(c.id)}</span>
        <button type="button" class="btn btn-danger btn-sm btn-remove-flash-word" data-idx="${idx}">Xoá thẻ</button>
      </div>
      <div class="flash-fields">
        <label>Từ (tiếng Anh) <input type="text" data-fc="${idx}" data-k="word" value="${escapeAttr(c.word)}" /></label>
        <label>Phiên âm <input type="text" data-fc="${idx}" data-k="phonetic" value="${escapeAttr(c.phonetic || "")}" /></label>
        <label>Nghĩa (tiếng Việt) <input type="text" data-fc="${idx}" data-k="meaning" value="${escapeAttr(c.meaning || "")}" /></label>
        <label class="flash-fields-wide">Ví dụ tiếng Anh <textarea data-fc="${idx}" data-k="example" rows="2">${escapeAttr(c.example || "")}</textarea></label>
        <label class="flash-fields-wide">Bản dịch ví dụ <textarea data-fc="${idx}" data-k="exampleVi" rows="2">${escapeAttr(c.exampleVi || "")}</textarea></label>
        <label>Ảnh (tên file, có thể để trống) <input type="text" data-fc="${idx}" data-k="image" value="${imgVal}" placeholder="vd. doctor.jpg" /></label>
      </div>
    </div>`;
}

function patchFlashField(el) {
  if (!el.hasAttribute("data-fc")) return;
  const idx = Number(el.getAttribute("data-fc"));
  const k = el.getAttribute("data-k");
  const row = flashcards[activeFlashTopic]?.[idx];
  if (!row) return;
  let v = el.value;
  if (k === "image") {
    const t = v.trim();
    row.image = t === "" ? null : t;
  } else {
    row[k] = v;
  }
  syncRawEditors();
}

function createNewFlashTopic() {
  const ids = Object.keys(flashcards)
    .map((k) => Number(k))
    .filter((x) => !Number.isNaN(x));
  const next = String(Math.max(0, ...ids, 0) + 1);
  flashcards[next] = [];
  mockContent.TOPICS = mockContent.TOPICS || [];
  mockContent.TOPICS.push({
    id: next,
    name: "Chủ đề mới",
    icon: "📌",
    totalWords: 0,
    done: false,
  });
  activeFlashTopic = next;
  renderMockForms();
  renderFlashUi();
  syncRawEditors();
  setStatus("status-flash", "Đã thêm chủ đề — đặt tên trong tab Nội dung mock nếu cần.", true);
}

function renderFlashUi() {
  const host = document.getElementById("flash-ui");
  if (!host || !flashcards) return;

  const topicIds = Object.keys(flashcards).sort((a, b) => Number(a) - Number(b));
  if (topicIds.length === 0) {
    host.innerHTML = `
      <div class="toolbar flash-toolbar">
        <button type="button" class="btn btn-secondary" id="btn-flash-new-topic-empty">+ Chủ đề mới</button>
      </div>
      <p class="helper-text">Chưa có nhóm flashcard. Nhấn nút trên để tạo chủ đề đầu tiên.</p>`;
    document.getElementById("btn-flash-new-topic-empty")?.addEventListener("click", () =>
      createNewFlashTopic()
    );
    return;
  }
  if (!topicIds.includes(activeFlashTopic)) {
    activeFlashTopic = topicIds[0];
  }

  const cards = flashcards[activeFlashTopic] || [];
  const topicLabel = topicDisplayName(activeFlashTopic);

  host.innerHTML = `
    <div class="flash-layout">
      <nav class="flash-sidebar" aria-label="Chọn chủ đề">
        ${topicIds
          .map((tid) => {
            const n = (flashcards[tid] || []).length;
            const name = topicDisplayName(tid);
            const active = tid === activeFlashTopic ? "active" : "";
            return `<button type="button" class="flash-topic-btn ${active}" data-flash-nav="${tid}">
              <span class="flash-topic-title">${escapeAttr(name)}</span>
              <span class="flash-topic-meta">${n} từ · mã ${tid}</span>
            </button>`;
          })
          .join("")}
      </nav>
      <div class="flash-main">
        <div class="flash-main-head">
          <h3 class="flash-heading">${escapeAttr(topicLabel)}</h3>
          <p class="flash-count"><strong>${cards.length}</strong> từ trong chủ đề này</p>
        </div>
        <div class="toolbar flash-toolbar">
          <button type="button" class="btn btn-primary" id="btn-flash-add-word">+ Thêm từ</button>
          <button type="button" class="btn btn-secondary" id="btn-flash-new-topic">+ Chủ đề mới</button>
          <button type="button" class="btn btn-secondary" id="btn-flash-sync-counts">Đồng bộ &quot;số từ&quot; vào danh sách chủ đề</button>
          <button type="button" class="btn btn-danger" id="btn-flash-clear-topic">Xoá hết từ trong chủ đề này</button>
          <button type="button" class="btn btn-danger" id="btn-flash-delete-topic">Xóa luôn chủ đề này</button>
        </div>
        <p class="helper-text flash-hint">Ảnh: chỉ điền <strong>tên file</strong> (vd. doctor.jpg). File phải có sẵn trong app; ảnh hoàn toàn mới cần nhờ kỹ thuật cập nhật thêm.</p>
        <div id="flash-card-rows"></div>
      </div>
    </div>`;

  const rowsHost = document.getElementById("flash-card-rows");
  rowsHost.innerHTML = cards.map((c, idx) => flashCardRowHtml(c, idx)).join("");

  host.querySelectorAll("[data-flash-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFlashTopic = btn.getAttribute("data-flash-nav");
      renderFlashUi();
      syncRawEditors();
    });
  });

  rowsHost.querySelectorAll("[data-fc]").forEach((el) => {
    el.addEventListener("change", () => patchFlashField(el));
    el.addEventListener("blur", () => patchFlashField(el));
  });

  rowsHost.querySelectorAll(".btn-remove-flash-word").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-idx"));
      flashcards[activeFlashTopic].splice(idx, 1);
      renderFlashUi();
      syncRawEditors();
    });
  });

  document.getElementById("btn-flash-add-word")?.addEventListener("click", () => {
    const list = flashcards[activeFlashTopic];
    const ids = list.map((x) => Number(x.id)).filter((x) => !Number.isNaN(x));
    const nextId = String(Math.max(0, ...ids, 0) + 1);
    list.push({
      id: nextId,
      word: "",
      phonetic: "",
      meaning: "",
      example: "",
      exampleVi: "",
      image: null,
    });
    renderFlashUi();
    syncRawEditors();
  });

  document.getElementById("btn-flash-new-topic")?.addEventListener("click", () => createNewFlashTopic());

  document.getElementById("btn-flash-clear-topic")?.addEventListener("click", () => {
    const n = (flashcards[activeFlashTopic] || []).length;
    if (!confirm(`Xoá hết ${n} từ trong "${topicLabel}"?`)) return;
    flashcards[activeFlashTopic] = [];
    renderFlashUi();
    syncRawEditors();
  });

  document.getElementById("btn-flash-delete-topic")?.addEventListener("click", () => {
    const tid = activeFlashTopic;
    const label = topicDisplayName(tid);
    const nCard = (flashcards[tid] || []).length;
    const nLesson = Array.isArray(lessons[tid])
      ? lessons[tid].reduce((s, u) => s + (u.sentences?.length || 0), 0)
      : 0;
    if (
      !confirm(
        `Xóa hẳn chủ đề « ${label} » (mã ${tid})?\n\n` +
          `• Flashcard: ${nCard} thẻ.\n` +
          `• Bài học: ${nLesson} câu (toàn bộ phần).\n` +
          `• Xóa dòng chủ đề trong tab Nội dung mock.\n` +
          `Thẻ trang chủ có thể vẫn trỏ mã ${tid} — chỉnh tay nếu cần.`
      )
    ) {
      return;
    }
    deleteTopicFully(tid);
    setStatus("status-flash", "Đã xóa chủ đề (flashcard + bài học + mock).", true);
  });

  document.getElementById("btn-flash-sync-counts")?.addEventListener("click", () => {
    mockContent.TOPICS = mockContent.TOPICS || [];
    mockContent.TOPICS.forEach((t) => {
      const tid = String(t.id);
      t.totalWords = (flashcards[tid] || []).length;
    });
    renderMockForms();
    renderFlashUi();
    syncRawEditors();
    setStatus(
      "status-flash",
      "Đã cập nhật cột « Số từ » trong tab Nội dung mock → Danh sách chủ đề.",
      true
    );
  });
}

function renderLessonEditor() {
  const chips = document.getElementById("lesson-topic-chips");
  const detail = document.getElementById("lesson-detail");
  if (!chips || !detail || !lessons) return;

  const topicIds = Object.keys(lessons).sort((a, b) => Number(a) - Number(b));

  if (topicIds.length === 0) {
    chips.innerHTML = "";
    detail.innerHTML = `
      <div class="toolbar flash-toolbar">
        <button type="button" class="btn btn-secondary" id="btn-lesson-new-topic-empty">+ Chủ đề mới</button>
      </div>
      <p class="helper-text">Chưa có chủ đề bài học. Nhấn nút trên để tạo chủ đề đầu tiên.</p>`;
    document.getElementById("btn-lesson-new-topic-empty")?.addEventListener("click", () =>
      createNewLessonTopic()
    );
    return;
  }

  if (!topicIds.includes(activeLessonTopic)) {
    activeLessonTopic = topicIds[0];
  }

  chips.innerHTML = topicIds
    .map(
      (tid) =>
        `<button type="button" class="chip ${tid === activeLessonTopic ? "active" : ""}" data-tid="${tid}">${escapeAttr(topicDisplayName(tid))} <span style="opacity:0.8;font-size:0.85em">#${escapeAttr(tid)}</span></button>`
    )
    .join("");

  chips.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeLessonTopic = btn.getAttribute("data-tid");
      renderLessonEditor();
    });
  });

  const units = lessons[activeLessonTopic] || [];
  const topicLabel = topicDisplayName(activeLessonTopic);
  const unitCount = units.length;
  const sentenceCount = units.reduce((n, u) => n + (u.sentences?.length ?? 0), 0);
  const nCard = (flashcards?.[activeLessonTopic] || []).length;

  detail.innerHTML = `
    <div class="lesson-topic-toolbar mock-card" style="margin-bottom:1rem;padding:0.85rem 1rem">
      <p style="margin:0 0 0.5rem;font-size:0.9rem"><strong>${escapeAttr(topicLabel)}</strong> · ${unitCount} phần · ${sentenceCount} câu · ${nCard} flashcard</p>
      <div class="toolbar" style="margin:0">
        <button type="button" class="btn btn-danger" id="btn-lesson-delete-topic">Xóa luôn chủ đề này</button>
      </div>
      <p class="helper-text" style="margin:0.5rem 0 0">Xóa sẽ gỡ toàn bộ <strong>bài học</strong>, <strong>flashcard</strong> cùng mã và <strong>dòng chủ đề</strong> trong tab Nội dung mock.</p>
    </div>
    ${units
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
    .join("")}`;

  document.getElementById("btn-lesson-delete-topic")?.addEventListener("click", () => {
    const tid = activeLessonTopic;
    const label = topicDisplayName(tid);
    const nCard = (flashcards[tid] || []).length;
    const nLesson = Array.isArray(lessons[tid])
      ? lessons[tid].reduce((s, u) => s + (u.sentences?.length || 0), 0)
      : 0;
    if (
      !confirm(
        `Xóa hẳn chủ đề « ${label} » (mã ${tid})?\n\n` +
          `• Bài học: ${nLesson} câu (toàn bộ phần).\n` +
          `• Flashcard: ${nCard} thẻ.\n` +
          `• Xóa dòng chủ đề trong tab Nội dung mock.\n` +
          `Thẻ trang chủ có thể vẫn trỏ mã ${tid} — chỉnh tay nếu cần.`
      )
    ) {
      return;
    }
    deleteTopicFully(tid);
    setStatus("status-lessons", "Đã xóa chủ đề (bài học + flashcard + mock).", true);
  });

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
      renderFlashUi();
      setStatus("status-mock", "Đã áp dụng (trên bộ nhớ). Nhấn Lưu để ghi vào file.", true);
    } catch (e) {
      setStatus("status-mock", `JSON không hợp lệ: ${e.message}`, false);
    }
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
      renderFlashUi();
      setStatus("status-lessons", "Đã áp dụng JSON.", true);
    } catch (e) {
      setStatus("status-lessons", e.message, false);
    }
  });

  document.getElementById("btn-add-lesson-topic")?.addEventListener("click", () => createNewLessonTopic());

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
      renderFlashUi();
      renderLessonEditor();
      setStatus("status-flash", "Đã áp dụng JSON.", true);
    } catch (e) {
      setStatus("status-flash", e.message, false);
    }
  });

  init();
});
