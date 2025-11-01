# 介绍

一个采用赛博朋克终端美学的现代化服务监控系统

## 功能特性
- **实时监控**   定期检查服务可用性和响应时间
- **30天可视化** 使用 Recharts 展示历史可用性趋势
- **终端风格**   赛博朋克美学，矩阵绿配色
- **多服务支持** 同时监控多个域名/服务
- **运行统计**   显示运行天数和精确可用率
- **轻量存储**   JSON 文件存储，无需数据库
- **主题切换**   支持暗色/亮色模式
- **响应式设计** 完美适配桌面和移动端

## 快速开始

```bash
cp .env.example .env.local # 注意修改 .env.local 中的环境变量
pnpm install
pnpm dev
```

访问 http://localhost:3000

## Docker 部署

```bash
docker build -t xystatus .
docker run -d -p 3000:3000 -e ADMIN_PASSWORD=your-password -e MONITOR_INTERVAL=60 xystatus
```