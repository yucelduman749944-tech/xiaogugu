# 小姑姑手作 花生脆糖 — 品牌單頁網站

## 專案概要
- 純靜態單頁網站，沒有建置工具、沒有框架、沒有 npm 套件。
- 所有要上線的檔案都在 `site/`，它就是網站根目錄。
- 原始版本是在 Claude 桌面版做的（單一 index.html），2026-11-24 移到這裡時把 CSS、JS 拆成獨立檔案。

## 結構
```
site/
├── index.html      # 頁面內容與 SVG 圖示（<symbol>）
├── css/style.css   # 全部樣式；設計色票與字型在最上面的 :root 變數
├── js/main.js      # 訂購計算機、托盤動畫、複製訂單、手機底部下單列
└── img/            # 商品照片與標誌
```

## 本地預覽
```
python3 -m http.server 8000 -d site
```
然後打開 http://localhost:8000

## 上線
- 網址：https://yucelduman749944-tech.github.io/xiaogugu/
- 推到 `main` 就會由 `.github/workflows/pages.yml` 自動把 `site/` 發布到 GitHub Pages，大約一兩分鐘生效。
- 版本標籤：`v1.0` 是從 Claude 桌面版移過來的第一版。

## 慣例
- 文字用繁體中文、台灣用語、全形標點。
- 顏色、字型一律用 `style.css` 的 `:root` 變數，不要寫死色碼。
- 價格規則（`js/main.js` 最上面）：單包 NT$280，運費 60，滿 3 包免運，買 5 送 1（5～9 包），10 包以上請客人私訊。改價格時，`index.html` 裡寫出來的文案和 `<meta description>` 也要一起改。
- 圖示用 `index.html` 開頭的 `<symbol>`，用法是 `<svg><use href="#i-名稱"/></svg>`。
- 新增圖片前先壓縮（單張盡量 < 250KB），放進 `site/img/`。
