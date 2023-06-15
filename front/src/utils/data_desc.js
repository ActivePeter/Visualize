import { api_get_table } from "@/utils/request"
import { MAP_INFO } from "@/utils/mapinfo"
const config_map = {
    "宏观景气指数": {
        type: "line", group_by: "stat_month", attr_map: {
            "stat_month": "月份",
            "early_warning_idx": "预警指数信号",
            "leading_idx": "超前信号",
            "lagging_idx": "滞后信号",
            "consistency_idx": "一致指数"
        }, whitelist: {}
    },
    "消费者景气指数": {
        type: "line", group_by: "stat_month", attr_map: {
            "stat_month": "月份",
            "expectation_idx": "期望指数",
            "satisfaction_idx": "满意指数",
            "confidence_idx": "消费者信心指数"
        }, whitelist: {}
    },
    "全国居民消费价格指数": {
        type: "line", group_by: "stat_month", attr_map: {
            "stat_month": "月份",
            "cpi_month": "当月cpi",
            // "yoy": "满意指数",
            // "mom": "消费者信心指数",
            // "acc":"",
        }, whitelist: { "area_name": (name) => name == "全国" }
    },
    "企业景气及企业家信心指数": {
        type: "line", group_by: "stat_quarter", attr_map: {
            "stat_quarter": "季度",
            "confidence_idx": "企业家信心指数",
            "boom_idx": "企业景气指数"
        }, whitelist: {}
    },
    "分地区居民消费价格指数": {
        type: "map", lockey: "area_name", attr_map: {
            // "stat_quarter": "季度",
            "item_value": "居民消费价格指数",
        }, whitelist: {
            "area_name": (name) => name != "中国",
            "item_name": (name) => name.indexOf("交通和通信") != -1
        }, map_point_scale: 0.1
    },

    "分地区按行业分城镇单位就业人员情况": {
        type: "bar", attr_in_group: "industry_name", group_by: "area_name", y: "employ", attr_map: {
            "industry_name": "行业",
            "employ": "就业人数",
            "area_name": "地区"
        }, whitelist: {
            "stat_year": (year) => year == "2015",
            "industry_name": (name) => name != "城镇单位总计"
        }
    },
    // "分地区按注册类型分城镇单位就业人员工资情况": {
    //     type: "bar", x: "stat_year", group_by: "area_name", y: "wage_avg", attr_map: {
    //         "wage_avg": "该行业平均工资",
    //         "area_name": "地区",
    //         "stat_year": "年份"
    //     }, whitelist: {}
    // },

    "分地区按注册类型分城镇单位就业人员工资情况": {
        type: "line", group_by: "stat_year",
        attr_in_group: "area_name",
        attr_map: {
            "stat_year": "年份",
            "wage_avg": "该行业平均工资",
            "area_name": "地区"
        }, whitelist: {
            // "area_name": (name) => name == "福建省"
        }
    },

    // "分地区按注册类型分城镇单位就业人员工资情况": {
    //     type: "map", lockey: "area_name", attr_map: {
    //         // "stat_quarter": "季度",
    //         "wage_avg": "该行业平均工资",
    //     }, whitelist: {
    //         "stat_year": (year) => year == "2006"
    //     }, map_point_scale: 0.001
    // },

    "保险公司保费金额表": {
        type: "line", group_by: "stat_year",
        attr_map: {
            "stat_year": "年份",
            "total_income": "保险公司保费",
            "property_income": "财产保险公司保费",
            "enterprise": "企业财产保险保费",
            "family": "家庭财产保险保费"
        }, whitelist: {
        }
    },

    "保险公司赔款及给付表": {
        type: "line", group_by: "stat_year",
        attr_map: {
            "stat_year": "年份",
            "total_expense": "保险公司赔款及给付",
            "vehicle": "机动车辆保险赔款及给付",
            "enterprise": "企业财产保险赔款及给付费",
            "family": "家庭财产保险赔款及给付费"
        }, whitelist: {
        }
    },

        "保险公司原保费收入和赔付支出情况": {
        type: "line", group_by: "stat_year",
        attr_map: {
            "stat_year": "年份",
            "original_revenue": "原保险保费收入",
            "original_expense": "原保险保费支出",
        }, whitelist: {
        }
    },

    "保险公司资产情况": {
        type: "line", group_by: "stat_year",
        attr_map: {
            "stat_year": "年份",
            "total": "保险业资产总额",
        }, whitelist: {
        }
    },

    "全国各地区保险业务统计表": {
        type: "line", group_by: "stat_year",
        attr_in_group: "area_name",
        attr_map: {
            "stat_year": "年份",
            "income": "原保险保费收入",
            "area_name": "地区"
        }, whitelist: {
            // "area_name": (name) => name == "福建省"
        }
    },
}

