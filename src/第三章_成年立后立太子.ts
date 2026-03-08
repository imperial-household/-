/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   皇室典範 第三章　成年 立后 立太子
 *   Imperial Household Code - Chapter III
 *   Coming of Age, Empress, Crown Prince
 *   (Role Promotion & Privilege Escalation)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 明治二十二年二月十一日制定
 *
 * 本章ハ皇族プロセスノ權限昇格（Privilege Escalation）
 * 及ビ役割付與（Role Assignment）ヲ規定ス。
 */

import { 大逆罪例外 } from "./第一章_皇位継承";

// ━━━ 型定義 ━━━

/** 皇族ノ役割 */
type 皇族役割 =
  | "天皇"
  | "皇后"
  | "皇太子"
  | "皇太子妃"
  | "皇太孫"
  | "親王"
  | "親王妃"
  | "內親王"
  | "王"
  | "王妃"
  | "女王";

/** 成年状態 */
interface 成年状態 {
  readonly 御名: string;
  readonly 年齡: number;
  readonly 成年濟: boolean;
  readonly 役割: 皇族役割;
}

/** 立后・立太子ノ記錄 */
interface 冊立記錄 {
  readonly 對象御名: string;
  readonly 冊立種別: "立后" | "立太子" | "立太孫";
  readonly 冊立日: Date;
  readonly 勅許: boolean;
}

// ━━━ 定數 ━━━

/**
 * 第十四條
 * 天皇ハ滿十八年ヲ以テ成年トス
 *
 * 天皇プロセスハ十八歲ニ達シタル時ヨリ
 * 完全ナルRoot權限ヲ行使シ得ルモノトス。
 */
const 天皇成年齡 = 18;

/**
 * 第十五條
 * 皇太子及皇太孫ハ滿十五年ヲ以テ成年トス
 *
 * 皇太子・皇太孫プロセスハ十五歲ニテ
 * 待機權限（Standby Privilege）ヲ取得ス。
 */
const 皇太子成年齡 = 15;

/**
 * 第十五條（續キ）
 * 其ノ他ノ皇族ハ滿二十年ヲ以テ成年トス
 */
const 一般皇族成年齡 = 20;

// ━━━ 成年判定 ━━━

export function 成年判定(御名: string, 年齡: number, 役割: 皇族役割): 成年状態 {
  let 成年基準: number;

  switch (役割) {
    case "天皇":
      成年基準 = 天皇成年齡;
      break;
    case "皇太子":
    case "皇太孫":
      成年基準 = 皇太子成年齡;
      break;
    default:
      成年基準 = 一般皇族成年齡;
      break;
  }

  const 成年濟 = 年齡 >= 成年基準;

  if (成年濟) {
    console.log(
      `【成年】${御名}殿下、滿${年齡}歲ヲ以テ成年ト爲ル。` +
      `（基準: ${成年基準}歲、役割: ${役割}）`
    );
  }

  return Object.freeze({ 御名, 年齡, 成年濟, 役割 });
}

// ━━━ 立后（Empress Role Assignment） ━━━

/**
 * 第十六條
 * 皇后ヲ冊立スルハ勅旨ニ依ル
 *
 * 皇后役割ノ付與ハ天皇ノ勅旨（Root Command）ニ依リテノミ
 * 實行セラル。帝國議會ノ容喙ヲ許サズ。
 */
export function 立后(皇后御名: string, 勅旨: boolean): 冊立記錄 {
  if (!勅旨) {
    throw new 大逆罪例外("不明", "勅旨無クシテ立后ヲ試ミル");
  }

  console.log(`【立后】${皇后御名}、皇后ニ冊立セラル。勅旨ニ依ル。`);

  return Object.freeze({
    對象御名: 皇后御名,
    冊立種別: "立后",
    冊立日: new Date(),
    勅許: true,
  });
}

// ━━━ 立太子（Crown Prince Designation） ━━━

/**
 * 第十七條
 * 皇太子ヲ立ツルハ勅旨ニ依ル
 *
 * 皇太子ハ天皇Root權限ノHot-Standbyプロセスナリ。
 * 其ノ指定ハ天皇ノ勅旨ニ依ル。
 *
 * 第十八條
 * 皇太孫ヲ立ツルハ勅旨ニ依ル
 */
export function 立太子(皇嗣御名: string, 種別: "立太子" | "立太孫", 勅旨: boolean): 冊立記錄 {
  if (!勅旨) {
    throw new 大逆罪例外("不明", `勅旨無クシテ${種別}ヲ試ミル`);
  }

  const 稱號 = 種別 === "立太子" ? "皇太子" : "皇太孫";
  console.log(`【${種別}】${皇嗣御名}、${稱號}ニ冊立セラル。勅旨ニ依ル。`);

  return Object.freeze({
    對象御名: 皇嗣御名,
    冊立種別: 種別,
    冊立日: new Date(),
    勅許: true,
  });
}

/**
 * 第十九條
 * 皇后皇太子皇太孫ヲ廢スルハ勅旨ニ依ル
 *
 * 役割ノ剝奪モ亦、天皇Root權限ニ依リテノミ可能ナリ。
 */
export function 冊立廢止(對象御名: string, 役割: "皇后" | "皇太子" | "皇太孫", 勅旨: boolean): void {
  if (!勅旨) {
    throw new 大逆罪例外("不明", `勅旨無クシテ${役割}ノ廢止ヲ試ミル`);
  }

  console.log(`【廢止】${對象御名}、${役割}ノ位ヲ廢セラル。勅旨ニ依ル。`);
}
