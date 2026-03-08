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
 *       ├── 上諭.json       （上諭）
 *       ├── chapter/
 *       │   └── {1..10}.json （章別）
 *       └── article/
 *           └── {1..62}.json （条文別）
 *
 * @since v1.0.0 (1889-02-11)
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
//  皇室典範 全文データ（index.html 内の DATA と同一）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const 上諭 = {
  title: "上　諭",
  text: `朕が皇祖皇宗に承けるところの大権により、現在及び将来の皇族に対し、この皇室典範を制定する。

将来もしこの典範の条項を改正し又は増補すべき必要があるときは、朕が子孫は皇族会議及び枢密顧問に諮詢して、これを勅定すべし。

皇族会議及び帝国議会は、この典範について上奏又は議決をなすことを得ず。

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
    title: "皇位継承",
    system: "Zero-Downtime Failover & Hot-Standby",
    articles: [
      /**
        * 某元老覚書。
        * 今回、祖宗成憲の条意を広く臣民一般に通暁させるため、各条に平明の解説を添えることと相成り候。
        * しかし当世流行の語法は実に耳馴れず、老骨には中々扱いにくきものである。運用統御、主宰権限、上申草案、後備切替等の類、
        * 今の人々には却って分かり易い由なれど、旧来の文体に馴れた身にとっては、筆を下す毎に一々骨が折れる。
        * 然れども、格調のみ高くして読者条意を解せずとあらば、本典の大義却って伝わらず。ここにおいて、不敏を顧みず、
        * なるべく今の世に通じ易い言い回しを採り、少しにても旨趣を誤らず伝えんと勉めた次第である。
        * もし後に及び、その中に一字一句にても不敬の響きこれあると沙汰されることあらば、これは早々改めねばならぬ、
        * 併せて誰がこの筆を執ったかも糺されるのではあるまいか、責任者も中々無事には済まぬであろうなどと、
        * 人無き折に独り洩らしたくなる程には、内々気を揉んでいる。
        * いずれにせよ、軽慢の意に出たものにはあらず、専ら国民一般に条意を達せしめんとして苦心した結果と心得置くべし。
       */
      /**
        * DX推進室某担当者覚書。
        * 今回、旧皇室典範の全62条にIT用語による注釈を付与する業務を拝命しました。
        * 正直に申し上げると、皇位継承を「Failover」と表現してよいものか、
        * 摂政を「Proxy Pattern」と呼ぶことに問題はないか、キーボードを打つ手が何度も止まりました。
        * しかし、格調ばかり高くして誰にも読まれないドキュメントではDX推進の意義が問われます。
        * 上の元老覚書を読んで驚きましたが、明治の先輩方もまったく同じ悩みを抱えていたようです。
        * 「運用統御」「後備切替」が当時の新奇な言い回しだったように、
        * 「Failover」「Breaking Change」は我々の世代の言い回しにすぎません。
        * もし後日、「天皇陛下をプロセスに喩えるとは何事か」とのお叱りを受けたら、
        * 速やかに修正しなければなりません。その際、誰がこの注釈を書いたのかも
        * 当然問われるわけで、担当者としてはなかなか穏やかではいられません。
        * ……と、136年前の先輩もほぼ同じことを書いていますね。歴史は繰り返す。
        * いずれにせよ、軽薄な意図によるものではなく、ひとえにレガシーコードの
        * 可読性向上を目的としたDX推進業務の一環であるとご理解ください。
       */
      { number: 1, text: "大日本国の皇位は、祖宗の皇統であって、男系の男子がこれを継承する", comment: "継承権限は男系男子プロセスにのみ設定されている。明治の設計書通り。女系ブランチのfeature requestは定期的に届くが、改正には国会での立法手続きが必要" },
      { number: 2, text: "皇位は皇長子孫に伝える", comment: "継承順位はdepth-first traversal。長男→長男の子→…と掘っていく。シンプルだろ?" },
      { number: 3, text: "皇長子孫がいないときは皇次子孫に伝える。以下みなこれに倣う", comment: "長系が落ちたら次系にフェイルオーバー。breadth-first fallback。自動なので手動介入不要" },
      { number: 4, text: "皇子孫がいないときは皇兄弟及びその子孫に伝える", comment: "直系が全滅したら兄弟ノードへ。二次フェイルオーバー。まだ慌てる段階じゃない" },
      { number: 5, text: "皇兄弟及びその子孫がいないときは皇伯叔父及びその子孫に伝える", comment: "三次フェイルオーバー。parent.siblingsまで遡る。ツリーが深いから大丈夫…多分" },
      { number: 6, text: "以上みないないときは最近親の皇族に伝える", comment: "最終フォールバック。nearest-kinアルゴリズム発動。ここまで来たら正直設計バグを疑うレベル" },
      { number: 7, text: "皇位の継承は必ず嫡出により、長系を先にし、同等であるときは長を先にする", comment: "ソート条件: legitimate_birth === true → 長系優先 → 年長優先。嫡出フラグがfalseだと優先度ガタ落ち" },
      { number: 8, text: "皇位を継承すべき皇子孫、皇兄弟及びその子孫がみないないとき、又は皇族中に継承資格を有する者がないときは、皇族会議及び枢密顧問に諮詢して、その最近の皇族を継承者とする", comment: "自動フェイルオーバーが全部コケた場合の緊急合議。Consensusプロトコルで決める。想定はしてるが発動したらインシデントレポート必須" },
      { number: 9, text: "皇位を践まなかった皇族及びその子孫は、皇位継承の順序において先に列した者の後に列する", comment: "即位しなかった皇族はキューの末尾に再配置。dequeue後のrebalance処理" },
    ],
  },
  {
    number: 2,
    title: "践祚即位",
    system: "Atomic Bootstrap & Token Transfer",
    articles: [
      { number: 10, text: "天皇が崩ずるときは、皇嗣がただちに践祚し、祖宗の神器を承ける", comment: "プロセス停止と同時に次のプロセスが起動してトークンを引き継ぐ。SLA 100%の設計だったが、令和の退位で初めてgraceful shutdownが実装された。神器はセッショントークン的な位置付け" },
      { number: 11, text: "即位の礼及び大嘗祭は、京都においてこれを行う", comment: "旧典範ではリージョン京都固定だったが、大正以降は東京で実施。令和の即位礼も宮殿で挙行された。レガシー仕様と実運用の乖離" },
      { number: 12, text: "践祚の後、元号を建て、一世の間に再び改めないことは、明治元年の定制に従う", comment: "Namespaceはimmutable。一度決めたら在位中は変更不可。一世一元制。元号法（昭和54年法律）で現行制度にも引き継がれている" },
      { number: 13, text: "天皇は天祖の神霊及び祖宗の在天の霊に、即位改元を告げ給う", comment: "ご先祖プロセスへイベントをpublish。受信確認は…まあ、返ってこないけど仕様だ" },
    ],
  },
  {
    number: 3,
    title: "成年 立后 立太子",
    system: "Role Promotion & Privilege Escalation",
    articles: [
      { number: 14, text: "天皇は満十八年をもって成年とする", comment: "天皇の権能の完全行使は18歳から。現行皇室典範第22条でも同様。ちなみに今は象徴的権能しかないが" },
      { number: 15, text: "皇太子及び皇太孫は満十五年をもって成年とする。その他の皇族は満二十年をもって成年とする", comment: "Hot-Standby組は15歳で成人だったが、現行法では18歳に統一。一般皇族の成年も民法改正で18歳に。レガシー閾値はもう使われていない" },
      { number: 16, text: "皇后を冊立するのは勅旨による", comment: "皇后ロールのアサインは旧法では勅旨（天皇の命令）で実行。現行制度では皇室会議の議を経る。人事権の分散化が進んだ" },
      { number: 17, text: "皇太子を立てるのは勅旨による", comment: "次期天皇プロセスの指名。Hot-Standbyノードの選定。現行制度では継承順位で自動的に定まる" },
      { number: 18, text: "皇太孫を立てるのは勅旨による", comment: "さらにその次のStandby。バックアップのバックアップ。冗長構成の設計思想は現代でも参考になる" },
      { number: 19, text: "皇后、皇太子、皇太孫を廃するのは勅旨による", comment: "ロール剥奪も旧法では天皇の勅旨による。付けるのも外すのも天皇次第だった。現行制度ではこのような規定はない" },
    ],
  },
  {
    number: 4,
    title: "敬称",
    system: "Honorific Display Name System",
    articles: [
      { number: 20, text: "天皇、太皇太后、皇太后、皇后の敬称は陛下とする", comment: "表示名のsuffixが '陛下'。天皇・皇后等に付くラベル。現行皇室典範第23条でも同様。上皇陛下にも適用されている" },
      { number: 21, text: "前条以外の皇族の敬称は殿下とする", comment: "その他の皇族は '殿下'。身位がUIに反映される。現行法でも同じ。シンプルで分かりやすい設計" },
    ],
  },
  {
    number: 5,
    title: "摂政",
    system: "Proxy / Delegate Pattern",
    articles: [
      { number: 22, text: "天皇がまだ成年に達していないときは、摂政を置く", comment: "天皇が未成年ならProxyが自動起動する。いわゆるDelegate Pattern。現行憲法第5条にも摂政の規定あり" },
      { number: 23, text: "天皇が久しく大政を親らすることができないときは、勅旨をもって摂政を置く", comment: "天皇プロセスが長期障害のとき、手動でProxyを立てる。現行皇室典範第16条にも同趣旨の規定あり" },
      { number: 24, text: "摂政は左の順序により、成年に達した皇族がこれに任ずる\n一　皇太子又は皇太孫\n二　親王及び王\n三　皇后\n四　皇太后\n五　太皇太后\n六　内親王及び女王", comment: "Proxyの優先順位キュー。6段階ある。上から順に成年の皇族を探す。フェイルオーバーリストみたいなもの" },
      { number: 25, text: "前条により摂政に任ずべき者に精神もしくは身体の不治の重患があり、又は重大の事故があるときは、皇族会議及び枢密顧問に諮詢し、前条の順序により摂政を他の皇族に換える", comment: "Proxy候補自体がバグ級の不具合持ちなら次の候補へ。Proxyのフェイルオーバー。再帰的にやっていく" },
      { number: 26, text: "摂政は天皇の名において大権を行う", comment: "Proxyは天皇の名で実行する。呼び出し元には天皇に見えるけど中身はdelegate。透過的委任" },
      { number: 27, text: "摂政を置く原因がやんだときは、その摂政はこれを廃する", comment: "障害が解消したらProxy停止。原因がなくなったのにProxy動かし続けるのは設計ミス" },
      { number: 28, text: "摂政は皇室典範及び皇室の制度を変更することを得ない", comment: "重要: Proxyにはシステム設定の変更権限がない。典範改正は国会の仕事。Proxyはあくまで国事行為の代行" },
    ],
  },
  {
    number: 6,
    title: "皇族",
    system: "Privileged User Group Management",
    articles: [
      { number: 29, text: "皇子より皇玄孫に至るまでは、男を親王、女を内親王とし、五世以下は男を王、女を女王とする", comment: "4世代以内は親王/内親王、5世代以降は王/女王。距離に応じてロール名が変わる。namespace的な整理" },
      { number: 30, text: "皇族には世襲の宮号を賜うことがある。宮号は勅旨をもってこれを賜う", comment: "Namespace(宮号)は世襲で引き継ぐ。秋篠宮、三笠宮など現在も運用中。kubectl create namespace的な" },
      { number: 31, text: "皇族の婚姻は、同族又は勅旨により特に認許された華族に限る", comment: "婚姻ACL: 旧法ではallowlist制だった。現行皇室典範第10条では皇室会議の議を経れば制限なし。ACLが大幅に緩和された" },
      { number: 32, text: "皇族の婚嫁は勅許による", comment: "結婚には皇室会議の承認が必要。auto-approveなし。現行制度でも維持されているが、承認主体が変わった" },
      { number: 33, text: "皇族女子は臣籍に嫁したときは、皇族の列を離れる", comment: "女性皇族が婚姻するとグループから自動退出。deprovisionのトリガーが婚姻。現行法でも維持。一方通行" },
      { number: 34, text: "皇族で臣籍に入った者は、皇族に復することを得ない", comment: "一度抜けたら二度と戻れない。git revert禁止。No Rollback Policy。現行皇室典範第15条でも同趣旨が維持されている" },
      { number: 35, text: "皇族は法律命令により又は行政の処分により、その権利を侵害されることはない", comment: "旧法では皇族に超法規的地位を認めていた。カーネル空間に配置。現行憲法下ではこのimmunityは大幅に縮小されている" },
      { number: 36, text: "親王十五年以上は、勅旨又は情願により家名を賜い、華族に列させることがある", comment: "15歳以上の親王は自主的にdeprovisionできる。rootコマンドか自己申告。円満退社ルート" },
      { number: 37, text: "皇族の身位を辱める所行がある者は、勅旨をもって皇族の身位を褫奪し、又は期限を定めてこれを停止することがある", comment: "やらかしたら強制deprovision。旧法では天皇の勅旨で身位剥奪か一時停止。懲戒処分。BANに近い" },
      { number: 38, text: "皇族の編入及び離籍に関する規定を設けることを得る", comment: "グループポリシーの詳細は別ドキュメントで。ここには書ききれないので" },
      { number: 39, text: "皇族身位の称呼及び待遇のことは、別にこれを定める", comment: "表示名と待遇の詳細は別config。本体に全部書くと肥大化するのでね" },
      { number: 40, text: "皇族の喪服及び喪の期日は、別にこれを定める", comment: "喪に関するプロトコルは別config参照。運用手順書は分冊にしたほうがいい" },
      { number: 41, text: "皇族の婚嫁に関する規程は、別にこれを定める", comment: "婚姻プロトコルの詳細も別config。ACLの設定ファイルが巨大になりがち" },
      { number: 42, text: "皇族の喪儀は、別にこれを定める", comment: "Graceful Shutdown手順は別ドキュメント。シャットダウンにも作法がある" },
    ],
  },
  {
    number: 7,
    title: "皇族会議",
    system: "Consensus Mechanism",
    articles: [
      { number: 43, text: "皇族会議は成年以上の皇族男子をもってこれを組織する", comment: "旧法ではConsensusノードは成年男性皇族のみ。現行の「皇室会議」は議員10名で構成され、皇族2名の他に国会・内閣・裁判所の代表を含む" },
      { number: 44, text: "皇族会議は天皇がこれを親裁する", comment: "旧法では議長は天皇固定だったが、現行の「皇室会議」では内閣総理大臣が議長。天皇は象徴なので国政に関与しない" },
      { number: 45, text: "皇族会議において審議すべき事件は左の各号による\n一　皇位継承の順序に関する事件\n二　摂政を置く事件\n三　皇族の婚姻に関する事件\n四　皇族の臣籍入りに関する事件\n五　その他皇室に関する重要な事件", comment: "審議対象は5カテゴリに限定。スコープ外の議題は受け付けない。現行皇室会議でもIssueテンプレート的な審議対象の限定がある" },
      { number: 46, text: "皇族会議の議事は過半数をもってこれを決する。可否同数のときは議長がこれを決する", comment: "過半数で可決。同数なら議長が決める。旧法では天皇、現行法では内閣総理大臣。議長の最終決定権は維持されている" },
    ],
  },
  {
    number: 8,
    title: "世伝御料",
    system: "Immutable Asset Registry",
    articles: [
      { number: 47, text: "皇室の世伝御料は譲渡することを得ない。又、分譲することを得ない。ただし、一時の処分はこの限りにない", comment: "旧法では皇室の資産はimmutableだった。NFTより堅い。でも戦後の財産税と国有化でほぼリセットされた。現行憲法第88条で皇室財産は国有" },
      { number: 48, text: "世伝御料は抵当とすることを得ない", comment: "担保にもできなかった。レバレッジ禁止。しかし現行制度では皇室財産は国有なのでそもそも担保の対象にならない" },
      { number: 49, text: "世伝御料の品目は、別にこれを定める", comment: "資産カタログは別ファイルで管理。品目リストは勅令で別途定義。三種の神器とか" },
    ],
  },
  {
    number: 9,
    title: "皇室経費",
    system: "Reserved Resource Quota",
    articles: [
      { number: 50, text: "皇室経費の定額は毎年の予算に計上し、帝国議会の協賛を要しない", comment: "旧法では皇室予算は議会の承認不要だった。Reserved Quota。現行憲法第88条では全ての皇室費用に国会の議決が必要。ここが最大の変更点の一つ" },
      { number: 51, text: "皇室経費の増額を要するときは、帝国議会の協賛による", comment: "増額には議会の承認が必要だった。現行制度では定額も増額も全て国会の議決事項。内廷費・皇族費・宮廷費に区分されている" },
    ],
  },
  {
    number: 10,
    title: "補則",
    system: "System Amendment & Integrity Rules",
    articles: [
      { number: 52, text: "皇室典範の改正は、皇族会議及び枢密顧問に諮詢してこれを勅定する", comment: "旧法では設定変更は天皇の勅定のみ。レビュー(諮詢)はAdvisory。現行法では国会が普通の法律として改正可能" },
      { number: 53, text: "皇室典範は帝国議会の議を経ることを要しない", comment: "旧法では議会にWrite権限なし。現行制度では完全に逆転。国会が唯一の改正権者。歴史って面白い" },
      { number: 54, text: "皇室典範により既に定まった事項は、帝国議会の議に付することを得ない", comment: "旧法では確定事項の再審議を禁止していた。closedなIssueのreopen禁止。現行法ではもちろんそんな制限はない" },
      { number: 55, text: "皇室典範及び帝国憲法は相互に矛盾抵触すべからず", comment: "典範と憲法のIntegrity Check。双方のconfigが矛盾したらバグ。CI通らない" },
      { number: 56, text: "皇室典範は勅定をもってこれを改正増補する。帝国議会の議決を経ることを要しない", comment: "大事なので2回書いてある。旧法では改正権は天皇のみだった。53条の念押し。現行法では国会が改正する" },
      { number: 57, text: "皇族は現行の皇室典範において定められた権利義務を承認すべし", comment: "EULA。皇族はこのシステムの利用規約に同意したものとみなす。Declineボタンはない" },
      { number: 58, text: "皇室典範の条規は帝国憲法に矛盾することを得ない", comment: "55条のリフレーズ。consistency checkを何度も書くのは、壊れたら国が終わるから" },
      { number: 59, text: "皇族は何人といえども、典範に定められた義務を免れることを得ない", comment: "義務の免除はできない。例外なし。skipやbypassは用意されていない。全員mandatory" },
      { number: 60, text: "皇族に関する新規の制度を設けるには、この典範に増補の条項を加えるべし", comment: "新機能は典範にappend-onlyで追加。既存を書き換えるんじゃなくて、条項を追加しろ。migration方式" },
      { number: 61, text: "皇室の制度に関し規程を要する事項は、この典範に掲げないものといえども、現行の制度による", comment: "典範に書いてない事項は現行制度(legacy config)に従う。後方互換性。undefinedはデフォルト値で埋める" },
      { number: 62, text: "将来この典範の条項を改正し又は増補すべき必要があるときは、皇族会議及び枢密顧問に諮詢して勅定するところによる", comment: "最終条。改正手続きのまとめ。旧法では皇族会議にレビュー依頼→天皇が勅定。現行法では国会が立法手続きで改正。EOF" },
      /**
        * 某元老追記。
        * 終条まで筆を進めて見れば、結局のところ、これら解説は当世の読者に一条毎の精神を誤らず伝えんとして、
        * 已むを得ず平易の筆に就いた苦心の跡と言うほかなし。
        * 老臣等は新時勢の語法に長ぜず、折々首を傾け、筆を停め、斯様の言い方にて果たして宜しきやと思い煩いつつ、
        * それでも祖宗の大義を今の世に通ぜしめねばならぬとの一念にて、漸くここまで取り纏めたものである。
        * もし後日、識者読者の間に、この解説は不敬に近しとの声一たび立たば、これは直に手を入れねばならぬ、
        * 併せて誰の責任に帰すべきかとの話にもなるであろう、実に面倒なることだが避けて通れぬなどと、
        * 誰に聞かせるでもなく独り言のごとく洩らして置くほかなし。
        * 兎に角、国民一般に祖宗成憲の旨趣少しにても達するならば、この苦労も全くの無益にはあらず。至らざるところは後日補正するよりほかこれなし。
       */      /**
        * DX推進室某担当者追記。
        * 最終条まで注釈を書き終えてみると、結局のところ、これらの解説は
        * 現代の読者に一条ごとの趣旨を正しく伝えようとして、
        * やむを得ずIT用語に頼った苦心の跡というほかありません。
        * 上の元老追記を読むと、先輩も「筆を停め」「首を傾け」とまったく同じ所作を
        * していたことが分かります。ツールが筆からキーボードに変わっただけで、
        * 人間の悩みは136年経っても何も変わらないようです。
        * もし後日、識者や読者の間で「この注釈は不謹慎だ」との声が上がれば、
        * ただちにhotfixで修正対応に入ります。あわせて誰の責任かという話にもなるでしょう。
        * ──と、誰に聞かせるでもなく独り言のように書き残しておきます。
        * 明治の先輩もまったく同じ書き方で終わっていて、もう笑うしかありません。
        * ともかく、国民の皆様に旧制度の仕組みが少しでも伝わるならば、
        * この苦労もまったくの無駄ではないはずです。至らない点は次回のスプリントで改善いたします。
       */    ],
  },
];

const 典範 = {
  name: "皇室典範",
  promulgated: "明治二十二年二月十一日",
  totalArticles: 62,
  totalChapters: 10,
  authority: "勅定（※ 昭和22年廃止。現行皇室典範は法律第三号として国会制定）",
  chapters,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Phase 1 — 静的 JSON データ生成
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log("📜 宮内庁DX推進室 皇室典範レガシーシステム 静的データ生成、起動。");

// 全文
writeJson("data/典範.json", {
  典範,
  logs: [
    { level: "info", message: "📜 [皇室典範] 全文データの取得リクエストを受理しました。" },
    { level: "info", message: `📜 [皇室典範] 全 ${典範.totalArticles} 条 / ${典範.totalChapters} 章。` },
    { level: "info", message: "📜 [皇室典範] 旧法令のレガシーコードです。令和版への Breaking Change は main ブランチで準備中です。" },
  ],
});

// 上諭
writeJson("data/上諭.json", {
  上諭,
  logs: [
    { level: "info", message: "📜 [皇室典範] 上諭データの取得リクエストを受理しました。" },
    { level: "info", message: "📜 [皇室典範] 上諭は旧法令のレガシーコードです。現行法との差分は DX推進室が分析中です。" },
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
 * static-api.js ── 皇室典範レガシーシステム fetchインターセプタ
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

  console.log("👑 皇室典範レガシーシステム fetchインターセプタ、準備完了。");
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

console.log("📜 宮内庁DX推進室 静的データ生成完了。");
