// 本地局域网服务器：node serve.js，然后用同一 Wi-Fi 下的设备打开提示的地址
// 注意：逐个地址监听而不是 0.0.0.0 —— 本机开着代理虚拟网卡时，通配监听会收不到连接。
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PORT = process.env.PORT || 8765;
const TYPES = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const handler = (req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const file = path.join(__dirname, path.normalize(rel));
  if (!file.startsWith(__dirname + path.sep) || !TYPES[path.extname(file)]) { res.writeHead(404); res.end('not found'); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)], 'Cache-Control': 'no-store' });
    res.end(data);
  });
};
const listen = (addr, label) => http.createServer(handler)
  .on('error', e => console.log(label + ' ' + addr + ' 启动失败: ' + e.message))
  .listen(PORT, addr, () => console.log(label + ' http://' + (addr === '127.0.0.1' ? 'localhost' : addr) + ':' + PORT + '/'));

listen('127.0.0.1', '本机:  ');
for (const [name, list] of Object.entries(os.networkInterfaces()))
  for (const i of list)
    if (i.family === 'IPv4' && !i.internal && !i.address.startsWith('198.18.') && /^en\d/.test(name))
      listen(i.address, '局域网:');
