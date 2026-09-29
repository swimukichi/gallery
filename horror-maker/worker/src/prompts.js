// プロンプト・選択肢定義。ここが唯一の正。フロントには表示名とIDだけを置く。
// 選択肢ID → 内部の文言（恐怖設計など）への対応はすべてこのファイルに閉じる。

export const OPTIONS = {
  genre: {
    kaidan: { label: "怪談", src: "土地や物に宿る怪異", show: "伝聞と体験談の語り口", ng: "怪異の正体を理屈で説明しきる" },
    shinrei: { label: "心霊", src: "死者の意思", show: "気配・音・写り込みなど間接描写", ng: "幽霊の姿を最初から詳細に描く" },
    hitokowa: { label: "人怖", src: "生きた人間の悪意や執着", show: "善意に見える行動の裏", ng: "超常現象" },
    shinri: { label: "心理ホラー", src: "主人公自身の認知の歪み", show: "信頼できない語り、日常のずれ", ng: "外部の怪物で解決する" },
    inshu: { label: "因習村", src: "共同体の掟と信仰", show: "歓迎されすぎる違和感、誰も口にしない場所", ng: "村人を単純な悪役にする" },
    netto: { label: "ネット怪談", src: "掲示板・SNS・動画に潜む何か", show: "書き込みやログの断片を挟む", ng: "古い技術描写の誤り" },
    toshi: { label: "都市伝説", src: "噂として広まるルール", show: "噂の検証が現実になっていく", ng: "有名な都市伝説のそのままの再話" },
    mokyu: { label: "モキュメンタリー", src: "記録された出来事", show: "取材メモ・証言・資料の体裁", ng: "記録の体裁を途中で崩す" },
    sf: { label: "SFホラー", src: "技術や科学の暴走", show: "合理的な説明がかえって恐ろしい", ng: "長い設定説明" },
    body: { label: "ボディホラー", src: "身体の変容", show: "感覚描写を積み重ねる", ng: "過剰なスプラッタ" },
    fujori: { label: "不条理", src: "説明されない世界のルール", show: "誰も疑問に思わないことへの違和感", ng: "最後に理屈で種明かし" },
  },
  setting: {
    town: { label: "現代日本の街" },
    school: { label: "学校" },
    apartment: { label: "マンション・団地" },
    hospital: { label: "病院" },
    village: { label: "田舎の集落" },
    office: { label: "職場" },
    mountain_sea: { label: "山・海" },
  },
  hero: {
    man_worker: { label: "男性・社会人" },
    woman_worker: { label: "女性・社会人" },
    boy_student: { label: "男子学生" },
    girl_student: { label: "女子学生" },
    child: { label: "子ども" },
    elder: { label: "高齢者" },
  },
  pov: {
    first: { label: "一人称" },
    third: { label: "三人称" },
  },
  style: {
    tantan: { label: "淡々", note: "感情語を抑え、事実を短い文で積む" },
    bungaku: { label: "文学的", note: "比喩と余白を使い、情景に心理を映す" },
    yomiyasui: { label: "読みやすい", note: "平易な語彙、テンポ良く、会話多め" },
    namanamashii: { label: "生々しい", note: "五感と身体感覚を具体的に描く" },
  },
  fear: {
    jiwajiwa: { label: "じわじわ", note: "小さな違和感を段階的に強める" },
    shogeki: { label: "衝撃系", note: "山場で一気に反転させる" },
    bukimi: { label: "不気味", note: "正体を明かさず気配だけで押す" },
    atoaji: { label: "後味が悪い", note: "読後に嫌な余韻が残る終わり方" },
  },
  ending: {
    salvation: { label: "救いあり" },
    no_salvation: { label: "救いなし" },
    meaning: { label: "意味が分かると怖い" },
    interpret: { label: "解釈を残す" },
  },
  length: {
    2000: { label: "2000字" },
    4000: { label: "4000字" },
    6000: { label: "6000字" },
  },
  chapters: {
    1: { label: "1章" },
    3: { label: "3章" },
    5: { label: "5章" },
  },
};

export const OPTION_KEYS = Object.keys(OPTIONS);

// テーマ：プリセット30種（"none" = 指定なし）
export const THEMES = {
  none: "",
  conbini: "深夜のコンビニ",
  danchi: "古い団地",
  unknown_call: "知らない番号からの着信",
  akazu: "祖母の家の開かずの間",
  chat_read: "社内チャットの既読",
  closed_school: "閉校した小学校",
  family_photo: "家族写真に写る他人",
  night_bus: "夜行バス",
  elevator: "止まるはずのない階に止まるエレベーター",
  tunnel: "旧道のトンネル",
  hotel_404: "ビジネスホテルの404号室",
  neighbor_noise: "隣人の生活音",
  smart_speaker: "スマートスピーカーの独り言",
  delivery: "身に覚えのない宅配便",
  last_train: "終電の一つ前の車両",
  mirror: "実家の姿見",
  cram_school: "夜の学習塾",
  night_ward: "夜勤の病棟",
  hokora: "山道の小さな祠",
  tsuya: "通夜の晩",
  jiko_bukken: "格安の事故物件",
  school_trip: "修学旅行の夜",
  cctv: "防犯カメラの映像",
  matching: "マッチングアプリの相手",
  dead_friend_dm: "亡くなった友人からのDM",
  video_tape: "押し入れから出てきたビデオテープ",
  empty_room: "引っ越し前夜の空き部屋",
  old_well: "村外れの古井戸",
  sento: "深夜の銭湯",
};

