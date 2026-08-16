# 广西旅游大数据智能分析平台

> Tourism Big Data Multi-Dimensional Analysis & Visualization Platform

基于 **Flask + ECharts** 的广西旅游景区大数据多维分析与可视化平台。以携程旅行网公开的广西景区数据为基础，覆盖南宁、桂林、柳州、北海等城市，对景区分布、评分、评论、门票价格、景区类型等指标进行统计分析，并以数据大屏形式直观呈现。

> 桂林旅游学院 · 旅游数据学院 · 大赛项目团队 | 数据来源：携程旅行网 | 数据更新：2026-05-08

## 功能特性

- **多城市景区数据**：内置南宁、桂林、柳州、北海四市景区 CSV 数据
- **多维统计分析**：景区总数、覆盖城市、平均评分、高分景区占比、景区类型分布、门票价格统计等
- **可视化大屏**：基于 ECharts 的图表展示与指标卡片
- **模拟实时数据**：`data_fake.py` 通过指标累计叠加模拟数据增长，演示动态看板效果
- **数据接口**：`/api/data` 提供结构化 JSON 数据，便于二次开发

## 技术栈

- 后端：Python 3 · Flask 2.3.3
- 数据库：SQLite（`scenic.db`）
- 前端：HTML / CSS / JavaScript · jQuery 3.5.1 · ECharts 5.4.3
- 数据处理：pandas · CSV

## 快速开始

### 环境要求

- Python 3.8+
- pip

### 方式一：一键启动（Windows）

双击运行 `一键运行.bat`，脚本将自动安装依赖（清华 PyPI 镜像加速）并启动服务。

### 方式二：手动运行

```bash
pip install -r requirements.txt
python app.py
```

启动后浏览器访问 **http://127.0.0.1:5000**

## 项目结构

```
Guangxi-Tourism-BigData/
├── app.py # Flask 主程序（页面渲染 + 数据接口）
├── spider.py # 景区数据统计脚本（CSV 读取与分析）
├── data_fake.py # 模拟数据增长模块
├── requirements.txt # Python 依赖清单
├── scenic.db # SQLite 景区数据库
├── 一键运行.bat # Windows 一键启动脚本
├── data/ # 景区原始数据（CSV）
│ ├── nanning.csv # 南宁
│ ├── guilin.csv # 桂林
│ ├── liuzhou.csv # 柳州
│ └── beihai.csv # 北海
├── static/ # 静态资源（CSS/JS）
└── templates/ # 页面模板
└── index.html # 数据大屏首页
```

## API 接口

### `GET /api/data`

返回景区数据（默认前 5 条）：

```json
{
  "status": "success",
  "count": 5,
  "data": [
    { "name": "景区名称", "city": "城市", "rating": 4.5, "review_count": 100, "ticket_price": 80.0, "scenic_type": "类型" }
  ]
}
```

## 数据说明

- 数据来源：携程旅行网（公开页面）
- 主要字段：景区名称、所属城市、评分、评论数、门票价格、景区类型
- 更新日期：2026 年 5 月 8 日

## 注意事项

- `data_fake.py` 仅用于演示数据增长效果，正式场景请以数据库实时数据为准（详见文件内注释）
- `scenic.db` 由 `data/` 目录下 CSV 数据导入生成，可通过 `spider.py` 复核数据统计