function quickSort(arr, cmp) {
    // console.log("quickSort", cmp)
    if (arr.length <= 1) return arr
    var arr1 = [], arr2 = []
    for (var i = 1; i < arr.length; i++) {
        if (cmp(arr[i], arr[0])) {
            arr1.push(arr[i])
        } else {
            arr2.push(arr[i])
        }
    }
    arr1 = quickSort(arr1, cmp)
    arr2 = quickSort(arr2, cmp)
    arr1.push(arr[0])
    return arr1.concat(arr2)
}

class WhiteListHelper {
    config = {
        whitelist: {}
    }
    constructor(config) {
        this.config = config
    }
    collected = []
    collect_one_attr(attr, idx) {
        if (attr in this.config.whitelist) {
            this.collected.push([idx, this.config.whitelist[attr]])
        }
    }
    check_row(row) {
        let ok = true
        this.collected.forEach(idx_fn => {
            let idx = idx_fn[0]
            let fn = idx_fn[1]
            if (!fn(row[idx])) {
                ok = false
            }
        })

        return ok
    }
}
export class DataDescription {
    type = "line" // 折线，饼
    tablename = ""
    tabledata = []
    chart_option = {}
    pos = ""
    height
    limit = 10000
    interval_for_x_anime = -1
    constructor(tablename, pos, height = "200px") {
        this.tablename = tablename
        this.pos = pos
        this.height = height
        console.log("DataDescription", this)
    }
    load_data_line(config) {
        let whitelist_helper = new WhiteListHelper(config)
        let linechartdata = new LineChartData()
        linechartdata.set_title(this.tablename)

        this.tabledata = this.tabledata.slice(0, this.limit)
        // collect y map
        let y_maps = []
        let x_attr_idx = -1
        let attrline = this.tabledata[0]
        let attr_in_group_idx = -1

        attrline.forEach((element, i) => {
            if (element in config.attr_map) {
                if (element == config.group_by) {
                    x_attr_idx = i
                } else if (element == config.attr_in_group) {
                    attr_in_group_idx = i
                } else {
                    y_maps.push([element, i])
                    if (!("attr_in_group" in config)) {
                        linechartdata.add_y(config.attr_map[element])
                    }
                }
            }
            whitelist_helper.collect_one_attr(element, i)
        });

        this.tabledata = quickSort(this.tabledata.slice(1, this.limit), (a, b) => {
            return a[x_attr_idx] > b[x_attr_idx]
        })
        if ("attr_in_group" in config) {
            let group_by_x_rows = {}
            this.tabledata.forEach(row => {
                if (whitelist_helper.check_row(row)) {
                    let x_attr = row[x_attr_idx]
                    if (x_attr in group_by_x_rows) {
                        group_by_x_rows[x_attr].push(row)
                    } else {
                        group_by_x_rows[x_attr] = [row]
                    }
                }
            })

            let collect_attr_in_group = {}
            for (const key in group_by_x_rows) {
                let grouped_rows = group_by_x_rows[key]
                grouped_rows.forEach(row => {
                    let attr_in_group = row[attr_in_group_idx]
                    // linechartdata.add_y(attr_in_group)
                    collect_attr_in_group[attr_in_group] = 1
                })
            }
            let collect_attr_in_group_orderd = []
            for (const key in collect_attr_in_group) {
                collect_attr_in_group_orderd.push(key)
                linechartdata.add_y(key)
            }
            for (const key in group_by_x_rows) {
                let grouped_rows = group_by_x_rows[key]
                let attr_in_group_2_value = {}
                grouped_rows.forEach(row => {
                    attr_in_group_2_value[row[attr_in_group_idx]] = row[y_maps[0][1]]
                })
                linechartdata.add_x(key, collect_attr_in_group_orderd.map(attr_in_group => {
                    return attr_in_group in attr_in_group_2_value ? attr_in_group_2_value[attr_in_group] : 0
                }))
            }
        } else {
            this.tabledata.forEach(row => {
                if (whitelist_helper.check_row(row)) {
                    linechartdata.add_x(row[x_attr_idx],
                        y_maps.map(attr_name_idx => row[attr_name_idx[1]]))
                }
            })
        }

        this.chart_option = linechartdata.option
    }

