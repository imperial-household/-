/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   皇室典範 第九章　皇室經費
 *   Imperial Household Code - Chapter IX
 *   Imperial Household Budget
 *   (Resource Allocation & Quota Management)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 明治二十二年二月十一日制定
 *
 * 本章ハ皇室經費（Resource Quota）ノ定額確保及ビ
 * 帝國議會ノ容喙排除ヲ規定ス。
 * 皇室經費ハ國家豫算ノ外ニ在リ、
 * 帝國議會ノ協贊ヲ要セズ。
 */

import { 大逆罪例外 } from "./第一章_皇位継承";

// ━━━ 型定義 ━━━

/** 經費種別 */
type 經費種別 = "定額" | "增額";

/** 皇室經費 */
interface 皇室經費 {
  readonly 年度: number;       // 皇紀
  readonly 種別: 經費種別;
  readonly 金額: number;       // 圓
  readonly 議會協贊要否: boolean;
}

/** 經費增額要求 */
interface 增額要求 {
  readonly 要求元: string;
  readonly 增額金額: number;
  readonly 事由: string;
  readonly 議會協贊要否: boolean;
}

// ━━━ 定額經費 ━━━

/**
 * 第五十條
 * 皇室經費ノ定額ハ毎年ノ豫算ニ計上シ
 * 帝國議會ノ協贊ヲ要セス
 *
 * 皇室經費ノ定額（Base Quota）ハ國家豫算ニ
 * 自動的ニ計上セラレ、帝國議會ノ承認ヲ要セズ。
 * 即チ、Reserved Resource ニシテ他プロセスノ
 * 容喙ヲ許サザル保證濟資源ナリ。
 */
const 定額經費基準: number = 300_0000; // 三百萬圓（明治二十二年基準）

export function 定額經費算定(年度: number): 皇室經費 {
  const 經費: 皇室經費 = Object.freeze({
    年度,
    種別: "定額",
    金額: 定額經費基準,
    議會協贊要否: false, // 帝國議會ノ協贊ヲ要セズ
  });

  console.log(
    `【皇室經費】皇紀${年度}年度 定額經費: ${經費.金額.toLocaleString()}圓` +
    `（帝國議會ノ協贊ヲ要セズ）`
  );

  return 經費;
}

// ━━━ 增額 ━━━

/**
 * 第五十一條
 * 皇室經費ノ增額ヲ要スルトキハ
 * 帝國議會ノ協贊ニ依ル
 *
 * 定額ヲ超ユル增額（Quota Increase）ニ限リ、
 * 帝國議會ノ協贊（Approval）ヲ要ス。
 * 但シ協贊ハ增額ニ限リ要求セラルルモノニシテ、
 * 定額ノ減額ハ一切試ミルコトヲ得ズ。
 */
export function 增額要求提出(
  事由: string,
  增額金額: number,
): 增額要求 {
  if (增額金額 <= 0) {
    throw new 大逆罪例外(
      "帝國議會",
      "皇室經費ノ減額ヲ試ミル。定額ノ減額ハ之ヲ許サズ。"
    );
  }

  const 要求: 增額要求 = Object.freeze({
    要求元: "宮內省",
    增額金額,
    事由,
    議會協贊要否: true,
  });

  console.log(
    `【增額要求】事由: ${事由}、金額: ${增額金額.toLocaleString()}圓` +
    `（帝國議會ノ協贊ヲ要ス）`
  );

  return 要求;
}

/**
 * 帝國議會ニ依ル增額ノ協贊。
 */
export function 增額協贊(要求: 增額要求, 協贊: boolean): 皇室經費 | null {
  if (!協贊) {
    console.log(
      `【增額否決】帝國議會、增額要求ヲ否決ス。` +
      `（金額: ${要求.增額金額.toLocaleString()}圓）`
    );
    return null;
  }

  const 增額經費: 皇室經費 = Object.freeze({
    年度: 0, // 別途指定
    種別: "增額",
    金額: 要求.增額金額,
    議會協贊要否: true,
  });

  console.log(
    `【增額可決】帝國議會、增額ヲ協贊ス。` +
    `（金額: ${要求.增額金額.toLocaleString()}圓）`
  );

  return 增額經費;
}

// ━━━ 減額ノ永久禁止 ━━━

/**
 * 定額ノ減額ハ皇室典範ニ於テ一切之ヲ認メズ。
 * 皇室經費ハ國體ノ尊嚴ヲ維持スル爲ニ
 * 不可減（Non-Decreasing）ノ保證ヲ有ス。
 */
export function 減額禁止檢査(試行金額: number): void {
  if (試行金額 < 定額經費基準) {
    throw new 大逆罪例外(
      "帝國議會",
      `皇室經費ヲ${試行金額.toLocaleString()}圓ニ減額セントス。` +
      `定額${定額經費基準.toLocaleString()}圓ヲ下回ルコトハ斷ジテ之ヲ許サズ。`
    );
  }
}
