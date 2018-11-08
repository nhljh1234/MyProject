/**
 * 全局游戏数据工厂
 */
var outModule = {};
var local = {};
var DateTool = require("DateTool");
var EventName = require("EventName");
var ForceFactory = require("ForceFactory");

/**
 * @param force 为割据数据绑定相应的函数
 */
local.buildFunc = function (game) {
    //时间更新函数
    game.timeUpdate = function (addMinutes) {
        var newDate = DateTool.getNewDate(game._nowTimeYear, game._nowTimeMonth, game._nowTimeDay, game._nowTimeHour, game._nowTimeMinute, addMinutes);
        var isDayChange = false;
        //这边先判断是否有时间段的变化
        if (game._nowTimeHour !== newDate.hour) {
            g_EventManager.send(EventName.TIME_UPDATE_HOUR);
        }
        if (game._nowTimeDay !== newDate.day) {
            g_EventManager.send(EventName.TIME_UPDATE_DAY);
            isDayChange = true;
        }
        if (game._nowTimeMonth !== newDate.month) {
            g_EventManager.send(EventName.TIME_UPDATE_MONTH);
        }
        if (DateTool.getSeason(game._nowTimeMonth) !== DateTool.getSeason(newDate.month)) {
            g_EventManager.send(EventName.TIME_UPDATE_SEASON);
        }
        if (game._nowTimeYear !== newDate.year) {
            g_EventManager.send(EventName.TIME_UPDATE_YEAR);
        }

        game._nowTimeYear = newDate.year;
        game._nowTimeMonth = newDate.month;
        game._nowTimeDay = newDate.day;
        game._nowTimeHour = newDate.hour;
        game._nowTimeMinute = newDate.minute;
        //cc.log(DateTool.getTimeStrWithEra(game._nowTimeYear, game._nowTimeMonth, game._nowTimeDay, game._nowTimeHour, game._nowTimeMinute));
        if (isDayChange) {
            //城市有每日更新的函数
            game._allCityArr.forEach(function (oneCityData) {
                oneCityData.dayUpdate();
            });
            //每个人也有有每日更新的函数
            game._allPersonArr.forEach(function (onePersonData) {
                onePersonData.dayUpdate();
            });
        }
        //人物更新函数
        game._allPersonArr.forEach(function (onePersonData) {
            onePersonData.timeUpdate(addMinutes);
        });
    };
    //game里面存储的是所有人物的列表，转换成以id为key的对象数据
    game.personDataBuild = function () {
        if (!game._allPersonData) {
            game._allPersonData = {};
        }
        game._allPersonArr.forEach(function (onePersonData) {
            game._allPersonData[onePersonData._id] = onePersonData;
        });
    };
    //根据id查找人物数据
    game.getPersonById = function (personId) {
        return this._allPersonArr.find((onePersonData) => {
            return onePersonData._id === personId;
        });
    };
    //根据id查找势力数据
    game.getForceById = function (forceId) {
        return this._allForceArr.find((oneForceData) => {
            return oneForceData._id === forceId;
        });
    };
    //根据id查找城市数据
    game.getCityById = function (cityId) {
        return this._allCityArr.find((oneCityData) => {
            return oneCityData._id === cityId;
        });
    };
};

/**
 * @param saveData 存储的数据
 */
local.createOneGameBySaveData = function (saveData) {

    local.buildFunc(this);
};

/**
 * 新建一个全局游戏数据
 */
local.createOneGame = function (month, day) {

    //全部城市
    this._allCityArr = [];
    //全部人物
    this._allPersonArr = [];
    //这边这个按照一个虚拟的年号来做
    this._nowTimeYear = 1;
    //这边设置可以选择出生年月日
    this._nowTimeMonth = month || 6;
    this._nowTimeDay = day || 1;
    this._nowTimeHour = 8;
    this._nowTimeMinute = 0;

    local.buildFunc(this);

    //割据势力的列表
    this._allForceArr = g_JsonDataTool.getTableByName('_table_force_force').array.map(function (oneForce) {
        return ForceFactory.createOneForce(oneForce.main_id, undefined);
    });
    //全部城市
    this._allForceArr.forEach(function (oneForceData) {
        oneForceData._cityArr.forEach(function (oneCityDay) {
            this._allCityArr.push(oneCityDay);
            this._allPersonArr = this._allPersonArr.concat(oneCityDay._personArr);
        }.bind(this));
    }.bind(this));
    this.personDataBuild();
};

/**
 * @param cityId
 * @param saveData 
 */
outModule.createOneGame = (saveData, month, day) => {
    if (saveData) {
        return new local.createOneGameBySaveData(saveData);
    }
    return new local.createOneGame(month, day);
};

module.exports = outModule;