# examples/server_simple.py
from aiohttp import web
import pandas as pd
import logging
from objprint import objprint

import xlrd;

def load_one_xls_table(begin_row:int,filepath:str):
    print("load_one_xls_table",filepath)
    wb = xlrd.open_workbook(filepath)
    table_data=[]
    sheet = wb.sheet_by_index(0)
    nrows = sheet.nrows
    ncols = sheet.ncols
    # print("row,col",nrows,ncols,begin_row)
    for rowi in range(begin_row,nrows):
        row=sheet.row_values(rowi)
        # if row[0]=='':
        #     break
        # print(row)
        table_data.append(row)
        
    # print(table_data)
    return table_data
    #所有sheet的名字
    # wnames = wb.sheet_names()
    # print(wnames)

    #不同方式获取sheet#
    # sheet1 = wb.sheet_by_index(0)
    # print("sheet1="+sheet1.name)
    # sheet2=wb.sheet_by_name("中山分校")
    # print("sheet2="+sheet2.name)
    # sheet3=wb.sheets()[0]
    # print("sheet3="+sheet3.name)

    # #行
    # crow = sheet1.nrows
    # print(crow)
    # #列
    # cols = sheet1.ncols
    # print("列数="+str(cols))

    # #行内容
    # crow4=sheet1.row_values(3)
    # print(crow4)
    # #行内容
    # clos4=sheet1.col_slice(3)
    # print(clos4)
    # #指定单元格
    # cell_data_1=sheet1.cell(1,1)
    # print(cell_data_1)
    
# load_one_table(1,"./恒大/恒大股份回购.xls")


# async def get_new(request):
#     # name = request.match_info.get('name', "Anonymous")
#     return web.json_response(read_a_new_url())

