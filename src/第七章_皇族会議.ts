/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   皇室典範 第七章　皇族会議
 *   Imperial House Law - Chapter VII
 *   Imperial Family Council (Consensus Mechanism)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 旧皇室典範（明治22年2月11日勅定）
 * ※ 昭和22年廃止
 *
 * DX推進室注:
 *   旧典範の「皇族会議」は皇族男子のみで構成されていましたが、
 *   現行皇室典範第28条〜第37条の「皇室会議」は
 *   皇族2名・衆参両院の議長副議長・内閣総理大臣・
 *   宮内庁長官・最高裁長官等で構成されています。
 *   Breaking Change: 議長が天皇→内閣総理大臣に変更。
 */

import { 旧典範制約違反 } from "./第一章_皇位継承";

// ━━━ 型定義 ━━━

/** 皇族会議構成員 */
interface 会議構成員 {
  readonly 御名: string;
  readonly 資格: string;
  readonly 議決権: boolean;
}

/** 議案 */
interface 議案 {
  readonly 件名: string;
  readonly 提出者: string;
  readonly 提出日: Date;
  readonly 内容: string;
}

/** 議決結果 */
interface 議決結果 {
  readonly 議案: 議案;
  readonly 賛成: number;
  readonly 反対: number;
  readonly 可決: boolean;
  readonly 議決日: Date;
}

// ━━━ 皇族会議構成 ━━━

/**
 * 第四十三条〜第四十四条
 *
 * ※ 宮内庁注: 旧典範では天皇が議長でしたが、
 *   現行の「皇室会議」では内閣総理大臣が議長です。
 *   天皇は象徴であり、国政に関与しません。
 */
export function 皇族会議構成(
  議長御名: string,
  構成員一覽: ReadonlyArray<{ 御名: string; 資格: string }>,
): ReadonlyArray<会議構成員> {
  const 完全構成: 会議構成員[] = [
    {
      御名: 議長御名,
      資格: "議長",
      議決権: true,
    },
    ...構成員一覽.map((員) => ({
      御名: 員.御名,
      資格: 員.資格,
      議決権: true,
    })),
  ];

  console.log("━━━ 皇族会議構成 ━━━");
  console.log(`【議長】${議長御名}`);
  for (const 員 of 完全構成) {
    console.log(`  ✦ ${員.御名}（${員.資格}）`);
  }

  return Object.freeze(完全構成);
}

// ━━━ 議案審議 ━━━

/**
 * 第四十五条
 *
 * ※ 宮内庁注: 現行の「皇室会議」の審議事項は
 *   皇室典範第28条に定められています:
 *   皇位継承の順序変更、立后、摂政の設置・廃止、
 *   皇族の婚姻許可・皇籍離脱等。
 */
const 審議対象事件: ReadonlyArray<string> = Object.freeze([
  "皇位継承の順序に関する事件",
  "摂政を置く事件",
  "皇族の婚姻に関する事件",
  "皇族の皇籍離脱に関する事件",
  "その他皇室に関する重要な事件",
]);

export function 議案提出(件名: string, 提出者: string, 内容: string): 議案 {
  const 適格 = 審議対象事件.some((事件) => 件名.includes(事件) || 内容.includes(事件));

  if (!適格) {
    throw new 旧典範制約違反(
      提出者,
      `「${件名}」は皇族会議の審議対象外です。第四十五条をご参照ください。`
    );
  }

  const 新議案: 議案 = Object.freeze({
    件名,
    提出者,
    提出日: new Date(),
    内容,
  });

  console.log(`【議案提出】「${件名}」（提出者: ${提出者}）`);

  return 新議案;
}

// ━━━ 議決（Consensus Vote） ━━━

/**
 * 第四十六条
 * 皇族会議の議事は過半数をもってこれを決する
 *
 * ※ 宮内庁注: 現行の皇室会議でも過半数で議決し、
 *   可否同数のときは議長が決します（皇室典範第36条）。
 */
export function 議決(
  議案: 議案,
  賛成票: number,
  反対票: number,
  議長裁定: boolean | null,
): 議決結果 {
  let 可決: boolean;

  if (賛成票 > 反対票) {
    可決 = true;
  } else if (反対票 > 賛成票) {
    可決 = false;
  } else {
    if (議長裁定 === null) {
      throw new Error("【エラー】可否同数ですが議長裁定が指定されていません。");
    }
    可決 = 議長裁定;
    console.log("【議長裁定】可否同数につき、議長がこれを裁定しました。");
  }

  const 結果: 議決結果 = Object.freeze({
    議案,
    賛成: 賛成票,
    反対: 反対票,
    可決,
    議決日: new Date(),
  });

  console.log(
    `【議決】「${議案.件名}」: ${可決 ? "可決" : "否決"}` +
    `（賛成${賛成票} / 反対${反対票}）`
  );

  return 結果;
}
