# 分发方案总览

## 🎯 三层分发策略（按门槛从低到高）

### ⭐⭐⭐ 第一层：Web在线版
- 就是一个网页，打开即用
- 部署到 GitHub Pages / Vercel（免费）
- 生成二维码，发到朋友圈/微信群扫码即用
- 文件: `compliance-tools/web/index.html`
- **零安装、零注册、零费用**

### ⭐⭐ 第二层：油猴脚本
- 全浏览器通用（Edge/Chrome/360/QQ/Firefox）
- 用户只需安装 Tampermonkey（多数国产浏览器已内置）
- 发布到 GreasyFork.org（免费，国内可访问）
- 安装后网页右下角出现🛡️浮动按钮，随时检测
- 文件: `compliance-tools/tampermonkey/ai-compliance-checker.user.js`
- **免费分发，自动更新**

### ⭐ 第三层：Edge扩展商店
- Edge 国内用户量可观（Windows自带）
- 开发者注册免费，无需$5
- 与 Chrome 扩展代码完全兼容（都是Chromium）
- 直接用现有的 `content-compliance-checker` 文件夹
- **免费上架，Edge商店SEO获客**

---

## 📝 当前交付物

```
咸鱼翻身/
├── content-compliance-checker/     # Chrome/Edge 扩展（已测试通过）
│   └── ...12个文件
├── compliance-tools/
│   ├── tampermonkey/
│   │   └── ai-compliance-checker.user.js   # 油猴脚本（推荐！）
│   └── web/
│       └── index.html                       # Web在线版（零门槛）
├── compliance-landing/
│   └── index.html                           # 产品落地页
├── content-compliance-checker.zip           # 扩展打包
```

---

## 🚀 建议的发布顺序

1. **现在**: 把 Web 版部署到 GitHub Pages → 生成二维码 → 发朋友圈测试
2. **今天**: 把油猴脚本发布到 GreasyFork.org
3. **后续**: 把扩展提交到 Edge Add-ons 商店（免费）
