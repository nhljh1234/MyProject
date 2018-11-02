var outModule = {};
var local = {};

/**
 * @param year 判断一个年份是否是瑞年
 */
outModule.getIsLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0);
};

/**
 * @param year 
 * @param month 
 * @param day 
 * @param hour 
 * @param minute 
 * @param addMinute 增加的分钟数，游戏的时间流逝以分钟数为准
 */
outModule.getNewData = (year, month, day, hour, minute, addMinute) => {
    let date = new Date(year, month - 1, day, hour, minute, 0, 0);
    let totalMilliseconds = date.getMilliseconds() + addMinute * 60 * 1000;
    let newDate = new Date(totalMilliseconds);
    return {
        year: newDate.getFullYear(),
        month: newDate.getMonth() + 1,
        day: newDate.getDate(),
        hour: newDate.getHours(),
        minute: newDate.getMinutes()
    }
};

module.exports = outModule;