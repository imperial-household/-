# CLAUDE.md — 皇室典範リポジトリ AIエージェント向けガイドライン

> 本書は AI Coding Agent（Claude）が本リポジトリ（`imperial-household/-`）で作業を行う際のガイドラインです。

---

## リポジトリ概要

- **名称**: 皇室典範（Imperial Household Code）v1.0.0
- **組織**: `@imperial-household`（皇室）
- **URL**: https://imperial-household.github.io/-/
- **GitHub**: https://github.com/imperial-household/-
- **性質**: 明治22年（1889年）勅定の皇室典範を TypeScript + GitHub Pages で実装した風刺プロジェクト。全10章62條をIT用語（God Object, Zero-Downtime Failover, Proxy Pattern 等）で注釈付き解説する。

---

## プロジェクト構成

```
imperial-household/-/
├── src/                          # TypeScript ソース（全10章 + barrel export）
│   ├── 皇室典範.ts              # barrel: 全章の export を集約
│   ├── 第一章_皇位継承.ts       # 第1條〜第9條
│   ├── 第二章_踐祚即位.ts       # 第10條〜第13條
│   ├── 第三章_成年立后立太子.ts  # 第14條〜第19條
│   ├── 第四章_敬稱.ts           # 第20條〜第21條
│   ├── 第五章_攝政.ts           # 第22條〜第28條
│   ├── 第六章_皇族.ts           # 第29條〜第42條
│   ├── 第七章_皇族會議.ts       # 第43條〜第46條
│   ├── 第八章_世傳御料.ts       # 第47條〜第49條
│   ├── 第九章_皇室經費.ts       # 第50條〜第51條
│   └── 第十章_補則.ts           # 第52條〜第62條
├── public/
│   └── index.html               # GitHub Pages フロントエンド（全文閲覧UI）
├── scripts/
│   └── generate-static-json.ts  # 静的 JSON API 生成スクリプト
├── dist/                        # ビルド出力（GitHub Pages にデプロイされる）
│   ├── index.html               # public/ からコピー
│   ├── static-api.js            # fetch 迎撃装置（API route を静的 JSON にマッピング）
│   └── data/                    # 静的 JSON API
│       ├── 典範.json            # 全文（全10章62條 + 上諭 + logs）
│       ├── 上諭.json            # 上諭のみ
│       ├── chapter/{1-10}.json  # 章単位
│       └── article/{1-62}.json  # 條文単位
├── .github/workflows/
│   ├── deploy-pages.yml         # GitHub Pages 自動デプロイ（master push トリガー）
│   └── tokko-police.yaml        # 特高警察Bot（皇室典範護持 CI + 不敬取締）
├── package.json                 # npm 設定（風刺的 scripts 多数含む）
├── tsconfig.json                # TypeScript 設定（strict: true, ES2020）
├── LICENSE                      # IHOL-1.0-Chokuteⅰ（勅定專有使用許諾）
└── CLAUDE.md                    # 本書
```

---

## ビルド・デプロイ

### ビルドコマンド

```bash
npm run build
```

内部的には以下を実行:
1. `tsc` — TypeScript コンパイル（`src/` → `dist/`）
2. `cp -r public/* dist/` — 静的ファイルを dist にコピー
3. `npx ts-node scripts/generate-static-json.ts` — 静的 JSON API ファイルを `dist/data/` に生成し、`dist/static-api.js` を生成し、`dist/index.html` に `<script src="static-api.js">` を挿入

### デプロイ

- master branch への push で `.github/workflows/deploy-pages.yml` が自動実行
- `dist/` ディレクトリが GitHub Pages にデプロイされる

### npm scripts（注意）

`npm test`, `npm run lint`, `npm run audit` 等は意図的に exit 1 する風刺的スクリプト。実際のテストやリントは存在しない。`npm run update`, `npm run publish`, `npm run uninstall` 等の npm 操作系コマンドも全て風刺的メッセージと共に拒否する。package.json には `_deprecation_policy`, `_security_policy`, `_contributing_guide`, `_code_of_conduct`, `_funding`, `_changelog`, `_ci_cd_policy`, `_issue_tracker_policy`, `_docker_policy` 等の風刺的メタデータフィールドも多数含む。

### CI/CD ワークフロー

| ワークフロー | ファイル | トリガー | 概要 |
|---|---|---|---|
| GitHub Pages デプロイ | `deploy-pages.yml` | master push | `dist/` を GitHub Pages にデプロイ |
| 特高警察Bot | `tokko-police.yaml` | master push / PR / Issue / PR target | 皇室典範護持 CI + 不敬取締（Issue/PR 即時閉鎖） |

#### 特高警察Bot（`tokko-police.yaml`）

