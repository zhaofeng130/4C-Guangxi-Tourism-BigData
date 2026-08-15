function getData() {
    return window.rawData || [];
}

function renderChart1() {
    const cityCount = {};
    getData().forEach(item => {
        const city = item.city || '未知';
        cityCount[city] = (cityCount[city] || 0) + 1;
    });

    const chart = echarts.init(document.getElementById('chart1'));
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}个景点'
        },
        xAxis: {
            type: 'category',
            data: Object.keys(cityCount),
            axisLabel: { 
                color: '#aaa',
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#aaa' }
        },
        series: [{
            data: Object.values(cityCount),
            type: 'bar',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#1890ff' },
                    { offset: 1, color: '#13c2c2' }
                ])
            },
            label: {
                show: true,
                position: 'top',
                color: '#fff'
            },
            // 动画配置
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicOut',
            animationDelay: function(idx) {
                return idx * 100;
            }
        }]
    };
    chart.setOption(option);
    window.chartInstances.push(chart);
}

// 图表2：景区类型分布（玫瑰图）
function renderChart2() {
    const typeCount = {};
    getData().forEach(item => {
        const type = item.scenic_type || '其他';
        typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const chart = echarts.init(document.getElementById('chart2'));
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a}<br/>{b}: {c} ({d}%)'
        },
        series: [{
            name: '景区类型',
            type: 'pie',
            radius: ['15%', '70%'],
            roseType: 'area',
            data: Object.entries(typeCount).map(([name, value]) => ({
                name, value
            })),
            label: {
                color: '#fff'
            },
            itemStyle: {
                borderRadius: 8
            },
            // 动画配置
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function(idx) {
                return Math.random() * 200;
            }
        }]
    };
    chart.setOption(option);
    window.chartInstances.push(chart);
}

// 图表3：评分与门票价格关系（散点图）
function renderChart3() {
    const scatterData = getData().map(item => [
        parseFloat(item.rating) || 0,
        parseFloat(item.ticket_price) || 0,
        item.name
    ]);

    const chart = echarts.init(document.getElementById('chart3'));
    const option = {
        tooltip: {
            formatter: function(params) {
                var data = params.data;
                return '景点: ' + data[2] + '<br/>评分: ' + data[0] + '<br/>门票: ' + data[1] + '元';
            }
        },
        xAxis: {
            name: '评分',
            type: 'value',
            min: 3,
            max: 5,
            axisLabel: { color: '#aaa' }
        },
        yAxis: {
            name: '门票价格（元）',
            type: 'value',
            axisLabel: { color: '#aaa' }
        },
        series: [{
            type: 'scatter',
            data: scatterData,
            symbolSize: function(data) {
                return Math.min(30, Math.sqrt(data[1]) / 2 + 5);
            },
            itemStyle: {
                color: '#ff6b6b'
            },
            // 动画配置
            animationDelay: function(idx) {
                return idx * 10;
            }
        }]
    };
    chart.setOption(option);
    window.chartInstances.push(chart);
}

// 图表4：评论数TOP10景点（横向柱状图）
function renderChart4() {
    const sorted = [...getData()]
        .sort((a, b) => (parseInt(b.review_count) || 0) - (parseInt(a.review_count) || 0))
        .slice(0, 10);

    const chart = echarts.init(document.getElementById('chart4'));
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}条评论'
        },
        xAxis: {
            type: 'value',
            name: '评论数',
            axisLabel: { color: '#aaa' }
        },
        yAxis: {
            type: 'category',
            data: sorted.map(item => item.name),
            axisLabel: {
                color: '#aaa',
                interval: 0
            }
        },
        series: [{
            type: 'bar',
            data: sorted.map(item => parseInt(item.review_count) || 0),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: '#ff9a3c' },
                    { offset: 1, color: '#ff6b6b' }
                ])
            },
            // 动画配置
            animationDuration: 1500,
            animationEasing: 'elasticOut'
        }]
    };
    chart.setOption(option);
    window.chartInstances.push(chart);
}

