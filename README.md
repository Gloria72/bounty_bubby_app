# 搭子赏金平台 - React Native 移动端

基于PRD开发的搭子任务赏金平台移动端应用,采用React Native + Expo构建。

## 功能特性

- ✅ **赏金猎人主题**: 深色主题 + 金色强调色
- ✅ **首页**: Hero区、统计卡片、分类导航、最新任务
- ✅ **任务广场**: 搜索、分类筛选、任务列表
- ✅ **底部导航**: 首页/任务/我的
- ✅ **API集成**: 连接Web应用后端API

## 技术栈

- **框架**: React Native + Expo
- **导航**: React Navigation (Stack + Bottom Tabs)
- **状态管理**: Zustand
- **数据请求**: Axios + React Query
- **UI**: 自定义组件 + 赏金猎人主题

## 安装依赖

\`\`\`bash
npm install
\`\`\`

## 运行项目

### Web预览
\`\`\`bash
npm run web
\`\`\`

### iOS (需要macOS)
\`\`\`bash
npm run ios
\`\`\`

### Android
\`\`\`bash
npm run android
\`\`\`

## 项目结构

\`\`\`
src/
├── api/
│   └── client.ts          # API客户端配置
├── screens/
│   ├── HomeScreen.tsx     # 首页
│   ├── TasksScreen.tsx    # 任务广场
│   └── ...
├── theme/
│   └── colors.ts          # 主题配色
└── ...
\`\`\`

## 主题配色

- **背景色**: #1E1E2E (深蓝黑)
- **主色调**: #F5C842 (金色)
- **强调色**: #4ECDC4 (青色)
- **卡片**: #2A2A3E (深灰蓝)

## API配置

默认连接到Web应用的API端点:
\`https://3000-iyasrztoojmd7m0imhfai-d6807d2b.manusvm.computer/api\`

可在 \`src/api/client.ts\` 中修改API地址。

## 开发说明

1. 确保Web应用后端正常运行
2. 启动移动端应用
3. 首页会自动加载任务数据
4. 可以浏览任务、搜索筛选

## 待开发功能

- [ ] 任务详情页
- [ ] 发布任务页面
- [ ] 用户个人中心
- [ ] 消息通知
- [ ] 地图集成
- [ ] 支付集成

## 与Web应用共享

- 数据库Schema
- API接口
- 业务逻辑
- 设计风格

## 许可证

MIT

