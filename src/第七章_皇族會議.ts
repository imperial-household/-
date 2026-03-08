/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   皇室典範 第七章　皇族會議
 *   Imperial Household Code - Chapter VII
 *   Imperial Family Council (Consensus Mechanism)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 明治二十二年二月十一日制定
 *
 * 皇族會議ハ皇室ニ關スル重大事項ヲ審議スル
 * 合議機構（Consensus Mechanism）ナリ。
 * 議長ハ天皇陛下ニシテ、議決ハ多數決ニ依ル。
 */

import { 大逆罪例外 } from "./第一章_皇位継承";

// ━━━ 型定義 ━━━

/** 皇族會議構成員 */
interface 會議構成員 {
  readonly 御名: string;
  readonly 資格: string;
  readonly 議決權: boolean;
}

/** 議案 */
interface 議案 {
  readonly 件名: string;
  readonly 提出者: string;
  readonly 提出日: Date;
  readonly 內容: string;
}

/** 議決結果 */
interface 議決結果 {
  readonly 議案: 議案;
  readonly 贊成: number;
  readonly 反對: number;
  readonly 可決: boolean;
  readonly 議決日: Date;
}

// ━━━ 皇族會議構成 ━━━

/**
 * 第四十三條
 * 皇族會議ハ成年以上ノ皇族男子ヲ以テ之ヲ組織ス
 *
 * 第四十四條
 * 皇族會議ハ天皇之ヲ親裁ス
 *
 * 天皇ガ議長（Chair）ヲ務メ、
 * 成年以上ノ男性皇族ガ議決權ヲ有ス。
 */
export function 皇族會議構成(
  議長御名: string,
  構成員一覽: ReadonlyArray<{ 御名: string; 資格: string }>,
): ReadonlyArray<會議構成員> {
  const 完全構成: 會議構成員[] = [
    {
      御名: 議長御名,
      資格: "天皇（議長）",
      議決權: true,
    },
    ...構成員一覽.map((員) => ({
      御名: 員.御名,
      資格: 員.資格,
      議決權: true,
    })),
  ];

  console.log("━━━ 皇族會議構成 ━━━");
  console.log(`【議長】${議長御名}陛下`);
  for (const 員 of 完全構成) {
    console.log(`  ✦ ${員.御名}（${員.資格}）`);
  }

  return Object.freeze(完全構成);
}

// ━━━ 議案審議 ━━━

/**
 * 第四十五條
 * 皇族會議ニ於テ審議スヘキ事件ハ
 * 左ノ各號ニ依ル
 *
 * 一 皇位繼承ノ順序ニ關スル事件
 * 二 攝政ヲ置クノ事件
 * 三 皇族ノ婚姻ニ關スル事件
 * 四 皇族ノ臣籍入ニ關スル事件
 * 五 其ノ他皇室ニ關スル重要ノ事件
 */
const 審議對象事件: ReadonlyArray<string> = Object.freeze([
  "皇位繼承ノ順序ニ關スル事件",
  "攝政ヲ置クノ事件",
  "皇族ノ婚姻ニ關スル事件",
  "皇族ノ臣籍入ニ關スル事件",
  "其ノ他皇室ニ關スル重要ノ事件",
]);

export function 議案提出(件名: string, 提出者: string, 內容: string): 議案 {
  const 適格 = 審議對象事件.some((事件) => 件名.includes(事件) || 內容.includes(事件));

  if (!適格) {
    throw new 大逆罪例外(
      提出者,
      `「${件名}」ハ皇族會議ノ審議對象ニ非ズ。第四十五條ヲ參照セヨ。`
    );
  }

  const 新議案: 議案 = Object.freeze({
    件名,
    提出者,
    提出日: new Date(),
    內容,
  });

  console.log(`【議案提出】「${件名}」（提出者: ${提出者}）`);

  return 新議案;
}

// ━━━ 議決（Consensus Vote） ━━━

/**
 * 第四十六條
 * 皇族會議ノ議事ハ過半數ヲ以テ之ヲ決ス
 * 可否同數ナルトキハ議長之ヲ決ス
 *
 * 多數決（Majority Vote）ニ依ル議決。
 * 同數ノ場合ハ天皇（議長）ニ決定權アリ。
 */
export function 議決(
  議案: 議案,
  贊成票: number,
  反對票: number,
  議長裁定: boolean | null,
): 議決結果 {
  let 可決: boolean;

  if (贊成票 > 反對票) {
    可決 = true;
  } else if (反對票 > 贊成票) {
    可決 = false;
  } else {
    // 可否同數: 議長裁定
    if (議長裁定 === null) {
      throw new Error("【錯誤】可否同數ニシテ議長裁定ガ未指定ナリ。");
    }
    可決 = 議長裁定;
    console.log("【議長裁定】可否同數ニ付キ、天皇陛下之ヲ裁定シ給フ。");
  }

  const 結果: 議決結果 = Object.freeze({
    議案,
    贊成: 贊成票,
    反對: 反對票,
    可決,
    議決日: new Date(),
  });

  console.log(
    `【議決】「${議案.件名}」: ${可決 ? "可決" : "否決"}` +
    `（贊成${贊成票} / 反對${反對票}）`
  );

  return 結果;
}