// 图表5：各城市平均评分对比（折线图）
function renderChart5() {
    const cityStats = {};
    getData().forEach(item => {
        const city = item.city;
        if (!city) return;
        if (!cityStats[city]) {
            cityStats[city] = { sum: 0, count: 0 };
        }
        cityStats[city].sum += parseFloat(item.rating) || 0;
        cityStats[city].count += 1;
    });

    const cities = Object.keys(cityStats);
    const avgRatings = cities.map(city => 
        (cityStats[city].sum / cityStats[city].count).toFixed(2)
    );

    const chart = echarts.init(document.getElementById('chart5'));
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}分'
        },
        xAxis: {
            type: 'category',
            data: cities,
            axisLabel: { color: '#aaa' }
        },
        yAxis: {
            type: 'value',
            min: 3,
            max: 5,
            axisLabel: { color: '#aaa' }
        },
        series: [{
            data: avgRatings,
            type: 'line',
            smooth: true,
            lineStyle: {
                width: 4
            },
            itemStyle: {
                color: '#13c2c2'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(19, 194, 194, 0.6)' },
                    { offset: 1, color: 'rgba(19, 194, 194, 0.1)' }
                ])
            },
            // 动画配置
            animationDuration: 2000,
            animationEasing: 'cubicOut'
        }]
    };
    chart.setOption(option);
    window.chartInstances.push(chart);
}

// 图表6：门票价格区间分布（柱状图）
function renderChart6() {
    const priceRanges = [
        { name: '免费', min: 0, max: 0 },
        { name: '0-50元', min: 0.01, max: 50 },
        { name: '50-100元', min: 50, max: 100 },
        { name: '100-200元', min: 100, max: 200 },
        { name: '200元以上', min: 200, max: Infinity }
    ];

    const rangeCount = new Array(priceRanges.length).fill(0);
    getData().forEach(item => {
        const price = parseFloat(item.ticket_price) || 0;
        for (let i = 0; i < priceRanges.length; i++) {
            const range = priceRanges[i];
            if (price >= range.min && price <= range.max) {
                rangeCount[i]++;
                break;
            }
        }
    });

    const chart = echarts.init(document.getElementById('chart6'));
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}个景点'
        },
        xAxis: {
            type: 'category',
            data: priceRanges.map(r => r.name),
            axisLabel: { color: '#aaa' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#aaa' }
        },
        series: [{
            data: rangeCount,
            type: 'bar',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#9d4edd' },
                    { offset: 1, color: '#560bad' }
                ])
            },
            label: {
                show: true,
                position: 'top',
                color: '#fff'
            },
            // 动画配置
            animationDuration: 1200,
            animationEasing: 'bounceOut'
        }]
    };
    chart.setOption(option);
    window.chartInstances.push(chart);
}

// 图表7：广西景点分布地图（三级矢量缩放下钻：省→市→区县）
window.mapDrillState = { level: 0, city: null, district: null, history: [] };

function renderChart7() {
    var chartDom = document.getElementById('chart7');
    if (!chartDom) return;

    if (window._chart7Instance && !window._chart7Instance.isDisposed()) {
        window._chart7Instance.dispose();
    }

    var chart = echarts.init(chartDom);
    window._chart7Instance = chart;
    window.chartInstances.push(chart);

    if (!echarts.getMap('guangxi_city')) {
        chart.setOption({
            title: { text: '地图数据加载中...', left: 'center', top: 'center', textStyle: { color: '#ff6b6b' } }
        });
        return;
    }

    renderProvinceLevel(chart);

    chart.on('click', function(params) {
        if (params.componentType !== 'series' || params.seriesType !== 'map') return;

        var state = window.mapDrillState;
        var clickedName = params.name;

        if (state.level === 0) {
            var cityName = clickedName.replace('市', '');
            if (CITY_ADCODE_MAP[cityName] && echarts.getMap('city_' + cityName)) {
                state.history.push({ level: 0, city: null, district: null });
                state.level = 1;
                state.city = cityName;
                state.district = null;
                renderCityLevel(chart, cityName);
            }
        } else if (state.level === 1) {
            state.history.push({ level: 1, city: state.city, district: null });
            state.level = 2;
            state.district = clickedName;
            renderDistrictLevel(chart, state.city, clickedName);
        }
    });

    chart.on('contextmenu', function(params) {
        params.event.event.preventDefault();
        drillUp(chart);
    });

    $(chartDom).off('dblclick').on('dblclick', function() {
        drillUp(chart);
    });
}

function drillUp(chart) {
    var state = window.mapDrillState;
    if (state.history.length === 0) return;

    var prev = state.history.pop();
    state.level = prev.level;
    state.city = prev.city;
    state.district = prev.district;

    if (state.level === 0) {
        renderProvinceLevel(chart);
    } else if (state.level === 1) {
        renderCityLevel(chart, state.city);
    }
}

