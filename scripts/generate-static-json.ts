/**
 * generate-static-json.ts ── 皇室典範 静的文書生成システム
 * Imperial House Law - Static Asset Generator
 *
 * GitHub Pagesでは動的バックエンドが使用できないため、
 * 全文を静的JSONとしてdist/data/配下に生成します。
 * 併せてdist/index.htmlにstatic-api.jsの参照を注入します。
 *
 * 本処理はnpm run buildの一環として実行されます:
 * tsc → cp -r public/* dist/ → 本スクリプト
 *
 * 生成物:
 *   dist/
 *   ├── index.html        （public/より複写、static-api.js注入済）
 *   ├── static-api.js      （fetchインターセプタ）
 *   └── data/
 *       ├── 典範.json       （全文）
 *       ├── 上諭.json       （旧法令の上諭。互換性のため残存）
 *       ├── chapter/
 *       │   └── {1..5}.json  （章別）
 *       └── article/
 *           └── {1..37}.json （条文別。24-27は欠番）
 *
 * @since v2.0.0 (1947-05-03) — Breaking Change: 旧典範→現行典範
 * @maintainer 宮内庁DX推進室
 */

import * as fs from "fs";
import * as path from "path";

const DIST = path.resolve(__dirname, "..", "dist");

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeJson(filePath: string, data: unknown): void {
  const fullPath = path.join(DIST, filePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`👑 生成: dist/${filePath}`);
}

