# design/

不會上線的設計原始檔。

## og-image.html — FB／LINE 分享圖
改完文案或照片後，在專案根目錄執行以下指令重新產生 `site/img/og-share.jpg`（2400×1260）：

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1200,630 --virtual-time-budget=8000 \
  --allow-file-access-from-files --screenshot=/tmp/og.png "file://$PWD/design/og-image.html"
sips -s format jpeg -s formatOptions 80 /tmp/og.png --out site/img/og-share.jpg
```

分享圖上的價格要跟網站同步，改價格時記得一起改。