def get_table(tablename:str):
    load_xls_table_map={
        "恒大股份回购":[1,"./恒大/恒大股份回购.xls"],
        "恒大财务比率":[0,"./恒大/恒大财务比率.xls"],
        "恒大借款":[0,"./恒大/恒大借款.xls"],
        "利润表":[0,"./恒大/利润表.xls"],

        # 景气指数相关
        "资产负债表":[0,"./恒大/资产负债表.xls"],
        "宏观景气指数":[0,"./恒大/景气指数/宏观经济景气指数（月度）.xls"],
        "消费者景气指数":[0,"./恒大/景气指数/消费者景气指数（月度）.xls"],
        "全国居民消费价格指数":[0,"./恒大/景气指数/全国居民消费价格指数（月度）.xls"],
        "企业景气及企业家信心指数":[0,"./恒大/景气指数/企业景气及企业家信心指数（季度）.xls"],
        "分地区居民消费价格指数":[0,"./恒大/景气指数/分地区居民消费价格指数（月度）.xls"],

        # 就业与工资
        "分地区按行业分城镇单位就业人员情况":[0,"./恒大/就业与工资/分地区按行业分城镇单位就业人员情况表（年度）.xls"],
        "分地区按注册类型分城镇单位就业人员工资情况":[0,"./恒大/就业与工资/分地区按注册类型分城镇单位就业人员工资情况表(年度).xls"],
        "分地区城镇登记失业率":[0,"./恒大/就业与工资/分地区城镇登记失业率（年度）.xls"],
        "分行业城镇单位就业人员工资情况表":[0,"./恒大/就业与工资/分行业城镇单位就业人员工资情况表(年度).xls"],
        "就业情况基本表":[0,"./恒大/就业与工资/就业情况基本表(年度).xls"],

        # 人口
        "不同年龄段人口数":[0,"./恒大/人口/按年龄和性别分人口数表（年度）.xls"],
        "不同地区每户人口数":[0,"./恒大/人口/各地区按家庭户规模分的户数表（年度）.xls"],
        "不同地区受教育程度":[0,"./恒大/人口/各地区按性别和受教育程度分人口情况表（年度）.xls"],
        "各地区人口平均预期寿命":[0,"./恒大/人口/各地区人口平均预期寿命表（年度）.xls"],
        "妇女分龄生育情况":[0,"./恒大/人口/育龄妇女分年龄生育状况表（年度）.xls"],
        
        # 资源环境
        "各地区废气排放及处理情况":[0,"./恒大/资源环境/各地区废气排放及处理情况表（年度）.xls"],
        "各地区供水情况":[0,"./恒大/资源环境/各地区供水用水情况表（年度）.xls"],
        "环境污染治理投资":[0,"./恒大/资源环境/环境污染治理投资情况信息表（年度）.xls"],
        "全球水资源量年度信息":[0,"./恒大/资源环境/全国水资源量年度信息表（年度）.xls"],
        "自然灾害情况":[0,"./恒大/资源环境/自然灾害情况信息表（年度）.xls"],

        #人民生活
        "城乡恩格尔指数":[0,"./恒大/人民生活/城乡居民家庭人均收入及恩格尔系数(年度).xls"],
        "各地区居民消费水平":[0,"./恒大/人民生活/各地区居民消费水平表(年度).xls"],
        "居民家庭住房情况":[0,"./恒大/人民生活/分地区农村居民家庭住房情况表(年度).xls"],
        "储蓄存款情况":[0,"./恒大/人民生活/城乡居民人民币储蓄存款表(年度).xls"],

        #财政收入
        "各地区财政收入":[0,"./恒大/财政政策/各地区财政收入表（年度）.xls"],
        "各地区财政支出":[0,"./恒大/财政政策/各地区财政支出表（年度）.xls"],
        "中央与地方财政收支情况":[0,"./恒大/财政政策/中央财政与地方财政收支及比重表（年度）.xls"],
        "外债余额":[0,"./恒大/财政政策/外债余额表（年度）.xls"],
        "外债风险指标":[0,"./恒大/财政政策/外债风险指标表（年度）.xls"],

        #保险
        "保险公司保费金额表":[0,"./恒大/保险/保险公司保费金额表(年度).xls"],
        "保险公司赔款及给付表":[0,"./恒大/保险/保险公司赔款及给付表(年度).xls"],
        "保险公司原保费收入和赔付支出情况":[0,"./恒大/保险/保险公司原保费收入和赔付支出情况（年度）.xls"],
        "保险公司资产情况":[0,"./恒大/保险/保险公司资产情况（年度）.xls"],
        "全国各地区保险业务统计表":[0,"./恒大/保险/全国各地区保险业务统计表(年度).xls"],

        #国内贸易
        "分地区消费品零售总额（年度）":[0,"./恒大/国内贸易/分地区消费品零售总额（年度）.xls"],
        
        "社会消费品销售总额（月度）":[0,"./恒大/国内贸易/社会消费品销售总额（月度）.xls"],
        "限额以上零售分类表（月度）":[0,"./恒大/国内贸易/限额以上零售分类表（月度）.xls"],
        "亿元以上商品交易市场基本情况（年度）":[0,"./恒大/国内贸易/亿元以上商品交易市场基本情况（年度）.xls"],
        "分地区亿元以上商品交易市场基本情况（年度）":[0,"./恒大/国内贸易/分地区亿元以上商品交易市场基本情况（年度）.xls"],


        #房地产
        "房地产投资情况":[0,"./恒大/房地产/房地产开发投资情况表(月度累计).xls"],
        "分地区投资情况":[0,"./恒大/房地产/分地区房地产开发投资情况表(月度累计).xls"],
        "分地区开发竣工情况":[0,"./恒大/房地产/各地区房地产开发规模与开、竣工面积增长情况表(月度累计).xls"],
        "开发投资资金来源":[0,"./恒大/房地产/房地产开发投资资金来源情况表(月度累计).xls"],
    }

    if tablename in load_xls_table_map:
        args=load_xls_table_map[tablename]
        return load_one_xls_table(args[0],args[1])
        
print(get_table("恒大股份回购"))

async def api_get_table(request):
    data = await request.json()
    tablename=data['table_name']
    # df.to_csv(path_or_buf="./恒大新闻output.csv")
    return web.json_response({"data":get_table(tablename)})

app = web.Application()
app.add_routes([web.post('/get_table', api_get_table)])

if __name__ == '__main__':
    web.run_app(app)