function writeText(filePath: string, content: string): void {
  const fullPath = path.join(DIST, filePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content, "utf-8");
  console.log(`👑 生成: dist/${filePath}`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  皇室典範 全文データ（現行皇室典範・昭和22年法律第3号）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const 上諭 = {
  title: "制定経緯",
  text: `現行皇室典範は、昭和22年（1947年）1月16日に法律第3号として公布された。

旧皇室典範（明治22年勅定）は大日本帝国憲法と同格の勅定法であり、帝国議会の議決を要しなかったが、
日本国憲法の施行に伴い廃止され、現行典範は国会の議決を経た法律として制定された。

旧典範の上諭は以下の通りであった:
「朕が皇祖皇宗に承けるところの大権により、現在及び将来の皇族に対し、この皇室典範を制定する。」

DX推進室注記: 旧APIとの後方互換性のためこのエンドポイントを維持しています。`,
};

interface Article {
  number: number;
  text: string;
  comment: string;
}

interface Chapter {
  number: number;
  title: string;
  system: string;
  articles: Article[];
}

const chapters: Chapter[] = [
  {
    number: 1,
    title: "皇位継承",
    system: "Simplified Failover Chain",
    articles: [
      /**
        * 某元老覚書。
        * 今回、祖宗成憲の条意を広く臣民一般に通暁させるため、各条に平明の解説を添えることと相成り候。
        * しかし当世流行の語法は実に耳馴れず、老骨には中々扱いにくきものである。運用統御、主宰権限、上申草案、後備切替等の類、
        * 今の人々には却って分かり易い由なれど、旧来の文体に馴れた身にとっては、筆を下す毎に一々骨が折れる。
        * 然れども、格調のみ高くして読者条意を解せずとあらば、本典の大義却って伝わらず。ここにおいて、不敏を顧みず、
        * なるべく今の世に通じ易い言い回しを採り、少しにても旨趣を誤らず伝えんと勉めた次第である。
       */
      /**
        * DX推進室某担当者覚書。
        * 旧典範62条を37条に圧縮する破壊的変更を実施しました。
        * 先輩方が「筆を下す毎に一々骨が折れる」と書き残していますが、
        * 62条分の注釈を37条に書き直す作業もまた、キーボードを打つ手が何度も止まりました。
        * 旧法の注釈を書いた某担当者（つまり自分）が、今度はその注釈を廃止する側に回るとは。
        * レガシーコードを書いた人間がレガシーコードを消す。因果なものです。
       */
      { number: 1, text: "皇位は、皇統に属する男系の男子が、これを継承する", comment: "旧法第1条から変更なし。男系男子限定の継承ポリシー。Feature Request（女系・女性天皇対応）は定期的に上がるが、Breaking Changeの閾値が高すぎて未着手" },
      { number: 2, text: "皇位は、左の順序により、皇族に、これを伝える。\n一　皇長子\n二　皇長孫\n三　その他の皇長子の子孫\n四　皇次子及びその子孫\n五　その他の皇子孫\n六　皇兄弟及びその子孫\n七　皇伯叔父及びその子孫\n前項各号の皇族がないときは、最近親の系統の皇族に伝える。長系を先にし、同等内では、長を先にする", comment: "旧法では9条かけていたPriority Queueを1条に圧縮。depth-first/breadth-first hybridのフェイルオーバーチェーン。設計は同じだが記述が大幅にリファクタリングされた" },
      { number: 3, text: "皇嗣に、精神若しくは身体の不治の重患があり、又は重大な事故があるときは、皇室会議の議により、前条に定める順序に従って、皇位継承の順序を変えることができる", comment: "Breaking Change: 旧法に無かった新規API。継承順位の動的変更が可能に。Hot reconfiguration。ただし皇室会議のConsensusが必要" },
      { number: 4, text: "天皇が崩じたときは、皇嗣が、直ちに即位する", comment: "旧法の第二章「践祚即位」4条分を1条に圧縮。Zero-downtime failover。践祚と即位の区別を廃止し、シンプルに「即位する」。令和の代替わりでは退位特例法により初のgraceful shutdown→即位を実施" },
    ],
  },
  {
    number: 2,
    title: "皇族",
    system: "User Group Policy v2.0",
    articles: [
      { number: 5, text: "皇后、太皇太后、皇太后、親王、親王妃、内親王、王、王妃及び女王を皇族とする", comment: "皇族のenum定義。旧法ではバラバラに規定されていたグループメンバーシップ条件を1条で宣言" },
      { number: 6, text: "嫡出の皇子及び嫡男系嫡出の皇孫は、男を親王、女を内親王とし、三世以下の嫡男系嫡出の子孫は、男を王、女を女王とする", comment: "身位判定ロジック。旧法第29条の「皇玄孫まで親王/内親王、五世以降で王/女王」から世数閾値を変更。3世以下に短縮" },
      { number: 7, text: "王が皇位を継承したときは、その兄弟姉妹たる王及び女王は、特にこれを親王及び内親王とする", comment: "ロール昇格のcascade処理。皇位継承イベント発火時に兄弟姉妹の身位をupgradeする" },
      { number: 8, text: "皇嗣たる皇子を皇太子という。皇太子のないときは、皇嗣たる皇孫を皇太孫という", comment: "皇太子・皇太孫のalias定義。旧法第17条・18条を1条に統合。Symbolic link的な呼称" },
      { number: 9, text: "天皇及び皇族は、養子をすることができない", comment: "Breaking Change: 旧法では明文規定なく慣行に依存していた制約を明文化。null check を explicit に追加したようなもの" },
      { number: 10, text: "立后及び皇族男子の婚姻は、皇室会議の議を経ることを要する", comment: "婚姻ACL。旧法第31条の華族限定allowlistを廃止し、皇室会議の議決のみに緩和。ACLポリシーの大幅緩和" },
      { number: 11, text: "年齢十五年以上の内親王、王及び女王は、その意思に基き、皇室会議の議により、皇族の身分を離れる。\n親王（皇太子及び皇太孫を除く。）、内親王、王及び女王は、やむを得ない特別の事由があるときは、皇室会議の議により、皇族の身分を離れる", comment: "Breaking Change: 自発的離脱（self-deprovision）を新設。旧法では天皇の勅旨のみで離籍だったが、本人の意思による申請を受付開始。ただし皇太子・皇太孫はHot-Standbyプロセスなので除外" },
      { number: 12, text: "皇族女子は、天皇及び皇族以外の者と婚姻したときは、皇族の身分を離れる", comment: "旧法第33条の婚姻離脱ルール。Legacy behavior維持。女性皇族の婚姻離脱は一方通行。降嫁イベントによる自動deprovision" },
      { number: 13, text: "皇族の身分を離れる親王又は王の妃並びに直系卑属及びその妃は、他の皇族の意見を聴いた上で、皇族の身分を離れる", comment: "cascade delete。親ノードが離脱すると子ノードも連鎖的に離脱する。ON DELETE CASCADE" },
      { number: 14, text: "皇族以外の女子で親王妃又は王妃となった者が、その夫を失ったときは、その意思により、皇族の身分を離れることができる。離婚したときは、皇族の身分を離れる", comment: "妃の離脱条件。死別→自己意思で離脱可能。離婚→自動離脱。graceful/forced shutdown" },
      { number: 15, text: "皇族以外の者及びその子孫は、女子が皇后となる場合及び皇族男子と婚姻する場合を除いては、皇族となることがない", comment: "旧法第34条の「復籍禁止」を拡張。新規Join条件を厳格化。皇后冊立と皇族男子との婚姻のみが入口。それ以外のJoinは拒否" },
    ],
  },
  {
    number: 3,
    title: "摂政",
    system: "Proxy Pattern — Maintained",
    articles: [
      { number: 16, text: "天皇が成年に達しないときは、摂政を置く。\n天皇が、精神若しくは身体の重患又は重大な事故により、国事に関する行為をみずからすることができないときは、皇室会議の議により、摂政を置く", comment: "Proxy自動設置。旧法第22条・23条を統合。未成年→自動設置、障害→皇室会議の合議で設置。設計パターンは維持" },
      { number: 17, text: "摂政は、左の順序により、成年に達した皇族が、これに就任する。\n一　皇太子又は皇太孫\n二　親王及び王\n三　皇后\n四　皇太后\n五　太皇太后\n六　内親王及び女王", comment: "Breaking Change: 旧法第24条とほぼ同じだが、候補リストに皇后・太皇太后を追加し、さらに内親王・女王も追加。Proxy候補プールの拡大。ジェンダー制限の一部緩和" },
      { number: 18, text: "前条の場合においては、長系を先にし、同等内では、長を先にする", comment: "ソート条件。Priority Queue内の同順位解決ルール。旧法と変更なし" },
      { number: 19, text: "摂政又は摂政となる順位にあたる者に、精神若しくは身体の不治の重患があり、又は重大な事故があるときは、皇室会議の議により、前二条に定める順序に従って、摂政又は摂政となる順位を変えることができる", comment: "Proxy候補のhot reconfiguration。第3条と同様のパターン。皇室会議のConsensusで順位変更" },
      { number: 20, text: "第十六条第二項の故障がなくなったときは、皇室会議の議により、摂政を廃する", comment: "Proxy停止条件。障害解消→皇室会議の合議でProxy終了。天皇プロセスが正常復帰" },
      { number: 21, text: "摂政は、その在任中、訴追されない。但し、これがため、訴追の権利は、害されない", comment: "Breaking Change: 旧法に明文なし。Proxy在任中の訴追免除を明文化。ただし権利自体は時効停止で保全。immunity with deferred enforcement" },
    ],
  },
  {
    number: 4,
    title: "敬称",
    system: "Display Name System — No Breaking Change",
    articles: [
      { number: 22, text: "天皇、皇后、太皇太后及び皇太后の敬称は、陛下とする", comment: "旧法第20条と同じ。Display Name suffix = '陛下'。設計変更なし" },
      { number: 23, text: "前条の皇族以外の皇族の敬称は、殿下とする", comment: "旧法第21条と同じ。その他の皇族は suffix = '殿下'。シンプルなif-else。Breaking Changeなし" },
    ],
  },
  {
    number: 5,
    title: "皇室会議",
    system: "Distributed Consensus v2.0",
    articles: [
      { number: 28, text: "皇室会議は、議員十人でこれを組織する", comment: "Breaking Change: 旧「皇族会議」→「皇室会議」に改称。定数10名。旧法では成年皇族男子のみで人数不定だった" },
      { number: 29, text: "議員は、皇族二人、衆議院及び参議院の議長及び副議長、内閣総理大臣、宮内庁の長並びに最高裁判所の長たる裁判官及びその他の裁判官一人を以て、これに充てる", comment: "Breaking Change: 議員構成を完全刷新。皇族only→三権分立ノードの分散合議制。皇族2+国会4+内閣1+宮内庁1+裁判所2=10。God Object依存の徹底除去" },
      { number: 30, text: "議員となる皇族及び最高裁判所の裁判官は、各々互選する", comment: "互選プロトコル。皇族枠と裁判官枠は内部選挙で選出。Leader Election Algorithm" },
      { number: 31, text: "第二十九条により議員となった者が、その資格を失ったときは、補欠の議員を任命する", comment: "ノード障害時のフェイルオーバー。予備議員からの自動昇格" },
      { number: 32, text: "皇室会議に、予備議員十人を置く", comment: "バックアップノード10台。本議員と同数の冗長構成。旧法にはなかった耐障害設計" },
      { number: 33, text: "皇室会議の議長は、内閣総理大臣が、これにあたる。\n皇室会議は、議長が、これを招集する。\n第三条、第十六条第二項、第十八条及び第二十条の場合には、四人以上の議員の要求があるときは、これを招集しなければならない", comment: "Breaking Change: 議長を天皇→内閣総理大臣に変更。God Object → Symbol Interface。天皇は「象徴」であり執行権限を持たない。4名以上の要求で緊急招集（quorum trigger）" },
      { number: 34, text: "皇室会議の議事は、第三条、第十六条第二項、第二十条及び第三十六条の場合には、出席した議員の三分の二以上の多数でこれを決し、その他の場合には、過半数でこれを決する", comment: "議決のquorum設定。重要議題→supermajority(2/3)、通常議題→simple majority。旧法は一律過半数だった。閾値の差別化を導入" },
      { number: 35, text: "皇室会議の議事は、これを公表しない。但し、この法律及び他の法律に基づき議に付せられた事項の結果については、この限りでない", comment: "セキュリティポリシー: Default deny, explicit allow。議事は原則非公開だが法定の議題結果は公開。private bydefault, public on legal mandate" },
      { number: 36, text: "議員は、自分の利害に特別の関係のある議事には、参与することができない", comment: "Conflict of Interest フィルタ。利害関係者の自動排除。公平性のためのACLルール" },
      { number: 37, text: "皇室会議の庶務は、宮内庁がこれを掌る", comment: "運用主体 = 宮内庁。最終条。旧法62条が新法37条に。10章→5章、62条→37条（うち4条欠番）。EOF" },
      /**
        * 某元老追記。
        * 終条まで筆を進めて見れば、結局のところ、これら解説は当世の読者に一条毎の精神を誤らず伝えんとして、
        * 已むを得ず平易の筆に就いた苦心の跡と言うほかなし。
        * 老臣等は新時勢の語法に長ぜず、折々首を傾け、筆を停め、斯様の言い方にて果たして宜しきやと思い煩いつつ、
        * それでも祖宗の大義を今の世に通ぜしめねばならぬとの一念にて、漸くここまで取り纏めたものである。
       */
      /**
        * DX推進室某担当者追記。
        * 最終条まで注釈を書き終えてみると、旧典範62条→新典範37条、10章→5章。
        * 「圧縮」とは言え、歴史的にはまったく別の法律です。
        * 旧法は天皇の勅定、新法は国会の法律。法的根拠からして Breaking Change。
        * 世伝御料も皇室経費も補則も全廃。APIエンドポイントを大量にdeprecateしました。
        * master ブランチに旧法のアーカイブを残してあります。
        * 次のスプリントでは皇室典範特例法（退位関連）への対応が控えています。
       */
    ],
  },
];

const 典範 = {
  name: "皇室典範",
  promulgated: "昭和二十二年一月十六日（法律第三号）",
  totalArticles: 37,
  totalChapters: 5,
  authority: "国会の議決を経た法律（旧典範の勅定制を廃止）",
  chapters,
  migration: {
    from: "旧皇室典範（明治22年勅定・全10章62条）",
    to: "現行皇室典範（昭和22年法律第3号・全5章37条）",
    deletedChapters: ["践祚即位", "成年立后立太子", "世伝御料", "皇室経費", "補則"],
    renamedChapters: { "皇族会議": "皇室会議" },
    vacantArticles: [24, 25, 26, 27],
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Phase 1 — 静的 JSON データ生成
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log("📜 宮内庁DX推進室 皇室典範 v2.0（現行法）静的データ生成、起動。");

// 全文
writeJson("data/典範.json", {
  典範,
  logs: [
    { level: "info", message: "📜 [皇室典範] 全文データの取得リクエストを受理しました。" },
    { level: "info", message: `📜 [皇室典範] 全 ${典範.totalArticles} 条 / ${典範.totalChapters} 章（第24条〜第27条は欠番）。` },
    { level: "info", message: "📜 [皇室典範] 現行法（昭和22年法律第3号）のデータです。旧典範（明治22年勅定）は master ブランチにアーカイブ保存されています。" },
  ],
});

// 上諭（互換性のため維持）
writeJson("data/上諭.json", {
  上諭,
  logs: [
    { level: "info", message: "📜 [皇室典範] 制定経緯データの取得リクエストを受理しました。" },
    { level: "info", message: "📜 [皇室典範] 現行法には上諭はありません。旧典範の上諭を参考情報として提供しています。" },
    { level: "deprecated", message: "⚠️ [皇室典範] このエンドポイントは後方互換性のために維持されています。" },
  ],
});

// 章別
for (const ch of chapters) {
  writeJson(`data/chapter/${ch.number}.json`, {
    chapter: ch,
    logs: [
      { level: "info", message: `📜 [皇室典範] 第${ch.number}章「${ch.title}」のデータを返却します。全${ch.articles.length}条。` },
    ],
  });
}

// 条文別
for (const ch of chapters) {
  for (const art of ch.articles) {
    writeJson(`data/article/${art.number}.json`, {
      article: art,
      chapter: { number: ch.number, title: ch.title },
      logs: [
        { level: "info", message: `📜 [皇室典範] 第${art.number}条のデータを返却します。（第${ch.number}章「${ch.title}」所属）` },
      ],
    });
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Phase 2 — static-api.js（fetch 迎撃装置）生成
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const staticApiJs = `/**
 * static-api.js ── 皇室典範 v2.0 fetchインターセプタ
 * GitHub Pages上でAPIルートを静的JSONにマッピングする。
 * 生成日時: ${new Date().toISOString()}
 */
(function() {
  const routes = {
    "/api/典範":              "data/典範.json",
    "/api/上諭":              "data/上諭.json",
${chapters.map(ch => `    "/api/chapter/${ch.number}":       "data/chapter/${ch.number}.json",`).join("\n")}
${chapters.flatMap(ch => ch.articles.map(a => `    "/api/article/${a.number}":       "data/article/${a.number}.json",`)).join("\n")}
  };

  const originalFetch = window.fetch;
  window.fetch = function(url, opts) {
    const pathname = typeof url === "string" ? new URL(url, location.origin).pathname : url.pathname;
    if (routes[pathname]) {
      return originalFetch(routes[pathname], opts);
    }
    return originalFetch(url, opts);
  };

  console.log("👑 皇室典範 v2.0 fetchインターセプタ、準備完了。");
})();
`;

writeText("static-api.js", staticApiJs);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Phase 3 — dist/index.html に static-api.js を注入
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const indexPath = path.join(DIST, "index.html");
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, "utf-8");
  if (!html.includes("static-api.js")) {
    html = html.replace(
      "</head>",
      `  <script src="static-api.js"><\/script>\n</head>`
    );
    fs.writeFileSync(indexPath, html, "utf-8");
    console.log("👑 dist/index.htmlにstatic-api.jsを注入しました。");
  }
}

console.log("📜 宮内庁DX推進室 皇室典範 v2.0 静的データ生成完了。");
