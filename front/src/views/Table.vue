<template>
    <div class="table">
        <div class="tablename">
            {{ tablename }}
        </div>
        <el-table :data="table.rows" height="250" border style="width: 100%">
            <el-table-column v-for="(attr, index) in table.attrs" :key="index" :prop="attr" :label="attr" width="180">
            </el-table-column>
        </el-table>
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
        let that = this
        api_get_table(this.tablename).then((res) => {
            that.table = array_table_2_table_struct(res.data.data)
            console.log("table loaded", that.table)
            that.$forceUpdate()
        })
    },
    beforeDestroy() {
    }
}
</script>

<style scoped>
.tablename {
    padding: 10px;
    font-size: 25px;
}

.table {
    z-index: 1000;
}
</style>