function renderProvinceLevel(chart) {
    var spotCoords = window.spotCoords || {};
    var cityData = {};
    var allSpots = [];

    getData().forEach(function(item) {
        var city = item.city;
        if (!city) return;
        cityData[city] = (cityData[city] || 0) + 1;

        var key = item.name + '|' + city;
        var coords = spotCoords[key];
        var lng, lat;
        if (coords && coords[0] && coords[1]) {
            lng = coords[0];
            lat = coords[1];
        } else {
            lng = 108.8 + (Math.random() - 0.5) * 2;
            lat = 23.5 + (Math.random() - 0.5) * 2;
        }

        allSpots.push({
            name: item.name,
            value: [lng, lat, item.rating || 0, item.ticket_price || 0, item.review_count || 0],
            city: city, rating: item.rating, ticket_price: item.ticket_price,
            review_count: item.review_count, scenic_type: item.scenic_type
        });
    });

    var mapData = Object.keys(cityData).map(function(name) {
        return { name: name + '市', value: cityData[name] };
    });

    var maxCount = Math.max.apply(null, Object.values(cityData).concat([1]));

    chart.setOption({
        title: {
            text: '广西景点分布地图',
            subtext: '共 ' + allSpots.length + ' 个景点 · 14 个城市 · 点击城市下钻',
            left: 'center', top: 8,
            textStyle: { color: '#fff', fontSize: 16 },
            subtextStyle: { color: '#aaa', fontSize: 11 }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (params.seriesType === 'effectScatter') {
                    var d = params.data;
                    return '<strong>' + d.name + '</strong><br/>城市：' + d.city
                        + '<br/>评分：' + d.rating + ' 分<br/>门票：'
                        + (d.ticket_price > 0 ? d.ticket_price + ' 元' : '免费')
                        + '<br/>评论数：' + d.review_count + '<br/>类型：' + d.scenic_type;
                }
                if (params.seriesType === 'map') {
                    return '<strong>' + params.name + '</strong><br/>景点数量：'
                        + (params.data ? params.data.value : 0) + ' 个<br/><span style="color:#40a9ff">点击查看区县详情</span>';
                }
                return params.name;
            }
        },
        visualMap: {
            min: 0, max: maxCount, left: 'right', top: 'bottom',
            text: ['多', '少'], calculable: true,
            inRange: { color: ['#0d2137', '#0d3b2e', '#1a6b4a', '#3da87a', '#6dd4a8'] },
            textStyle: { color: '#fff' }
        },
        geo: {
            map: 'guangxi_city', roam: true,
            center: [108.8, 23.5], zoom: 1.2,
            label: { show: true, color: '#ccc', fontSize: 12 },
            emphasis: {
                label: { show: true, color: '#fff', fontSize: 14 },
                itemStyle: { areaColor: 'rgba(24, 144, 255, 0.4)', borderColor: '#40a9ff', borderWidth: 2 }
            },
            itemStyle: { areaColor: '#0f1a2e', borderColor: '#3a5a8c', borderWidth: 1 }
        },
        series: [
            {
                name: '景点数量', type: 'map', map: 'guangxi_city', geoIndex: 0,
                data: mapData, animationDurationUpdate: 1000, animationEasingUpdate: 'cubicOut'
            },
            {
                name: '旅游景点', type: 'effectScatter', coordinateSystem: 'geo',
                data: allSpots,
                symbolSize: function(val) { return Math.max(4, Math.min(12, Math.sqrt(val[4]) / 12 + 3)); },
                showEffectOn: 'render',
                rippleEffect: { brushType: 'stroke', scale: 2, period: 3 },
                label: { show: false },
                emphasis: {
                    scale: 2,
                    label: { show: true, formatter: function(p) { return p.data.name; }, position: 'top', color: '#fff', fontSize: 10, fontWeight: 'bold' }
                },
                itemStyle: { color: '#ff4757', shadowBlur: 6, shadowColor: 'rgba(255,71,87,0.5)' },
                zlevel: 1
            }
        ]
    }, true);

    updateBreadcrumb(['广西']);
}

