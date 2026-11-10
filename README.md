# Cleo Marsh 官网完整源文件

这是当前工作目录的完整网页源码与素材快照。网站是原生 HTML / CSS / JavaScript 静态站点，没有必须安装的 npm 依赖，也不需要编译。

## 在另一台电脑预览

1. 解压整个文件夹，不要只复制 index.html。
2. 安装 Python 3（若已有则跳过）。
3. Windows 双击 `start-preview.bat`；其他系统在此目录执行 `python3 preview.py`。
4. 浏览器打开 http://127.0.0.1:8765/ 。关闭命令窗口即可停止服务。

也可在 VS Code 中用 Live Server 打开 dist/index.html。不要通过双击 HTML 的 file:// 方式测试：动画会读取帧序列清单，需要 HTTP 服务。

## 修改入口

- `dist/index.html`：页面结构、文案、联系表单、SEO。
- `dist/style.css`：基础样式与响应式布局。
- `dist/composition.css`：人物位置、移动端首屏、纵向流程、联系区域的覆盖样式；最后加载，优先级更高。
- `dist/app.js`：作品、业务、角色画廊、导航、流程渐显动画、表单提交。
- `dist/motion.js`：洗牌帧序列与角色左右看；包含手机陀螺仪权限逻辑。
- `dist/fonts.css`、`dist/assets/font-*.woff2`：字体。
- `dist/assets/`：所有本地海报、透明人物、背景、Logo 和字体。
- `dist/assets/motion/card-keyed-v4/`、`bunny-keyed-v4/`：当前使用的动画清单与 WebP 帧。

保留了旧动画版本与旧角色图片作为源素材备份；当前网站未引用它们。当前线上发布清单见 `production-files.json`，不含这些旧资源。新女仆海报为 `dist/assets/maid-poster.webp`。

## 当前功能与状态

- 网站定位：原创 AI 故事、角色、世界观与 IP。
- 唯一业绩数字：50M+ VIEWS GENERATED；已移除数据区、图表和作品详情弹窗。
- 手机端采用 Remy / Cleo / 动漫女主首屏及纵向制作流程。
- 联系按钮为 CONTACT US，展开网页表单；页面不显示收件邮箱。
- 表单通过第三方 FormSubmit 转发到 business@cleomarsh.com，不是自建邮件服务器。邮箱地址仍存在源代码和表单请求中，视觉隐藏不等于保密。
- 邮件通道尚未完成激活及端到端送达验证；之前自动测试被 FormSubmit 返回 403 拒绝。不能认为表单提交成功提示代表邮件已送达。
- 真机陀螺仪需要 HTTPS；iOS 通常需点击小型 Enable tilt 按钮授权。

## Vercel 部署

现有项目：https://cleo-marsh-studio.vercel.app/
项目名称：cleo-marsh-studio。项目与团队 ID 见 deployment-info.json（不含密钥）。

在新电脑登录同一个 Vercel 账户，关联现有项目后，从 `dist` 目录发布静态文件；Framework 选 Other，不设置构建命令。避免误建一个独立生产项目。

当前源文件已经是可发布文件，不需要构建。可以执行 `cd dist` 后运行 `vercel link` 关联现有项目，再执行 `vercel --prod`。Vercel CLI 需在新电脑单独安装和登录；本包不含登录状态、令牌或密码。

## 自定义域名

cleomarsh.com 和 www.cleomarsh.com 已在 Vercel 关联。www 配置为跳转到根域名；Northwest 侧 DNS 配置尚待完成/核验。最后一次 Vercel 返回的建议解析如下，操作前请在项目域名页重新确认：

- A，@，216.198.79.1
- A，@，64.29.17.1
- CNAME，www，79987f7b8f2654b8.vercel-dns-017.com

保留原有 Lark MX 和 TXT 邮箱记录，不改 Nameservers。

## Figma

https://www.figma.com/design/3LirTp2UNDQKo9hDTzUG7n

Figma 是云端文件，登录原账户即可继续编辑。本包没有伪造 .fig 文件；若需要离线 Figma 副本，请在 Figma 编辑器中使用 Save local copy。
最近一次“原创故事与 IP”文案大改只发布到了网站，Figma 并非完全同步。

## 检查与迁移

`checks/` 包含当前流程动画和初始化检查。装好 Node.js 后，在项目根目录执行 `node checks/test-process-scroll.cjs`、`node checks/test-mobile-process.cjs`、`node checks/test-originals-init.cjs`。
`SHA256SUMS.json` 用于核对所有交付文件完整性。
