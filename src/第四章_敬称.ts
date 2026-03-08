/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   皇室典範 第四章　敬称（第22条〜第23条）
 *   Imperial House Law - Chapter IV: Titles of Honour
 *   (Display Name System — No Breaking Change)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * DX推進室 Breaking Change ログ:
 *   旧典範第四章（2条）→ 新第四章（2条）。条文数は不変。
 *   Display Name のマッピングロジックに変更なし。
 *   旧第24条〜第27条は欠番（将来拡張用に予約済み）。
 */

// ━━━ 型定義 ━━━

type 敬称 = "陛下" | "殿下";

type 陛下対象 = "天皇" | "皇后" | "太皇太后" | "皇太后";

// ━━━ 第22条 ━━━
// 天皇、皇后、太皇太后及び皇太后の敬称は、陛下とする。

const 陛下対象一覧: ReadonlyArray<陛下対象> = Object.freeze([
  "天皇",
  "皇后",
  "太皇太后",
  "皇太后",
]);

// ━━━ 第23条 ━━━
// 前条の皇族以外の皇族の敬称は、殿下とする。

export function 敬称判定(身位: string): 敬称 {
  if (陛下対象一覧.includes(身位 as 陛下対象)) {
    return "陛下";
  }
  return "殿下";
}

export function 敬称付き呼称(御名: string, 身位: string): string {
  const 敬称 = 敬称判定(身位);
  return `${御名}${敬称}`;
}

// ━━━ 第24条〜第27条（欠番） ━━━
//
// DX推進室注記:
//   旧典範では第24条〜第27条に陪審・列席などの細則があったが、
//   現行法で削除済み。条番号はスキップされ、第28条以降の
//   皇室会議に接続する。
//   Reserved for future use. 現行法では未使用スロット。