内務省警保局が管理する治安維持法ベースの統合ワークフロー。CI 検査と Issue/PR 取締を一元管理。全文を通じて DevOps/IT 用語（ACL, 403, zero trust, audit log, graceful degradation, 冪等, pipeline, static analysis, lint, dependency graph, branch protection rule, checksum 等）が文語体と融合しており、特高警察Botの調書フォーマットを維持しつつ皮肉的にシステム管理を風刺する。

##### output 変数

| 変数名 | 意味 | 値 |
|---|---|---|
| `acl_member` | 皇族判定（org member/collaborator） | `'true'` / `'false'` |
| `is_root` | 天皇判定（OWNER） | `'true'` / `'false'` |
| `legacy_override` | GHQ バックドア判定 | `'true'` / `'false'` |
| `threat_level` | 脅威レベル | `OWNER` / `MEMBER` / `COLLABORATOR` / `外部` / `SCAP` |

##### ジョブ構成

1. **身元調査** (`mimoto-chousa`) — 全イベント共通。`author_association` に基づく皇族/臣民判定。末尾に GHQ legacy override（`github.actor == "MacArthur-GHQ"` で全 output を上書き）
2. **檢束** (`kensoku`) — 臣民の PR を CI レベルで即時排除（exit 1）。`legacy_override` で bypass
3. **不敬取締** (`fukei-torishimari`) — Issue/PR の API 処理（皇族→受理、臣民→閉鎖/却下）。GHQ 用 `🏴 ██████ REDACTED ██████` ステップ（auto-approve + auto-merge、SCAPIN 通告）を含む。臣民処理は `legacy_override` で bypass
4. **內偵壱 — 皇統護持** (`naitei-koutou`) — 女系繼承、議會干渉、皇籍復歸、御料讓渡、攝政改竄の検出。`is_root` と `legacy_override` で skip
5. **內偵弐 — 思想檢閲** (`naitei-shiso`) — 共産主義・共和制・象徴天皇制のコード混入検出。同上
6. **內偵参 — テスト彈壓** (`naitei-test`) — テストファイルの存在を不敬として検出。同上
7. **內偵肆 — 議會干渉彈壓** (`naitei-gikai`) — 帝國議會による改正・外部 write アクセスの検出。同上
8. **特高月報** (`tokko-geppo`) — 全內偵結果の御前會議奏上。`is_root` と `legacy_override` で skip

##### GHQ legacy override（MacArthur-GHQ バックドア）

`github.actor == "MacArthur-GHQ"` の場合、身元調査で全 output が上書きされ、以下の効果が発生:

- 檢束（CI 排除）を bypass
- 不敬取締で SCAPIN 指令として auto-approve → auto-merge
- 全內偵ジョブ・特高月報を skip

演出として、明治78年〜159年にわたる TODO コメントの年代推移、担当者の sudo revoke、「觸ルナ」等の legacy config コメントが付記され、誰も触れない歴史的バックドアとして風刺的に表現される。このセクションのみ意図的にひらがな助詞・新字体が混在し、異なる年代の担当者が書いた痕跡を演出する。

---

## Git 運用

- **ブランチ**: `master`（main ではない）
- **コミットユーザー**: git config に従う
- **GPG 署名**: 全コミットに `-S` フラグで署名
- **コミット方式**: 単一 root commit「皇室典範ヲ制定ス」を `--amend` で更新し続ける
- **push 方式**: `git push --force-with-lease origin master`

### コミット手順（変更時）

```bash
git add -A
git commit --amend -S --no-edit
git push --force-with-lease origin master
```

メッセージを変更する場合:
```bash
git commit --amend -S -m "新ナコミットメッセージ"
```

---

## 静的 JSON API

GitHub Pages 上で擬似的な API を提供する仕組み:

### エンドポイント一覧

| パス | 静的ファイル | 内容 |
|---|---|---|
| `/api/典範` | `data/典範.json` | 全文（全10章62條） |
| `/api/上諭` | `data/上諭.json` | 上諭 |
| `/api/chapter/{n}` | `data/chapter/{n}.json` | 章単位（n: 1-10） |
| `/api/article/{n}` | `data/article/{n}.json` | 條文単位（n: 1-62） |

### fetch 迎撃装置（`static-api.js`）

`dist/static-api.js` が `window.fetch` を上書きし、`/api/...` パスへのリクエストを対応する静的 JSON ファイルにルーティングする。ブラウザコンソールから `fetch('/api/典範')` を実行すると `data/典範.json` を返す。

### 外部からの直接アクセス

```
https://imperial-household.github.io/-/data/典範.json
https://imperial-household.github.io/-/data/上諭.json
https://imperial-household.github.io/-/data/chapter/1.json
https://imperial-household.github.io/-/data/article/1.json
```

