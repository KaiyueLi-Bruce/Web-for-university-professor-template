# 校园教师工作平台（前端示例）

一个为学校老师设计的网页前端示例，包含**教师主页 / 仪表盘**界面，用于展示课程安排、教学数据、校园通知和常用功能入口。

目前是纯前端静态数据示例，方便先确定界面风格与布局，后续可接入真实后端接口与登录系统。

## 技术栈

- **构建工具**：Vite
- **框架**：React 19 + TypeScript

## 目录结构（主要部分）

- `index.html`：应用入口 HTML
- `src/main.tsx`：React 入口文件
- `src/App.tsx`：整体页面布局
- `src/styles.css`：全局样式 & 布局
- `src/components/`：页面组件
  - `Header.tsx`：顶部导航栏（系统名称、导航、教师信息）
  - `Hero.tsx`：问候区 + 今日概览卡片
  - `QuickStats.tsx`：教学统计数据卡片
  - `TodaySchedule.tsx`：今日课程安排
  - `Announcements.tsx`：校园通知列表
  - `ResourceSection.tsx`：常用功能快捷入口
  - `Footer.tsx`：底部说明

## 本地运行方式

1. **进入项目目录**

   ```bash
   cd "/Users/bruceli/local files/test/Web test"
   ```

2. **安装依赖**

   （只需执行一次，时间取决于网络环境）

   ```bash
   npm install
   ```

3. **启动开发服务器**

   ```bash
   npm run dev
   ```

   终端会输出一个本地地址，一般类似：

   ```text
   http://localhost:5173/
   ```

   在浏览器中打开这个地址即可看到教师主页界面。

