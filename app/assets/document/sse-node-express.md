在前端开发中，通常是客户端通过请求获取服务器的数据。但在某些场景（如实时通知、进度更新、直播弹幕等），我们更希望**服务器主动推送数据到客户端**。这时候，`SSE（Server-Sent Events）` 就派上用场了。

* * *

## ✅ 什么是 SSE？

SSE 是 HTML5 标准的一部分，是一种基于 HTTP 协议的单向通信机制：

-   **由服务器主动向客户端推送数据**
-   **客户端使用 `EventSource` 进行接收**
-   **天然支持浏览器自动重连、消息顺序控制**

* * *

## 🚀 使用场景

-   实时股票/币价推送
-   在线用户列表实时刷新
-   实时系统消息、后台任务进度更新
-   聊天系统（轻量实现）

* * *

## 🛠 服务端实现（Node.js + Express）

```
js
复制编辑
const express = require('express');
const router = express.Router();

router.get('/test/server-sent-events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',     // SSE 核心类型
    'Cache-Control': 'no-cache',             // 禁用缓存
    'Connection': 'keep-alive'               // 保持连接
  });

  // 每秒向客户端推送当前时间
  setInterval(() => {
    const data = {
      message: `Current time is ${new Date().toLocaleTimeString()}`
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);
});
```

### 📌 说明：

-   `Content-Type` 必须是 `text/event-stream`
-   每条数据前加上 `data:`，结尾两个换行符 `\n\n` 是 SSE 协议要求
-   使用 `setInterval` 模拟持续推送数据

* * *

## 💻 客户端实现

```
html
复制编辑
<script>
  if (typeof(EventSource) !== "undefined") {
    const source = new EventSource('/test/server-sent-events', {
      withCredentials: true  // 如果需要携带 cookie
    });

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("收到推送消息：", data.message);
    };

    // source.close(); // 如需手动关闭连接
  } else {
    console.log("当前浏览器不支持 SSE");
  }
</script>
```

### 📌 说明：

-   使用 `EventSource` 创建与服务器的持久连接
-   每当服务端 `res.write()` 新数据时，客户端 `onmessage` 被触发

* * *

## ⚙️ 与 WebSocket 区别？

| 特性    | SSE       | WebSocket   |
| ----- | --------- | ----------- |
| 协议    | HTTP（单向）  | 自定义协议（双向）   |
| 简单易用  | ✅         | ❌（需要握手、协议）  |
| 浏览器支持 | ✅（IE 除外）  | ✅           |
| 自动重连  | ✅         | ❌（需手动实现）    |
| 用途    | 实时通知、进度推送 | 聊天、游戏、实时协作等 |

* * *

## ✅ 总结

SSE 是一种轻量级的服务器推送方案，**不需要引入额外库**，前后端代码简洁易懂，非常适合用在消息推送、实时提示、进度反馈等场景。

如果你只需要单向的数据流推送，SSE 是个优雅又简单的解决方案。