    load_data_map(config) {
        let mapchartdata = new MapChartData()
        let whitelist_helper = new WhiteListHelper(config)
        let attrline = this.tabledata[0]

        // find location index
        let loc_idx = -1
        let attr_name_idx_s = [];

        attrline.forEach((attr, i) => {
            if (attr == config.lockey) {
                loc_idx = i
            } else if (attr in config.attr_map) {
                attr_name_idx_s.push([config.attr_map[attr], i])
            }
            whitelist_helper.collect_one_attr(attr, i)
        })
        attr_name_idx_s.forEach((name_idx) => {
            let attr_name = name_idx[0]
            let attr_idx = name_idx[1]
            let arr_locname_value = []
            this.tabledata.slice(1).forEach((row) => {
                if (whitelist_helper.check_row(row)) {
                    arr_locname_value.push([row[loc_idx], row[attr_idx]])
                }
            })
            mapchartdata.add_one_dataset(attr_name, arr_locname_value, config.map_point_scale)
        })



        this.chart_option = mapchartdata.option
    }

    load_data_bar(config) {
        console.log("load_data_bar")
        let whitelist_helper = new WhiteListHelper(config)
        let attrline = this.tabledata[0]

        let attr_in_group_i = -1
        let group_by_i = -1
        let y_i = -1

        attrline.forEach((attr, i) => {
            if (attr == config.attr_in_group) {
                attr_in_group_i = i
            }
            if (attr == config.group_by) {
                group_by_i = i
            }
            if (attr == config.y) {
                y_i = i
            }
            whitelist_helper.collect_one_attr(attr, i)
        })

        let collector = new BarChartGroupCollector()
        this.tabledata.slice(1).forEach((row) => {
            if (whitelist_helper.check_row(row)) {
                collector.check_group(row[group_by_i], row[attr_in_group_i], row[y_i])
            }
        })

        this.chart_option = collector.into_chart_option()

        // anime
        if (this.interval_for_x_anime != -1) {
            clearInterval(this.interval_for_x_anime)
        }
        this.interval_for_x_anime = setInterval(() => {
            if (this.chart_option.dataZoom[0].endValue === this.chart_option.xAxis[0].data.length) {
                this.chart_option.dataZoom[0].startValue = 0;
                this.chart_option.dataZoom[0].endValue = 3;
            } else {
                this.chart_option.dataZoom[0].startValue += 1
                this.chart_option.dataZoom[0].endValue += 1;
            }
        }, 1000)
    }

