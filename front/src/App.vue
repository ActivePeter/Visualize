<template>
  <div id="all">
    <!-- <NavMenu /> -->

    <div id="app" :style="{ transform: 'scale(' + screenWidth / 2300.0 + ')', transformOrigin: '0 0' }">
      <div class="maintitle">数据可视化平台</div>
      <el-row style="width: 100%;" :gutter="20">
        <el-col :span="6">
          <Container v-for="(item, i) in     cur_pagedata.dataparts    " class="container"
            :style="'height:' + item.height" v-if="item.pos == 'left'">
            <div class="part_title">{{ item.tablename }}</div>
            <LineTable :option="item.chart_option">
            </LineTable>
          </Container>

          <!-- <LineTable ref="haha"></LineTable>
          <Pie></Pie> -->


          <!-- <Table tablename="恒大股份回购"></Table>
          <Table tablename="恒大财务比率"></Table>
          <Table tablename="恒大借款"></Table>
          <Table tablename="利润表"></Table>
          <Table tablename="资产负债表"></Table> -->
        </el-col>
        <el-col :span="12">
          <div style="height: 40px;"></div>
          <Container v-for="(item, i) in     cur_pagedata.dataparts    " class="container"
            :style="{ height: item.height }" v-if="item.pos == 'mid'">
            <div class="part_title">{{ item.tablename }}</div>
            <!-- {{ item.chart_option }} -->
            <LineTable :option="item.chart_option">
            </LineTable>

          </Container>
          <div class="select_btns">
            <Container class="select_btn" v-for="(item, i) in    pages   "
              :style="cur_page_idx == i ? 'transform:scale(1.2);' : ''">
              <div :style="cur_page_idx == i ? 'color:rgb(189, 230, 255); margin-top:-13px; width:120px;' :
                'margin-top:-13px; width:120px;'
                " @click="select_page(i)">
                {{ item.name }}</div>
            </Container>
          </div>
        </el-col>
        <el-col :span="6">
          <Container v-for="(   item, i   ) in        cur_pagedata.dataparts       " class="container"
            :style="'height:' + item.height" v-if="item.pos == 'right'">
            <div class="part_title">{{ item.tablename }}</div>
            <LineTable :option="item.chart_option">
            </LineTable>
          </Container>
        </el-col>
      </el-row>
      <!-- <el-collapse-transition>
        <router-view></router-view>
      </el-collapse-transition> -->
    </div>
  </div>
</template>

