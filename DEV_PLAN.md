# 开发计划 - StaticHTML Publisher (精简版)

## 阶段一：准备与设计 (预计 0.5 - 1 周)

*   **任务 1.1：最终需求确认**
    *   [ ] 再次确认 PRD 中的核心功能点，确保理解一致。
*   **任务 1.2：技术选型 (轻量级)**
    *   [ ] **前端：**
        *   HTML 输入：简单的 `<textarea>`。
        *   实时预览：使用 `<iframe>` 的 `srcdoc` 属性，配置 `sandbox` 属性。
        *   UI 辅助：Pico.css (用于基本样式)。
        *   HTML 清理：DOMPurify。
    *   [ ] **后端 (发布功能)：**
        *   初步选定：Cloudflare Workers (或 Vercel/Netlify Functions)。
    *   [ ] **数据存储 (发布的 HTML 内容)：**
        *   初步选定：Cloudflare R2 (或对应平台的存储方案)。
*   **任务 1.3：基本 UI/UX 构思**
    *   [ ] 绘制极简界面草图：输入区、预览区、发布按钮、链接显示区。
*   **任务 1.4：搭建项目基础**
    *   [ ] 初始化 Git 仓库。
    *   [ ] 创建基础 HTML 文件 (`index.html`) 和 CSS (`style.css`)、JS (`script.js`) 文件结构。

## 阶段二：核心功能开发 - MVP (预计 1-2 周)

*   **任务 2.1：前端界面搭建**
    *   [ ] 实现 HTML 代码输入 `<textarea>`。
    *   [ ] 实现 `<iframe>` 预览区域。
    *   [ ] 实现“发布”按钮和显示结果链接的区域。
    *   [ ] 基础布局和样式 (Pico.css)。
    *   [ ] JavaScript 逻辑：获取 `<textarea>` 内容，更新 `<iframe>` 的 `srcdoc`。
*   **任务 2.2：HTML 清理 (Security)**
    *   [ ] 集成 DOMPurify，在更新预览前清理 HTML。
*   **任务 2.3：后端发布逻辑 (选择一个平台开始)**
    *   [ ] (以 Cloudflare Workers 为例) 编写 Worker 脚本：
        *   接收 POST 请求中的 HTML 内容。
        *   生成唯一 ID。
        *   将清理后的 HTML 存入 R2 (或 KV store for PoC)。
        *   返回 JSON 响应 { success: true, url: ".../:id" }。
*   **任务 2.4：后端内容服务逻辑**
    *   [ ] (以 Cloudflare Workers 为例) 编写 Worker 路由：
        *   处理 GET 请求 `/view/:id`。
        *   从 R2 (或 KV) 根据 ID 读取 HTML。
        *   返回 HTML 内容，`Content-Type: text/html`。

## 阶段三：测试与部署 (预计 0.5 - 1 周)

*   **任务 3.1：功能测试**
    *   [ ] 测试 HTML 粘贴、预览、发布全流程。
    *   [ ] 测试不同 HTML (含 CSS, JS) 的渲染。
    *   [ ] 安全性测试 (XSS)。
*   **任务 3.2：部署**
    *   [ ] 部署前端静态文件。
    *   [ ] 部署后端 Worker/Function。
*   **任务 3.3：简单文档**
    *   [ ] 编写 README 或简单使用说明。