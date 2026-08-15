@echo off
chcp 65001 >nul
echo ======================================
echo  广西旅游大数据智能分析平台 一键启动器
echo ======================================
echo.
echo 正在安装依赖（清华源加速）...
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
echo.
echo 启动完成！请打开浏览器访问：http://127.0.0.1:5000
echo 关闭黑框即可停止服务
echo.
python app.py
pause