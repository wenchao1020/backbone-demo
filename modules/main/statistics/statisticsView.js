/**
 * Created by qin on 2018/3/12.
 */
var statisticsTemplate = require('html!./statistics.html');
var macarons = require('../../../lib/echart/macarons.js');  // echarts皮肤
require('../../../lib/echart/echarts-all.js');
require('../../../lib/util.js');
require('./statistics.css');


var listModel = Backbone.Model.extend({   //进场商品数量和金额趋势分析
    url: 'stats/entry-stats.do'
});

var rankModel = Backbone.Model.extend({   //商品销量排名
    url: 'stats/trade-rank.do'
});

var statsModel = Backbone.Model.extend({   //销售额趋势分析
    url: 'stats/trade-stats.do'
});

var statisticsView = Backbone.View.extend({
    el: smartPage.domEl.mainEl,
    template: _.template(statisticsTemplate, {variable: 'data'}),
    events: {
        'click .quick-search span': 'searchBy'
    },
    initialize: function () {
        var that = this;
        that.listModel = new listModel();
        that.rankModel = new rankModel();
        that.statsModel = new statsModel();
        that.searchPara = {
            date: that.formatDate(-7) + ' - ' + that.formatDate(0)
        }
        that.$el.html(that.template({}))
        that.listenTo(that.listModel, 'change', that.initCharts)
        that.listenTo(that.rankModel, 'change', that.initSellBar)
        that.listenTo(that.statsModel, 'change', that.initProSellBar)
        that.listModel.fetch({
            data: {
                spanType: 'month'
            }
        })
        that.rankModel.fetch({
            data: {
                spanType: 'month'
            }
        })
        that.statsModel.fetch({
            data: {
                spanType: 'month'
            }
        })
        that.renderDate()
        //日期范围
    },
    searchBy: function (e) {
        var $target = $(e.currentTarget),
            spanType = $target.data("spantype"),
            that = this;
        that.listModel.fetch({
            data: {
                spanType: spanType
            }
        });
        that.rankModel.fetch({
            data: {
                spanType: spanType
            }
        });
        that.statsModel.fetch({
            data: {
                spanType: spanType
            }
        });
    },
    search: function () {
        var that = this;
        that.listModel.fetch({
            data: {
                startDate: that.searchPara.startDate,
                endDate: that.searchPara.endDate,
                spanType: 'day'
            }
        });
        that.rankModel.fetch({
            data: {
                startDate: that.searchPara.startDate,
                endDate: that.searchPara.endDate,
                spanType: 'day'
            }
        });
        that.statsModel.fetch({
            data: {
                startDate: that.searchPara.startDate,
                endDate: that.searchPara.endDate,
                spanType: 'day'
            }
        });
    },
    renderDate: function () {
        var that = this;
        layui.laydate.render({
            elem: '#date',
            range: true,
            max: 0,
            value: that.searchPara.date || '',
            done: function (value, date, endDate) {
            }
        });
        layui.use('form', function () {
            that.form = layui.form;
            that.form.on('submit(searchStat)', function (data, aa) {
                that.searchPara.date = data.field.date
                that.searchPara.startDate = data.field.date ? data.field.date.substr(0, 10) : '';
                that.searchPara.endDate = data.field.date ? data.field.date.substr(13, 10) : '';
                that.search();
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
            that.form.render();
        })
        that.$el.find('#searchStat').trigger('click');
    },
    initCharts: function (res) {
        res = res.toJSON().result || {}
        var option = {
            title: {
                text: '进场商品数量和金额趋势分析'
            },
            tooltip: {
                trigger: 'axis'
            },
            calculable: true,
            legend: {
                data: ['商品数量', '进场金额']
            },
            xAxis: [
                {
                    type: 'category',
                    data: res.timeList
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '商品数量',
                    axisLabel: {
                        formatter: '{value} kg'
                    }
                },
                {
                    type: 'value',
                    name: '进场金额',
                    axisLabel: {
                        formatter: '{value} 元'
                    }
                }
            ],
            series: [
                {
                    name: '商品数量',
                    type: 'bar',
                    barMaxWidth: '30',
                    data: res.quantityList
                },
                {
                    name: '进场金额',
                    type: 'line',
                    yAxisIndex: 1,
                    data: res.amountList
                }
            ]
        };
        var admissionTrend = echarts.init(document.getElementById('echarts'), macarons);
        admissionTrend.setOption(option);
    },
    initSellBar: function (res) {
        res = res.toJSON().result || {}
        var option = {
            title: {
                text: '商品销量排名'
            },
            tooltip: {
                trigger: 'axis'
            },
            calculable: true,
            xAxis: [
                {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    data: res.quantityList
                }
            ],
            series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: res.nameList,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }
            ]
        };
        var admissionTrend = echarts.init(document.getElementById('proBar'), macarons);
        admissionTrend.setOption(option);
    },
    initProSellBar: function (res) {
        res = res.toJSON().result || {}
        var option = {
            title: {
                text: '销售额趋势分析'
            },
            tooltip: {
                trigger: 'axis'
            },
            calculable: true,
            legend: {
                data: ['销售额']
            },
            xAxis: [
                {
                    type: 'category',
                    data: res.timeList
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '销售额',
                    axisLabel: {
                        formatter: '{value} 元'
                    }
                }
            ],
            series: [
                {
                    name: '销售额',
                    type: 'bar',
                    barMaxWidth: '30',
                    data: res.amountList
                }
            ]
        };
        var admissionTrend = echarts.init(document.getElementById('sellBar'), macarons);
        admissionTrend.setOption(option);
    },
    formatDate: function (data) {
        var today = new Date()
        var date2 = new Date(today);
        date2.setDate(today.getDate() + data);
        return date2.format('yyyy-MM-dd')
    }
});
module.exports = statisticsView;