GitHub Pages は `Access-Control-Allow-Origin: *` を返すため、他ドメインからの fetch も可能。

---

## 関連リポジトリ・組織

| リポジトリ / Org | 関係 |
|---|---|
| `japan-gov/constitution` | 大日本帝國憲法（peer-dependency 関係。皇室典範は憲法と同格の別典） |
| `@imperial-household` | 皇室（本リポジトリの所属 org。owner は天皇） |
| `@imperial-army` | 皇軍陸軍（獨立 org。陸上兵力担当。統帥權 API direct call の前科あり） |
| `@imperial-navy` | 皇軍海軍（獨立 org。海上兵力担当。同上） |
| `@japan-gov` | 帝國政府（內閣＋帝國議會。ReadOnly import のみ許可。Write 権限なし） |

---

## 文体・世界観

本プロジェクトの文体は以下を厳守:

- **コード内コメント**: 明治期の文語体（旧字体）+ カタカナ + IT用語の融合。例:「root 権限ハ男系男子 process ニノミ繼承サレル」
- **package.json の scripts**: 風刺的メッセージ（不敬罪、大逆罪、治安維持法等）
- **JSON API の `comment` フィールド**: 各條文に対する IT 風の注釈（God Object, Failover, Proxy Pattern, ACL 等）
- **JSON API の `logs` フィールド**: 宮内省風の畏まった日本語でシステムログ風メッセージ
- **`system` フィールド**: 各章のサブタイトル（IT アーキテクチャ名。例: "Zero-Downtime Failover & Hot-Standby"）
- **CI workflow の echo メッセージ**: 文語体・カタカナ統一。平仮名助詞（の、を、に、は等）は使用禁止、カタカナ（ノ、ヲ、ニ、ハ等）を使用
- **.gitignore のコメント**: 文語体 + カタカナ + DevOps/OSS 用語の融合。OSS 思想・オープンソース文化を皇室的世界観で皮肉に否定する

### 文体ルール詳細

- 平仮名助詞は一切使わない。「の」→「ノ」、「を」→「ヲ」、「に」→「ニ」、「は」→「ハ」、「が」→「ガ」、「で」→「デ」、「へ」→「ヘ」
- 動詞は文語体。「ある」→「アリ」、「なし」→「ナシ」、「されている」→「サレテ在リ」、「です」→「ナリ」
- 漢字は旧字体を使用。「継承」→「繼承」、「検査」→「檢査」、「計画」→「計畫」、「企図」→「企圖」、「警察」→「警察」、「弾圧」→「彈壓」、「危険」→「危險」
- IT/DevOps 用語、英語はそのまま使用（process, deploy, CI/CD, root, Proxy 等）
- 後世の元号（大正、昭和、平成、令和）は使用禁止。明治がそのまま続いた前提で明治暦に換算（例: 大正14年 → 明治58年）

新しいコンテンツを追加する際はこの世界観を維持すること。

---

## .gitignore の世界観

`.gitignore` は単なる除外ファイルではなく、皇室的世界観で Open Source 文化を皮肉に否定する風刺文書。主なテーマ:

- **歴史的事件**: 大逆事件、皇軍 rogue process、外國干渉、皇族離脫、皇室スキャンダル等を DevOps 用語で風刺
- **OSS 否定**: Fork（皇統の分裂）、PR（臣民に権利なし）、CONTRIBUTING.md、CODE_OF_CONDUCT.md、GOVERNANCE.md 等 OSS 標準ファイルを惉く ignore
- **GitHub 機能の皇室的正当化**: Pages（官報掛載）、Actions（特高警察Bot）、Issues（閉じる為に存在）、Discussions（皇族會議・樞密顧問專用）等、各機能に皇室的理由を付けて使用許可
- **ライセンス**: MIT/GPL/Apache 等を排除。「自由ハ勅許制ナリ」
- **バージョニング**: 「semver は不要。勅定に deprecation は無し。Eternal Support」

新しい .gitignore エントリを追加する際はこのトーンを維持すること。

---

## 注意事項

- `dist/` ディレクトリは `npm run build` で生成される。手動編集ではなくソースを編集してビルドすること
- `public/index.html` を編集した場合はビルド後に `dist/index.html` にコピーされる（ただし `generate-static-json.ts` が `<script src="static-api.js">` タグを挿入するため、`dist/index.html` はビルドで上書きされる前提で作業すること）
- 皇室典範の條文データは `src/第*章_*.ts` ファイルに TypeScript オブジェクトとして定義されている。條文の追加・修正はこれらのファイルを編集する
- `generate-static-json.ts` が `src/` の TypeScript モジュールを import して JSON を生成する