    async load_data() {
        this.tabledata = (await api_get_table(this.tablename)).data
        console.log(config_map, this.tablename)
        let config = config_map[this.tablename]
        this.type = config.type
        if (config.type == "line") {
            this.load_data_line(config)
        } else if (config.type == "map") {
            this.load_data_map(config)
        } else if (config.type == "bar") {
            this.load_data_bar(config)
        }


        console.log("tabledata", this.tabledata)


        // }
    }
}
class BarChartGroupCollector {
    group_name_2_i = {}
    groups = []
    all_x_s = {}
    check_group(group_name, attr_in_group_name, y_value) {
        if (!(group_name in this.group_name_2_i)) {
            this.groups.push({
                group_name,
                columns: {} // x_name 2 y_value
            })
            this.group_name_2_i[group_name] = this.groups.length - 1
        }
        let group = this.groups[this.group_name_2_i[group_name]]
        group.columns[attr_in_group_name] = y_value
        this.all_x_s[attr_in_group_name] = 0
    }
    into_chart_option() {
        let option = bar_chart_default_option()

        // generate ordered x
        let ordered_x_s = []
        {
            let i = 0
            for (const key in this.all_x_s) {
                ordered_x_s.push(key)
            }
        }
        // groups
        console.log("collected groups", this.groups)
        option.xAxis[0].data = this.groups.map((v) => {
            return v.group_name
        })
        console.log("group names", option.xAxis[0].data)
        // outter for - x
        ordered_x_s.forEach((x_name, i) => {
            // 横轴类型
            option.legend.data.push(x_name)
            // 横轴类型描述
            option.series.push(
                {
                    name: x_name,
                    type: 'bar',
                    barGap: 0,
                    label: "label_" + x_name,
                    emphasis: {
                        focus: 'series'
                    },
                    // 当前x对应不同group的值
                    data: this.groups.map(group => {
                        if (x_name in group.columns) {
                            return group.columns[x_name]
                        } else {
                            return 0
                        }
                    })
                },
            )
        })

        return option
    }
}
function bar_chart_default_option() {
    let option = {

        backgroundColor: 'transparent',
        tooltip: {
            show: false
        },
        legend: {
            data: []//['Forest', 'Steppe', 'Desert', 'Wetland']
        },
        toolbox: {
            show: false,
        },
        dataZoom: [
            {
                show: false, // 是否显示滑动条
                xAxisIndex: 0, // 这里是从X轴的0刻度开始
                startValue: 0, // 数据窗口范围的起始数值
                endValue: 3 // 数据窗口范围的结束数值(一次性展示几个)
            }
        ],
        xAxis: [
            {
                type: 'category',
                axisTick: { show: true },
                axisLabel: { interval: 0, rotate: 90 },
                data: []//['2012', '2013', '2014', '2015', '2016']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            // {
            //     name: 'Forest',
            //     type: 'bar',
            //     barGap: 0,
            //     label: labelOption,
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: [320, 332, 301, 334, 390]
            // },
            // {
            //     name: 'Steppe',
            //     type: 'bar',
            //     label: labelOption,
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: [220, 182, 191, 234, 290]
            // },
            // {
            //     name: 'Desert',
            //     type: 'bar',
            //     label: labelOption,
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: [150, 232, 201, 154, 190]
            // },
            // {
            //     name: 'Wetland',
            //     type: 'bar',
            //     label: labelOption,
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: [98, 77, 101, 99, 40]
            // }
        ]
    }

    return option
}

class MapChartData {
    option = {
        backgroundColor: 'transparent',
        // title: {
        //   text: '全国主要城市空气质量',
        //   subtext: 'data from PM25.in',
        //   sublink: 'http://www.pm25.in',
        //   left: 'center',
        //   textStyle: {
        //     color: '#fff'
        //   }
        // },
        tooltip: {
            trigger: 'item'
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: false,
            itemStyle: {
                normal: {
                    areaColor: '#2043AA',
                    borderColor: '#111'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: [

            //   {
            //     name: 'Top 5',
            //     type: 'effectScatter',
            //     coordinateSystem: 'bmap',
            //     data: convertData(
            //       data
            //         .sort(function (a, b) {
            //           return b.value - a.value;
            //         })
            //         .slice(0, 6)
            //     ),
            //     encode: {
            //       value: 2
            //     },
            //     symbolSize: function (val) {
            //       return val[2] / 10;
            //     },
            //     showEffectOn: 'emphasis',
            //     rippleEffect: {
            //       brushType: 'stroke'
            //     },
            //     hoverAnimation: true,
            //     label: {
            //       formatter: '{b}',
            //       position: 'right',
            //       show: true
            //     },
            //     itemStyle: {
            //       color: '#f4e925',
            //       shadowBlur: 10,
            //       shadowColor: '#333'
            //     },
            //     zlevel: 1
            //   },
            //   {
            //     type: 'custom',
            //     coordinateSystem: 'bmap',
            //     renderItem: renderItem,
            //     itemStyle: {
            //       opacity: 0.5
            //     },
            //     animation: false,
            //     silent: true,
            //     data: [0],
            //     z: -10
            //   }
        ]
    };
    get_loc_coord(locname) {
        if (locname[locname.length - 1] == '省' || locname[locname.length - 1] == '市') {
            locname = locname.slice(0, locname.length - 1)
        }

        let spec = ["宁夏", "新疆", "广西", "西藏", "内蒙古"]
        spec.forEach((spec) => {
            if (locname.indexOf(spec) != -1) {
                locname = spec
            }
        })

        return MAP_INFO[locname]
    }
    add_one_dataset(value_name, arr_locname_value, scale) {

        this.option.series.push({
            name: value_name,
            type: 'scatter',
            coordinateSystem: 'geo',
            data: arr_locname_value.map(locname_value => {
                console.log("get_loc_coord", locname_value[0], this.get_loc_coord(locname_value[0]))
                return {
                    name: locname_value[0],
                    value: this.get_loc_coord(locname_value[0]).concat(locname_value[1])
                }
            }),
            symbolSize: function (val) {
                return val[2] * scale;
            },
            label: {
                formatter: '{b}',
                position: 'right'
            },
            itemStyle: {
                color: '#f4e925'
            },
            emphasis: {
                label: {
                    show: true
                }
            }
        })
    }
}

class LineChartData {
    option = {
        animationDuration: 10000,
        // title: {
        //     text: 'Stacked Area Chart'
        // },
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: []//['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: []//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            // {
            //     name: 'Email',
            //     type: 'line',
            //     stack: 'Total',
            //     areaStyle: {},
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: []//[120, 132, 101, 134, 90, 230, 0]
            // },
            // {
            //     name: 'Union Ads',
            //     type: 'line',
            //     stack: 'Total',
            //     areaStyle: {},
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: []//[220, 182, 191, 234, 290, 330, 310]
            // },
            // {
            //     name: 'Video Ads',
            //     type: 'line',
            //     stack: 'Total',
            //     areaStyle: {},
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: [150, 232, 201, 154, 190, 330, 410]
            // },
            // {
            //     name: 'Direct',
            //     type: 'line',
            //     stack: 'Total',
            //     areaStyle: {},
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: [320, 332, 301, 334, 390, 330, 320]
            // },
            // {
            //     name: 'Search Engine',
            //     type: 'line',
            //     stack: 'Total',
            //     label: {
            //         show: true,
            //         position: 'top'
            //     },
            //     areaStyle: {},
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: [820, 932, 901, 934, 1290, 1330, 0]
            // }
        ]
    }
    set_title(title) {
        // this.option.title.text = title
    }
    add_y(name) {
        console.log("add y", name)
        this.option.legend.data.push(name)
        this.option.series.push(
            {
                name: name,
                type: 'line',
                endLabel: {
                    show: true,
                },
                // stack: 'Total',
                // areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: []//[120, 132, 101, 134, 90, 230, 0]
            },
        )
    }
    add_x(xname, values) {
        console.log("add x", xname, values)
        this.option.xAxis[0].data.push(xname)
        for (let i = 0; i < values.length; i++) {
            this.option.series[i].data.push(values[i])
        }
    }
}


