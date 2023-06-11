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
    if tablename == "恒大股份回购":
        return load_one_xls_table(1,"./恒大/恒大股份回购.xls")
    if tablename=="恒大财务比率":
        return load_one_xls_table(0,"./恒大/恒大财务比率.xls")
    if tablename=="恒大借款":
        return load_one_xls_table(0,"./恒大/恒大借款.xls")
    if tablename=="利润表":
        return load_one_xls_table(0,"./恒大/利润表.xls")
    if tablename=="资产负债表":
        return load_one_xls_table(0,"./恒大/资产负债表.xls")
    if tablename=="宏观景气指数":
        return load_one_xls_table(0,"./恒大/景气指数/宏观经济景气指数（月度）.xls")
    if tablename=="消费者景气指数":
        return load_one_xls_table(0,"./恒大/景气指数/消费者景气指数（月度）.xls")
    if tablename=="全国居民消费价格指数":
        return load_one_xls_table(0,"./恒大/景气指数/全国居民消费价格指数（月度）.xls")
    if tablename=="企业景气及企业家信心指数":
        return load_one_xls_table(0,"./恒大/景气指数/企业景气及企业家信心指数（季度）.xls")
    if tablename=="分地区居民消费价格指数":
        return load_one_xls_table(0,"./恒大/景气指数/分地区居民消费价格指数（月度）.xls")
        
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