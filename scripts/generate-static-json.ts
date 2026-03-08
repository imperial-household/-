/**
 * generate-static-json.ts ── 皇室典範靜的文書生成裝置
 * Imperial Household Code Static Asset Generator
 *
 * GitHub Pages ニ於テハ動的 Backend ハ稼働セス。
 * 故ニ全文ヲ靜的 JSON トシテ dist/data/ 配下ニ燒キ込ム。
 * 併セテ dist/index.html ニ static-api.js ノ參照ヲ注入ス。
 *
 * 本處理ハ npm run build ノ一環トシテ實行サレ、
 * tsc → cp -r public/* dist/ ノ後ニ起動サルル。
 *
 * 生成物:
 *   dist/
 *   ├── index.html        （public/ ヨリ複寫、static-api.js 注入濟）
 *   ├── static-api.js      （fetch 迎擊裝置）
 *   └── data/
 *       ├── 典範.json       （全文）
 *       ├── 上諭.json       （上諭）
 *       ├── chapter/
 *       │   └── {1..10}.json （章別）
 *       └── article/
 *           └── {1..62}.json （條文別）
 *
 * @since v1.0.0 (1889-02-11)
 * @author 宮內省
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
//  皇室典範 全文データ（index.html 內ノ DATA ト同一）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const 上諭 = {
  title: "上　諭",
  text: `朕カ皇祖皇宗ニ承クル所ノ大權ニ依リ現在及將來ノ皇族ニ對シ此ノ皇室典範ヲ制定ス

將來若シ此ノ典範ノ條項ヲ改正シ又ハ增補スヘキノ必要アルトキハ朕カ子孫ハ皇族會議及樞密顧問ニ諮詢シテ之ヲ勅定スヘシ

皇族會議及帝國議會ハ此ノ典範ニ付キ上奏又ハ議決ヲ爲スコトヲ得ス

御名　御璽
　明治二十二年二月十一日`,
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
    title: "皇位繼承",
    system: "Zero-Downtime Failover & Hot-Standby",
    articles: [
      /**
        * 某元老覺書。
        * 今囘、祖宗成憲ノ條意ヲ廣ク臣民一般ニ通曉セシメンガ爲、各條ニ平明ノ解説ヲ添フルコトト相成リ候。
        * 併シ當世流行ノ語法ハ實ニ耳馴レズ、老骨ニハ中々扱ヒニクキモノナリ。運用統御、主宰權限、上申草案、後備切替等ノ類、
        * 今ノ人々ニハ却テ分リ易キ由ナレド、舊來ノ文體ニ馴レタル身ニ取リテハ、筆ヲ下ス毎ニ一々骨ガ折レル。
        * 然レドモ、格調ノミ高クシテ讀者條意ヲ解セズトアラバ、本典ノ大義却テ傳ハラズ。是ニ於テ、不敏ヲ顧ミズ、
        * 成ルベク今ノ世ニ通ジ易キ言ヒ廻シヲ採リ、少シニテモ旨趣ヲ誤ラズ傳ヘムト勉メタル次第ナリ。
        * 若シ後ニ及ビ、其中ニ一字一句ニテモ不敬ノ響有之ト沙汰セラルルコトアラバ、是ハ早々改メネバナラヌ、
        * 併セテ誰ガ此ノ筆ヲ執リタルカモ糺サレルノデハアルマイカ、責任者モ中々無事ニハ濟マヌデアラウナドト、
        * 人無キ折ニ獨リ洩ラシタクナル程ニハ、內々氣ヲ揉ミ居ル。
        * 何レニセヨ、輕慢ノ意ニ出タルモノニハ非ズ、專ラ國民一般ニ條意ヲ達セシメムトシテ苦心シタル結果ト心得置クベシ。
       */
      { number: 1, text: "大日本國皇位ハ祖宗ノ皇統ニシテ男系ノ男子之ヲ繼承ス", comment: "root権限は男系男子プロセスにのみ継承される。女系? そんなブランチは存在しない。PRを出すな" },
      { number: 2, text: "皇位ハ皇長子孫ニ傳フ", comment: "継承順位はdepth-first traversal。長男→長男の子→…と掘っていく。シンプルだろ?" },
      { number: 3, text: "皇長子孫在ラサルトキハ皇次子孫ニ傳フ以下皆之ニ倣フ", comment: "長系が落ちたら次系にフェイルオーバー。breadth-first fallback。自動なので手動介入不要" },
      { number: 4, text: "皇子孫在ラサルトキハ皇兄弟及其ノ子孫ニ傳フ", comment: "直系が全滅したら兄弟ノードへ。二次フェイルオーバー。まだ慌てる段階じゃない" },
      { number: 5, text: "皇兄弟及其ノ子孫在ラサルトキハ皇伯叔父及其ノ子孫ニ傳フ", comment: "三次フェイルオーバー。parent.siblingsまで遡る。ツリーが深いから大丈夫…多分" },
      { number: 6, text: "以上皆在ラサルトキハ最近親ノ皇族ニ傳フ", comment: "最終フォールバック。nearest-kinアルゴリズム発動。ここまで来たら正直設計バグを疑うレベル" },
      { number: 7, text: "皇位ノ繼承ハ必ス嫡出ニ依リ長系ヲ先ニシ同等ナルトキハ長ヲ先ニス", comment: "ソート条件: legitimate_birth === true → 長系優先 → 年長優先。嫡出フラグがfalseだと優先度ガタ落ち" },
      { number: 8, text: "皇位ヲ繼承スヘキ皇子孫皇兄弟及其ノ子孫皆在ラサルトキ又ハ皇族中ニ繼承資格ヲ有スル者ナキトキハ皇族會議及樞密顧問ニ諮詢シテ其ノ最近ノ皇族ヲ繼承者トス", comment: "自動フェイルオーバーが全部コケた場合の緊急合議。Consensusプロトコルで決める。想定はしてるが発動したらインシデントレポート必須" },
      { number: 9, text: "皇位ヲ踐マサル皇族及其ノ子孫ハ皇位繼承ノ順序ニ於テ先ニ列シタル者ノ後ニ列ス", comment: "即位しなかった皇族はキューの末尾に再配置。dequeue後のrebalance処理" },
    ],
  },
  {
    number: 2,
    title: "踐祚即位",
    system: "Atomic Bootstrap & Token Transfer",
    articles: [
      { number: 10, text: "天皇崩スルトキハ皇嗣即チ踐祠シ祖宗ノ神器ヲ承ク", comment: "プロセス停止と同時に次のプロセスが起動してトークンを引き継ぐ。ダウンタイムゼロ。SLA 100%。神器がセッショントークンみたいなもの" },
      { number: 11, text: "即位ノ禮及大嘗祭ハ京都ニ於テ之ヲ行フ", comment: "本番デプロイのセレモニーはリージョン京都固定。東京じゃダメ。インフラの都合じゃなくて仕様" },
      { number: 12, text: "踐祚ノ後元號ヲ建テ一世ノ間ニ再ヒ改メサルコト明治元年ノ定制ニ從フ", comment: "Namespaceはimmutable。一度決めたら在位中は変更不可。一世一元。envを途中で書き換えるな" },
      { number: 13, text: "天皇ハ天祖ノ神靈及祖宗ノ在天ノ靈ニ即位改元ヲ告ケ給フ", comment: "ご先祖プロセスへイベントをpublish。受信確認は…まあ、返ってこないけど仕様だ" },
    ],
  },
  {
    number: 3,
    title: "成年 立后 立太子",
    system: "Role Promotion & Privilege Escalation",
    articles: [
      { number: 14, text: "天皇ハ滿十八年ヲ以テ成年トス", comment: "root権限の完全行使は18歳から。それまではsudo制限付き" },
      { number: 15, text: "皇太子及皇太孫ハ滿十五年ヲ以テ成年トス其ノ他ノ皇族ハ滿二十年ヲ以テ成年トス", comment: "Hot-Standby組は15歳で成人、一般皇族は20歳。ロールによって閾値が違う。権限昇格のタイミング設計" },
      { number: 16, text: "皇后ヲ冊立スルハ勅旨ニ依ル", comment: "皇后ロールのアサインはrootコマンド(勅旨)で実行。人事権はrootが握ってる" },
      { number: 17, text: "皇太子ヲ立ツルハ勅旨ニ依ル", comment: "次期rootプロセスの指名。Hot-Standbyノードの選定。これもrootコマンド" },
      { number: 18, text: "皇太孫ヲ立ツルハ勅旨ニ依ル", comment: "さらにその次のStandby。バックアップのバックアップ。冗長構成は大事" },
      { number: 19, text: "皇后皇太子皇太孫ヲ廢スルハ勅旨ニ依ル", comment: "ロール剥奪もrootコマンド。付けるのも外すのもroot次第。sudo権限のないやつには触れない" },
    ],
  },
  {
    number: 4,
    title: "敬稱",
    system: "Honorific Display Name System",
    articles: [
      { number: 20, text: "天皇太皇太后皇太后皇后ノ敬稱ハ陛下トス", comment: "表示名のsuffixが '陛下'。root級のユーザーに付くラベル。CSSみたいなもんだが変更不可" },
      { number: 21, text: "前條以外ノ皇族ノ敬稱ハ殿下トス", comment: "root級じゃない皇族は '殿下'。権限レベルがUIに反映される。わかりやすくていい" },
    ],
  },
  {
    number: 5,
    title: "攝政",
    system: "Proxy / Delegate Pattern",
    articles: [
      { number: 22, text: "天皇未タ成年ニ達セサルトキハ攝政ヲ置ク", comment: "rootが未成年ならProxyが自動起動する。いわゆるDelegate Pattern。設計書通り" },
      { number: 23, text: "天皇久シク大政ヲ親ラスルコト能ハサルトキハ勅旨ヲ以テ攝政ヲ置ク", comment: "rootプロセスが長期障害のとき、手動でProxyを立てる。ヘルスチェック失敗が続いたらってこと" },
      { number: 24, text: "攝政ハ左ノ順序ニ依リ成年ニ達シタル皇族之ニ任ス\n一　皇太子又ハ皇太孫\n二　親王及王\n三　皇后\n四　皇太后\n五　太皇太后\n六　內親王及女王", comment: "Proxyの優先順位キュー。6段階ある。上から順に成年の皇族を探す。フェイルオーバーリストみたいなもの" },
      { number: 25, text: "前條ニ依リ攝政ニ任スヘキ者精神若ハ身體ノ不治ノ重患アリ又ハ重大ノ事故アルトキハ皇族會議及樞密顧問ニ諮詢シ前條ノ順序ニ依リ攝政ヲ他ノ皇族ニ換フ", comment: "Proxy候補自体がバグ級の不具合持ちなら次の候補へ。Proxyのフェイルオーバー。再帰的にやっていく" },
      { number: 26, text: "攝政ハ天皇ノ名ニ於テ大權ヲ行フ", comment: "ProxyはRoot.nameで実行する。呼び出し元はrootに見えるけど中身はdelegate。透過的委任" },
      { number: 27, text: "攝政ヲ置クノ原因止ミタルトキハ其ノ攝政ハ之ヲ廢ス", comment: "障害が解消したらProxy停止。原因がなくなったのにProxy動かし続けるのは設計ミス" },
      { number: 28, text: "攝政ハ皇室典範及皇室ノ制度ヲ變更スルコトヲ得ス", comment: "重要: Proxyにはシステム設定の変更権限がない。sudoersの編集はrootだけ。Proxyはあくまで代行" },
    ],
  },
  {
    number: 6,
    title: "皇族",
    system: "Privileged User Group Management",
    articles: [
      { number: 29, text: "皇子ヨリ皇玄孫ニ至ルマテハ男ヲ親王女ヲ內親王トシ五世以下ハ男ヲ王女ヲ女王トス", comment: "4世代以内は親王/内親王、5世代以降は王/女王。距離に応じてロール名が変わる。namespace的な整理" },
      { number: 30, text: "皇族ニハ世襲ノ宮號ヲ賜フコトアルヘシ宮號ハ勅旨ヲ以テ之ヲ賜フ", comment: "Namespace(宮号)は世襲で引き継ぐ。新規作成はrootコマンドで。kubectl create namespace的な" },
      { number: 31, text: "皇族ノ婚姻ハ同族又ハ勅旨ニ依リ特ニ認許セラレタル華族ニ限ル", comment: "婚姻ACL: allowlist制。皇族同士か、rootが明示的に許可した華族だけ。外部ユーザーは基本deny" },
      { number: 32, text: "皇族ノ婚嫁ハ勅許ニ依ル", comment: "結婚にはroot承認が必須。auto-approveなし。いちいちrootの判子がいる" },
      { number: 33, text: "皇族女子ハ臣籍ニ嫁シタルトキハ皇族ノ列ヲ離ル", comment: "女性皇族が外部に嫁ぐとグループから自動退出。deprovisionのトリガーが婚姻。一方通行" },
      { number: 34, text: "皇族ノ臣籍ニ入リタル者ハ皇族ニ復スルコトヲ得ス", comment: "一度抜けたら二度と戻れない。git revert禁止。No Rollback Policy。動画配信で泣いても無駄" },
      { number: 35, text: "皇族ハ法律命令ニ依リ又ハ行政ノ處分ニ依リ其ノ權利ヲ侵害セラルルコトナシ", comment: "皇族はユーザー空間のプロセス(法律)からは制限できない。カーネル空間にいるので。immunity" },
      { number: 36, text: "親王十五年以上ハ勅旨又ハ情願ニ依リ家名ヲ賜ヒ華族ニ列セシムルコトアルヘシ", comment: "15歳以上の親王は自主的にdeprovisionできる。rootコマンドか自己申告。円満退社ルート" },
      { number: 37, text: "皇族ノ身位ヲ辱ムルノ所行アル者ハ勅旨ヲ以テ皇族ノ身位ヲ褫奪シ又ハ期限ヲ定メテ之ヲ停止スルコトアルヘシ", comment: "やらかしたら強制deprovision。rootコマンドで身位剥奪か一時停止。懲戒処分。BANに近い" },
      { number: 38, text: "皇族ノ編入及離籍ニ關スル規定ヲ設クルコトヲ得", comment: "グループポリシーの詳細は別ドキュメントで。ここには書ききれないので" },
      { number: 39, text: "皇族身位ノ稱呼及待遇ノ事ハ別ニ之ヲ定ム", comment: "表示名と待遇の詳細は別config。本体に全部書くと肥大化するのでね" },
      { number: 40, text: "皇族喪服及喪ノ期日ハ別ニ之ヲ定ム", comment: "喪に関するプロトコルは別config参照。運用手順書は分冊にしたほうがいい" },
      { number: 41, text: "皇族ノ婚嫁ニ關スル規程ハ別ニ之ヲ定ム", comment: "婚姻プロトコルの詳細も別config。ACLの設定ファイルが巨大になりがち" },
      { number: 42, text: "皇族ノ喪儀ハ別ニ之ヲ定ム", comment: "Graceful Shutdown手順は別ドキュメント。シャットダウンにも作法がある" },
    ],
  },
  {
    number: 7,
    title: "皇族會議",
    system: "Consensus Mechanism",
    articles: [
      { number: 43, text: "皇族會議ハ成年以上ノ皇族男子ヲ以テ之ヲ組織ス", comment: "Consensusノードになれるのは成年男性皇族のみ。投票権のあるvalidator。クォーラムの構成要件" },
      { number: 44, text: "皇族會議ハ天皇之ヲ親裁ス", comment: "議長はroot固定。委任不可。rootが議長をやらないConsensusなんてConsensusじゃない" },
      { number: 45, text: "皇族會議ニ於テ審議スヘキ事件ハ左ノ各號ニ依ル\n一　皇位繼承ノ順序ニ關スル事件\n二　攝政ヲ置クノ事件\n三　皇族ノ婚姻ニ關スル事件\n四　皇族ノ臣籍入ニ關スル事件\n五　其ノ他皇室ニ關スル重要ノ事件", comment: "審議対象は5カテゴリに限定。スコープ外の議題は受け付けない。Issueテンプレに従え" },
      { number: 46, text: "皇族會議ノ議事ハ過半數ヲ以テ之ヲ決ス可否同數ナルトキハ議長之ヲ決ス", comment: "過半数で可決。同数なら議長(=天皇)が決める。結局rootが最終決定権。民主主義のふりをしたroot裁定" },
    ],
  },
  {
    number: 8,
    title: "世傳御料",
    system: "Immutable Asset Registry",
    articles: [
      { number: 47, text: "皇室ノ世傳御料ハ讓渡スルコトヲ得ス又分讓スルコトヲ得ス但シ一時ノ處分ハ此ノ限ニ在ラス", comment: "皇室の資産はimmutable。transferもsplitも禁止。一時的なリースだけ例外。NFTより堅い" },
      { number: 48, text: "世傳御料ハ抵當ト爲スコトヲ得ス", comment: "担保にもできない。レバレッジかけるな。御料を質に入れる発想がそもそも不敬" },
      { number: 49, text: "世傳御料ノ品目ハ別ニ之ヲ定ム", comment: "資産カタログは別ファイルで管理。品目リストは勅令で別途定義。三種の神器とか" },
    ],
  },
  {
    number: 9,
    title: "皇室經費",
    system: "Reserved Resource Quota",
    articles: [
      { number: 50, text: "皇室經費ノ定額ハ毎年ノ豫算ニ計上シ帝國議會ノ協贊ヲ要セス", comment: "皇室の予算枠は自動計上。議会の承認は不要。リソースクォータがシステムレベルで確保されてる" },
      { number: 51, text: "皇室經費ノ增額ヲ要スルトキハ帝國議會ノ協贊ニ依ル", comment: "増額だけは議会の承認がいる。デフォルトのクォータ内なら勝手に使えるけど、増やすならPR出せと" },
    ],
  },
  {
    number: 10,
    title: "補則",
    system: "System Amendment & Integrity Rules",
    articles: [
      { number: 52, text: "皇室典範ノ改正ハ皇族會議及樞密顧問ニ諮詢シテ之ヲ勅定ス", comment: "設定変更はrootコマンド(勅定)のみ。レビュー(諮詢)はあるけどAdvisoryであってApprovalじゃない" },
      { number: 53, text: "皇室典範ハ帝國議會ノ議ヲ經ルヲ要セス", comment: "議会はこのリポジトリに対してWrite権限を持たない。ReadOnlyですらありがたく思え" },
      { number: 54, text: "皇室典範ニ依リ既ニ定マリタル事項ハ帝國議會ノ議ニ付スルコトヲ得ス", comment: "一度mergeされたconfigを議会が再審議することは禁止。closedなIssueを勝手にreopenするな" },
      { number: 55, text: "皇室典範及帝國憲法ハ相互ニ矛盾抵觸スヘカラス", comment: "典範と憲法のIntegrity Check。双方のconfigが矛盾したらバグ。CI通らない" },
      { number: 56, text: "皇室典範ハ勅定ヲ以テ之ヲ改正增補ス帝國議會ノ議決ヲ經ルコトヲ要セス", comment: "大事なので2回言う。改正も増補もrootのみ。議会は関係ない。53条の念押し" },
      { number: 57, text: "皇族ハ現行ノ皇室典範ニ於テ定メラレタル權利義務ヲ承認スヘシ", comment: "EULA。皇族はこのシステムの利用規約に同意したものとみなす。Declineボタンはない" },
      { number: 58, text: "皇室典範ノ條規ハ帝國憲法ニ矛盾スルコトヲ得ス", comment: "55条のリフレーズ。consistency checkを何度も書くのは、壊れたら国が終わるから" },
      { number: 59, text: "皇族ハ何人ト雖モ典範ニ定メラレタル義務ヲ免ルルコトヲ得ス", comment: "義務の免除はできない。例外なし。skipやbypassは用意されていない。全員mandatory" },
      { number: 60, text: "皇族ニ關スル新規ノ制度ヲ設クルニハ此ノ典範ニ增補ノ條項ヲ加フヘシ", comment: "新機能は典範にappend-onlyで追加。既存を書き換えるんじゃなくて、条項を追加しろ。migration方式" },
      { number: 61, text: "皇室ノ制度ニ關シ規程ヲ要スル事項ハ此ノ典範ニ揭ケサルモノト雖モ現行ノ制度ニ依ル", comment: "典範に書いてない事項は現行制度(legacy config)に従う。後方互換性。undefinedはデフォルト値で埋める" },
      { number: 62, text: "將來此ノ典範ノ條項ヲ改正シ又ハ增補スヘキノ必要アルトキハ皇族會議及樞密顧問ニ諮詢シテ勅定スル所ニ依ル", comment: "最終条。改正手続きのまとめ。皇族会議にレビュー依頼→rootが勅定。以上。merge完了。EOF" },
      /**
        * 某元老追記。
        * 終條マデ筆ヲ進メテ見レバ、結局ノ所、此等解説ハ當世ノ讀者ニ一條毎ノ精神ヲ誤ラズ傳ヘムトシテ、
        * 已ムヲ得ズ平易ノ筆ニ就キタル苦心ノ跡ト言フ外ナシ。
        * 老臣等ハ新時勢ノ語法ニ長ゼズ、折々首ヲ傾ケ、筆ヲ停メ、斯樣ノ言ヒ方ニテ果シテ宜シキヤト思ヒ煩ヒツツ、
        * ソレデモ祖宗ノ大義ヲ今ノ世ニ通ゼシメネバナラヌトノ一念ニテ、漸ク此處マデ取纏メタルモノナリ。
        * 若シ後日、識者讀者ノ間ニ、此ノ解説ハ不敬ニ近シトノ聲一タビ立タバ、是ハ直ニ手ヲ入レネバナラヌ、
        * 併セテ誰ノ責任ニ歸スベキカトノ話ニモナルデアラウ、實ニ面倒ナルコトダガ避ケテ通レヌナドト、
        * 誰ニ聞カセルデモナク獨リ言ノ如ク洩ラシテ置ク外無シ。
        * 兎ニ角、國民一般ニ祖宗成憲ノ旨趣少シニテモ達スルナラバ、此ノ苦勞モ全クノ無益ニハアラズ。至ラザル所ハ後日補正スルヨリ外無之。
       */
    ],
  },
];

