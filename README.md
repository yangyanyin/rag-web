# RAG 知识库 · 前端

基于 **Nuxt + Nuxt UI** 的 RAG（检索增强生成）知识库问答前端。输入问题后，可以直接检索文档原文，也可以开启 AI 回答，由大模型基于文档内容流式生成答案。


## 功能

- **文档检索**：关闭 AI 时，直接展示命中的文档片段（Markdown 渲染），内容均来自文档原文
- **AI 回答**：开启后通过 SSE 流式输出，边生成边显示
- **Markdown 渲染**：检索结果与 AI 回答统一渲染，支持列表、代码块、表格
- **随手记**：读取 `app/assets/document/` 下的 Markdown 文件，文件名即路由，新增文件自动出现在列表
- **响应式导航**：桌面端横向菜单，窄屏自动切换为汉堡菜单
- **明暗主题**：支持浅色 / 深色切换

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Nuxt、Vue 3、TypeScript |
| UI | Nuxt UI、Tailwind CSS |
| Markdown | markdown-it |
| 后端（独立仓库） | NestJS、Chroma Cloud、Qwen Embedding、火山方舟 |
| 部署 | Vercel |

## 项目结构

```text
app/
├── api/                  # 接口封装
├── assets/
│   ├── css/
│   └── document/         # 随手记的 Markdown 文件
├── components/           # 通用组件（如 Markdown 渲染）
├── composables/          # 组合函数（读取笔记、Markdown 渲染等）
├── layouts/
├── pages/
│   ├── index.vue         # 首页
│   ├── knowledge/        # 知识库搜索
│   ├── notes/            # 笔记列表与详情（/notes/[slug]）
│   └── about/
├── utils/
├── app.config.ts
└── app.vue               # 顶部导航与全局布局
nuxt.config.ts            # 代理与环境变量配置
```

## 快速开始

### 环境要求

- Node.js 20 及以上（开发环境使用 22）
- 已启动的后端服务（本地默认 `http://localhost:3000`）

### 安装与运行

```bash
# 安装依赖（网络慢可使用国内镜像）
npm install

# 复制环境变量文件并按需修改
cp .env.example .env

# 启动开发服务器
npm run dev
```

### 环境变量

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `API_BASE` | 后端服务地址，末尾不要带 `/` | `http://localhost:3000` |

`.env.example`：

```bash
API_BASE=http://localhost:3000
```

前端请求的 `/api/**` 会由 Nuxt 的 `routeRules` 代理到 `API_BASE`，因此浏览器看到的始终是同源请求，不需要在后端开启 CORS。

> `API_BASE` 在启动或构建时读取，修改后需要重启开发服务器；部署到 Vercel 时需在项目的环境变量里配置，并重新部署。

### 构建

```bash
npm run build
npm run preview
```

## 接口约定

前端通过 `POST /api/search` 调用后端：

```jsonc
// 请求
{
  "keyword": "什么是 Vercel",
  "ai_search": false    // true 为 AI 回答（SSE 流式），false 为仅检索
}
```

- `ai_search: false`：返回 JSON，包含命中的文档片段（`text`、`source`、`heading`、`distance`）
- `ai_search: true`：返回 SSE 流，每个事件形如 `data: "片段文本"`，前端解析后逐段拼接

## 随手记写法

在 `app/assets/document/` 下新增 Markdown 文件即可，无需改代码：

```text
app/assets/document/sse-node-express.md  →  /notes/sse-node-express
```

- 文件名使用小写英文加连字符，作为路由
- 页面标题取文件中第一个 `#` 标题，没有则使用文件名

## 部署

1. 将仓库推送到 GitHub
2. 在 Vercel 中导入该仓库，框架会被自动识别为 Nuxt
3. 在 **Settings → Environment Variables** 中添加 `API_BASE`
4. 部署；之后每次推送到主分支都会自动触发部署

## 相关项目

- 后端：NestJS 服务，负责文档分块、向量化入库（Chroma Cloud）、语义检索与大模型调用 <!-- 填写仓库链接 -->

## License

<!-- 按需填写，例如 MIT -->