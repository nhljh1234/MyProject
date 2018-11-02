/**
 * 这个模块下记录了一些全局性的东西，比如当前的时间
 */
var outModule = {};
var local = {};

//年
outModule.nowTimeYear = 0;
//月
outModule.nowTimeMonth = 0;
//日
outModule.nowTimeDay = 0;
//小时
outModule.nowTimeHour = 0;
//分钟
outModule.nowTimeMinute = 0;

//选择的剧本Id
outModule.scriptId;

outModule.allForce = [];
outModule.allCity = [];
outModule.allPerson = [];

/**
 * 数据初始化
 * @param {Object} saveData 存储的数据
 * @param {Object} scriptData 剧本数据，没有存储的数据就认为是新开的局，需要使用剧本数据
 */
outModule.init = (saveData, scriptData) => {
    if (saveData) {
        outModule.nowTimeYear = saveData.nowTimeYear;
        outModule.nowTimeMonth = saveData.nowTimeMonth;
        outModule.nowTimeDay = saveData.nowTimeDay;
        outModule.nowTimeHour = saveData.nowTimeHour;
        outModule.nowTimeMinute = saveData.nowTimeMinute;
        return;
    }
    outModule.nowTimeYear = scriptData.year;
    outModule.nowTimeMonth = scriptData.month;
    outModule.nowTimeDay = scriptData.day;
    outModule.nowTimeHour = scriptData.hour;
    outModule.nowTimeMinute = scriptData.minute;
};

module.exports = outModule;