const 典範 = {
  name: "皇室典範",
  promulgated: "明治二十二年二月十一日",
  totalArticles: 62,
  totalChapters: 10,
  authority: "勅定",
  chapters,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Phase 1 — 靜的 JSON データ生成
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log("📜 皇室典範靜的文書生成裝置、起動。");

// 全文
writeJson("data/典範.json", {
  典範,
  logs: [
    { level: "info", message: "📜 [皇室典範] 全文閲覽ノ上奏ヲ受理セリ。" },
    { level: "info", message: `📜 [皇室典範] 全 ${典範.totalArticles} 條 / ${典範.totalChapters} 章。` },
    { level: "info", message: "📜 [皇室典範] 畏レ多クモ閲覽ヲ許可ス。不敬ナキ態度ニテ拜讀スヘシ。" },
  ],
});

// 上諭
writeJson("data/上諭.json", {
  上諭,
  logs: [
    { level: "info", message: "📜 [皇室典範] 上諭ヲ返却ス。" },
    { level: "info", message: "📜 [皇室典範] 朕カ皇祖皇宗ニ承クル所ノ大權ニ依ル勅定ナリ。正座シテ拜讀スヘシ。" },
  ],
});

// 章別
for (const ch of chapters) {
  writeJson(`data/chapter/${ch.number}.json`, {
    chapter: ch,
    logs: [
      { level: "info", message: `📜 [皇室典範] 第${ch.number}章「${ch.title}」ヲ返却ス。全${ch.articles.length}條。` },
    ],
  });
}

// 條文別
for (const ch of chapters) {
  for (const art of ch.articles) {
    writeJson(`data/article/${art.number}.json`, {
      article: art,
      chapter: { number: ch.number, title: ch.title },
      logs: [
        { level: "info", message: `📜 [皇室典範] 第${art.number}條ヲ返却ス。（第${ch.number}章「${ch.title}」所屬）` },
      ],
    });
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Phase 2 — static-api.js（fetch 迎擊裝置）生成
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const staticApiJs = `/**
 * static-api.js ── 皇室典範 fetch 迎擊裝置
 * GitHub Pages 上ニ於テ API Route ヲ擬似的ニ再現ス。
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

  console.log("👑 皇室典範 fetch 迎擊裝置、裝塡完了。");
})();
`;

writeText("static-api.js", staticApiJs);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Phase 3 — dist/index.html ニ static-api.js ヲ注入
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
    console.log("👑 dist/index.html ニ static-api.js ヲ注入セリ。");
  }
}

console.log("📜 皇室典範靜的文書生成裝置、任務完了。畏クモ勅命ヲ奉ジ生成ヲ了ス。");
