"use strict";
cc._RF.push(module, '84d3cCdlR1B2Yfcv49/86/N', 'MapRandomEvent');
// Script/Module/Event/MapRandomEvent.js

'use strict';

/**
 * 大地图随机事件
 */
var outModule = {};
var local = {};

local.eventFuncObj = {};

local.eventFuncObj.battle = function (personData, dataArr) {
    g_BattleManager.startBattle(personData, require('PersonFactory').createOneBasePerson(dataArr[0], undefined, undefined));
};

//判断会不会有随机事件
outModule.judgeMapRandomEvent = function (personData) {
    if (cc.random0To1() >= g_JsonDataTool.getDataById('_table_Game_gameParameter', 1).num / 100) {
        return;
    }
    var mapRandomEventData = g_JsonDataTool.getTableByName('_table_event_mapRandomEvent');
    var mapRandomEventArr = mapRandomEventData ? mapRandomEventData.array : [];
    var i = void 0,
        len = void 0;
    for (i = 0, len = mapRandomEventArr.length; i < len; i++) {
        var randomNum = mapRandomEventArr[i].randomNum / 100;
        if (cc.random0To1() < randomNum) {
            //触发
            if (local.eventFuncObj[mapRandomEventArr[i].type]) {
                local.eventFuncObj[mapRandomEventArr[i].type](personData, ('' + mapRandomEventArr[i].num).split(','));
                personData.mapRandomEventCb();
                g_LogTool.showLog(personData._name + ' meet event ' + mapRandomEventArr[i].name);
                return true;
            }
        }
    }
    return false;
};

module.exports = outModule;

cc._RF.pop();