<script>
import Table from '@/views/Table'
import Container from '@/views/Container'
import LineTable from './views/LineTable.vue'
import Pie from './views/Pie.vue'
import { api_get_table } from "@/utils/request"
import { DataDescription } from "@/utils/data_desc"
import { color } from 'echarts'
// import NavMenu from '@/views/components/content/navmenu/NavMenu'
export default {
  name: "App",
  components: {
    // NavMenu,
    Table,
    Container,
    LineTable,
    Pie
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
    this.load_page()
  },
  data() {
    return {
      cur_page_idx: 0,
      screenWidth: document.body.clientWidth,
      pages: [
        {
          name: "就业与工资",
          dataparts: [

            new DataDescription("分地区按行业分城镇单位就业人员情况", "left", "630px"),
            new DataDescription("分地区城镇登记失业率", "left", "430px"),

            new DataDescription("分行业城镇单位就业人员工资情况表", "right", "430px"),
            new DataDescription("就业情况基本表", "right", "630px"),

            new DataDescription("分地区按注册类型分城镇单位就业人员工资情况", "mid", "920px"),


            // new DataDescription("宏观景气指数", "left", "220px"),
            // new DataDescription("宏观景气指数", "left", "220px"),

            // new DataDescription("企业景气及企业家信心指数", "right", "220px"),
            // new DataDescription("全国居民消费价格指数", "right", "330px"),

            // new DataDescription("分地区居民消费价格指数", "mid", "420px"),
          ]
        },
        {
          name: "景气指数",
          dataparts: [

            new DataDescription("消费者景气指数", "left", "630px"),
            new DataDescription("全国居民消费价格指数", "left", "430px"),
            new DataDescription("企业景气及企业家信心指数", "right", "430px"),
            new DataDescription("宏观景气指数", "right", "630px"),
            new DataDescription("分地区居民消费价格指数", "mid", "920px")
          ]
        }, {
          name: "人口",
          dataparts: [
            new DataDescription("不同年龄段人口数", "left", "630px"),
            new DataDescription("各地区人口平均预期寿命", "left", "430px"),

            new DataDescription("妇女分龄生育情况", "right", "430px"),
            new DataDescription("不同地区每户人口数", "right", "630px"),

            new DataDescription("不同地区受教育程度", "mid", "920px"),
          ]
        }, {
          name: "资源环境",
          dataparts: [
            new DataDescription("各地区废气排放及处理情况", "left", "630px"),
            new DataDescription("各地区供水情况", "left", "430px"),

            new DataDescription("全球水资源量年度信息", "right", "430px"),
            new DataDescription("环境污染治理投资", "right", "630px"),

            new DataDescription("自然灾害情况", "mid", "920px"),
          ]
        }, {
          name: "人民生活",
          dataparts: [
            new DataDescription("城乡恩格尔指数", "left", "630px"),
            new DataDescription("各地区居民消费水平", "left", "430px"),

            new DataDescription("储蓄存款情况", "right", "430px"),
            new DataDescription("不同地区每户人口数", "right", "630px"),

            new DataDescription("居民家庭住房情况", "mid", "920px"),
          ]
        }, {//todo
          name: "财政政策",
          dataparts: [
            new DataDescription("各地区财政收入", "left", "630px"),
            new DataDescription("各地区财政支出", "left", "430px"),

            new DataDescription("外债余额", "right", "430px"),
            new DataDescription("外债风险指标", "right", "630px"),

            new DataDescription("中央与地方财政收支情况", "mid", "920px"),
          ]
        }, {
          name: "保险",
          dataparts: [
            new DataDescription("保险公司保费金额表", "left", "630px"),
            new DataDescription("保险公司赔款及给付表", "left", "430px"),
            new DataDescription("保险公司原保费收入和赔付支出情况", "right", "430px"),
            new DataDescription("保险公司资产情况", "right", "630px"),
            new DataDescription("全国各地区保险业务统计表", "mid", "920px"),
          ]
        }, {
          name: "国内贸易",
          dataparts: [
            new DataDescription("分地区消费品零售总额（年度）", "left", "630px"),
            new DataDescription("社会消费品销售总额（月度）", "left", "430px"),
            new DataDescription("限额以上零售分类表（月度）", "right", "430px"),
            new DataDescription("亿元以上商品交易市场基本情况（年度）", "right", "630px"),
            new DataDescription("分地区亿元以上商品交易市场基本情况（年度）", "mid", "920px")
          ]
        }, {
          name: "房地产",
          dataparts: [
            new DataDescription("房地产投资情况", "left", "630px"),
            new DataDescription("分地区投资情况", "left", "430px"),
            new DataDescription("限额以上零售分类表（月度）", "right", "430px"),
            new DataDescription("开发投资资金来源", "right", "630px"),
            new DataDescription("分地区开发竣工情况", "mid", "920px")
          ]
        }, {
          name: "国民经济",
          dataparts: []
        }, {
          name: "工业",
          dataparts: []
        },],
      cur_pagedata: {
        dataparts: []
      }
    }
  },
  methods: {
    load_page() {
      console.log("load_page")
      this.pages[this.cur_page_idx].dataparts.forEach((v) => {
        v.load_data()
      })
      this.cur_pagedata = this.pages[this.cur_page_idx]
      console.log("cur_pagedata", this.cur_pagedata)
    },
    select_page(idx) {
      if (this.cur_page_idx != idx) {

        this.cur_page_idx = idx
        this.load_page()

      }
    }
  }
}
</script>

<style scoped>
@import "assets/css/base.css";

.maintitle {
  padding-top: 10px;
  font-size: 23px;
  text-align: center;
  /* margin-left: -20px; */
}

.part_title {
  margin: -10px 0 5px 5px;
  font-size: 21px;
}

.cate {
  padding: 20px 10px;
  font-size: 30px;
}

#app {
  background-position: center;
  background: url("assets/img/bg2.jpg");
  width: 2300px;
  height: 1200px;
  background-color: rgb(0, 0, 114);
  background-size: contain;
  color: rgb(114, 201, 255);
  background-repeat: no-repeat;
  padding: 0 30px;
}

.container {
  margin-top: 25px;
}

.select_btns {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  font-size: 20px;
  column-gap: 10px;
  row-gap: 10px;
  height: 100px;
  overflow: scroll;
  padding-bottom: 10px;
}

.select_btn {
  text-align: center;
  padding-bottom: 20px;
  cursor: pointer;
}
</style>
