`mkcert` 是一个超方便的工具，用来在本地生成受信任的 SSL 证书，特别适合本地开发使用 HTTPS。下面是完整使用流程，一步步带你操作 👇

***

## 使用mkcert生成SSL 证书

## ✅ 一、安装 mkcert（你已经安装）

    brew install mkcert

***

### ✅ 二、安装本地根证书（第一次使用必须做）

    mkcert -install

🔒 这个步骤会在你的系统中生成并信任一个本地 CA 证书（不会影响线上），它之后会签发本地 HTTPS 证书。

***

### ✅ 三、生成本地开发用的证书

    mkcert localhost // 进入指定目录输入，证书会生成在当前目录下

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/9105865338cc42b492d7a193b67a43ee~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LqS6IGU572R54mb6ams:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjY1NDY5NzM1NzU4ODQyNiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1792559190&x-orig-sign=zH36T%2Ft1y1TIqxJjPJZ%2FmgO5fv0%3D)
它会生成两个文件：

*   `localhost.pem`（公钥）
*   `localhost-key.pem`（私钥）

**`mkcert` 生成证书时指定的域名，必须和你在 Nginx 配置里的 `server_name` 完全一致**，否则浏览器会提示「证书无效」⚠️。

***

### ✅ 四、在本地项目中使用（以 Node.js/Express 为例）

    const fs = require('fs');
    const https = require('https');
    const express = require('express');

    const app = express();

    const options = {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    };

    app.get('/', (req, res) => {
      res.send('Hello HTTPS!');
    });

    https.createServer(options, app).listen(3000, () => {
      console.log('✅ 服务器已启动：https://localhost:3000');
    });

现在访问 `https://localhost:3000` 就不会出现证书不受信任的问题啦 🎉

***

### ✅ 五、常见用途

| 场景                   | 使用方式                                         |
| -------------------- | -------------------------------------------- |
| 本地 HTTPS 接口调试        | `mkcert localhost` 然后配置 express/nginx        |
| Vue/React 本地开发 HTTPS | 配置 devServer：`https: { key, cert }`          |
| nginx 本地 HTTPS 代理    | `ssl_certificate` 和 `ssl_certificate_key` 配置 |
| 多域名测试                | `mkcert domain1.test domain2.test`           |
