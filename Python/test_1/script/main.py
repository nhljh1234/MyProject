import xlrd
import xlwt
from xlutils.copy import copy

book = xlrd.open_workbook('./script/1910出口200万美元以下.xlsx')
sheetCompany = book.sheets()[0]
rowNum = sheetCompany.nrows
listCompanyInfo = []
count = 0

newBook = copy(book)
ws = newBook.get_sheet(0)

while count < rowNum - 1:
    count = count + 1
    address = sheetCompany.cell(count, 1).value
    if (address.find("街道") >= 0):
        strs = address.split("街道")
        if (strs[0].find("区") >= 0):
            strs = strs[0].split("区")
            ws.write(count, 2, strs[1] + "街道")
    elif (address.find("镇") >= 0):
        strs = address.split("镇")
        if (strs[0].find("区") >= 0):
            strs = strs[0].split("区")
            ws.write(count, 2, strs[1] + "镇")
    # elif (address.find("区") >= 0):
    #     strs = address.split("区")
    #     if (strs[0].find("市") >= 0):
    #         strs = strs[0].split("市")
    #         ws.write(count, 2, strs[1] + "区")
    #     elif (strs[0].find("省") >= 0):
    #         strs = strs[0].split("省")
    #         ws.write(count, 2, strs[1] + "区")
    #     elif (len(strs) > 0):
    #         ws.write(count, 2, strs[0] + "区")

newBook.save("./script/1910出口200万美元以下.xlsx")            

