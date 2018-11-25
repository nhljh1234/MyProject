"use strict";
cc._RF.push(module, 'cedf6XM2OZNB56ow4DkzIwq', 'GameGlobalManager');
// Script/Module/Manager/GameManager/GameGlobalManager.js

'use strict';

/*global module, require, cc, client */
/**
 * 这个模块下记录了一些全局性的东西，比如当前的时间
 */
var outModule = {};
var local = {};
var RandomNameTool = require('RandomNameTool');

//全局的游戏类
outModule.gameData;
//玩家数据
outModule.userRole;
//已用的最大人物id
outModule.maxPersonId = 1;
//承载定时器的component
local.component;

//标记时间，就是每帧世界运行的分钟数
var ONE_SECOND_GAME_MINUTE = 10;
//定时器间隔时间
//设定为可变的
outModule.TIMER_TIME = 1;
//是否暂停时间运行
local.pause = false;

/**
 * 时间更新函数
 */
local.minuteUpdate = function () {
    var addMinute = ONE_SECOND_GAME_MINUTE;
    if (outModule.gameData && outModule.gameData.timeUpdate) {
        outModule.gameData.timeUpdate(addMinute);
    }
};

/**
 * 定时器函数
 * local.pause作用于此
 */
local.timeUpdate = function () {
    var lastTime = void 0,
        nowTime = void 0;
    lastTime = new Date().getTime();
    if (!local.pause) {
        local.minuteUpdate();
    }
    nowTime = new Date().getTime();
    var useSeconds = (nowTime - lastTime) / 1000;
    //保证不超过1
    useSeconds = useSeconds > 1 ? 1 : useSeconds;
    //再次执行定时器
    local.component.unschedule(local.timeUpdate);
    local.component.schedule(local.timeUpdate, outModule.TIMER_TIME - useSeconds, 1);
};

//获取一个新的人物id
outModule.getNewPersonId = function () {
    outModule.maxPersonId++;
    return outModule.maxPersonId - 1;
};

/**
 * @param component 组件
 * @param gameData GameFactory生成的数据
 */
outModule.init = function (component, gameData) {
    local.component = component;
    outModule.gameData = gameData;
    //将配置中的名字都设置为不可随机的
    RandomNameTool.initAllNameArr(g_JsonDataTool.getTableByName('_table_person_person').array);
};

/**
 * 开始游戏中的定时器
 */
outModule.start = function () {
    if (local.component) {
        local.component.schedule(local.timeUpdate, outModule.TIMER_TIME, 1);
    }
};

/**
 * 停止游戏的定时器
 */
outModule.stop = function () {
    local.component.unschedule(local.timeUpdate);
};

/**
 * 暂停游戏
 */
outModule.pause = function () {
    local.pause = true;
};

module.exports = outModule;

cc._RF.pop();