// プロット修正：ボタン5種（1本につき合計3回まで）
export const REVISIONS = {
  no_ghost: "幽霊を出さない",
  realistic: "もっと現実的に",
  nastier: "結末をもっと嫌にする",
  scarier: "怖さを強める",
  faster: "テンポを上げる",
};
export const MAX_REVISIONS = 3;

const has = (o, k) => typeof k === "string" && Object.prototype.hasOwnProperty.call(o, k);

// options を検証して、正規化した新しいオブジェクトを返す。不正なら null。
export function validateOptions(o) {
  if (!o || typeof o !== "object" || Array.isArray(o)) return null;
  const keys = Object.keys(o);
  if (keys.length !== OPTION_KEYS.length) return null;
  const out = {};
  for (const k of OPTION_KEYS) {
    const v = o[k];
    if (typeof v !== "string" || !has(OPTIONS[k], v)) return null;
    out[k] = v;
  }
  return out;
}
export const validThemeId = (id) => has(THEMES, id);
export const validRevisionId = (id) => has(REVISIONS, id);

export function condText(opt, themeId) {
  const g = OPTIONS.genre[opt.genre];
  const st = OPTIONS.style[opt.style];
  const fr = OPTIONS.fear[opt.fear];
  const L = (k) => OPTIONS[k][opt[k]].label;
  const theme = THEMES[themeId] || "指定なし（条件から自由に発想）";
  return `ジャンル：${g.label}（恐怖の源：${g.src}／見せ方：${g.show}／避けること：${g.ng}）
舞台：${L("setting")}
主人公：${L("hero")}
語り：${L("pov")}
文体：${st.label}（${st.note}）
怖さ：${fr.label}（${fr.note}）
結末：${L("ending")}
総文字数：約${opt.length}字／章数：${opt.chapters}章
テーマ：${theme}`;
}

const PLOT_FORMAT = `次のJSONだけを返す：
{"title":"作品タイトル","logline":"一行の紹介","intro":"導入","development":"展開","twist":"転換","truth":"真相","ending":"結末","chapters":[{"no":1,"title":"章題","summary":"この章で起きること（2〜3文）"}]}
chaptersの数は章数と必ず一致させる。`;

export function buildPlotPrompt(opt, themeId) {
  return `あなたはホラー短編の構成作家です。以下の条件で、読者が「自分のために書かれた」と感じる独創的なプロットを作ってください。
【条件】
${condText(opt, themeId)}
【ルール】
- 結末の条件を必ず守る
- 真相につながる伏線を導入に仕込む
- 既存作品の筋をなぞらない
${PLOT_FORMAT}`;
}

export function buildRevisePrompt(opt, themeId, plot, revisionId) {
  return `あなたはホラー短編の構成作家です。次のプロットを、読者の修正指示に従って直してください。指示と関係ない部分はなるべく残します。
【条件】
${condText(opt, themeId)}
【現在のプロット】
${JSON.stringify(plot)}
【修正指示】
${REVISIONS[revisionId]}
${PLOT_FORMAT}`;
}

export const chapterChars = (opt) => Math.round(Number(opt.length) / Number(opt.chapters));

export function buildChapterPrompt(opt, themeId, plot, chapterNo, prevTail) {
  const n = plot.chapters.length;
  const i = chapterNo - 1;
  const ch = plot.chapters[i];
  const per = chapterChars(opt);
  const pov = OPTIONS.pov[opt.pov].label;
  const style = OPTIONS.style[opt.style].label;
  const ending = OPTIONS.ending[opt.ending].label;
  return `あなたはプロのホラー作家です。以下の設定とプロットに従い、第${chapterNo}章（全${n}章）の本文だけを書いてください。
【設定】
${condText(opt, themeId)}
【全体プロット】
${JSON.stringify(plot)}
【この章の要約】
${ch.title}：${ch.summary}
【前章の結び】
${prevTail || "なし（この章から始まる）"}
【執筆ルール】
- 約${per}字（前後15%まで）
- ${pov}で書く。文体は「${style}」
- 章タイトル・見出し・前置き・あとがきは書かない。本文のみ
- 段落ごとに改行し、会話は「」を使う
- ${i < n - 1 ? "この章では真相や結末を明かさない" : "最終章として結末の条件「" + ending + "」を必ず満たして締める"}
- 恐怖は説明せず、描写で見せる
- 前章と矛盾させない`;
}

// モデルが返したプロットを検証・整形する。不正なら null。
export function normalizePlot(p, chaptersCount) {
  if (!p || typeof p !== "object") return null;
  const s = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const title = s(p.title, 80);
  if (!title || !Array.isArray(p.chapters) || p.chapters.length !== chaptersCount) return null;
  const chapters = [];
  for (let i = 0; i < chaptersCount; i++) {
    const c = p.chapters[i];
    const t = s(c && c.title, 60);
    const sm = s(c && c.summary, 500);
    if (!t || !sm) return null;
    chapters.push({ no: i + 1, title: t, summary: sm });
  }
  return {
    title,
    logline: s(p.logline, 200),
    intro: s(p.intro, 700),
    development: s(p.development, 700),
    twist: s(p.twist, 700),
    truth: s(p.truth, 700),
    ending: s(p.ending, 700),
    chapters,
  };
}
