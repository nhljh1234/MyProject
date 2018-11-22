export let SPRING: number = 1;
export let SUMMER: number = 2;
export let AUTUMN: number = 3;
export let WINTER: number = 4;

/**
 * @param year 判断一个年份是否是瑞年
 */
export function getIsLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0);
}

/**
 * @param year 
 * @param month 
 * @param day 
 * @param hour 
 * @param minute 
 * @param addMinute 增加的分钟数，游戏的时间流逝以分钟数为准
 * 时间是按1970年开始结算的，这边的year需要处理一下
 */
export function getNewDate(year: number, month: number, day: number, hour: number, minute: number, addMinute: number) {
    year = year + 1970;
    let date = new Date(year, month - 1, day, hour, minute, 0, 0);
    let totalMilliseconds = date.getTime() + addMinute * 60 * 1000;
    let newDate = new Date(totalMilliseconds);
    return {
        year: newDate.getFullYear() - 1970,
        month: newDate.getMonth() + 1,
        day: newDate.getDate(),
        hour: newDate.getHours(),
        minute: newDate.getMinutes()
    }
}

export function getTimeStrWithEra (year:number, month:number, day:number, hour:number, minute:number) {
    return `${HistoryGame.LanguageTool.getLanguageStr("era_name")}${year} ${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day} ${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`;
}

/**
 * 返回季节
 * @param month 月份数
 */
export function getSeason (month) {
    if (month >= 2 && month <= 4) {
        return SPRING;
    } else if (month >= 5 && month <= 7) {
        return SUMMER;
    } else if (month >= 8 && month <= 10) {
        return AUTUMN;
    }
    return WINTER;
}