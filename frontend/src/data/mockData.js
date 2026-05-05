export const MOCK_USERS = [{ phone: "0123456789", password: "1234" }];

export const USER = {
  name: "Bác A",
  phone: "0123456789",
  memberSince: "tháng 1 / 2025",
  streak: 7,
  totalWords: 42,
  medals: 3,
};

/** Tiến độ bài học hiển thị trên trang chủ (theo bản thiết kế). */
export const HOME_CURRENT_LESSON = {
  title: "Trò chuyện thường ngày",
  subtitle: "Bài 3/8 · Chào hỏi cơ bản",
  current: 3,
  total: 8,
};

/**
 * Thẻ chủ đề trên trang chủ (cuộn ngang). Màu theo Homepage_svg / mockup.
 */
export const HOME_TOPIC_CARDS = [
  {
    id: "home-family",
    label: "GIA ĐÌNH",
    footer: "8 bài · Hoàn thành ✓",
    badge: "Đã xong",
    theme: "purple",
  },
  {
    id: "home-medical",
    label: "KHÁM BỆNH",
    /** Tiêu đề trên màn Chọn chế độ (theo mockup ChooseModePage). */
    chooseModeTopicTitle: "Đi khám bệnh",
    footer: "6 bài · Chưa bắt đầu",
    badge: null,
    theme: "blue",
  },
  {
    id: "home-entry",
    label: "NHẬP CẢNH",
    footer: "5 bài · Chưa bắt đầu",
    badge: "Mới",
    theme: "green",
  },
  {
    id: "home-shopping",
    label: "MUA SẮM",
    footer: "4 bài · Đang học",
    badge: null,
    theme: "amber",
  },
  {
    id: "home-greeting",
    label: "CHÀO HỎI",
    footer: "3 bài · Chưa bắt đầu",
    badge: "Phổ biến",
    theme: "rose",
  },
];

export const TOPICS = [
  { id: "1", name: "Khám bệnh", icon: "🏥", totalWords: 32, done: true },
  { id: "2", name: "Gia đình", icon: "👨‍👩‍👧", totalWords: 24, done: true },
  { id: "3", name: "Mua sắm", icon: "🛒", totalWords: 18, done: false },
  {
    id: "4",
    name: "Nhập cảnh / sân bay",
    icon: "✈️",
    totalWords: 28,
    done: false,
  },
  { id: "5", name: "Chào hỏi cơ bản", icon: "👋", totalWords: 15, done: false },
  {
    id: "6",
    name: "Số đếm và tiền tệ",
    icon: "💰",
    totalWords: 20,
    done: false,
  },
];

export const FLASHCARDS = {
  1: [
    {
      id: "1",
      word: "Doctor",
      phonetic: "/ˈdɒk.tər/",
      meaning: "Bác sĩ",
      example: "The doctor is very kind.",
      exampleVi: "Bác sĩ rất tốt bụng.",
      image: null,
    },
    {
      id: "2",
      word: "Hospital",
      phonetic: "/ˈhɒs.pɪ.təl/",
      meaning: "Bệnh viện",
      example: "I went to the hospital.",
      exampleVi: "Tôi đã đến bệnh viện.",
      image: null,
    },
    {
      id: "3",
      word: "Medicine",
      phonetic: "/ˈmed.ɪ.sɪn/",
      meaning: "Thuốc",
      example: "Take this medicine twice a day.",
      exampleVi: "Uống thuốc này hai lần mỗi ngày.",
      image: null,
    },
    {
      id: "4",
      word: "Fever",
      phonetic: "/ˈfiː.vər/",
      meaning: "Sốt",
      example: "I have a fever.",
      exampleVi: "Tôi bị sốt.",
      image: null,
    },
    {
      id: "5",
      word: "Appointment",
      phonetic: "/əˈpɔɪnt.mənt/",
      meaning: "Cuộc hẹn",
      example: "I have a doctor appointment.",
      exampleVi: "Tôi có cuộc hẹn với bác sĩ.",
      image: null,
    },
  ],
  2: [
    {
      id: "1",
      word: "Family",
      phonetic: "/ˈfæm.ɪ.li/",
      meaning: "Gia đình",
      example: "My family is big.",
      exampleVi: "Gia đình tôi đông người.",
      image: null,
    },
    {
      id: "2",
      word: "Grandfather",
      phonetic: "/ˈɡrænd.fɑː.ðər/",
      meaning: "Ông nội/ngoại",
      example: "My grandfather is 80 years old.",
      exampleVi: "Ông tôi 80 tuổi.",
      image: null,
    },
    {
      id: "3",
      word: "Grandmother",
      phonetic: "/ˈɡrænd.mʌð.ər/",
      meaning: "Bà nội/ngoại",
      example: "My grandmother cooks very well.",
      exampleVi: "Bà tôi nấu ăn rất ngon.",
      image: null,
    },
  ],
};

export const LESSONS = {
  1: [
    {
      id: "1",
      sentence: "I have a stomachache.",
      sentenceVi: "Tôi bị đau bụng.",
      listenOptions: [
        "Tôi bị đau đầu.",
        "Tôi bị đau bụng.",
        "Tôi bị sốt.",
        "Tôi bị ho.",
      ],
      listenAnswer: 1,
      writeWords: [
        "I",
        "have",
        "fever",
        "headache",
        "sick",
        "stomachache",
        "a",
      ],
      writeAnswer: ["I", "have", "a", "stomachache"],
    },
    {
      id: "2",
      sentence: "I need to see a doctor.",
      sentenceVi: "Tôi cần gặp bác sĩ.",
      listenOptions: [
        "Tôi cần mua thuốc.",
        "Tôi cần gặp bác sĩ.",
        "Tôi cần nghỉ ngơi.",
        "Tôi cần đi bệnh viện.",
      ],
      listenAnswer: 1,
      writeWords: ["I", "need", "doctor", "see", "to", "a", "nurse"],
      writeAnswer: ["I", "need", "to", "see", "a", "doctor"],
    },
  ],
};

export const MEDALS = [
  {
    id: "1",
    name: "Gia đình",
    desc: "Hoàn thành chủ đề Gia đình",
    earned: true,
    icon: "🥇",
  },
  {
    id: "2",
    name: "Chào hỏi",
    desc: "Hoàn thành chủ đề Chào hỏi",
    earned: true,
    icon: "🥈",
  },
  {
    id: "3",
    name: "Kiên trì 7 ngày",
    desc: "Học 7 ngày liên tiếp",
    earned: true,
    icon: "🥉",
  },
  {
    id: "4",
    name: "Bác sĩ tí hon",
    desc: "Hoàn thành chủ đề Khám bệnh",
    earned: false,
    icon: "🏅",
  },
  {
    id: "5",
    name: "Nhà du lịch",
    desc: "Hoàn thành chủ đề Nhập cảnh",
    earned: false,
    icon: "🏅",
  },
  {
    id: "6",
    name: "Học viên xuất sắc",
    desc: "Học 30 ngày liên tiếp",
    earned: false,
    icon: "🔥",
  },
];

export const HISTORY = [
  { date: "Hôm nay — 31/03", items: ["Trò chuyện thường ngày"] },
  { date: "Hôm qua — 30/03", items: ["Từ vựng — Gia đình", "Luyện phát âm"] },
  { date: "29/03/2026", items: ["Trò chuyện — Khám bệnh"] },
  { date: "28/03/2026", items: ["Flashcard — Khám bệnh"] },
  { date: "27/03/2026", items: ["Trò chuyện — Gia đình"] },
];
