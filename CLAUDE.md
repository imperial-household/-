# CLAUDE.md — 旧皇室典範DX推進リポジトリ 作業指示書

> 本書は AI Coding Agent（Claude）が本リポジトリ（`imperial-household/-`）で作業を行う際のガイドラインです。

---

## リポジトリ概要

- **名称**: 旧皇室典範レガシーシステム（Imperial Household Code Legacy System）
- **組織**: `@imperial-household`（宮内庁DX推進室）
- **URL**: https://imperial-household.github.io/-/
- **GitHub**: https://github.com/imperial-household/-
- **性質**: 明治22年（1889年）制定・昭和22年（1947年）廃止の旧皇室典範を TypeScript + GitHub Pages で実装した風刺的教育プロジェクト。全10章62条をIT用語（Symbol Interface, Zero-Downtime Failover, Proxy Pattern, Legacy System 等）で注釈付き解説する。宮内庁DX推進室の職員がレガシーシステムを淡々と保守する滑稽さが風刺の核。masterブランチはレガシーコード（帝国時代）、mainブランチはDX推進室が令和の皇室典範に向けた破壊的変更を準備するフィーチャーブランチ。

---

## ブランチ構成

| ブランチ | 内容 |
|---|---|
| `master` | 旧字体・文語体による原典保存版（帝国時代の世界観を維持） |
| `main` | 新字体・口語体・令和の世界観による現代版 |

---

## プロジェクト構成

```
imperial-household/-/
├── src/                          # TypeScript ソース（全10章 + barrel export）
│   ├── 皇室典範.ts              # barrel: 全章の export を集約
│   ├── 第一章_皇位継承.ts       # 第1条〜第9条
│   ├── 第二章_践祚即位.ts       # 第10条〜第13条
│   ├── 第三章_成年立后立太子.ts  # 第14条〜第19条
│   ├── 第四章_敬称.ts           # 第20条〜第21条
│   ├── 第五章_摂政.ts           # 第22条〜第28条
│   ├── 第六章_皇族.ts           # 第29条〜第42条
│   ├── 第七章_皇族会議.ts       # 第43条〜第46条
│   ├── 第八章_世伝御料.ts       # 第47条〜第49条
│   ├── 第九章_皇室経費.ts       # 第50条〜第51条
│   └── 第十章_補則.ts           # 第52条〜第62条
├── public/
│   └── index.html               # GitHub Pages フロントエンド（全文閲覧UI）
├── scripts/
│   └── generate-static-json.ts  # 静的 JSON API 生成スクリプト
├── dist/                        # ビルド出力（GitHub Pages にデプロイされる）
│   ├── index.html               # public/ からコピー
│   ├── static-api.js            # fetch 迎撃装置（API route を静的 JSON にマッピング）
│   └── data/                    # 静的 JSON API
│       ├── 典範.json            # 全文（全10章62条 + 上諭 + logs）
│       ├── 上諭.json            # 上諭のみ
│       ├── chapter/{1-10}.json  # 章単位
│       └── article/{1-62}.json  # 条文単位
├── .github/workflows/
│   ├── deploy-pages.yml         # GitHub Pages 自動デプロイ（master/main push トリガー）
│   ├── koho-response-bot.yml    # DX推進室対応Bot（Issue/PR 自動応答・クローズ）
│   └── shoryobu-archive-ci.yaml # DX推進室モダナイゼーションCI（構造検証・型チェック）
├── package.json                 # npm 設定（風刺的 scripts 含む）
├── tsconfig.json                # TypeScript 設定（strict: true, ES2020）
├── LICENSE                      # IHAL-2.0-Archive（レガシーコード公開許諾）
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

- master/main branch への push で `.github/workflows/deploy-pages.yml` が自動実行
- `dist/` ディレクトリが GitHub Pages にデプロイされる

### npm scripts（注意）

`npm test`, `npm run lint`, `npm run audit` 等は意図的に exit 1 する風刺的スクリプト。実際のテストやリントは存在しない。ただし main ブランチでは帝国時代の「不敬罪」等ではなく、宮内庁職員の穏やかな口調で丁重にお断りするメッセージに変更されている。

### CI/CD ワークフロー

| ワークフロー | ファイル | トリガー | 概要 |
|---|---|---|---|
| GitHub Pages デプロイ | `deploy-pages.yml` | master/main push | `dist/` を GitHub Pages にデプロイ |
| DX推進室対応Bot | `koho-response-bot.yml` | Issue / PR 作成 | Issue・PR にご案内を投稿してクローズ |
| DX推進室モダナイゼーションCI | `shoryobu-archive-ci.yaml` | master/main push / PR | 構造検証・型チェック・レガシー整合性確認 |

#### DX推進室モダナイゼーションCI（`shoryobu-archive-ci.yaml`）

宮内庁DX推進室が管理するレガシーモダナイゼーションCI。以下4つの検査ジョブで構成:

1. **モジュール構造検証** (`archive-structure`) — 全10章のソースファイル存在確認
2. **TypeScript 型チェック** (`type-check`) — `tsc --noEmit` による型チェック
3. **レガシー記録の整合性** (`historical-integrity`) — 全62条の条文定義存在確認
4. **保全状況レポート** (`archive-report`) — 全検査結果の最終報告

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

本プロジェクトには2つのブランチで異なる世界観がある:

### master ブランチ（帝国時代）
- **コード内コメント**: 明治期の文語体（旧字体）+ カタカナ + IT用語の融合。例:「Root 権限ハ男系男子 process ニノミ継承サレル」
- **package.json の scripts**: 不敬罪、大逆罪、治安維持法等による風刺的メッセージ
- **JSON API の `comment` フィールド**: God Object, Root権限 等の帝国的フレーミング

### main ブランチ（令和）
- **コード内コメント**: 宮内庁DX推進室の職員がレガシーシステムの破壊的変更を淡々と準備する視点。例:「旧典範のレガシー制約。Breaking Change候補: 女系・女性天皇対応。有識者会議の要件定義待ち」
- **package.json の scripts**: DX推進室職員の穏やかな口調で丁重にお断りするメッセージ（テストやリントは「導入検討中」「ロードマップに含まれている」等）
- **JSON API の `comment` フィールド**: Symbol Interface, Legacy System 等の現代的フレーミング。Failover, Proxy Pattern 等のIT用語は維持
- **JSON API の `logs` フィールド**: 宮内庁DX推進室風の丁寧な日本語でシステムログ風メッセージ
- **`system` フィールド**: 各章のサブタイトル（IT アーキテクチャ名。例: "Zero-Downtime Failover & Hot-Standby"）

新しいコンテンツを追加する際は、作業中のブランチの世界観を維持すること。

---

## 注意事項

- `dist/` ディレクトリは `npm run build` で生成される。手動編集ではなくソースを編集してビルドすること
- `public/index.html` を編集した場合はビルド後に `dist/index.html` にコピーされる（ただし `generate-static-json.ts` が `<script src="static-api.js">` タグを挿入するため、`dist/index.html` はビルドで上書きされる前提で作業すること）
- 皇室典範の条文データは `src/第*章_*.ts` ファイルに TypeScript オブジェクトとして定義されている。条文の追加・修正はこれらのファイルを編集する
- `generate-static-json.ts` が `src/` の TypeScript モジュールを import して JSON を生成する