function renderCityLevel(chart, cityName) {
    var mapName = 'city_' + cityName;
    var spotCoords = window.spotCoords || {};

    var districtData = {};
    var allSpots = [];

    getData().forEach(function(item) {
        if (item.city !== cityName) return;

        var key = item.name + '|' + cityName;
        var coords = spotCoords[key];
        var lng, lat;
        if (coords && coords[0] && coords[1]) {
            lng = coords[0]; lat = coords[1];
        } else {
            lng = 108.8 + (Math.random() - 0.5) * 1;
            lat = 23.5 + (Math.random() - 0.5) * 1;
        }

        allSpots.push({
            name: item.name,
            value: [lng, lat, item.rating || 0, item.ticket_price || 0, item.review_count || 0],
            city: cityName, rating: item.rating, ticket_price: item.ticket_price,
            review_count: item.review_count, scenic_type: item.scenic_type
        });

        var district = item.district || item.county || '';
        if (district) {
            districtData[district] = (districtData[district] || 0) + 1;
        }
    });

    var mapData = Object.keys(districtData).map(function(name) {
        return { name: name, value: districtData[name] };
    });

    var maxCount = Math.max.apply(null, Object.values(districtData).concat([1]));

    var geoJson = echarts.getMap(mapName).geoJson;
    var center = [108.8, 23.5];
    if (geoJson && geoJson.features && geoJson.features.length > 0) {
        var props = geoJson.features[0].properties;
        center = props.center || props.centroid || center;
    }

    chart.setOption({
        title: {
            text: cityName + '市区县景点分布',
            subtext: '共 ' + allSpots.length + ' 个景点 · ' + Object.keys(districtData).length + ' 个区县 · 点击区县查看景点',
            left: 'center', top: 8,
            textStyle: { color: '#fff', fontSize: 16 },
            subtextStyle: { color: '#aaa', fontSize: 11 }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (params.seriesType === 'effectScatter') {
                    var d = params.data;
                    return '<strong>' + d.name + '</strong><br/>评分：' + d.rating + ' 分<br/>门票：'
                        + (d.ticket_price > 0 ? d.ticket_price + ' 元' : '免费')
                        + '<br/>评论数：' + d.review_count + '<br/>类型：' + d.scenic_type;
                }
                if (params.seriesType === 'map') {
                    return '<strong>' + params.name + '</strong><br/>景点数量：'
                        + (params.data ? params.data.value : 0) + ' 个<br/><span style="color:#40a9ff">点击查看景点详情</span>';
                }
                return params.name;
            }
        },
        visualMap: {
            min: 0, max: maxCount, left: 'right', top: 'bottom',
            text: ['多', '少'], calculable: true,
            inRange: { color: ['#0d2137', '#0d3b2e', '#1a6b4a', '#3da87a', '#6dd4a8'] },
            textStyle: { color: '#fff' }
        },
        geo: {
            map: mapName, roam: true,
            center: center, zoom: 1.5,
            label: { show: true, color: '#ccc', fontSize: 10 },
            emphasis: {
                label: { show: true, color: '#fff', fontSize: 12 },
                itemStyle: { areaColor: 'rgba(24, 144, 255, 0.4)', borderColor: '#40a9ff', borderWidth: 2 }
            },
            itemStyle: { areaColor: '#0f1a2e', borderColor: '#3a5a8c', borderWidth: 1 }
        },
        series: [
            {
                name: '景点数量', type: 'map', map: mapName, geoIndex: 0,
                data: mapData, animationDurationUpdate: 800, animationEasingUpdate: 'cubicOut'
            },
            {
                name: '旅游景点', type: 'effectScatter', coordinateSystem: 'geo',
                data: allSpots,
                symbolSize: function(val) { return Math.max(5, Math.min(14, Math.sqrt(val[4]) / 10 + 4)); },
                showEffectOn: 'render',
                rippleEffect: { brushType: 'stroke', scale: 2.5, period: 3.5 },
                label: { show: false },
                emphasis: {
                    scale: 2.2,
                    label: { show: true, formatter: function(p) { return p.data.name; }, position: 'top', color: '#fff', fontSize: 11, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.8)', textShadowBlur: 4 }
                },
                itemStyle: { color: '#ff4757', shadowBlur: 8, shadowColor: 'rgba(255,71,87,0.6)' },
                zlevel: 1
            }
        ]
    }, true);

    updateBreadcrumb(['广西', cityName + '市']);
}

