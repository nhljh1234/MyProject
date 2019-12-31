# -*- coding: utf-8 -*-
import re
import csv
import scrapy
import redis

import time
import random

import xlrd
import xlwt
from xlutils.copy import copy

redis_cli = redis.Redis(host='127.0.0.1',port=6379)


class SearchSpider(scrapy.Spider):
    name = 'search'
    # num = 0
    allowed_domains = ['www.tianyancha.com']
    start_urls = ['http://www.tianyancha.com/']
    dr = re.compile(r'<[^>]+>', re.S)
    headers = {
        'User-Agent':'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/71.0',
        'Host':'www.tianyancha.com',
        'Referer':'www.tianyancha.com',
    }
    cookies = "aliyungf_tc=AQAAAM9vgi+JFQIAvP0keGszuV2OYYfd; csrfToken=RDTw-zPNZGYwPPCDaGjQ4PyO; TYCID=a46897c0263d11ea8ea0b9d1bc6f5d79; undefined=a46897c0263d11ea8ea0b9d1bc6f5d79; ssuid=6227246656; bannerFlag=undefined; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1577172721,1577183323; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1577185679; _ga=GA1.2.1036312342.1577185680; _gid=GA1.2.307949604.1577185680; _gat_gtag_UA_123487620_1=1; tyc-user-info=%257B%2522claimEditPoint%2522%253A%25220%2522%252C%2522myAnswerCount%2522%253A%25220%2522%252C%2522myQuestionCount%2522%253A%25220%2522%252C%2522explainPoint%2522%253A%25220%2522%252C%2522privateMessagePointWeb%2522%253A%25220%2522%252C%2522nickname%2522%253A%2522%25E7%258F%258D%25E5%25A6%25AE%25E5%25BC%2597%25C2%25B7%25E6%25B4%259B%25E4%25BD%25A9%25E5%2585%25B9%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522privateMessagePoint%2522%253A%25220%2522%252C%2522state%2522%253A%25220%2522%252C%2522announcementPoint%2522%253A%25220%2522%252C%2522isClaim%2522%253A%25220%2522%252C%2522bidSubscribe%2522%253A%2522-1%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522discussCommendCount%2522%253A%25220%2522%252C%2522monitorUnreadCount%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522claimPoint%2522%253A%25220%2522%252C%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNTc1OTI2MTY4MiIsImlhdCI6MTU3NzE4NTY5MiwiZXhwIjoxNjA4NzIxNjkyfQ.oSeAsj8avnRT5zZBsXpzxpESarM0XbMvTVHoqSb-Za6A_w4MswaXqgdKlqxVFOoP4nabskX_oHUS6JnXNVgRaQ%2522%252C%2522pleaseAnswerCount%2522%253A%25220%2522%252C%2522redPoint%2522%253A%25220%2522%252C%2522bizCardUnread%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252215759261682%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNTc1OTI2MTY4MiIsImlhdCI6MTU3NzE4NTY5MiwiZXhwIjoxNjA4NzIxNjkyfQ.oSeAsj8avnRT5zZBsXpzxpESarM0XbMvTVHoqSb-Za6A_w4MswaXqgdKlqxVFOoP4nabskX_oHUS6JnXNVgRaQ; tyc-user-phone=%255B%252215759261682%2522%255D"

    cookie = {}
    # f = open('C:tianyancha_car.txt', 'w', encoding='utf-8')
    for c in cookies.split(';'):
        cookie[c.split('=')[0]] = c.split('=')[1]

    def start_requests(self):
        # for id in idlist:
        book = xlrd.open_workbook('../script/1910出口200万美元以下.xlsx')
        sheetCompany = book.sheets()[0]
        rowNum = sheetCompany.nrows
        listCompanyInfo = []

        count = 0

        for string in sheetCompany.col_values(1):
            if (len(string) == 0):
                break;
            count = count + 1

        count = count - 1

        amount = 0

        while (count < rowNum and amount < 50):
            listCompanyInfo.append({
                "name": sheetCompany.cell(count, 0).value,
                "index": count
            })
            count = count + 1
            amount = amount + 1

        # listCompanyInfoTest = []
        # listCompanyInfoTest.append(listCompanyInfo[0])
        # for companyInfo in listCompanyInfoTest:
        for companyInfo in listCompanyInfo:
            yield scrapy.Request(url = 'https://www.tianyancha.com/search?key=%s'%companyInfo['name'],
                                callback = self.index_parse,
                                cookies = self.cookie,
                                meta = companyInfo)

    def index_parse(self, response):
        try:
            url = response.xpath('//a[@class="name "]/@href').extract()[0]
            # for element in response.css('#web-content > div > div.container-left > div > div.result-list>div'):
            #     url=element.css('div.header>a.name::attr(href)').extract()[0]
            yield scrapy.Request(url = url,
                                 callback = self.parse_campany, 
                                 cookies = self.cookie,
                                 meta = response.meta)
        except:
            print('提取详情页失败')


    def parse_campany(self, response):
        #注册地址
        try:
            address = response.xpath('//td[contains(./text(),"注册地址")]/following::td[1]/text()').extract()[0]

            index = response.meta['index']
            book = xlrd.open_workbook("../script/1910出口200万美元以下.xlsx")
            old_content = copy(book)
            # 定位到Sheet1表
            ws = old_content.get_sheet(0)
            #在sheet1表中写入内容
            ws.write(index, 1, address)
            #对修改后的内容进行保存
            old_content.save("../script/1910出口200万美元以下.xlsx")
            print("注册地址获取成功")
        except:
            print("注册地址获取失败")

        # except Exception as e :
        #     print('数据解析失败',e)
        #     with open('failed.csv','a',encoding='utf-8',newline='')as j:
        #         writer = csv.writer(j)
        #         writer.writerow(oldinfo)
        #         print('存入失败csv')
