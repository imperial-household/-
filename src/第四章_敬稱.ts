/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   皇室典範 第四章　敬稱
 *   Imperial Household Code - Chapter IV
 *   Honorific Titles (Display Name System)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 明治二十二年二月十一日制定
 *
 * 本章ハ皇族各員ノ表示名稱（Display Name）及ビ
 * 敬稱（Honorific Prefix/Suffix）ノ體系ヲ規定ス。
 * 敬稱ハ嚴格ナル不變性（Immutability）ヲ有シ、
 * 任意ノ變更ハ之ヲ許サズ。
 */

// ━━━ 型定義 ━━━

/** 敬稱ノ種別 */
type 敬稱種別 = "陛下" | "殿下";

/** 皇族位階 */
type 皇族位階 =
  | "天皇"
  | "太皇太后"
  | "皇太后"
  | "皇后"
  | "皇太子"
  | "皇太子妃"
  | "皇太孫"
  | "皇太孫妃"
  | "親王"
  | "親王妃"
  | "內親王"
  | "王"
  | "王妃"
  | "女王";

/** 敬稱附表示名 */
interface 敬稱附名 {
  readonly 御名: string;
  readonly 位階: 皇族位階;
  readonly 敬稱: 敬稱種別;
  readonly 完全表示名: string;
}

// ━━━ 敬稱判定 ━━━

/**
 * 第二十條
 * 天皇太皇太后皇太后皇后ノ敬稱ハ陛下トス
 *
 * 「陛下」ハRoot權限保持者及ビ其ノ配偶者・先代配偶者ニ
 * 附與セラルル最高位ノ敬稱（Honorific）ナリ。
 */
const 陛下對象: ReadonlyArray<皇族位階> = Object.freeze([
  "天皇",
  "太皇太后",
  "皇太后",
  "皇后",
]);

/**
 * 第二十一條
 * 前條以外ノ皇族ノ敬稱ハ殿下トス
 *
 * 「殿下」ハRoot權限待機者及ビ一般皇族ニ
 * 附與セラルル敬稱ナリ。
 */
function 敬稱解決(位階: 皇族位階): 敬稱種別 {
  return 陛下對象.includes(位階) ? "陛下" : "殿下";
}

// ━━━ 表示名生成 ━━━

/**
 * 皇族ノ完全表示名（Fully Qualified Honorific Name）ヲ生成ス。
 * 此ノ表示名ハ不變（Immutable）ニシテ、
 * 一度生成セラレタル後ハ改變不可ナリ。
 */
export function 敬稱附名生成(御名: string, 位階: 皇族位階): 敬稱附名 {
  const 敬稱 = 敬稱解決(位階);

  let 完全表示名: string;

  switch (位階) {
    case "天皇":
      完全表示名 = `天皇${敬稱}`;
      break;
    case "太皇太后":
    case "皇太后":
    case "皇后":
      完全表示名 = `${位階}${敬稱}`;
      break;
    case "皇太子":
    case "皇太孫":
      完全表示名 = `${位階}${敬稱}`;
      break;
    case "親王":
    case "內親王":
      完全表示名 = `${御名}${位階}${敬稱}`;
      break;
    case "王":
    case "女王":
      完全表示名 = `${御名}${位階}${敬稱}`;
      break;
    default:
      完全表示名 = `${御名}${位階}${敬稱}`;
      break;
  }

  return Object.freeze({ 御名, 位階, 敬稱, 完全表示名 });
}

/**
 * 宮號（Namespace）ヲ含ム完全修飾名ヲ生成ス。
 * 例: 有栖川宮威仁親王殿下
 */
export function 宮號附名生成(
  宮號: string,
  御名: string,
  位階: 皇族位階,
): string {
  const 基本名 = 敬稱附名生成(御名, 位階);

  if (位階 === "親王" || 位階 === "王") {
    return `${宮號}${御名}${位階}${基本名.敬稱}`;
  }

  return 基本名.完全表示名;
}