function renderDistrictLevel(chart, cityName, districtName) {
    var mapName = 'city_' + cityName;
    var spotCoords = window.spotCoords || {};

    var districtSpots = [];

    getData().forEach(function(item) {
        if (item.city !== cityName) return;
        var itemDistrict = item.district || item.county || '';
        if (itemDistrict !== districtName) return;

        var key = item.name + '|' + cityName;
        var coords = spotCoords[key];
        var lng, lat;
        if (coords && coords[0] && coords[1]) {
            lng = coords[0]; lat = coords[1];
        } else {
            lng = 108.8 + (Math.random() - 0.5) * 0.5;
            lat = 23.5 + (Math.random() - 0.5) * 0.5;
        }

        districtSpots.push({
            name: item.name,
            value: [lng, lat, item.rating || 0, item.ticket_price || 0, item.review_count || 0],
            city: cityName, district: districtName,
            rating: item.rating, ticket_price: item.ticket_price,
            review_count: item.review_count, scenic_type: item.scenic_type
        });
    });

    var geoJson = echarts.getMap(mapName).geoJson;
    var center = [108.8, 23.5];
    if (geoJson && geoJson.features) {
        for (var i = 0; i < geoJson.features.length; i++) {
            if (geoJson.features[i].properties.name === districtName) {
                center = geoJson.features[i].properties.center
                    || geoJson.features[i].properties.centroid
                    || center;
                break;
            }
        }
    }

    chart.setOption({
        title: {
            text: districtName + ' · 景点详情',
            subtext: '共 ' + districtSpots.length + ' 个景点 · 双击或右键返回上级',
            left: 'center', top: 8,
            textStyle: { color: '#fff', fontSize: 16 },
            subtextStyle: { color: '#aaa', fontSize: 11 }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                var d = params.data;
                return '<strong>' + d.name + '</strong><br/>评分：' + d.rating + ' 分<br/>门票：'
                    + (d.ticket_price > 0 ? d.ticket_price + ' 元' : '免费')
                    + '<br/>评论数：' + d.review_count + '<br/>类型：' + d.scenic_type;
            }
        },
        geo: {
            map: mapName, roam: true,
            center: center, zoom: 4,
            label: { show: true, color: '#888', fontSize: 9 },
            emphasis: {
                label: { show: true, color: '#fff', fontSize: 11 },
                itemStyle: { areaColor: 'rgba(24, 144, 255, 0.3)', borderColor: '#40a9ff', borderWidth: 1.5 }
            },
            itemStyle: { areaColor: '#0a1220', borderColor: '#1a3a5c', borderWidth: 0.5 },
            regions: [{
                name: districtName,
                itemStyle: { areaColor: '#1a3a5c', borderColor: '#40a9ff', borderWidth: 2 },
                label: { show: true, color: '#40a9ff', fontSize: 12, fontWeight: 'bold' }
            }]
        },
        series: [
            {
                name: '景点详情', type: 'effectScatter', coordinateSystem: 'geo',
                data: districtSpots,
                symbolSize: function(val) { return Math.max(8, Math.min(22, Math.sqrt(val[4]) / 8 + 6)); },
                showEffectOn: 'render',
                rippleEffect: { brushType: 'stroke', scale: 3, period: 3 },
                label: {
                    show: true,
                    formatter: function(p) { return p.data.name; },
                    position: 'top', color: '#fff', fontSize: 10,
                    textShadowColor: 'rgba(0,0,0,0.9)', textShadowBlur: 6,
                    distance: 8
                },
                emphasis: {
                    scale: 1.8,
                    label: { fontSize: 13, fontWeight: 'bold' }
                },
                itemStyle: { color: '#ff6b35', shadowBlur: 12, shadowColor: 'rgba(255,107,53,0.7)' },
                zlevel: 1
            }
        ]
    }, true);

    updateBreadcrumb(['广西', cityName + '市', districtName]);
}

function updateBreadcrumb(items) {
    var container = $('#chart7').closest('.chart-container');
    var bc = container.find('.map-breadcrumb');
    if (bc.length === 0) {
        bc = $('<div class="map-breadcrumb">').prependTo(container);
    }

    var html = '';
    items.forEach(function(item, idx) {
        if (idx > 0) html += '<span class="bc-sep">▸</span>';
        html += '<span class="bc-item' + (idx === items.length - 1 ? ' bc-active' : '') + '">' + item + '</span>';
    });

    if (items.length > 1) {
        html += '<span class="bc-back" title="返回上一级（双击地图或右键）">↩ 返回</span>';
    }

    bc.html(html);

    bc.find('.bc-back').off('click').on('click', function() {
        if (window._chart7Instance && !window._chart7Instance.isDisposed()) {
            drillUp(window._chart7Instance);
        }
    });
}

