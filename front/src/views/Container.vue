<template>
    <div class="container">
        <img class="left_top" src="@/assets/img/title_left_bg.png" />
        <img class="left_bot" src="@/assets/img/border_bg.jpg" />
        <img class="right_top" src="@/assets/img/border_bg.jpg" />
        <div class="left_line" />
        <div class="bottom_line" />
        <div class="top_line" />
        <div class="right_line" />
        <div class="right_bot" />
        <slot></slot>
    </div>
</template>

<script>
import { api_get_table } from "../utils/request"
import { array_table_2_table_struct } from "../utils/conv"

// const chinaMap = () => import('./components/page3/chinaMap');
// const channelBar = () => import('./components/page3/channelBar');
// const distributionSolider = () => import('./components/page3/distributionSolider');
// // const pie = () => import('./components/pie');
// const redPocket = () => import('./components/page3/redPocket');
// const radar = () => import('./components/radar');
// const doubleBar = () => import('./components/page3/doubleBar');
// const webcastsRisk = () => import('./components/page3/webcastsRisk');
// const deviceSafeRisk = () => import('./components/page3/deviceSafeRisk');
// const doubleRing = () => import('./components/page3/doubleRing');
// const hotWords = () => import('./components/page3/hotWords');

export default {
    name: 'page4',
    components: {

    },
    data() {
        return {
            table: [],
            attrs: ["a", "b", "c", "d"]
        }
    },
    props: {
        tablename: {
            type: String,
            default: ""
        }
    },
    mounted() {
        // let that = this
        // api_get_table(this.tablename).then((res) => {
        //     that.table = array_table_2_table_struct(res.data.data)
        //     console.log("table loaded", that.table)
        //     that.$forceUpdate()
        // })
    },
    beforeDestroy() {
    }
}
</script>

<style scoped>
.left_top {
    position: absolute;
    width: 100px;
    top: -15px;
    left: 0;
}

.left_line {
    position: absolute;
    top: 0;
    left: 0;
    height: calc(100% - 20px);
    border: 1px solid #408fcc;
}

.right_line {
    position: absolute;
    bottom: 0;
    right: 0;
    height: calc(100% - 20px);
    border: 1px solid #408fcc;

    width: 2px;
}

.bottom_line {
    position: absolute;
    bottom: 0;
    right: 0;
    width: calc(100% - 20px);
    border: 1px solid #408fcc;
}

.top_line {
    position: absolute;
    top: 0;
    right: 20px;
    width: calc(100% - 120px);
    border: 1px solid #408fcc;
}

.left_bot {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 20px;
}

.right_top {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
}

.right_bot {
    position: absolute;
    border: 3px solid #56a9e9;
    right: -2px;
    bottom: -2px;
    width: 30px;
    height: 30px;
    border-top: 0;
    border-left: 0;
}

.container {
    position: relative;
    padding: 10px;
    padding-top: 30px;
    padding-bottom: 50px;
    transition: all 0.5s ease;
    /* border: 2px solid #408fcc; */
    /* height: 100px; */
}

.container:hover {
    transform: scale(1.05);
}
</style>
