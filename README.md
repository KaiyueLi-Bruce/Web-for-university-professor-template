## 实验室官网 & 内容编辑器

这是一个为**高校实验室**设计的前端项目，包含：

- 面向外部访问者的 **单页实验室官网**（首页、研究、论文、成员、加入我们）
- 仅供内部使用的 **内容编辑器页面**，可以在线编辑上述内容并导出 `content.json` 配置

整个站点为纯前端实现，适合部署到静态站点（如 GitHub Pages、学校服务器的静态目录等）。

---

## 技术栈

- **构建工具**：Vite
- **框架**：React 19 + TypeScript
- **路由**：React Router
- **样式**：Tailwind CSS（白 / 灰 / 蓝绿色环境科学主题）

---

## 主要结构

- `index.html`：入口 HTML（包含中文语言设置和实验室标题）
- `public/content.json`：**当前线上使用的实验室内容配置**（官网和编辑器都会从这里读取）
- `src/content.json`：内容结构的一个代码仓库副本（方便版本管理）
- `src/main.tsx`：React 入口
- `src/App.tsx`：路由配置  
  - `/`：实验室官网
  - `/edit-lab-content`：内容编辑页面
- `src/styles.css`：Tailwind CSS 入口与基础样式

### 组件与页面

- `src/components/Navbar.tsx`  
  顶部导航栏

- `src/components/SectionTitle.tsx`  
  各个内容区的标题与下方蓝绿色装饰线。

- `src/types/content.ts`  
  定义 `LabContent`、`NavItem`、`MemberItem`、`PaperItem` 等数据结构。

- `src/pages/Home.tsx`  
  实验室官网主页，从 `content.json` 读取数据并渲染：
  - 首页简介
  - 研究内容
  - 论文列表
  - 成员列表（头像 / 姓名 / 职位 / 简介）
  - 加入我们

- `src/pages/EditLabContent.tsx`  
  内容编辑器页面，包含：
  - 左侧 **侧边栏菜单**：导航与名称 / 首页 / 研究 / 论文 / 成员 / 加入我们
  - 右侧编辑表单：使用 Input / Textarea 组成
  - **成员管理**：支持动态添加 / 删除成员条目，上传头像（Base64）或填写图片路径
  - **论文管理**：可添加 / 删除论文，编辑标题、作者、年份、链接
  - 底部有 **“生成并下载配置文件 (content.json)”** 按钮

---

## 本地运行方式

1. **进入项目目录**

   ```bash
   cd "Your adress for the file"
   ```

2. **安装依赖（首次运行需要）**

   ```bash
   npm install
   ```

3. **启动开发服务器**

   ```bash
   npm run dev
   ```

   终端会输出本地访问地址，例如：

   ```text
   http://localhost:5173/
   ```

   - 打开 `/`：查看实验室官网  
   - 打开 `/edit-lab-content`：进入内容编辑页面

---

## 编辑内容与导出流程

1. 在浏览器访问 `/edit-lab-content`。
2. 通过左侧侧边栏选择模块（首页、研究、论文、成员、加入我们等），在右侧表单中编辑内容：
   - 文本类内容：直接修改 Input / Textarea。
   - 成员头像：
     - 可以通过 **上传图片**（转成 Base64 保存在 JSON 中），或
     - 将图片放入 `public/images`，然后在对应成员的图片路径中填写 `/images/xxx.jpg`。
3. 编辑完成后，点击页面底部的 **“生成并下载配置文件 (content.json)”** 按钮。
4. 将下载得到的 `content.json` 覆盖到项目的 `public/content.json`。
5. 刷新官网（`/`），即可看到最新内容。

> 提示：如果部署到线上，只要替换部署目录下的 `content.json`（路径与本地一致），就可以在不重新构建前端的情况下更新内容。

---

## 外部访问者与编辑权限

- 普通访问者通常只会访问 `/`（官网页面）。
- 目前在push到github后网页会自动部署并使用 `npm run build` 指令。
- 部署后访问者无使用编辑器权限，仅能阅读发布内容。
- 目前视频支持本地文件，url视频，以及嵌入HTML（iframe），目前测试Youtube和bilibili视频可正常使用

