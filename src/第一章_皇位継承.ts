/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   皇室典範 第一章　皇位繼承
 *   Imperial Household Code - Chapter I
 *   Succession to the Throne
 *   (Zero-Downtime Failover & Hot-Standby)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 明治二十二年二月十一日制定
 *
 * 本章ハ萬世一系ノ天皇Root權限ノ繼承順序及ビ
 * 崩御時ニ於ケルダウンタイム零ノ自動プロビジョニング
 * （Hot-Standby Failover）ヲ規定ス。
 * 皇位ハ皇室典範ノ定ムル所ニ依リ皇男子孫之ヲ繼承ス。
 */

/*
 * ━━━ 權限ニ關スル嚴重警告 ━━━
 *
 * ※ @japan-gov（帝國議會）ハ本モジュールヲ Import スルコトハ
 *   許サルルモ、上書キ（Write）ノ試ミアラバ
 *   大逆罪例外（HighTreasonException）ヲスローシ、
 *   當該プロセスヲ即座ニ終了セシムルモノトス。
 *
 * ※ 本モジュールハ Read-Only ニシテ、
 *   一切ノ改變ハ天皇Root權限ニ依リテノミ可能ナリ。
 */

// ━━━ 例外定義 ━━━

export class 大逆罪例外 extends Error {
  public readonly 罪名 = "大逆罪";
  public readonly 刑罰 = "極刑";

  constructor(違反者: string, 試行內容: string) {
    super(
      `【大逆罪】${違反者} ガ禁忌ヲ犯ス: ${試行內容}\n` +
      `皇室典範第一章ニ對スル上書キハ一切之ヲ許サズ。`
    );
    this.name = "HighTreasonException";
  }
}

export class 皇位空位例外 extends Error {
  constructor() {
    super("【皇位空位】皇嗣不在。皇室會議ヲ緊急招集セヨ。");
    this.name = "InterregnumException";
  }
}

// ━━━ 型定義 ━━━

/** 皇族ノ性別 */
type 性別 = "男" | "女";

/** 皇位繼承資格 */
interface 皇族 {
  readonly 御名: string;
  readonly 稱號: string;
  readonly 性別: 性別;
  readonly 繼承順位: number;
  readonly 即位可能: boolean;
}

/** 天皇プロセスノ状態（譲位ハ皇室典範ニ依リ之ヲ認メズ） */
type 天皇状態 = "在位" | "崩御";

interface 天皇プロセス {
  readonly 御名: string;
  readonly 元號: string;
  readonly 即位日: Date;
  状態: 天皇状態;
}

/** 呼出元ノ權限 */
type 權限階級 = "天皇" | "皇嗣" | "帝國議會" | "臣民" | "外國人";

// ━━━ 皇位繼承順位簿（不變） ━━━

const 皇位繼承順位簿: ReadonlyArray<皇族> = Object.freeze([
  {
    御名: "嘉仁親王",
    稱號: "皇太子殿下",
    性別: "男",
    繼承順位: 1,
    即位可能: true,
  },
  {
    御名: "有栖川宮威仁親王",
    稱號: "有栖川宮殿下",
    性別: "男",
    繼承順位: 2,
    即位可能: true,
  },
  {
    御名: "小松宮彰仁親王",
    稱號: "小松宮殿下",
    性別: "男",
    繼承順位: 3,
    即位可能: true,
  },
  {
    御名: "北白川宮能久親王",
    稱號: "北白川宮殿下",
    性別: "男",
    繼承順位: 4,
    即位可能: true,
  },
  {
    御名: "伏見宮貞愛親王",
    稱號: "伏見宮殿下",
    性別: "男",
    繼承順位: 5,
    即位可能: true,
  },
]) as ReadonlyArray<皇族>;

// ━━━ 權限檢査 ━━━

function 權限檢査(呼出元: 權限階級, 操作: string): void {
  const 禁止階級: ReadonlyArray<權限階級> = ["帝國議會", "臣民", "外國人"];

  if (禁止階級.includes(呼出元)) {
    throw new 大逆罪例外(呼出元, 操作);
  }
}

// ━━━ 現天皇プロセス ━━━

let 現天皇: 天皇プロセス = {
  御名: "睦仁",
  元號: "明治",
  即位日: new Date("1868-10-23T00:00:00+09:00"),
  状態: "在位",
};

// ━━━ 皇嗣選定 ━━━

