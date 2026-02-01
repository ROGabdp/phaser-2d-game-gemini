# Phaser 2D 遊戲 - Oak Woods

這是一個使用 [Phaser 3](https://phaser.io/) 和 [Vite](https://vitejs.dev/) 建構的 2D 平台遊戲，包含視差背景、圖塊地圖 (Tilemap) 地板以及完整動畫的角色。

## 功能特色

- **無限世界**：動態生成的地板與無邊界的世界，支援無限橫向捲動遊玩。
- **視差背景**：3 層視差捲動背景，隨攝影機移動產生真實深度感。
- **角色控制**：流暢的待機、行走、奔跑、跳躍與攻擊動畫。
- **操作方式**：
  - **移動**：WASD 或 方向鍵
  - **跳躍**：空白鍵 (Space)、上 (Up) 或 W
  - **攻擊**：Z (攻擊 1)、X (攻擊 2)
- **資源管理**：使用 `assets.json` 集中管理並載入遊戲素材。
- **解析度**：原生 320x180 解析度 (Pixel Art 風格)，在網頁上自動縮放以適應螢幕。

## 快速開始

### 前置需求

- Node.js (v16+)
- npm

### 安裝

```bash
npm install
```

### 開發

啟動本地開發伺服器：

```bash
npm run dev
```

在瀏覽器中開啟 [http://localhost:5173/](http://localhost:5173/)。

### 測試

執行 Playwright 自動化測試以驗證遊戲是否正常運作：

```bash
npx playwright test
```

## 目錄結構

- `public/assets/oakwoods`：遊戲素材 (精靈圖、圖塊集)。
- `src/scenes`：Phaser 場景 (Boot, Preloader, Game)。
- `src/main.js`：遊戲入口與設定檔。
- `tests/`：Playwright 驗證測試。
