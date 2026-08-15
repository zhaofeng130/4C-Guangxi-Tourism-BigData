// 全局变量
let rawData = [];
let chartInstances = [];

$(document).ready(function() {
    // 显示加载动画
    showLoading();
    
    // 先加载广西地图数据
    loadGuangxiMap().then(() => {
        // 然后获取景点数据
        fetchData();
    });
});

// 显示加载动画
function showLoading() {
    const overlay = $('<div class="loading-overlay">')
        .html('<div class="loading-spinner"></div><div class="loading-text">正在加载数据与图表资源...</div>')
        .appendTo('body');
    window.loadingOverlay = overlay;
}

// 隐藏加载动画
function hideLoading() {
    if (window.loadingOverlay) {
        window.loadingOverlay.addClass('hidden');
        setTimeout(() => {
            if (window.loadingOverlay) {
                window.loadingOverlay.remove();
                window.loadingOverlay = null;
            }
        }, 500);
    }
}

// 加载广西地图数据
function loadGuangxiMap() {
    return new Promise((resolve) => {
        // 尝试从本地加载
        $.getJSON('/static/data/guangxi.json')
            .done(function(geoJson) {
                echarts.registerMap('guangxi', geoJson);
                console.log('广西地图数据加载成功');
                resolve();
            })
            .fail(function() {
                console.warn('本地地图文件加载失败，使用在线备用数据');
                // 备用方案：使用ECharts在线数据（如果网络允许）
                $.getJSON('https://echarts.apache.org/examples/data/asset/geo/guangxi.json')
                    .done(function(geoJson) {
                        echarts.registerMap('guangxi', geoJson);
                        resolve();
                    })
                    .fail(function() {
                        console.error('广西地图数据加载失败，地图图表将不可用');
                        resolve(); // 继续执行，地图图表会显示错误
                    });
            });
    });
}

// 获取景点数据
function fetchData() {
    $.ajax({
        url: '/get_data',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            rawData = data;
            // 更新顶部卡片数据
            updateStats();
            // 渲染所有图表
            renderAllCharts();
            // 隐藏加载动画（延迟一点，让图表有渲染时间）
            setTimeout(hideLoading, 500);
        },
        error: function(xhr, status, error) {
            console.error('数据获取失败:', error);
            hideLoading();
            alert('数据加载失败，请检查后端服务是否运行。错误信息：' + error);
        }
    });
}

// 更新顶部统计卡片
function updateStats() {
    if (rawData.length === 0) return;

    // 1. 景区总数
    $('#total-scenic').text(rawData.length);

    // 2. 覆盖城市数（去重）
    const cities = [...new Set(rawData.map(item => item.city))];
    $('#total-city').text(cities.length);

    // 3. 平均评分（保留1位小数）
    const totalRating = rawData.reduce((sum, item) => sum + (parseFloat(item.rating) || 0), 0);
    const avgRating = (totalRating / rawData.length).toFixed(1);
    $('#avg-rating').text(avgRating);

    // 4. 高分景区占比（评分≥4.5）
    const highRated = rawData.filter(item => parseFloat(item.rating) >= 4.5).length;
    const percent = ((highRated / rawData.length) * 100).toFixed(1);
    $('#high-rate-percent').text(percent);
}

// 窗口大小变化时重绘所有图表
$(window).resize(function() {
    chartInstances.forEach(chart => {
        if (chart && !chart.isDisposed()) {
            chart.resize();
        }
    });
});
