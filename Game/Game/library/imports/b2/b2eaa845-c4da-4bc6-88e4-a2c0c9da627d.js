"use strict";
cc._RF.push(module, 'b2eaahFxNpLxojkosDJ2mJ9', 'DateTool');
// Script/Tool/Date/DateTool.js

'use strict';

var outModule = {};
var local = {};

outModule.SPRING = 1;
outModule.SUMMER = 2;
outModule.AUTUMN = 3;
outModule.WINTER = 4;

/**
 * @param year 判断一个年份是否是瑞年
 */
outModule.getIsLeapYear = function (year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 100 === 0 && year % 400 === 0;
};

/**
 * @param year 
 * @param month 
 * @param day 
 * @param hour 
 * @param minute 
 * @param addMinute 增加的分钟数，游戏的时间流逝以分钟数为准
 * 时间是按1970年开始结算的，这边的year需要处理一下
 */
outModule.getNewDate = function (year, month, day, hour, minute, addMinute) {
    year = year + 1970;
    var date = new Date(year, month - 1, day, hour, minute, 0, 0);
    var totalMilliseconds = date.getTime() + addMinute * 60 * 1000;
    var newDate = new Date(totalMilliseconds);
    return {
        year: newDate.getFullYear() - 1970,
        month: newDate.getMonth() + 1,
        day: newDate.getDate(),
        hour: newDate.getHours(),
        minute: newDate.getMinutes()
    };
};

outModule.getTimeStrWithEra = function (year, month, day, hour, minute) {
    return '' + g_LanguageTool.getLanguageStr("era_name") + year + ' ' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + ' ' + (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute;
};

/**
 * 返回季节
 * @param month 月份数
 */
outModule.getSeason = function (month) {
    if (month >= 2 && month <= 4) {
        return outModule.SPRING;
    } else if (month >= 5 && month <= 7) {
        return outModule.SUMMER;
    } else if (month >= 8 && month <= 10) {
        return outModule.AUTUMN;
    }
    return outModule.WINTER;
};

module.exports = outModule;

cc._RF.pop();