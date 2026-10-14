## 💻 阿里云域名如何访问本地开发服务（Nginx+内网穿透）

在开发阶段，我们有时希望通过自定义域名访问本地运行的服务，比如：

*   使用真实域名调试微信小程序或浏览器跨域问题；
*   把本地项目分享给团队成员查看；
*   利用云解析和反向代理进行本地 API 调试。

这篇教程将带你 **一步步配置阿里云域名解析+本地 Nginx 反向代理**，实现公网域名访问你电脑里的服务。

***


### 📌 实现目标

例如，你已经在本地启动了一个服务，比如：

    arduino
    复制编辑
    http://localhost:5173  (Vite 本地前端)

你希望通过阿里云域名访问它，比如：

    arduino
    复制编辑
    http://dev.yourdomain.com

***

### 🛠 步骤总览

1.  ✅ 注册域名（阿里云）
2.  ✅ 域名解析至本地公网 IP
3.  ✅ 配置端口映射（公网访问你的电脑）
4.  ✅ 本地安装 Nginx
5.  ✅ 配置 Nginx 反向代理
6.  ✅ 成功访问本地服务！

***

### 🧩 第一步：注册一个域名

如果你还没有域名，可以在 [阿里云域名控制台]() 购买一个域名。

例如注册：`yourdomain.com`

***

### 🌐 第二步：域名解析至你的公网 IP

登录 [阿里云控制台 - 域名解析]() 添加如下记录：

| 类型 | 主机记录 | 记录值    | TTL |
| -- | ---- | ------ | --- |
| A  | dev  | 本地电脑IP | 600 |

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/dd385ba58d9c4fdb87a4313061e8036c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LqS6IGU572R54mb6ams:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjY1NDY5NzM1NzU4ODQyNiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1792559514&x-orig-sign=95PDu0wQoesZrey08tW9RhNke78%3D)

***

### 🌍 第三步：安装 Nginx

如果你的服务是运行在本地非标准端口（如 Vite 的 5173、Node 的 3000），我们需要通过 Nginx 反向代理。

#### 🔧 Mac 安装 Nginx：

    bash
    复制编辑
    brew install nginx

默认配置文件路径为：`/opt/homebrew/etc/nginx/nginx.conf`\
默认启动命令：

    bash
    复制编辑
    brew services start nginx

***

### 📝 第四步：配置 Nginx 反向代理

编辑配置文件，例如添加一个 `server` 段（或修改默认的 `server`）：

    nginx
    复制编辑
    server {
        listen       80;
        server_name  dev.yourdomain.com;

        location / {
            proxy_pass http://**.**.**.**:****; #(本地ip加端口号)
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }

> ❗ 如果你修改的是 `nginx.conf`，确保它被 `http {}` 包含。

#### 🔁 重启 Nginx：

    bash
    复制编辑
    nginx -s reload

#### ✅ 本地测试：

打开浏览器访问：

    arduino
    复制编辑
    http://dev.yourdomain.com

如果你的公网 IP 和端口映射没问题，这时就能成功访问到你本地的服务啦！

***

### 🧪 补充测试工具

*   `curl -I http://dev.yourdomain.com` 查看响应头
*   浏览器开发者工具查看图片/API 是否加载正常
*   阿里云 DNS 控制台有「解析检测」功能

***

### 🔐 可选：开启 HTTPS（推荐）

可以使用阿里云或 [Let's Encrypt](https://letsencrypt.org/) 提供的免费 SSL 证书，在 nginx 中配置：

    nginx
    复制编辑
    server {
        listen       443 ssl;
        server_name  dev.yourdomain.com;

        ssl_certificate     /path/to/fullchain.pem;
        ssl_certificate_key /path/to/private.key;

        location / {
            proxy_pass http://127.0.0.1:5173;
        }
    }
