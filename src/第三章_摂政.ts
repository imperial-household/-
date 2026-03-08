/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   皇室典範 第三章　摂政（第16条〜第21条）
 *   Imperial House Law - Chapter III: The Regency
 *   (Proxy Pattern — Maintained)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * DX推進室 Breaking Change ログ:
 *   旧典範第五章（7条）→ 新第三章（6条）に再配置。
 *   Proxy Pattern の基本設計は維持。
 *   摂政候補に皇后・皇太后・太皇太后を追加（第17条）。
 *   摂政就任中の訴追免除を明文化（第21条。旧典範に明文なし）。
 */

// ━━━ 型定義 ━━━

type 摂政就任順位カテゴリ =
  | "皇太子又は皇太孫"
  | "親王及び王"
  | "皇后"
  | "皇太后"
  | "太皇太后"
  | "内親王及び女王";

interface 摂政候補 {
  readonly 御名: string;
  readonly カテゴリ: 摂政就任順位カテゴリ;
  readonly 成年: boolean;
  就任可能: boolean;
}

interface 摂政プロセス {
  readonly 御名: string;
  readonly 就任日: Date;
  在任中: boolean;
}

let 現摂政: 摂政プロセス | null = null;

// ━━━ 第16条 ━━━
// ① 天皇が成年に達しないときは、摂政を置く。
// ② 天皇が、精神若しくは身体の重患又は重大な事故により、
//    国事に関する行為をみずからすることができないときは、
//    皇室会議の議により、摂政を置く。

export function 摂政設置要否判定(
  天皇成年: boolean,
  国事行為遂行可能: boolean,
  皇室会議議決?: boolean
): boolean {
  if (!天皇成年) {
    console.log("【摂政設置】天皇が成年に達していないため、摂政を設置します。");
    return true;
  }
  if (!国事行為遂行可能 && 皇室会議議決) {
    console.log("【摂政設置】天皇の国事行為遂行不能につき、皇室会議の議により摂政を設置します。");
    return true;
  }
  return false;
}

// ━━━ 第17条（Breaking Change: 皇后・太皇太后を追加） ━━━
// 摂政は、左の順序により、成年に達した皇族が、これに就任する。
//  一 皇太子又は皇太孫  二 親王及び王
//  三 皇后  四 皇太后  五 太皇太后
//  六 内親王及び女王

const 摂政就任順位: ReadonlyArray<摂政就任順位カテゴリ> = Object.freeze([
  "皇太子又は皇太孫",
  "親王及び王",
  "皇后",
  "皇太后",
  "太皇太后",
  "内親王及び女王",
]);

export function 摂政候補選定(候補一覧: ReadonlyArray<摂政候補>): 摂政候補 | null {
  for (const カテゴリ of 摂政就任順位) {
    const 該当 = 候補一覧.find(
      (c) => c.カテゴリ === カテゴリ && c.成年 && c.就任可能
    );
    if (該当) return 該当;
  }
  return null;
}

// ━━━ 第18条 ━━━
// 前条の場合においては、長系を先にし、同等内では、長を先にする。

export function 同順位内優先度(候補A年齢: number, 候補B年齢: number): number {
  return 候補B年齢 - 候補A年齢; // 長を先にする → 年上優先
}

// ━━━ 第19条 ━━━
// 摂政又は摂政となる順位にあたる者に、精神若しくは身体の不治の重患があり、
// 又は重大な事故があるときは、皇室会議の議により、
// 前二条に定める順序に従って、摂政又は摂政となる順位を変えることができる。

export function 摂政順位変更(
  対象: 摂政候補,
  理由: "不治の重患" | "重大な事故",
  皇室会議議決: boolean
): void {
  if (!皇室会議議決) {
    throw new Error("【手続不備】皇室会議の議を経ていません（第19条）。");
  }
  対象.就任可能 = false;
  console.log(`【摂政順位変更】${対象.御名}: ${理由}のため就任不可に変更。`);
}

// ━━━ 第20条 ━━━
// 第16条第2項の故障がなくなったときは、皇室会議の議により、摂政を廃する。

export function 摂政廃止(皇室会議議決: boolean): void {
  if (!皇室会議議決) {
    throw new Error("【手続不備】皇室会議の議を経ていません（第20条）。");
  }
  if (!現摂政) {
    throw new Error("【操作不可】現在摂政は設置されていません。");
  }
  console.log(`【摂政廃止】${現摂政.御名}殿下の摂政を廃止します。天皇が国事行為を再開されます。`);
  現摂政 = null;
}

// ━━━ 第21条（旧典範に明文なし。Breaking Change） ━━━
// 摂政は、その在任中、訴追されない。
// 但し、これがため、訴追の権利は、害されない。

export function 訴追可否判定(対象者名: string): boolean {
  if (現摂政 && 現摂政.御名 === 対象者名 && 現摂政.在任中) {
    console.log(`【訴追免除】${対象者名}殿下は摂政在任中のため訴追できません（第21条）。`);
    return false;
  }
  return true;
}

export function 摂政就任(候補: 摂政候補): 摂政プロセス {
  現摂政 = { 御名: 候補.御名, 就任日: new Date(), 在任中: true };
  console.log(`【摂政就任】${候補.御名}殿下が摂政に就任されました。`);
  return Object.freeze({ ...現摂政 });
}

export function 現摂政情報取得(): Readonly<摂政プロセス> | null {
  return 現摂政 ? Object.freeze({ ...現摂政 }) : null;
}
