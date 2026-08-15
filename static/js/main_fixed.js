$(document).ready(function() {
    console.log('✅ main_fixed.js 加载完成');

    showLoading();

    if (window.rawData && Array.isArray(window.rawData) && window.rawData.length > 0) {
        console.log('✅ 数据加载成功，共 ' + window.rawData.length + ' 条');

        updateStats();

        $.when(
            initAllMaps(),
            loadSpotCoords()
        ).always(function() {
            renderAllCharts();
            setTimeout(hideLoading, 500);
        });
    } else {
        console.error('❌ 数据为空或未定义，window.rawData:', window.rawData);
        hideLoading();
        alert('数据加载失败，请检查：\n1. MySQL服务是否运行（命令行执行：net start MySQL80）\n2. 数据库密码是否正确\n3. scenic表是否有数据（在MySQL Workbench中执行：SELECT COUNT(*) FROM scenic_db.scenic;）');
    }
});

var CITY_ADCODE_MAP = {
    '南宁': '450100', '柳州': '450200', '桂林': '450300', '梧州': '450400',
    '北海': '450500', '防城港': '450600', '钦州': '450700', '贵港': '450800',
    '玉林': '450900', '百色': '451000', '贺州': '451100', '河池': '451200',
    '来宾': '451300', '崇左': '451400'
};

var ADCODE_CITY_MAP = {};
Object.keys(CITY_ADCODE_MAP).forEach(function(city) {
    ADCODE_CITY_MAP[CITY_ADCODE_MAP[city]] = city;
});

function initAllMaps() {
    var deferred = $.Deferred();
    var mapsToLoad = [];

    if (!echarts.getMap('guangxi_city')) {
        mapsToLoad.push(loadMap('guangxi_city', '/static/data/guangxi.json'));
    }

    Object.keys(CITY_ADCODE_MAP).forEach(function(city) {
        var mapName = 'city_' + city;
        if (!echarts.getMap(mapName)) {
            var adcode = CITY_ADCODE_MAP[city];
            mapsToLoad.push(loadMap(mapName, '/static/data/districts/' + adcode + '.json'));
        }
    });

    if (mapsToLoad.length === 0) {
        console.log('✅ 所有地图已注册');
        deferred.resolve();
    } else {
        console.log('🔄 加载 ' + mapsToLoad.length + ' 个地图...');
        $.when.apply($, mapsToLoad).done(function() {
            console.log('✅ 所有地图加载完成');
            deferred.resolve();
        }).fail(function() {
            console.warn('⚠️ 部分地图加载失败');
            deferred.resolve();
        });
    }

    return deferred;
}

function loadMap(mapName, url) {
    var d = $.Deferred();
    $.getJSON(url)
        .done(function(geoJson) {
            echarts.registerMap(mapName, geoJson);
            var count = geoJson.features ? geoJson.features.length : 0;
            console.log('  ' + mapName + ': ' + count + ' 个区域');
            d.resolve();
        })
        .fail(function() {
            console.warn('  ' + mapName + ' 加载失败');
            d.resolve();
        });
    return d;
}

function loadSpotCoords() {
    var deferred = $.Deferred();

    if (window.spotCoords) {
        deferred.resolve();
        return deferred;
    }

    console.log('🔄 加载景点坐标数据...');
    $.getJSON('/static/data/spot_coords.json')
        .done(function(data) {
            window.spotCoords = data;
            var count = Object.keys(data).length;
            console.log('✅ 景点坐标加载成功，共 ' + count + ' 个');
            deferred.resolve();
        })
        .fail(function() {
            console.warn('⚠️ 景点坐标加载失败，将使用城市中心估算');
            window.spotCoords = {};
            deferred.resolve();
        });

    return deferred;
}

function showLoading() {
    var overlay = $('<div class="loading-overlay">')
        .html('<div class="loading-spinner"></div><div class="loading-text">正在加载数据与图表资源...</div>')
        .appendTo('body');
    window.loadingOverlay = overlay;
}

function hideLoading() {
    if (window.loadingOverlay) {
        window.loadingOverlay.addClass('hidden');
        setTimeout(function() {
            if (window.loadingOverlay) {
                window.loadingOverlay.remove();
                window.loadingOverlay = null;
            }
        }, 500);
    }
}

function updateStats() {
    var data = window.rawData || [];
    if (data.length === 0) return;

    $('#total-scenic').text(data.length);

    var cities = [];
    data.forEach(function(item) {
        if (cities.indexOf(item.city) === -1) {
            cities.push(item.city);
        }
    });
    $('#total-city').text(cities.length);

    var totalRating = 0;
    data.forEach(function(item) {
        totalRating += parseFloat(item.rating) || 0;
    });
    var avgRating = (totalRating / data.length).toFixed(1);
    $('#avg-rating').text(avgRating);

    var highRated = 0;
    data.forEach(function(item) {
        if (parseFloat(item.rating) >= 4.5) {
            highRated++;
        }
    });
    var percent = ((highRated / data.length) * 100).toFixed(1);
    $('#high-rate-percent').text(percent);
}

function renderAllCharts() {
    console.log('开始渲染7个图表...');
    window.chartInstances = [];

    if (typeof renderChart1 === 'function') renderChart1();
    if (typeof renderChart2 === 'function') renderChart2();
    if (typeof renderChart3 === 'function') renderChart3();
    if (typeof renderChart4 === 'function') renderChart4();
    if (typeof renderChart5 === 'function') renderChart5();
    if (typeof renderChart6 === 'function') renderChart6();
    if (typeof renderChart7 === 'function') renderChart7();

    console.log('图表渲染完成，实例数:', window.chartInstances.length);
}

$(window).resize(function() {
    if (window.chartInstances) {
        window.chartInstances.forEach(function(chart) {
            if (chart && !chart.isDisposed()) {
                chart.resize();
            }
        });
    }
});
