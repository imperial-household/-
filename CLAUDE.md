# CLAUDE.md — 皇室典範リポジトリ 自動電信人形向ケ勅令

> 本書ハ AI Coding Agent（Claude）ガ本リポジトリ（`imperial-household/-`）ニ於テ作業ヲ行フ際ノ勅令ナリ。

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
│   ├── lèse-majesté-bot.yml    # 不敬罪自動取締Bot（Issue/PR 即時閉鎖 + ban）
│   └── tokko-police.yaml        # 特高警察 CI（皇室典範護持・思想検閲・テスト弾圧）
├── package.json                 # npm 設定（風刺的 scripts 多数含む）
├── tsconfig.json                # TypeScript 設定（strict: true, ES2020）
├── LICENSE                      # IHOL-1.0-Chokuteⅰ（勅定專有使用許諾）
├── INTEGRATION-INSTRUCTIONS.md  # japan-gov/constitution との統合指示書
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

`npm test`, `npm run lint`, `npm run audit` 等は意図的に exit 1 する風刺的スクリプト。実際のテストやリントは存在しない。

### CI/CD ワークフロー

| ワークフロー | ファイル | トリガー | 概要 |
|---|---|---|---|
| GitHub Pages デプロイ | `deploy-pages.yml` | master push | `dist/` を GitHub Pages にデプロイ |
| 不敬罪自動取締Bot | `lèse-majesté-bot.yml` | Issue / PR 作成 | Issue・PR を即時閉鎖し、起票者を ban |
| 特高警察 CI | `tokko-police.yaml` | master push / PR | 皇室典範の神聖不可侵を自動護持 |

#### 特高警察 CI（`tokko-police.yaml`）

内務省警保局が管理する治安維持法ベースの CI。以下5つの検査ジョブで構成:

1. **皇統護持検査** (`koutou-guard`) — 女系継承コード、議会干渉、臣籍復帰、世傳御料売却、攝政改竄の検出
2. **思想検閲** (`shiso-kenetsu`) — 共産主義・共和制・象徴天皇制のコード混入検出
3. **テスト弾圧** (`test-suppression`) — テストファイルの存在を不敬として検出
4. **議會干渉弾圧** (`diet-suppression`) — 帝國議會による改正・外部 write アクセスの検出
5. **御前会議** (`gozen-kaigi`) — 全検査結果の最終報告

---

## Git 運用

- **ブランチ**: `master`（main ではない）
- **コミットユーザー**: `meiji-emperor <unseikan@gmail.com>`
- **GPG 署名**: 全コミットに `-S` フラグで署名（鍵 `09DF1E861CB5F68E`）
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

## 関連リポジトリ

| リポジトリ | 関係 |
|---|---|
| `japan-gov/constitution` | 大日本帝国憲法（peer-dependency 関係。皇室典範は憲法と同格の別典） |

`INTEGRATION-INSTRUCTIONS.md` に `japan-gov/constitution` のサイドバーから本 API を使って皇室典範全文を閲覧する統合手順を記載している。

---

## 文体・世界観

本プロジェクトの文体は以下を厳守:

- **コード内コメント**: 明治期の文語体（旧字体）+ カタカナ + IT用語の融合。例:「root 権限ハ男系男子 process ニノミ継承サレル」
- **package.json の scripts**: 風刺的メッセージ（不敬罪、大逆罪、治安維持法等）
- **JSON API の `comment` フィールド**: 各條文に対する IT 風の注釈（God Object, Failover, Proxy Pattern, ACL 等）
- **JSON API の `logs` フィールド**: 宮内省風の畏まった日本語でシステムログ風メッセージ
- **`system` フィールド**: 各章のサブタイトル（IT アーキテクチャ名。例: "Zero-Downtime Failover & Hot-Standby"）

新しいコンテンツを追加する際はこの世界観を維持すること。

---

## 注意事項

- `dist/` ディレクトリは `npm run build` で生成される。手動編集ではなくソースを編集してビルドすること
- `public/index.html` を編集した場合はビルド後に `dist/index.html` にコピーされる（ただし `generate-static-json.ts` が `<script src="static-api.js">` タグを挿入するため、`dist/index.html` はビルドで上書きされる前提で作業すること）
- 皇室典範の條文データは `src/第*章_*.ts` ファイルに TypeScript オブジェクトとして定義されている。條文の追加・修正はこれらのファイルを編集する
- `generate-static-json.ts` が `src/` の TypeScript モジュールを import して JSON を生成する
