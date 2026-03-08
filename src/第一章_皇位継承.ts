/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   皇室典範 第一章　皇位継承（第1条〜第4条）
 *   Imperial House Law - Chapter I: Succession to the Imperial Throne
 *   (Simplified Failover Chain)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 皇室典範（昭和22年1月16日法律第3号）
 *
 * DX推進室 Breaking Change ログ:
 *   旧典範9条 → 新典範4条に圧縮。旧第二章（践祚即位）を吸収。
 *   God Object → Symbol Interface 移行に伴い継承ロジックをリファクタリング。
 *   皇室会議による継承順序の動的変更を新設（第3条）。
 */

// ━━━ 型定義 ━━━

type 性別 = "男" | "女";

interface 皇族 {
  readonly 御名: string;
  readonly 称号: string;
  readonly 性別: 性別;
  readonly 継承順位: number;
  readonly 即位可能: boolean;
}

type 天皇状態 = "在位" | "崩御" | "退位";

interface 天皇プロセス {
  readonly 御名: string;
  readonly 元号: string;
  readonly 即位日: Date;
  状態: 天皇状態;
}

// ━━━ 継承順位簿（令和7年現在） ━━━

const 皇位継承順位簿: ReadonlyArray<皇族> = Object.freeze([
  { 御名: "文仁親王", 称号: "皇嗣秋篠宮殿下", 性別: "男", 継承順位: 1, 即位可能: true },
  { 御名: "悠仁親王", 称号: "悠仁親王殿下", 性別: "男", 継承順位: 2, 即位可能: true },
]);

// ━━━ 現天皇 ━━━

let 現天皇: 天皇プロセス = {
  御名: "徳仁",
  元号: "令和",
  即位日: new Date("2019-05-01T00:00:00+09:00"),
  状態: "在位",
};

// ━━━ 第1条 ━━━
// 皇位は、皇統に属する男系の男子が、これを継承する。

export function 継承資格検査(候補: 皇族): boolean {
  return 候補.性別 === "男" && 候補.即位可能;
}

// ━━━ 第2条 ━━━
// 皇位は、左の順序により、皇族に、これを伝える。
//  一 皇長子  二 皇長孫  三 その他の皇長子の子孫
//  四 皇次子及びその子孫  五 その他の皇子孫
//  六 皇兄弟及びその子孫  七 皇伯叔父及びその子孫
// ② 前項各号の皇族がないときは、最近親の系統の皇族に伝える。
// ③ 長系を先にし、同等内では、長を先にする。

export function 皇位継承順位取得(): ReadonlyArray<皇族> {
  return 皇位継承順位簿;
}

// ━━━ 第3条（旧典範に無し。Breaking Change） ━━━
// 皇嗣に不治の重患又は重大な事故があるときは、皇室会議の議により、
// 継承順序を変えることができる。

export function 継承順序変更(
  対象: 皇族,
  理由: "不治の重患" | "重大な事故",
  皇室会議議決: boolean
): void {
  if (!皇室会議議決) {
    throw new Error("【手続不備】皇室会議の議を経ていません。");
  }
  console.log(`【継承順序変更】${対象.御名}殿下: ${理由}のため順序変更。`);
}

// ━━━ 第4条（旧第二章4条分を吸収） ━━━
// 天皇が崩じたときは、皇嗣が、直ちに即位する。

function 皇嗣選定(): 皇族 {
  const 候補 = 皇位継承順位簿.find((p) => 継承資格検査(p));
  if (!候補) throw new Error("【皇位空位】皇嗣不在。皇室会議の緊急招集が必要。");
  return 候補;
}

export function 即位(): 天皇プロセス {
  if (現天皇.状態 === "在位") {
    throw new Error("【操作不可】現天皇は在位中です。");
  }
  const 次 = 皇嗣選定();
  現天皇 = { 御名: 次.御名, 元号: "（政令で定める）", 即位日: new Date(), 状態: "在位" };
  console.log(`【即位】${現天皇.御名}陛下が即位されました。`);
  return Object.freeze({ ...現天皇 });
}

export function 崩御(): void {
  console.log(`【崩御】${現天皇.御名}陛下が崩御されました。`);
  現天皇.状態 = "崩御";
  即位();
}

export function 退位(): 天皇プロセス {
  console.log(`【退位】${現天皇.御名}陛下が退位されます。皇室典範特例法に基づく手続き。`);
  現天皇.状態 = "退位";
  return 即位();
}

export function 現天皇情報取得(): Readonly<天皇プロセス> {
  return Object.freeze({ ...現天皇 });
}
