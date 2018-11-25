"use strict";
cc._RF.push(module, '0d511I/lHNMCaWtCsZoR7i7', 'GameFactory');
// Script/Data/Game/GameFactory.js

"use strict";

/**
 * 全局游戏数据工厂
 */
var outModule = {};
var local = {};
var DateTool = require("DateTool");
var EventName = require("EventName");
var ForceFactory = require("ForceFactory");
var CityFactory = require("CityFactory");
var PersonFactory = require("PersonFactory");
var GameSave = require("GameSave");

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
            console.log('game save');
            GameSave.saveGame();
        }
        //人物更新函数
        game._allPersonArr.forEach(function (onePersonData) {
            onePersonData.timeUpdate(addMinutes);
        });
        //战斗定时器
        g_BattleManager.timeUpdate(addMinutes);
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
        return game._allPersonArr.find(function (onePersonData) {
            return onePersonData._id === personId;
        });
    };
    //根据id查找势力数据
    game.getForceById = function (forceId) {
        return game._allForceArr.find(function (oneForceData) {
            return oneForceData._id === forceId;
        });
    };
    //根据id查找城市数据
    game.getCityById = function (cityId) {
        return game._allCityArr.find(function (oneCityData) {
            return oneCityData._id === cityId;
        });
    };
    //获取游戏存储的数据
    game.getSaveJsonData = function () {
        var jsonData = game.getSaveData();
        return jsonData;
    };
    //获取
    game.getSaveData = function () {
        return {
            year: game._nowTimeYear,
            month: game._nowTimeMonth,
            day: game._nowTimeDay,
            hour: game._nowTimeHour,
            minute: game._nowTimeMinute,
            maxPersonId: g_GameGlobalManager.maxPersonId,
            forceArr: game._allForceArr.map(function (oneForceData) {
                return oneForceData.getSaveData();
            }),
            cityArr: game._allCityArr.map(function (oneCityData) {
                return oneCityData.getSaveData();
            }),
            personArr: game._allPersonArr.map(function (onePersonData) {
                return onePersonData.getSaveData();
            })
        };
    };
    //设置数据
    game.setGameData = function (saveData) {
        //初始化的时候倒置，大的类可能会引用小的类
        //全部人物
        game._allPersonArr = saveData.personArr.map(function (data) {
            return PersonFactory.createOneBasePerson(undefined, data, undefined);
        });
        //全部城市
        game._allCityArr = saveData.cityArr.map(function (data) {
            return CityFactory.createOneCity(undefined, data);
        });
        //全部割据势力
        game._allForceArr = saveData.forceArr.map(function (data) {
            return ForceFactory.createOneForce(undefined, data);
        });
        //根据割据势力初始化城市和npc
        game.personDataBuild();
    };
};

/**
 * @param saveData 存储的数据
 */
local.createOneGameBySaveData = function (saveData) {
    //这边这个按照一个虚拟的年号来做
    this._nowTimeYear = saveData.year;
    //这边设置可以选择出生年月日
    this._nowTimeMonth = saveData.month;
    this._nowTimeDay = saveData.day;
    this._nowTimeHour = saveData.hour;
    this._nowTimeMinute = saveData.minute;

    g_GameGlobalManager.maxPersonId = saveData.maxPersonId;

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
    //根据割据势力初始化城市和npc
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
outModule.createOneGame = function (saveData, month, day) {
    if (saveData) {
        return new local.createOneGameBySaveData(saveData);
    }
    return new local.createOneGame(month, day);
};

module.exports = outModule;

cc._RF.pop();