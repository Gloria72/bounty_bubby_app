# Bounty Buddy 部署和域名绑定指南

## 📦 代码包说明

您已获得完整的项目代码包 `bounty-buddy-web.tar.gz`，包含:
- 完整的Web应用源代码
- 数据库schema定义
- 所有配置文件
- README和文档

**注意**: 压缩包不包含 `node_modules`，需要在部署时重新安装依赖。

---

## 🌐 绑定 .com 域名

### 方法一: 在Manus平台绑定自定义域名

1. **点击右上角"Publish"按钮发布网站**
   - 首先需要创建一个checkpoint(已完成)
   - 点击Publish按钮发布到生产环境

2. **进入管理面板 → Settings → Domains**
   - 在右侧Management UI中找到"Domains"设置
   - 点击"Add Custom Domain"

3. **添加您的 .com 域名**
   - 输入您的域名，例如: `bountyfriend.com`
   - 系统会提供DNS配置信息

4. **配置DNS记录**
   - 登录您的域名注册商(如GoDaddy, Namecheap, 阿里云等)
   - 添加以下DNS记录:
     ```
     类型: CNAME
     名称: @ 或 www
     值: [Manus提供的CNAME地址]
     ```

5. **等待DNS生效**
   - 通常需要5分钟到48小时
   - 系统会自动配置SSL证书

### 方法二: 自行部署到其他平台

如果您想部署到自己的服务器或其他云平台:

#### 部署到Vercel (推荐)

1. **解压代码包**
   ```bash
   tar -xzf bounty-buddy-web.tar.gz
   cd bounty-buddy-platform
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   - 复制 `.env.example` 到 `.env`
   - 配置数据库连接、OAuth等环境变量

4. **部署到Vercel**
   ```bash
   # 安装Vercel CLI
   npm i -g vercel
   
   # 登录并部署
   vercel login
   vercel --prod
   ```

5. **绑定自定义域名**
   - 在Vercel Dashboard中添加域名
   - 按照提示配置DNS记录

#### 部署到自己的服务器

1. **环境要求**
   - Node.js 22+
   - MySQL/TiDB数据库
   - Nginx (反向代理)

2. **安装依赖并构建**
   ```bash
   pnpm install
   pnpm build
   ```

3. **配置Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **配置SSL证书**
   ```bash
   # 使用Let's Encrypt免费证书
   sudo certbot --nginx -d yourdomain.com
   ```

5. **启动应用**
   ```bash
   pnpm start
   # 或使用PM2保持运行
   pm2 start npm --name "bounty-buddy" -- start
   ```

---

## 🔧 环境变量配置

部署时需要配置以下环境变量:

```env
# 数据库
DATABASE_URL=mysql://user:password@host:port/database

# JWT密钥
JWT_SECRET=your-secret-key

# OAuth配置
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# 应用信息
VITE_APP_TITLE=Bounty Buddy
VITE_APP_LOGO=https://your-logo-url.com/logo.png

# S3存储(可选)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_BUCKET=your-bucket
```

---

## 📱 React Native移动端

移动端代码在 `bounty-buddy-mobile.tar.gz` 中，部署方式:

1. **解压并安装依赖**
   ```bash
   tar -xzf bounty-buddy-mobile.tar.gz
   cd bounty-buddy-mobile
   npm install
   ```

2. **配置API地址**
   - 编辑 `src/api/client.ts`
   - 将 `baseURL` 改为您的 .com 域名

3. **构建应用**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web预览
   npm run web
   ```

4. **发布到应用商店**
   - 使用EAS Build构建生产版本
   - 提交到App Store和Google Play

---

## 🎯 快速开始(推荐)

**最简单的方式**: 使用Manus平台内置的域名绑定功能

1. 点击右上角"Publish"按钮
2. 进入Settings → Domains
3. 添加您的 .com 域名
4. 配置DNS记录
5. 等待生效(自动配置SSL)

这样您无需自己配置服务器、数据库、SSL证书等,一切都由平台自动处理!

---

## 📞 技术支持

如有问题,请访问: https://help.manus.im

---

## 🚀 当前部署状态

- **Web应用**: 已部署在Manus平台
- **临时域名**: https://3000-iyasrztoojmd7m0imhfai-d6807d2b.manusvm.computer
- **数据库**: 已配置并运行
- **功能状态**: 所有核心功能正常

绑定自定义域名后,您的网站将可通过 `https://yourdomain.com` 访问!