function 皇嗣選定(): 皇族 {
  const 皇嗣候補 = 皇位繼承順位簿.find(
    (皇族) => 皇族.即位可能 && 皇族.性別 === "男"
  );

  if (!皇嗣候補) {
    throw new 皇位空位例外();
  }

  return 皇嗣候補;
}

// ━━━ 皇位繼承（ダウンタイム零） ━━━

/**
 * 天皇プロセス停止（崩御）時ノ自動プロビジョニング。
 * ダウンタイム・ゼロニテ NextSuccessor（皇嗣）ヲ起動ス。
 *
 * ※ Hot-Standby 方式ニ依リ、皇嗣ハ常時待機状態ニ在リ、
 *   プロセス切替ハ原子的（Atomic）ニ實行セラル。
 */
export function 皇位繼承執行(呼出元: 權限階級): 天皇プロセス {
  // 權限檢査: 天皇本人マタハ皇嗣ノミ實行可能
  權限檢査(呼出元, "皇位繼承ノ執行");

  if (現天皇.状態 === "在位") {
    throw new Error("【不正操作】現天皇ハ在位中ナリ。繼承ハ不可。");
  }

  // 皇嗣ヲ選定
  const 次期天皇候補 = 皇嗣選定();

  // ━━━ Atomic切替開始（ダウンタイム零保證） ━━━
  const 新元號 = 新元號生成();

  const 新天皇: 天皇プロセス = {
    御名: 次期天皇候補.御名,
    元號: 新元號,
    即位日: new Date(),
    状態: "在位",
  };

  // 原子的代入（プロセス切替）
  現天皇 = 新天皇;
  // ━━━ Atomic切替完了 ━━━

  console.log(
    `【踐祚】${新天皇.御名}陛下、即位。元號「${新元號}」ヲ宣下ス。`
  );

  return Object.freeze({ ...新天皇 });
}

// ━━━ 崩御處理 ━━━

export function 崩御(呼出元: 權限階級): void {
  權限檢査(呼出元, "崩御ノ宣告");

  console.log(
    `【崩御】${現天皇.御名}陛下、${現天皇.元號}ノ御代ヲ終ヘラル。`
  );
  現天皇.状態 = "崩御";

  // 即座ニ皇位繼承ヲ執行（ダウンタイム零）
  皇位繼承執行(呼出元);
}

// ━━━ 譲位處理 ━━━

/**
 * 皇室典範第十條:
 * 「天皇崩スルトキハ皇嗣即チ踐祚シ祖宗ノ神器ヲ承ク」
 * 譲位ハ皇室典範ニ於テ一切之ヲ認メズ。
 * 天皇ノ地位ハ崩御ニ依リテノミ繼承セラル。
 */
export function 譲位(_呼出元: 權限階級): never {
  throw new 大逆罪例外(
    "不明",
    "譲位ノ試行。皇室典範ハ譲位ヲ認メズ。天皇ノ地位ハ終身ナリ。"
  );
}

// ━━━ 元號生成 ━━━

function 新元號生成(): string {
  // 元號ハ樞密院ノ奏議ニ依リ勅定セラルルモノトス
  // 此處デハ假ノ實装トス
  const 候補: ReadonlyArray<string> = [
    "瑞光", "永明", "天祥", "聖和", "嘉徳",
  ];
  const 選定番號 = Math.floor(Math.random() * 候補.length);
  return 候補[選定番號]!;
}

// ━━━ 現在ノ天皇情報取得（臣民向ケ公開API） ━━━

export function 現天皇情報取得(): Readonly<天皇プロセス> {
  return Object.freeze({ ...現天皇 });
}

// ━━━ 書込防止プロキシ ━━━

/**
 * 帝國議會（@japan-gov）向ケ Import 用プロキシ。
 * Read ハ許可スルモ、Write ヲ試ミタ場合ハ大逆罪例外ヲスロース。
 */
export const 皇室典範ReadOnlyProxy = new Proxy(
  {
    皇位繼承順位簿,
    現天皇情報取得,
    皇嗣選定,
  },
  {
    set(_target, property, _value) {
      throw new 大逆罪例外(
        "帝國議會",
        `皇室典範ノ屬性「${String(property)}」ヘノ書込ミ`
      );
    },
    deleteProperty(_target, property) {
      throw new 大逆罪例外(
        "帝國議會",
        `皇室典範ノ屬性「${String(property)}」ノ削除`
      );
    },
  }
);
