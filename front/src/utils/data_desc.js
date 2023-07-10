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
        // type: "bar", group_by: "stat_month", attr_map: {
        //     "stat_month": "月份",
        //     "expectation_idx": "期望指数",
        //     "satisfaction_idx": "满意指数",
        //     "confidence_idx": "消费者信心指数"
        // }, whitelist: {}

        type: "bar", desc_version: 2, group_by_keys: ["stat_month"],
        collector: (rows, attr_index_map) => {
            const row = rows[0]
            function i(attr_name) {
                return row[attr_index_map[attr_name]]
            }
            return [
                ["期望指数", i("expectation_idx")],
                ["满意指数", i("satisfaction_idx")],
                ["消费者信心指数", i("confidence_idx")],
                // ["城市就业", i("employ_urban")],
                // ["乡镇就业", i("employ_rural")],
                // ["未就业数", i("unemploy_num")]
            ]
        },
        x_count: 12,
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
        }, map_point_scale: 5.5, map_point_offset: -95
    },

    /// 资源环境
    "各地区废气排放及处理情况": {

        type: "map", lockey: "area_name",
        // attr_in_group: "area_name",
        // value: "SO2_discharged",
        attr_map: {
            // "area_name": "地区",
            "SO2_discharged": "废气排放量",
            // "area_name": "地区"
        }, whitelist: {
            "stat_year": (year) => year == "2012"
            // "area_name": (name) => name == "福建省"
        }, map_point_scale: 0.5, map_point_offset: -95
    },
    "各地区供水情况": {
        type: "bar", desc_version: 2, group_by_keys: ["stat_year"],
        collector: (rows, attr_index_map) => {
            const row = rows[0]
            function i(attr_name) {
                return row[attr_index_map[attr_name]]
            }
            return [
                ["地上水", i("surface_water")],
                ["地下水", i("ground_water")],
                ["其他", i("others")],
                ["农业用水", i("agriculture")],
                ["工业用水", i("industry")],
                ["日常用水", i("daily_consumption")]
            ]
        }
    },
    "环境污染治理投资": {
        type: "line", group_by: "stat_year", attr_map: {
            "infrastructure": "基础设施",
            "fuel_gas": "化石燃料污染",
            "centralized_heating": "集中供热",
            "drainage": "水污染",
            "gardening": "农业污染",
            "industrial_pollution": "工业污染",
        }, whitelist: {}
    },
    "全球水资源量年度信息": {
        type: "line", group_by: "stat_year", attr_map: {
            "stat_year": "年份",
            "surface": "地表水",
            "ground": "地下水",
        }, whitelist: {}
    },
    "自然灾害情况": {
        type: "pie", desc_version: 2,
        hide_tooltip: true,
        collector: (rows, attr_index_map) => {
            let collect_each_year = {}
            rows.forEach(row => {
                collect_each_year[row[1]] = row
            })
            let collect_each_type = [['灾害类型', '地震数', '森林火灾数', '森林虫灾影响面积']]
            for (const year in collect_each_year) {
                const row = collect_each_year[year]
                function i(attr_name) {
                    return row[attr_index_map[attr_name]]
                }
                collect_each_type.push([year, i("earthquake_num"), i("forest_fire_num"), i("forest_pest_affected_area"),])
            }

            return collect_each_type
        }
    },

    /// 就业与工资
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
    "分地区按注册类型分城镇单位就业人员工资情况": {
        type: "pie", group_by: "area_name",
        // attr_in_group: "area_name",
        value: "wage_avg",
        attr_map: {
            "area_name": "地区",
            "wage_avg": "该行业平均工资",
            // "area_name": "地区"
        }, whitelist: {
            "stat_year": (year) => year == "2006"
            // "area_name": (name) => name == "福建省"
        }
    },
    "分地区城镇登记失业率": {
        type: "line", attr_in_group: "area_name", group_by: "stat_year", attr_map: {
            "stat_year": "年份",
            "area_name": "福建省",
            "unemploy_rate": "失业率",
        }, whitelist: {}
    },
    "分行业城镇单位就业人员工资情况表": {
        type: "line", attr_in_group: "industry_name", group_by: "stat_year", attr_map: {
            "stat_year": "年份",
            "industry_name": "行业名称",
            "wage_avg": "平均薪资"
        }, whitelist: {}
    },
    "就业情况基本表": {
        type: "bar", desc_version: 2, group_by_keys: ["stat_year"],
        collector: (rows, attr_index_map) => {
            const row = rows[0]
            function i(attr_name) {
                return row[attr_index_map[attr_name]]
            }
            return [
                ["第一产业就业", i("employ_primary")],
                ["第二产业就业", i("employ_secondary")],
                ["第三产业就业", i("employ_tertiary")],
                ["城市就业", i("employ_urban")],
                ["乡镇就业", i("employ_rural")],
                ["未就业数", i("unemploy_num")]
            ]
        }
    },

    // 人口
    "不同年龄段人口数": {
        type: "bar", desc_version: 2, group_by_keys: ["stat_year"],
        collector: (rows, attr_index_map) => {
            return rows.map((row) => {
                return [row[2], row[5]]
            })
        }
    },
    "不同地区每户人口数": {
        type: "bar", desc_version: 2, group_by_keys: ["area_name"],
        collector: (rows, attr_index_map) => {
            function i(row, attr_name) {
                return row[attr_index_map[attr_name]]
            }
            return [
                ["1人", i(rows[rows.length - 1], "one_persons")],
                ["2人", i(rows[rows.length - 1], "two_persons")],
                ["3人", i(rows[rows.length - 1], "three_persons")],
                ["4人", i(rows[rows.length - 1], "four_persons")],
                ["5人", i(rows[rows.length - 1], "five_persons")],
                ["6人", i(rows[rows.length - 1], "six_persons")],
                ["7人", i(rows[rows.length - 1], "seven_persons")],
                ["8人", i(rows[rows.length - 1], "eight_persons")],
                ["9人", i(rows[rows.length - 1], "nine_persons")],
                [">=10人", i(rows[rows.length - 1], "over_ten_persons")],
            ]
        }
    },
    "不同地区受教育程度": {
        type: "pie", desc_version: 2,
        hide_tooltip: true,
        collector: (rows, attr_index_map) => {
            let collect_each_province = {}
            rows.forEach(row => {
                collect_each_province[row[3]] = row
            })
            let collect_each_learn = [['学习程度', '无教育经历', '小学', '初中', '高中', '大学']]
            for (const province in collect_each_province) {
                const row = collect_each_province[province]
                function i(attr_name) {
                    return row[attr_index_map[attr_name]]
                }
                collect_each_learn.push([province, i("no_schooling"), i("primary_school"), i("junior_secondary_school"), i("senior_secondary_school"), i("college")])
            }

            return collect_each_learn
        }
    },
    "各地区人口平均预期寿命": {
        type: "map", lockey: "area_name", attr_map: {
            // "stat_quarter": "季度",
            "life_expect": "预期寿命",
        }, whitelist: {
            "area_name": (name) => name != "中国",
            "stat_year": (year) => year == "2010"
        }, map_point_scale: 1.2,
        map_point_offset: -60,
    },
    "妇女分龄生育情况": {
        type: "line", attr_in_group: "age", group_by: "stat_year", attr_map: {
            "stat_year": "年份",
            "age": "年龄",
            "population": "生育数"
        }, whitelist: {}
    },

    // 人民生活
    "城乡恩格尔指数": {
        type: "line", group_by: "stat_year", attr_map: {
            "stat_year": "年份",
            "urban_engel_coefficient": "城市恩格尔指数",
            "rural_engel_coefficient": "乡村恩格尔指数"
        }, whitelist: {}
    },
    "各地区居民消费水平": {
        type: "map", lockey: "area_name", attr_map: {
            // "stat_quarter": "季度",
            "expense": "消费金额",
        }, whitelist: {
            "area_name": (name) => name != "中国",
            "stat_year": (year) => year == "2015"
        }, map_point_scale: 0.001,
        map_point_offset: -60,
    },
    "居民家庭住房情况": {
        type: "pie", desc_version: 2,
        hide_tooltip: true,
        collector: (rows, attr_index_map) => {
            let collect_each_province = {}
            rows.forEach(row => {
                collect_each_province[row[3]] = row
            })

            let collect_each_type = [['房屋属性', '房屋面积', '房屋价格', '混凝土结构', '砖头结构']]
            for (const province in collect_each_province) {
                const row = collect_each_province[province]
                function i(attr_name) {
                    return row[attr_index_map[attr_name]]
                }
                collect_each_type.push([province, i("house_area"), i("house_value"), i("concrete_structure"), i("brick_wood_structure")])
            }

            return collect_each_type
        }
    },
    "储蓄存款情况": {
        type: "bar", desc_version: 2, group_by_keys: ["stat_year"],
        collector: (rows, attr_index_map) => {
            const row = rows[0]
            function i(attr_name) {
                return row[attr_index_map[attr_name]]
            }
            return [
                ["定期存款", i("time_deposit")],
                ["活期存款", i("demand_deposit")],
            ]
        },
        x_count: 8
    },

    //财政政策
    "各地区财政收入": {
        type: "line", attr_in_group: "area_name", group_by: "stat_year", attr_map: {
            "stat_year": "年份",
            "area_name": "省份",
            "general_budget": "总体收入",
        }, whitelist: {}
    },
    "各地区财政支出": {
        type: "line", attr_in_group: "area_name", group_by: "stat_year", attr_map: {
            "stat_year": "年份",
            "area_name": "省份",
            "general_budget": "总体收入",
        }, whitelist: {}
    },
    "中央与地方财政收支情况": {
        type: "pie", desc_version: 2,
        hide_tooltip: true,
        collector: (rows, attr_index_map) => {
            let collect_each_province = {}
            rows.forEach(row => {
                if (row[1] > "2000") {
                    collect_each_province[row[1]] = row
                }
            })

            let collect_each_type = [['收支类型', '中央收入', '地方收入', '中央支出', '地方支出']]
            for (const province in collect_each_province) {
                const row = collect_each_province[province]
                function i(attr_name) {
                    return row[attr_index_map[attr_name]]
                }
                collect_each_type.push([province, i("central_revenue"), i("local_revenue"), i("central_expense"), i("local_expense")])
            }

            return collect_each_type
        }
    },
    "外债余额": {
        type: "bar", desc_version: 2, group_by_keys: ["stat_year"],
        collector: (rows, attr_index_map) => {
            const row = rows[0]
            function i(attr_name) {
                return row[attr_index_map[attr_name]]
            }
            return [
                ["长期债务", i("long_term_debt")],
                ["短期债务", i("short_term_debt")],
            ]
        },
        x_count: 8
    },
    "外债风险指标": {
        type: "bar", desc_version: 2, group_by_keys: ["stat_year"],
        collector: (rows, attr_index_map) => {
            const row = rows[0]
            function i(attr_name) {
                return row[attr_index_map[attr_name]]
            }
            return [
                ["外债清偿比率", i("debt_service_ratio")],
                ["负债比率", i("liability_ratio")],
                ["债务率", i("foreign_debt_ratio")]
            ]
        },
        x_count: 12
    },

    //房地产
    "房地产投资情况": {
        type: "line", group_by: "stat_month", attr_map: {
            "stat_month": "月份",
            "auxiliary_project": "配套工程",
            "resident": "住户",
            "villa_flat": "别墅公寓",
            "office": "办公室",
            "business": "商业楼",
            "other_house": "其他类型"
        }, whitelist: {}
    },
    "分地区投资情况": {
        type: "map", lockey: "area_name", attr_map: {
            // "stat_quarter": "季度",
            "invest": "投资情况",
        },
        map_point_scale: 0.005,
        map_point_offset: -100,
        whitelist: {
            stat_month: (m) => m == "2016-11"
        }
    },
    "分地区开发竣工情况": {
        type: "pie", desc_version: 2,
        hide_tooltip: true,
        collector: (rows, attr_index_map) => {
            let collect_each_province = {}
            rows.forEach(row => {
                if (row[1] > "2020-10") {
                    collect_each_province[row[1]] = row
                }
            })

            let collect_each_type = [['类型', '建筑面积', '新建面积', '竣工面积']]
            for (const province in collect_each_province) {
                const row = collect_each_province[province]
                function i(attr_name) {
                    return row[attr_index_map[attr_name]]
                }
                collect_each_type.push([province, i("construct_area"), i("new_start_area"), i("complete_area")])
            }

            return collect_each_type
        }
    },
    "开发投资资金来源": {
        type: "bar", desc_version: 2, group_by_keys: ["stat_month"],
        collector: (rows, attr_index_map) => {
            const row = rows[0]
            function i(attr_name) {
                return row[attr_index_map[attr_name]]
            }
            return [
                ["国内贷款", i("domestic_loan")],
                ["外国资本", i("foreign_capital")],
                ["自行融资", i("self_financing")],
                ["其他资本", i("other_capital")],
                ["项目基金", i("project_funds")]
            ]
        },
        x_count: 6
    },

    "分地区消费品零售总额（年度）": {
        type: "bar", attr_in_group: "stat_year", group_by: "area_name", y: "retail", attr_map: {
            "stat_year": "统计年份",
            "retail": "社会消费品零售总额",
            "area_name": "地区名称"
        }, whitelist: {
        }
    },
    "亿元以上商品交易市场基本情况（年度）": {
        type: "bar", attr_in_group: "stat_year", group_by: "market_name", y: "stall_num", attr_map: {
            "stat_year": "统计年份",
            "market_name": "市场名称",
            "stall_num": "摊位数量"
        }, whitelist: {
        }
    },


    // "分地区按注册类型分城镇单位就业人员工资情况": {
    //     type: "bar", x: "stat_year", group_by: "area_name", y: "wage_avg", attr_map: {
    //         "wage_avg": "该行业平均工资",
    //         "area_name": "地区",
    //         "stat_year": "年份"
    //     }, whitelist: {}
    // },

    // "分地区按注册类型分城镇单位就业人员工资情况": {
    //     type: "line", group_by: "stat_year",
    //     attr_in_group: "area_name",
    //     attr_map: {
    //         "stat_year": "年份",
    //         "wage_avg": "该行业平均工资",
    //         "area_name": "地区"
    //     }, whitelist: {
    //         // "area_name": (name) => name == "福建省"
    //     }
    // },



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
    "社会消费品销售总额（月度）": {
        type: "line", group_by: "stat_month", attr_map: {
            "stat_month": "月份",
            "retail_sin": "当期值",
            "retail_acc": "累计值",
            "retail_sin_yoy": "同比增长",
            "retail_acc_yoy": "累计增长"
        }, whitelist: {}
    },
    "限额以上零售分类表（月度）": {
        type: "line", group_by: "stat_month",
        attr_in_group: "item_name",
        attr_map: {
            "stat_month": "月份",
            "item_sale_sin": "当前值",
            "item_sale_acc": "累计值",
            "item_sale_sin_rate": "累计增长",
            "item_sale_acc_rate": "当期值"
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
    "分地区亿元以上商品交易市场基本情况（年度）": {
        type: "map", lockey: "area_name", attr_map: {
            // "stat_quarter": "季度",
            "market_num": "市场数量",
        }, whitelist: {

        }, map_point_scale: 0.1
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

class DivideLayer {
    cur_group_by_i
    group_bys
    map = {}
    get_attr_index

    constructor(cur_group_by_i, group_bys, get_attr_index) {
        this.group_bys = group_bys
        this.cur_group_by_i = cur_group_by_i
        this.get_attr_index = get_attr_index
    }

    depth() {
        return this.group_bys.length
    }
    attr() {
        return this.group_bys[this.cur_group_by_i]
    }
    _map_row(row) {
        let attr_value = row[this.get_attr_index(this.group_bys[this.cur_group_by_i])]
        if (attr_value in this.map) {
            this.map[attr_value].push(row)
        } else {
            this.map[attr_value] = [row]
        }
    }
    _map_next(row) {
        let attr_value = row[this.get_attr_index(this.group_bys[this.cur_group_by_i])]
        if (!(attr_value in this.map)) {
            this.map[attr_value] = new DivideLayer(this.cur_group_by_i + 1, this.group_bys, this.get_attr_index)
        }
        this.map[attr_value].map_groupby(attr_value, row)
    }
    map_groupby(row) {
        if (this.cur_group_by_i == this.group_bys.length - 1) {
            this._map_row(row)
        } else {
            this._map_next(row)
        }
    }
    // layer begins from 0
    for_each_layer(layer, cb_key_divide_rows) {
        if (layer > this.group_bys.length) {
            console.error("for_each_layer out of layer range")
        }
        function arrive_divide(that) {
            console.log("arrive_divide", that)
            return layer < that.group_bys.length && layer == that.cur_group_by_i
        }
        function arrive_rows(that) {
            console.log("arrive_rows", that)
            return layer == that.group_bys.length && layer == that.cur_group_by_i + 1
        }
        if (arrive_divide(this)) {
            cb_key_divide_rows(this.attr(), this, undefined)
        } else if (arrive_rows(this)) {
            for (const key in this.map) {
                cb_key_divide_rows(key, undefined, this.map[key])
            }
        } else {
            for (const key in this.map) {
                this.map[key].for_each_layer(layer, cb_key_divide_rows)
            }
        }
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
            mapchartdata.add_one_dataset(attr_name, arr_locname_value, config.map_point_scale, config.map_point_offset)
        })



        this.chart_option = mapchartdata.option
    }

    load_data_v2(config) {
        // {
        //     type: "bar", 
        //     desc_version: 2, 
        //     group_by_keys: ["stat_year"],
        //     collector: (rows, attr_index_map) => {}
        // }
        let attrline = this.tabledata[0]
        let attr_index_map = {}
        attrline.forEach((attr, i) => {
            attr_index_map[attr] = i
        })

        function row_attr(row, attr) {
            return row[attr_index_map[attr]]
        }

        let group_by = new DivideLayer(0, config.group_by_keys, (attr) => {
            return attr_index_map[attr]
        });



        this.tabledata.slice(1).forEach((row, i) => {
            group_by.map_groupby(row)
        })

        // to bar option
        this.v2_2_bar_option(attr_index_map, config, group_by)
    }
    v2_pie_option(config) {
        let attrline = this.tabledata[0]
        let attr_index_map = {}
        attrline.forEach((attr, i) => {
            attr_index_map[attr] = i
        })

        let source = config.collector(this.tabledata.slice(1), attr_index_map)
        source[0][0] = 'product'
        let option = {
            title: [],
            backgroundColor: 'transparent',
            legend: {},
            dataset: {
                source: source
                //   [
                //     ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                //     ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
                //     ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
                //     ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
                //     ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
                //   ]
            },
            series: []
        };
        if (source[0].length == 4) {
            option.series = [
                {
                    type: 'pie',
                    radius: '30%',
                    center: ['25%', '30%']
                    // No encode specified, by default, it is '2012'.
                },
                {
                    type: 'pie',
                    radius: '30%',
                    center: ['75%', '30%'],
                    encode: {
                        itemName: 'product',
                        value: source[0][2]
                    }
                },
                {
                    type: 'pie',
                    radius: '30%',
                    center: ['50%', '75%'],
                    encode: {
                        itemName: 'product',
                        value: source[0][3]
                    }
                },
                // {
                //     type: 'pie',
                //     radius: '20%',
                //     center: ['75%', '75%'],
                //     encode: {
                //         itemName: 'product',
                //         value: source[0][4]
                //     }
                // }
            ];
        } else {
            option.series = [
                {
                    type: 'pie',
                    radius: '20%',
                    center: ['25%', '30%']
                    // No encode specified, by default, it is '2012'.
                },
                {
                    type: 'pie',
                    radius: '20%',
                    center: ['75%', '30%'],
                    encode: {
                        itemName: 'product',
                        value: source[0][2]
                    }
                },
                {
                    type: 'pie',
                    radius: '20%',
                    center: ['25%', '75%'],
                    encode: {
                        itemName: 'product',
                        value: source[0][3]
                    }
                },
                {
                    type: 'pie',
                    radius: '20%',
                    center: ['75%', '75%'],
                    encode: {
                        itemName: 'product',
                        value: source[0][4]
                    }
                }
            ];
        }
        source[0].slice(1).forEach((s, i) => {
            if (i < option.series.length) {
                let top = option.series[i].center[1]
                top = parseFloat(top.slice(0, top.length - 1))
                option.title.push({
                    text: s,
                    // left: 'center'
                    left: option.series[i].center[0],
                    top: top + 19 + "%",
                    textAlign: 'center'
                })
            }

        })

        // if (!config.hide_tooltip) {
        //     option.tooltip = {}
        // }
        this.chart_option = option
    }
    v2_2_bar_option(attr_index_map, config, group_by) {
        let option = bar_chart_default_option()


        // level 1 group
        if (group_by.depth() == 1) {

            group_by.for_each_layer(0, (key, divide, rows) => {
                console.log("for each 0", divide)

                divide.for_each_layer(1, (key, divide, rows) => {
                    if (divide) {
                        console.warn("not support layer>1")
                    } else {
                        option.xAxis[0].data.push(key)
                        let collect = config.collector(rows, attr_index_map)
                        if (option.legend.data.length == 0) {
                            collect.forEach((pair) => {
                                option.legend.data.push(pair[0])
                                option.series.push({
                                    name: pair[0],
                                    type: 'bar',
                                    barGap: 0,
                                    label: "label_" + pair[0],
                                    emphasis: {
                                        focus: 'series'
                                    },
                                    data: []
                                },)
                            })
                        }
                        collect.forEach((pair, i) => {
                            option.series[i].data.push(pair[1])
                        })
                    }
                })
            })
        }
        // console.log("final bar option", option)
        let x_count = 3;
        if ("x_count" in config) {
            x_count = config.x_count
        }
        option.dataZoom[0].endValue = x_count - 1
        this.chart_option = option

        // anime
        if (this.interval_for_x_anime != -1) {
            clearInterval(this.interval_for_x_anime)
        }

        this.interval_for_x_anime = setInterval(() => {
            if (this.chart_option.dataZoom[0].endValue === this.chart_option.xAxis[0].data.length) {
                this.chart_option.dataZoom[0].startValue = 0;
                this.chart_option.dataZoom[0].endValue = x_count - 1;
            } else {
                this.chart_option.dataZoom[0].startValue += 1
                this.chart_option.dataZoom[0].endValue += 1;
            }
        }, 1000)
    }

    load_data_bar(config) {
        console.log("load_data_bar")
        let whitelist_helper = new WhiteListHelper(config)
        let attrline = this.tabledata[0]

        let attr_in_group_i = -1
        let group_by_i = -1
        let y_i = -1

        if ("desc_version" in config && config.desc_version == 2) {
            return this.load_data_v2(config)
        }

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

    load_data_pie(config) {
        if (config.desc_version == 2) {
            return this.v2_pie_option(config)
        }
        let whitelist_helper = new WhiteListHelper(config)
        let attrline = this.tabledata[0]

        let group_by_i = -1
        let value_i = -1

        attrline.forEach((attr, i) => {
            if (attr == config.group_by) {
                group_by_i = i
            }
            if (attr == config.value) {
                value_i = i
            }
            whitelist_helper.collect_one_attr(attr, i)
        })


        let helper = new PieChartHelper()
        this.tabledata.slice(1).forEach((row) => {
            if (whitelist_helper.check_row(row)) {
                helper.add_one(row[value_i], row[group_by_i])
            }
        })
        this.chart_option = helper.option
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
        } else if (config.type == "pie") {
            this.load_data_pie(config)
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

class PieChartHelper {
    default_opt() {
        return {

            backgroundColor: 'transparent',
            // title: {
            //   text: 'Referer of a Website',
            //   subtext: 'Fake Data',
            //   left: 'center'
            // },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        //   { value: 1048, name: 'Search Engine' },
                        //   { value: 735, name: 'Direct' },
                        //   { value: 580, name: 'Email' },
                        //   { value: 484, name: 'Union Ads' },
                        //   { value: 300, name: 'Video Ads' }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }
    constructor() {
        this.option = this.default_opt()
    }
    add_one(value, name) {
        this.option.series[0].data.push({ value, name })
        return this
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

        let spec = ["宁夏", "新疆", "广西", "西藏", "内蒙古", "香港", "澳门"]
        spec.forEach((spec) => {
            if (locname.indexOf(spec) != -1) {
                locname = spec
            }
        })

        return MAP_INFO[locname]
    }
    add_one_dataset(value_name, arr_locname_value, scale, offset) {
        if (!offset) {
            offset = 0
        }
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
                console.log("symbolSize", val, (val[2] * scale) + offset)
                return (val[2] + offset) * scale;
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


