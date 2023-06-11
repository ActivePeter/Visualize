<template>
    <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent
]);

export default {
    name: 'line_chart',
    components: {
        VChart
    },
    provide: {
        [THEME_KEY]: "dark"
    },
    data() {
        return {
            option: {
                backgroundColor: 'transparent',
                textStyle: {
                    color: '#75deef',
                },
                title: {
                    text: "Traffic Sources",
                    left: "center"
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    left: "left",
                    data: [
                        "Direct",
                        "Email",
                        "Ad Networks",
                        "Video Ads",
                        "Search Engines"
                    ],

                },
                series: [
                    {
                        name: "Traffic Sources",
                        type: "pie",
                        radius: "55%",
                        center: ["50%", "60%"],
                        data: [
                            { value: 335, name: "Direct" },
                            { value: 310, name: "Email" },
                            { value: 234, name: "Ad Networks" },
                            { value: 135, name: "Video Ads" },
                            { value: 1548, name: "Search Engines" }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        }
                    }
                ]
            }
        };
    },
    props: {
        // tablename: {
        //     type: String,
        //     default: ""
        // }
    },
    mounted() {
        this.setChart()
    },
    beforeDestroy() {
    },
    methods: {
        setChart() {

            let option = {
                tooltip: {
                    trigger: 'item',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'none'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    backgroundColor: '#11367a',
                    textStyle: {
                        color: '#6dd0e3',
                        fontSize: 10,
                    },
                    formatter: (data) => {
                        if (data.componentSubType == 'bar' && data.seriesName != '辅助') {
                            return data.name + ":" + data.value
                        } else if (data.componentSubType == 'line') {
                            return data.name + "<br>" + data.seriesName + ":" + this.formateData(data.value)
                        }
                    }
                },
                title: [
                    {
                        text: '【应用类型统计】',
                        textStyle: {
                            color: '#75deef',
                            fontSize: 12,
                            fontWeight: 'normal'
                        },
                        top: '12%',
                        left: '15%'
                    },

                ],
                legend: [
                    {
                        top: '6%',
                        left: 'center',
                        itemWidth: 7,
                        itemHeight: 7,
                        textStyle: {
                            color: '#75deef',
                            fontSize: 12,
                        },
                        z: 2,
                        data: [
                            { name: '社交', icon: 'circle' },
                            { name: '游戏', icon: 'circle' },
                            { name: '直播', icon: 'circle' },
                            { name: '金融理财', icon: 'circle' },
                            { name: '生活', icon: 'circle' },
                            { name: '购物', icon: 'circle' },
                            { name: '办公学习', icon: 'circle' },
                            { name: '其他', icon: 'circle' },
                        ]
                    }
                ],
                grid: [
                    {
                        left: '5%',
                        top: '20%',
                        right: '52%',
                        bottom: '53%',
                        containLabel: false
                    },
                ],
                xAxis: [
                    // {
                    //     type: 'category',
                    //     data: ['社交', '游戏', '直播', '金融理财', '生活', '购物', '办公', '其他'],
                    //     axisLabel: {
                    //         interval: 0,
                    //         fontSize: 9,
                    //         color: '#75deef'
                    //     },
                    //     axisLine: { show: false },
                    //     axisTick: {
                    //         show: false
                    //     }
                    // },
                    // {
                    //     type: 'category',
                    //     gridIndex: 1,
                    //     data: ['微信', 'QQ音乐', '钉钉', '抖音', '直播', '互动吧', '其他'],
                    //     axisLine: { show: false },
                    //     axisLabel: {
                    //         interval: 0,
                    //         fontSize: 9,
                    //         color: '#75deef'
                    //     },
                    //     axisTick: {
                    //         show: false
                    //     }
                    // },
                    {
                        type: 'category',
                        gridIndex: 2,
                        boundaryGap: false,
                        data: ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7'],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#1a3c58'
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            fontSize: 9,
                            color: '#75deef'
                        },
                        axisTick: {
                            show: true
                        }
                    },
                    // {
                    //     type: 'category',
                    //     gridIndex: 3,
                    //     boundaryGap: false,
                    //     data: ['0.00', '4.00', '8.00', '12.00', '16.00', '20.00', '24.00'],
                    //     axisLine: {
                    //         show: true,
                    //         lineStyle: {
                    //             color: '#1a3c58'
                    //         }
                    //     },
                    //     axisLabel: {
                    //         interval: 0,
                    //         fontSize: 9,
                    //         color: '#75deef'
                    //     },
                    //     axisTick: {
                    //         show: true
                    //     }
                    // },
                ],
                yAxis: [
                    // {
                    //     type: 'value',
                    //     splitLine: { show: false },
                    //     axisLabel: { show: false },
                    //     axisLine: { show: false },
                    //     axisTick: {
                    //         show: false
                    //     }
                    // },
                    // {
                    //     type: 'value',
                    //     gridIndex: 1,
                    //     axisLabel: { show: false },
                    //     splitLine: { show: false },
                    //     axisLine: { show: false },
                    //     axisTick: {
                    //         show: false
                    //     }
                    // },
                    // {
                    //     type: 'value',
                    //     gridIndex: 2,
                    //     axisLabel: {
                    //         interval: 0,
                    //         fontSize: 9,
                    //         color: '#75deef',
                    //         showMaxLabel: false
                    //     },
                    //     name: '(小时)',
                    //     nameGap: -5,
                    //     nameTextStyle: {
                    //         color: '#75deef',
                    //         fontSize: 9,
                    //         align: 'right',
                    //         padding: [0, 4, 0, 0]
                    //     },
                    //     min: 0,
                    //     max: 6,
                    //     splitLine: { show: false },
                    //     axisLine: {
                    //         show: true,
                    //         lineStyle: {
                    //             color: '#1a3c58'
                    //         }
                    //     },
                    //     axisTick: {
                    //         show: true
                    //     }
                    // },
                    // {
                    //     type: 'value',
                    //     gridIndex: 2,
                    //     axisLabel: { show: false },
                    //     splitLine: { show: false },
                    //     axisLine: { show: false },
                    //     axisTick: {
                    //         show: false
                    //     }
                    // },
                    {
                        type: 'value',
                        gridIndex: 3,
                        axisLabel: {
                            interval: 0,
                            fontSize: 9,
                            color: '#75deef',
                            showMaxLabel: false
                        },
                        name: '(小时)',
                        nameGap: -5,
                        nameTextStyle: {
                            color: '#75deef',
                            fontSize: 9,
                            align: 'right',
                            padding: [0, 4, 0, 0]
                        },
                        min: 0,
                        max: 6,
                        splitLine: {
                            show: false,

                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#1a3c58'
                            }
                        },
                        axisTick: {
                            show: true
                        }
                    },
                    {
                        type: 'value',
                        gridIndex: 3,
                        axisLabel: { show: false },
                        splitLine: { show: false },
                        axisLine: { show: false },
                        axisTick: {
                            show: false
                        }
                    },
                ],
                series: this.setOptionData()
            };
            let myChart = this.$echarts(this.$el);
            myChart.clear();
            myChart.resize()
            myChart.setOption(option);
        }
    }
}
</script>

<style scoped>
.chart {
    /* border: 1px solid red; */
    /* background-color: red; */
    width: 300px;
    height: 200px;
    /* z-index: 1000; */
}
</style>
