/**
 * Mock bài học theo chủ đề:
 * LESSONS[topicId] là mảng các PHẦN (unit), mỗi phần có 6–10 câu (sentence exercises).
 */

function phFromSentence(sentence) {
  return sentence
    .toLowerCase()
    .replace(/[^a-z\s']/gi, " ")
    .split(/\s+/)
    .filter(Boolean)
    .join(" · ");
}

/**
 * distractions: thêm từ nhiễu cho word bank viết (không bao trùm đáp án).
 */
export function exercise(
  id,
  sentence,
  sentenceVi,
  listenOptions,
  listenAnswerIdx,
  writeAnswerWords,
  extraBankWords,
  phoneticOverride
) {
  const ans = [...writeAnswerWords];
  const pool = new Set(ans.map(String));
  extraBankWords.forEach((w) => pool.add(String(w)));
  return {
    id: String(id),
    sentence,
    sentenceVi,
    phonetic: phoneticOverride ?? phFromSentence(sentence),
    listenOptions,
    listenAnswer: listenAnswerIdx,
    writeWords: [...pool],
    writeAnswer: ans,
  };
}

function unit(id, title, sentences) {
  return { id, title, sentences };
}

/** —— Topic 1: Khám bệnh —— */
const T1U1 = [
  exercise(
    "1-1",
    "I have a stomachache.",
    "Tôi bị đau bụng.",
    ["Tôi bị đau đầu.", "Tôi bị đau bụng.", "Tôi bị sốt.", "Tôi bị ho."],
    1,
    ["I", "have", "a", "stomachache"],
    ["headache", "fever", "sick", "cold"],
    "ay · hæv · ə · ˈstʌm.ək.eɪk"
  ),
  exercise(
    "1-2",
    "I need to see a doctor.",
    "Tôi cần gặp bác sĩ.",
    ["Tôi cần mua thuốc.", "Tôi cần gặp bác sĩ.", "Tôi cần nghỉ ngơi.", "Tôi cần đi bệnh viện."],
    1,
    ["I", "need", "to", "see", "a", "doctor"],
    ["nurse", "phone", "rest", "medicine"],
    "ay · niːd · tuː · siː · ə · ˈdɒk.tər"
  ),
  exercise(
    "1-3",
    "I have a fever.",
    "Tôi bị sốt.",
    ["Tôi bị ho.", "Tôi bị sốt.", "Tôi bị cảm lạnh.", "Tôi bị đau họng."],
    1,
    ["I", "have", "a", "fever"],
    ["cold", "cough", "headache"],
    "ay · hæv · ə · ˈfiː.vər"
  ),
  exercise(
    "1-4",
    "Where is the pharmacy?",
    "Hiệu thuốc ở đâu?",
    ["Bệnh viện ở đâu?", "Hiệu thuốc ở đâu?", "Bác sĩ ở đâu?", "Phòng khám ở đâu?"],
    1,
    ["Where", "is", "the", "pharmacy"],
    ["hospital", "doctor", "gate", "nurse"],
    "wer · ɪz · ðə · ˈfɑːr.mə.si"
  ),
  exercise(
    "1-5",
    "Please take this medicine.",
    "Vui lòng uống thuốc này.",
    ["Vui lòng nghỉ ngơi.", "Vui lòng uống nước.", "Vui lòng uống thuốc này.", "Vui lòng đi khám."],
    2,
    ["Please", "take", "this", "medicine"],
    ["drink", "water", "rest", "eat"],
    "pliːz · teɪk · ðɪs · ˈmed.ɪ.sɪn"
  ),
  exercise(
    "1-6",
    "Call an ambulance, please.",
    "Vui lòng gọi xe cứu thương.",
    ["Vui lòng gọi taxi.", "Vui lòng gọi y tá.", "Vui lòng gọi bác sĩ.", "Vui lòng gọi xe cứu thương."],
    3,
    ["Call", "an", "ambulance", "please"],
    ["doctor", "taxi", "help", "nurse"],
    "kɔːl · ən · ˈæm.bjə.ləns · pliːz"
  ),
  exercise(
    "1-7",
    "How long have you felt this pain?",
    "Anh/Chị đau như vậy bao lâu rồi?",
    ["Đau ở đâu?", "Anh/Chị đau như vậy bao lâu rồi?", "Đã uống thuốc chưa?", "Có bị khó thở không?"],
    1,
    ["How", "long", "have", "you", "felt", "this", "pain"],
    ["many", "days", "I", "headache"],
    null
  ),
  exercise(
    "1-8",
    "I feel dizzy.",
    "Tôi chóng mặt.",
    ["Tôi táo bón.", "Tôi chóng mặt.", "Tôi không ngủ được.", "Tôi không muốn ăn."],
    1,
    ["I", "feel", "dizzy"],
    ["sick", "tired", "cold", "hot"],
    null
  ),
];

const T1U2 = [
  exercise(
    "2-1",
    "Could you repeat that slowly?",
    "Bạn có thể nhắc lại chậm hơn được không?",
    ["Bạn nói quá nhỏ.", "Bạn có thể nhắc lại chậm hơn được không?", "Hôm nay đóng cửa à?", "Tôi không hiểu."],
    1,
    ["Could", "you", "repeat", "that", "slowly"],
    ["say", "again", "fast", "loud"],
    null
  ),
  exercise(
    "2-2",
    "Take one pill before meals.",
    "Uống một viên trước bữa ăn.",
    ["Uống sau bữa ăn.", "Uống một viên trước bữa ăn.", "Uống lúc nửa đêm.", "Uống với đường."],
    1,
    ["Take", "one", "pill", "before", "meals"],
    ["after", "water", "twice", "day"],
    null
  ),
  exercise(
    "2-3",
    "I am allergic to penicillin.",
    "Tôi bị dị ứng penicillin.",
    ["Tôi dị ứng sữa.", "Tôi bị dị ứng penicillin.", "Tôi không dị ứng gì.", "Tôi dị ứng hạt điều."],
    1,
    ["I", "am", "allergic", "to", "penicillin"],
    ["fish", "milk", "nuts", "sugar"],
    null
  ),
  exercise(
    "2-4",
    "When is my next appointment?",
    "Cuộc hẹn tiếp theo của tôi là khi nào?",
    ["Tôi cần trả tiền khi nào?", "Cuộc hẹn tiếp theo của tôi là khi nào?", "Tôi ở lại đây bao lâu?", "Làm sao để về nhà?"],
    1,
    ["When", "is", "my", "next", "appointment"],
    ["today", "doctor", "pharmacy", "home"],
    null
  ),
  exercise(
    "2-5",
    "The nurse will measure your blood pressure.",
    "Y tá sẽ đo huyết áp cho ông.",
    ["Bác sĩ sẽ xét nghiệm máu.", "Y tá sẽ đo huyết áp cho ông.", "Bạn cần nằm lại một giờ.", "Chúng ta sẽ phẫu thuật."],
    1,
    ["The", "nurse", "will", "measure", "your", "blood", "pressure"],
    ["doctor", "take", "pill", "fever"],
    null
  ),
  exercise(
    "2-6",
    "Do I need surgery?",
    "Tôi có cần mổ không?",
    ["Tôi có cần nhập viện không?", "Tôi có cần mổ không?", "Thuốc này bao lâu mới có tác dụng?", "Có được về không?"],
    1,
    ["Do", "I", "need", "surgery"],
    ["medicine", "rest", "hospital", "help"],
    null
  ),
  exercise(
    "2-7",
    "Do you have insurance?",
    "Bạn có bảo hiểm không?",
    ["Bạn có tiền mặt không?", "Bạn có bảo hiểm không?", "Tôi cần hộ chiếu.", "Bạn có vé không?"],
    1,
    ["Do", "you", "have", "insurance"],
    ["cash", "card", "ticket", "phone"],
    null
  ),
];

/** —— Topic 2: Gia đình —— */
const T2U1 = [
  exercise(
    "1-1",
    "This is my family.",
    "Đây là gia đình tôi.",
    ["Đây là nhà tôi.", "Đây là gia đình tôi.", "Đây là bạn tôi.", "Đây là họ hàng tôi."],
    1,
    ["This", "is", "my", "family"],
    ["house", "your", "friend", "man"],
    "ðɪs · ɪz · maɪ · ˈfæm.ɪ.li"
  ),
  exercise(
    "1-2",
    "My father is a teacher.",
    "Bố tôi là giáo viên.",
    ["Bố tôi là bác sĩ.", "Mẹ tôi là giáo viên.", "Bố tôi là giáo viên.", "Anh tôi là giáo viên."],
    2,
    ["My", "father", "is", "a", "teacher"],
    ["mother", "doctor", "nurse", "farmer"],
    "maɪ · ˈfɑː.ðər · ɪz · ə · ˈtiː.tʃər"
  ),
  exercise(
    "1-3",
    "I love my grandmother.",
    "Tôi yêu bà của tôi.",
    ["Tôi yêu mẹ của tôi.", "Tôi yêu bà của tôi.", "Tôi yêu ông của tôi.", "Tôi yêu chị của tôi."],
    1,
    ["I", "love", "my", "grandmother"],
    ["grandfather", "mother", "sister", "brother"],
    "aɪ · lʌv · maɪ · ˈɡrænd.mʌð.ər"
  ),
  exercise(
    "1-4",
    "I have two sons.",
    "Tôi có hai đứa con trai.",
    ["Tôi có hai con gái.", "Tôi có một con trai.", "Tôi có hai đứa con trai.", "Tôi có hai cháu trai."],
    2,
    ["I", "have", "two", "sons"],
    ["one", "daughters", "daughter", "child"],
    "aɪ · hæv · tuː · sʌnz"
  ),
  exercise(
    "1-5",
    "We live together.",
    "Chúng tôi sống cùng nhau.",
    ["Chúng tôi đi cùng nhau.", "Chúng tôi ăn cùng nhau.", "Chúng tôi sống cùng nhau.", "Chúng tôi học cùng nhau."],
    2,
    ["We", "live", "together"],
    ["eat", "study", "work", "travel"],
    "wiː · lɪv · təˈɡeð.ər"
  ),
  exercise(
    "1-6",
    "Happy birthday to you.",
    "Chúc mừng sinh nhật bạn.",
    ["Chúc mừng sinh nhật bạn.", "Chúc bạn một ngày tốt lành.", "Chúc mừng năm mới.", "Chúc bạn vui vẻ."],
    0,
    ["Happy", "birthday", "to", "you"],
    ["new", "year", "day", "home"],
    "ˈhæp.i · ˈbɜːrθ.deɪ · tə · juː"
  ),
  exercise(
    "1-7",
    "My daughter is getting married next month.",
    "Con gái tôi sẽ cưới vào tháng tới.",
    ["Con trai tôi đi du học.", "Con gái tôi sẽ cưới vào tháng tới.", "Con tôi vừa sinh cháu.", "Cháu tôi đi học."],
    1,
    ["My", "daughter", "is", "getting", "married", "next", "month"],
    ["year", "son", "wife", "home"],
    null
  ),
];

const T2U2 = [
  exercise(
    "2-1",
    "Come over for dinner on Sunday.",
    "Chủ nhật qua nhà chúng tôi ăn cơm nhé.",
    ["Chủ nhật họp mặt ở công ty.", "Chủ nhật qua nhà chúng tôi ăn cơm nhé.", "Thứ bảy đi du lịch.", "Đừng lên xe."],
    1,
    ["Come", "over", "for", "dinner", "on", "Sunday"],
    ["Monday", "lunch", "home", "late"],
    null
  ),
  exercise(
    "2-2",
    "I miss them very much.",
    "Tôi nhớ họ rất nhiều.",
    ["Tôi ghét họ.", "Tôi nhớ họ rất nhiều.", "Tôi chưa gặp xe buýt.", "Họ không nói chuyện."],
    1,
    ["I", "miss", "them", "very", "much"],
    ["love", "hate", "see", "call"],
    null
  ),
  exercise(
    "2-3",
    "My granddaughter just started school.",
    "Cháu gái tôi vừa vào học.",
    ["Cháu trai làm xe ôm.", "Cháu gái tôi vừa vào học.", "Chúng ta chơi cờ.", "Nhớ đem ô."],
    1,
    ["My", "granddaughter", "just", "started", "school"],
    ["work", "tired", "home", "old"],
    null
  ),
  exercise(
    "2-4",
    "Please call when you arrive.",
    "Đến nơi thì nhớ gọi cho ông nhé.",
    ["Đến nhà báo ông chủ.", "Đến nơi thì nhớ gọi cho ông nhé.", "Đừng mang theo ô.", "Hãy chờ xe."],
    1,
    ["Please", "call", "when", "you", "arrive"],
    ["wait", "text", "email", "leave"],
    null
  ),
  exercise(
    "2-5",
    "Our family gathers every Lunar New Year.",
    "Nhà tôi tụ họp vào Tết âm.",
    ["Tết ta đi chợ một mình.", "Nhà tôi tụ họp vào Tết âm.", "Chúng ta không họp nhau.", "Tết chỉ có pháo."],
    1,
    ["Our", "family", "gathers", "every", "Lunar", "New", "Year"],
    ["summer", "alone", "work", "shop"],
    null
  ),
  exercise(
    "2-6",
    "She takes care of the kids.",
    "Cô ấy lo cho các cháu nhỏ.",
    ["Anh ta đi chợ một mình.", "Cô ấy lo cho các cháu nhỏ.", "Ông nội không ăn được.", "Bà buổi tối mới đến."],
    1,
    ["She", "takes", "care", "of", "the", "kids"],
    ["mother", "father", "pets", "house"],
    null
  ),
  exercise(
    "2-7",
    "We are proud of you.",
    "Chúng tôi tự hào về bạn.",
    ["Chúng tôi buồn vì bạn.", "Chúng tôi tự hào về bạn.", "Chúng tôi không nghe rõ.", "Chúng tôi lo lắng quá."],
    1,
    ["We", "are", "proud", "of", "you"],
    ["angry", "sad", "tired", "late"],
    null
  ),
];

/** —— Topic 3: Mua sắm —— */
const T3U1 = [
  exercise(
    "1-1",
    "How much is this?",
    "Cái này bao nhiêu tiền?",
    ["Cái này là gì?", "Cái này bao nhiêu tiền?", "Cái này ở đâu?", "Cái này của ai?"],
    1,
    ["How", "much", "is", "this"],
    ["many", "where", "that", "cheap"],
    "haʊ · mʌtʃ · ɪz · ðɪs"
  ),
  exercise(
    "1-2",
    "I want to buy this.",
    "Tôi muốn mua cái này.",
    ["Tôi muốn xem cái này.", "Tôi muốn mua cái này.", "Tôi muốn trả lại.", "Tôi muốn mua cái kia."],
    1,
    ["I", "want", "to", "buy", "this"],
    ["see", "sell", "that", "cheap"],
    "aɪ · wɒnt · tə · baɪ · ðɪs"
  ),
  exercise(
    "1-3",
    "It is too expensive.",
    "Cái đó quá đắt.",
    ["Cái đó quá rẻ.", "Cái đó quá đắt.", "Cái đó quá to.", "Cái đó quá nhỏ."],
    1,
    ["It", "is", "too", "expensive"],
    ["cheap", "big", "small", "free"],
    "ɪt · ɪz · tuː · ɪkˈspen.sɪv"
  ),
  exercise(
    "1-4",
    "Can I pay by card?",
    "Tôi có thể trả bằng thẻ không?",
    ["Tôi có thể trả bằng tiền mặt không?", "Tôi có thể trả bằng thẻ không?", "Tôi có thể trả sau không?", "Tôi có thể đổi tiền không?"],
    1,
    ["Can", "I", "pay", "by", "card"],
    ["cash", "later", "phone", "free"],
    "kæn · aɪ · peɪ · baɪ · kɑːrd"
  ),
  exercise(
    "1-5",
    "Please give me a receipt.",
    "Vui lòng đưa tôi hoá đơn.",
    ["Vui lòng đưa tôi cái túi.", "Vui lòng đưa tôi tiền thừa.", "Vui lòng đưa tôi hoá đơn.", "Vui lòng đưa tôi hộ chiếu."],
    2,
    ["Please", "give", "me", "a", "receipt"],
    ["bag", "change", "menu", "help"],
    "pliːz · ɡɪv · miː · ə · rɪˈsiːt"
  ),
  exercise(
    "1-6",
    "Do you have a discount?",
    "Bạn có giảm giá không?",
    ["Bạn có size khác không?", "Bạn có màu khác không?", "Bạn có giảm giá không?", "Bạn có bán hết chưa?"],
    2,
    ["Do", "you", "have", "a", "discount"],
    ["sale", "size", "color", "gift"],
    "də · juː · hæv · ə · ˈdɪs.kaʊnt"
  ),
  exercise(
    "1-7",
    "Is there anything cheaper?",
    "Có loại nào rẻ hơn không?",
    ["Còn sai số không?", "Có loại nào rẻ hơn không?", "Cửa đó có chìa không?", "Cần chờ thêm phải không?"],
    1,
    ["Is", "there", "anything", "cheaper"],
    ["free", "big", "new", "old"],
    null
  ),
];

const T3U2 = [
  exercise(
    "2-1",
    "I am just looking, thank you.",
    "Tôi chỉ xem thôi, cảm ơn.",
    ["Tôi đổi ý rồi.", "Tôi chỉ xem thôi, cảm ơn.", "Tôi không biết giá.", "Tôi trả mặc cả."],
    1,
    ["I", "am", "just", "looking", "thank", "you"],
    ["buying", "selling", "late", "hungry"],
    null
  ),
  exercise(
    "2-2",
    "Could you wrap it as a gift?",
    "Cho tôi gói quà được không?",
    ["Cho khuyến mãi chứ?", "Cho tôi gói quà được không?", "Đổi một cái mới chứ?", "Có chỗ ngồi không?"],
    1,
    ["Could", "you", "wrap", "it", "as", "a", "gift"],
    ["bag", "box", "card", "home"],
    null
  ),
  exercise(
    "2-3",
    "This one does not fit.",
    "Cái này không vừa.",
    ["Cái này hết nhãn.", "Cái này không vừa.", "Không được chụp hình.", "Không được trả tiền."],
    1,
    ["This", "one", "does", "not", "fit"],
    ["size", "cheap", "old", "new"],
    null
  ),
  exercise(
    "2-4",
    "Where can I find the milk?",
    "Sữa tươi ở kệ nào?",
    ["Nhà vệ sinh ở đâu?", "Sữa tươi ở kệ nào?", "Thẻ tín dụng ở đâu?", "Xe bus ở đâu?"],
    1,
    ["Where", "can", "I", "find", "the", "milk"],
    ["bread", "rice", "water", "meat"],
    null
  ),
  exercise(
    "2-5",
    "The line is very long today.",
    "Hôm nay xếp hàng rất dài.",
    ["Hôm nay đóng cửa.", "Hôm nay xếp hàng rất dài.", "Hôm nay không bán.", "Hôm nay giảm nửa giá."],
    1,
    ["The", "line", "is", "very", "long", "today"],
    ["short", "quiet", "late", "open"],
    null
  ),
  exercise(
    "2-6",
    "Can I try it on?",
    "Tôi thử được không?",
    ["Tôi trả góp được không?", "Tôi thử được không?", "Tôi lấy chưa ngon.", "Tôi buồn quá."],
    1,
    ["Can", "I", "try", "it", "on"],
    ["see", "buy", "pay", "eat"],
    null
  ),
  exercise(
    "2-7",
    "Keep the change.",
    "Tiền thừa không cần trả lại.",
    ["Cho tôi thêm túi.", "Tiền thừa không cần trả lại.", "Tôi không mang tiền.", "Tôi quên thẻ."],
    1,
    ["Keep", "the", "change"],
    ["bill", "card", "bag", "free"],
    null
  ),
];

/** —— Topic 4: Nhập cảnh —— */
const T4U1 = [
  exercise(
    "1-1",
    "Here is my passport.",
    "Đây là hộ chiếu của tôi.",
    ["Đây là vé của tôi.", "Đây là hộ chiếu của tôi.", "Đây là va li của tôi.", "Đây là thị thực của tôi."],
    1,
    ["Here", "is", "my", "passport"],
    ["ticket", "visa", "bag", "phone"],
    "hɪr · ɪz · maɪ · ˈpæs.pɔːrt"
  ),
  exercise(
    "1-2",
    "I am a tourist.",
    "Tôi là khách du lịch.",
    ["Tôi là sinh viên.", "Tôi là khách du lịch.", "Tôi là người Việt Nam.", "Tôi là khách của khách sạn."],
    1,
    ["I", "am", "a", "tourist"],
    ["student", "worker", "pilot", "guide"],
    "aɪ · æm · ə · ˈtʊr.ɪst"
  ),
  exercise(
    "1-3",
    "Where is the gate?",
    "Cổng ra máy bay ở đâu?",
    ["Sân bay ở đâu?", "Cổng ra máy bay ở đâu?", "Khách sạn ở đâu?", "Hành lý ở đâu?"],
    1,
    ["Where", "is", "the", "gate"],
    ["airport", "hotel", "map", "taxi"],
    "wer · ɪz · ðə · ɡeɪt"
  ),
  exercise(
    "1-4",
    "My flight is delayed.",
    "Chuyến bay của tôi bị hoãn.",
    ["Chuyến bay của tôi đã đến.", "Chuyến bay của tôi bị huỷ.", "Chuyến bay của tôi bị hoãn.", "Chuyến bay của tôi đúng giờ."],
    2,
    ["My", "flight", "is", "delayed"],
    ["early", "late", "gate", "full"],
    "maɪ · flaɪt · ɪz · dɪˈleɪd"
  ),
  exercise(
    "1-5",
    "I want a window seat.",
    "Tôi muốn một ghế cạnh cửa sổ.",
    ["Tôi muốn ghế lối đi.", "Tôi muốn một ghế cạnh cửa sổ.", "Tôi muốn đổi ghế.", "Tôi muốn ghế trống."],
    1,
    ["I", "want", "a", "window", "seat"],
    ["aisle", "door", "map", "food"],
    "aɪ · wɒnt · ə · ˈwɪn.doʊ · siːt"
  ),
  exercise(
    "1-6",
    "Welcome to Vietnam.",
    "Chào mừng đến Việt Nam.",
    ["Tạm biệt Việt Nam.", "Chào mừng đến Việt Nam.", "Cảm ơn bạn đến Việt Nam.", "Hẹn gặp lại Việt Nam."],
    1,
    ["Welcome", "to", "Vietnam"],
    ["Japan", "from", "see", "home"],
    "ˈwel.kəm · tə · ˌvjetˈnɑːm"
  ),
  exercise(
    "1-7",
    "How long will I stay?",
    "Tôi sẽ ở đây bao lâu?",
    ["Tôi có bị nhốt không?", "Tôi sẽ ở đây bao lâu?", "Tôi phải tháo máy chứ?", "Tôi mất ô kìa."],
    1,
    ["How", "long", "will", "I", "stay"],
    ["wait", "see", "fly", "eat"],
    null
  ),
];

const T4U2 = [
  exercise(
    "2-1",
    "I have nothing to declare.",
    "Tôi không có gì để khai báo.",
    ["Tôi không mang hành lý.", "Tôi không có gì để khai báo.", "Tôi mang thịt vào cửa.", "Tôi chỉ có nhẫn cưới."],
    1,
    ["I", "have", "nothing", "to", "declare"],
    ["food", "money", "see", "open"],
    null
  ),
  exercise(
    "2-2",
    "Is this the right baggage claim?",
    "Đây có phải băng chuyền nhận hành lý không?",
    ["Đây có phải nhà wc không?", "Đây có phải băng chuyền nhận hành lý không?", "Xe bus ở đây không?", "Tôi bị nhầm chỗ chứ?"],
    1,
    ["Is", "this", "the", "right", "baggage", "claim"],
    ["gate", "map", "taxi", "food"],
    null
  ),
  exercise(
    "2-3",
    "Where is customs?",
    "Hải quan ở đâu?",
    ["Xe đón ở đâu?", "Hải quan ở đâu?", "Đổi tiền ở xa không?", "Có chỗ uống cà phê chứ?"],
    1,
    ["Where", "is", "customs"],
    ["gate", "hotel", "taxi", "map"],
    null
  ),
  exercise(
    "2-4",
    "My luggage is heavy.",
    "Hành lý của tôi nặng.",
    ["Hộ chiếu mới hết.", "Hành lý của tôi nặng.", "Xe bus kẹt đường.", "Điều chỉnh thời gian chứ."],
    1,
    ["My", "luggage", "is", "heavy"],
    ["light", "small", "cheap", "new"],
    null
  ),
  exercise(
    "2-5",
    "Could you speak more slowly?",
    "Bạn nói chậm hơn được không?",
    ["Bạn nói to hơn được không?", "Bạn nói chậm hơn được không?", "Bạn biết tiếng Pháp không?", "Bạn đói chưa?"],
    1,
    ["Could", "you", "speak", "more", "slowly"],
    ["loudly", "fast", "English", "help"],
    null
  ),
  exercise(
    "2-6",
    "I need a taxi to the hotel.",
    "Tôi cần taxi đến khách sạn.",
    ["Tôi cần giường nằm.", "Tôi cần taxi đến khách sạn.", "Tôi cần đổi vé.", "Tôi cần mua sim."],
    1,
    ["I", "need", "a", "taxi", "to", "the", "hotel"],
    ["bus", "map", "gate", "food"],
    null
  ),
  exercise(
    "2-7",
    "Thank you for your help.",
    "Cảm ơn bạn đã giúp đỡ.",
    ["Tôi không nghe rõ.", "Cảm ơn bạn đã giúp đỡ.", "Tôi bị lạc.", "Tôi quên hộ chiếu."],
    1,
    ["Thank", "you", "for", "your", "help"],
    ["please", "sorry", "water", "late"],
    null
  ),
];

/** —— Topic 5: Chào hỏi —— */
const T5U1 = [
  exercise(
    "1-1",
    "Hello, how are you?",
    "Xin chào, bạn khoẻ không?",
    ["Tạm biệt, bạn khoẻ không?", "Xin chào, bạn khoẻ không?", "Cảm ơn bạn rất nhiều.", "Xin chào, tên bạn là gì?"],
    1,
    ["Hello", "how", "are", "you"],
    ["name", "what", "where", "fine"],
    "heˈloʊ · haʊ · ɑːr · juː"
  ),
  exercise(
    "1-2",
    "I am fine, thank you.",
    "Tôi khoẻ, cảm ơn bạn.",
    ["Tôi mệt, cảm ơn bạn.", "Tôi khoẻ, cảm ơn bạn.", "Tôi bận, cảm ơn bạn.", "Tôi không khoẻ."],
    1,
    ["I", "am", "fine", "thank", "you"],
    ["tired", "busy", "sick", "late"],
    "aɪ · æm · faɪn · θæŋk · juː"
  ),
  exercise(
    "1-3",
    "Nice to meet you.",
    "Rất vui được gặp bạn.",
    ["Rất vui được gặp bạn.", "Hẹn gặp lại bạn sau.", "Cảm ơn bạn rất nhiều.", "Tạm biệt bạn."],
    0,
    ["Nice", "to", "meet", "you"],
    ["later", "see", "sorry", "home"],
    "naɪs · tə · miːt · juː"
  ),
  exercise(
    "1-4",
    "What is your name?",
    "Tên bạn là gì?",
    ["Bạn bao nhiêu tuổi?", "Tên bạn là gì?", "Bạn từ đâu đến?", "Bạn làm nghề gì?"],
    1,
    ["What", "is", "your", "name"],
    ["age", "from", "time", "phone"],
    "wɒt · ɪz · jɔːr · neɪm"
  ),
  exercise(
    "1-5",
    "Thank you very much.",
    "Cảm ơn bạn rất nhiều.",
    ["Xin lỗi rất nhiều.", "Cảm ơn bạn rất nhiều.", "Vui lòng giúp tôi.", "Cảm ơn bạn một chút."],
    1,
    ["Thank", "you", "very", "much"],
    ["sorry", "please", "fine", "late"],
    "θæŋk · juː · ˈver.i · mʌtʃ"
  ),
  exercise(
    "1-6",
    "See you tomorrow.",
    "Hẹn gặp ngày mai.",
    ["Hẹn gặp tuần sau.", "Hẹn gặp ngày mai.", "Tạm biệt mọi người.", "Chào buổi sáng."],
    1,
    ["See", "you", "tomorrow"],
    ["later", "today", "home", "night"],
    "siː · juː · təˈmɒr.oʊ"
  ),
  exercise(
    "1-7",
    "Have a nice day!",
    "Chúc bạn một ngày tốt lành!",
    ["Chúc bạn sớm khoẻ.", "Chúc bạn một ngày tốt lành!", "Chúng ta đừng về sớm.", "Tôi rất thích màn hình này."],
    1,
    ["Have", "a", "nice", "day"],
    ["night", "week", "see", "home"],
    null
  ),
];

const T5U2 = [
  exercise(
    "2-1",
    "Excuse me, where is the restroom?",
    "Xin lỗi, nhà vệ sinh ở đâu?",
    ["Xin lỗi, giờ mấy rồi?", "Xin lỗi, nhà vệ sinh ở đâu?", "Tôi cần bánh mì chứ không phải cà phê.", "Bạn thích nghe nhạc không?"],
    1,
    ["Excuse", "me", "where", "is", "the", "restroom"],
    ["hello", "map", "help", "phone"],
    null
  ),
  exercise(
    "2-2",
    "I do not speak English very well.",
    "Tôi nói tiếng Anh chưa tốt lắm.",
    ["Tôi không biết lái xe.", "Tôi nói tiếng Anh chưa tốt lắm.", "Tôi chưa ăn cơm.", "Tôi thích xem tin tức."],
    1,
    ["I", "do", "not", "speak", "English", "very", "well"],
    ["read", "write", "sing", "dance"],
    null
  ),
  exercise(
    "2-3",
    "Could you repeat that?",
    "Bạn nói lại được không?",
    ["Chúng ta đọc lại chứ?", "Bạn nói lại được không?", "Bạn không nghe chứ?", "Tôi sẽ chờ chứ?"],
    1,
    ["Could", "you", "repeat", "that"],
    ["say", "write", "read", "see"],
    null
  ),
  exercise(
    "2-4",
    "I am pleased to meet you.",
    "Rất vui được làm quen với ông.",
    ["Tôi ghét chỗ này.", "Rất vui được làm quen với ông.", "Tôi chưa sẵn sàng đi chợ.", "Chắc là trời sẽ mưa."],
    1,
    ["I", "am", "pleased", "to", "meet", "you"],
    ["fine", "sad", "late", "tired"],
    null
  ),
  exercise(
    "2-5",
    "Good morning, sir.",
    "Chào buổi sáng, thưa ông.",
    ["Chào buổi tối, thưa cô.", "Chào buổi sáng, thưa ông.", "Đồ uống ở quầy này.", "Tối không ngủ được."],
    1,
    ["Good", "morning", "sir"],
    ["evening", "night", "maam", "help"],
    null
  ),
  exercise(
    "2-6",
    "Take care!",
    "Bảo trọng nhé!",
    ["Chúng ta kết thúc buổi học chứ?", "Bảo trọng nhé!", "Hãy chờ chỗ xe.", "Đồ uống còn nóng quá."],
    1,
    ["Take", "care"],
    ["see", "hello", "please", "sorry"],
    null
  ),
  exercise(
    "2-7",
    "See you later.",
    "Hẹn gặp lại sau.",
    ["Mai bạn rảnh không?", "Hẹn gặp lại sau.", "Tôi quên chìa khoá.", "Chúng ta chưa trả tiền."],
    1,
    ["See", "you", "later"],
    ["tomorrow", "today", "night", "home"],
    null
  ),
];

/** —— Topic 6: Số đếm và tiền tệ —— */
const T6U1 = [
  exercise(
    "1-1",
    "I have one apple.",
    "Tôi có một quả táo.",
    ["Tôi có hai quả táo.", "Tôi có một quả cam.", "Tôi có một quả táo.", "Tôi có một cuốn sách."],
    2,
    ["I", "have", "one", "apple"],
    ["two", "orange", "book", "pen"],
    "aɪ · hæv · wʌn · ˈæp.əl"
  ),
  exercise(
    "1-2",
    "It costs ten dollars.",
    "Cái đó giá mười đô la.",
    ["Cái đó giá hai đô la.", "Cái đó giá mười đô la.", "Cái đó giá một trăm đồng.", "Cái đó giá một đô la."],
    1,
    ["It", "costs", "ten", "dollars"],
    ["two", "five", "dong", "free"],
    "ɪt · kɒsts · ten · ˈdɒl.ərz"
  ),
  exercise(
    "1-3",
    "I have fifty thousand dong.",
    "Tôi có năm mươi nghìn đồng.",
    ["Tôi có năm mươi nghìn đồng.", "Tôi có năm trăm nghìn đồng.", "Tôi có năm mươi đô la.", "Tôi có một triệu đồng."],
    0,
    ["I", "have", "fifty", "thousand", "dong"],
    ["hundred", "million", "ten", "one"],
    "aɪ · hæv · ˈfɪf.ti · ˈθaʊ.zənd · dɒŋ"
  ),
  exercise(
    "1-4",
    "What is your phone number?",
    "Số điện thoại của bạn là gì?",
    ["Tên của bạn là gì?", "Địa chỉ của bạn là gì?", "Số điện thoại của bạn là gì?", "Tuổi của bạn là gì?"],
    2,
    ["What", "is", "your", "phone", "number"],
    ["name", "address", "age", "time"],
    "wɒt · ɪz · jɔːr · foʊn · ˈnʌm.bər"
  ),
  exercise(
    "1-5",
    "Can I have the bill?",
    "Cho tôi xin hoá đơn được không?",
    ["Cho tôi xin nước được không?", "Cho tôi xin hoá đơn được không?", "Cho tôi xin thực đơn được không?", "Cho tôi xin một cái túi được không?"],
    1,
    ["Can", "I", "have", "the", "bill"],
    ["menu", "water", "bag", "see"],
    "kæn · aɪ · hæv · ðə · bɪl"
  ),
  exercise(
    "1-6",
    "Five minutes, please.",
    "Vui lòng năm phút.",
    ["Vui lòng mười phút.", "Vui lòng năm phút.", "Vui lòng năm giây.", "Vui lòng một giờ."],
    1,
    ["Five", "minutes", "please"],
    ["ten", "hour", "one", "six"],
    "faɪv · ˈmɪn.ɪts · pliːz"
  ),
  exercise(
    "1-7",
    "Is this item on sale?",
    "Mặt hàng này có giảm giá không?",
    ["Đã bán hết chưa?", "Mặt hàng này có giảm giá không?", "Có nhận thẻ không?", "Có giao tận nhà không?"],
    1,
    ["Is", "this", "item", "on", "sale"],
    ["price", "free", "card", "food"],
    null
  ),
];

const T6U2 = [
  exercise(
    "2-1",
    "I need three tickets.",
    "Tôi cần ba vé.",
    ["Tôi cần hai vé.", "Tôi cần ba vé.", "Tôi cần mười vé nhưng không có tiền.", "Tôi trả vé rồi."],
    1,
    ["I", "need", "three", "tickets"],
    ["two", "five", "one", "ten"],
    null
  ),
  exercise(
    "2-2",
    "The total is eighty thousand dong.",
    "Tổng cộng tám mươi nghìn đồng.",
    ["Đã được giảm nửa chứ?", "Tổng cộng tám mươi nghìn đồng.", "Tụi nhỏ chưa ăn cơm.", "Thời tiết không đẹp."],
    1,
    ["The", "total", "is", "eighty", "thousand", "dong"],
    ["fifty", "hundred", "dollar", "free"],
    null
  ),
  exercise(
    "2-3",
    "Can I pay in cash?",
    "Tôi trả tiền mặt được không?",
    ["Tôi trả vé online được không?", "Tôi trả tiền mặt được không?", "Tôi hết tiền rồi.", "Xe bus đã đến chưa?"],
    1,
    ["Can", "I", "pay", "in", "cash"],
    ["card", "later", "free", "see"],
    null
  ),
  exercise(
    "2-4",
    "What time does the store open?",
    "Cửa hàng mở cửa lúc mấy giờ?",
    ["Nhà hàng đóng cửa chưa?", "Cửa hàng mở cửa lúc mấy giờ?", "Giá xăng tăng chưa?", "Máy rút tiền ở đâu?"],
    1,
    ["What", "time", "does", "the", "store", "open"],
    ["close", "run", "see", "home"],
    null
  ),
  exercise(
    "2-5",
    "This is thirty percent off.",
    "Đang giảm ba mươi phần trăm.",
    ["Không được chụp hình chứ?", "Đang giảm ba mươi phần trăm.", "Chỉ có bốn chỗ đứng thôi.", "Hôm nay có hội chợ chứ."],
    1,
    ["This", "is", "thirty", "percent", "off"],
    ["fifty", "free", "card", "see"],
    null
  ),
  exercise(
    "2-6",
    "I would like smaller change.",
    "Tôi muốn xin nhỏ lại tiền lẻ.",
    ["Tôi muốn mua chứng khoán.", "Tôi muốn xin nhỏ lại tiền lẻ.", "Tôi chưa mở được điện thoại.", "Tôi cần sạc máy chứ không phải cá."],
    1,
    ["I", "would", "like", "smaller", "change"],
    ["bigger", "bill", "card", "cash"],
    null
  ),
  exercise(
    "2-7",
    "Please count again.",
    "Vui lòng đếm lại một lần nữa.",
    ["Đổi chỗ ngồi được không?", "Vui lòng đếm lại một lần nữa.", "Tài xế chờ chứ?", "Xe bus đã khởi hành chưa?"],
    1,
    ["Please", "count", "again"],
    ["write", "read", "see", "help"],
    null
  ),
];

export const LESSONS = {
  1: [
    unit("t1-u1", "Phần 1 · Khai báo triệu chứng", T1U1),
    unit("t1-u2", "Phần 2 · Thuốc, bảo hiểm và chỉ dẫn", T1U2),
  ],
  2: [
    unit("t2-u1", "Phần 1 · Người thân trong nhà", T2U1),
    unit("t2-u2", "Phần 2 · Gia đình quây quần", T2U2),
  ],
  3: [
    unit("t3-u1", "Phần 1 · Hỏi giá và thanh toán", T3U1),
    unit("t3-u2", "Phần 2 · Đổi trả và siêu thị", T3U2),
  ],
  4: [
    unit("t4-u1", "Phần 1 · Sân bay cơ bản", T4U1),
    unit("t4-u2", "Phần 2 · Hải quan và xe", T4U2),
  ],
  5: [
    unit("t5-u1", "Phần 1 · Chào hỏi hằng ngày", T5U1),
    unit("t5-u2", "Phần 2 · Giao tiếp lịch sự", T5U2),
  ],
  6: [
    unit("t6-u1", "Phần 1 · Số và thanh toán", T6U1),
    unit("t6-u2", "Phần 2 · Giá và tổng tiền", T6U2),
  ],
};

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
