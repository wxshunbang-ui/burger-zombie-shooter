#!/bin/zsh
# 双击本文件：启动本地服务器，同一 Wi-Fi 下的手机/电脑都能打开下面的地址来玩。关掉这个窗口即停止。
cd "$(dirname "$0")"
echo "🍔 汉堡节：僵尸来了！本地服务器已启动（关闭此窗口即停止）"
echo
if command -v node >/dev/null 2>&1; then
  node serve.js
else
  IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1)
  echo "本机:   http://localhost:8765/"
  echo "局域网: http://$IP:8765/"
  python3 -m http.server 8765 --bind 0.0.0.0
fi
