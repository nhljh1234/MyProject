(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Module/GameTool/GameTool.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a974cx0dAJFWK+C8dn0FZFo', 'GameTool', __filename);
// Script/Module/GameTool/GameTool.js

"use strict";

/**
 * 这边封装了很多游戏内用的函数
 */
var outModule = {};
var local = {};

/**
 * 判断两个二位数组的坐标是否相同
 * @param pos_1
 * @param pos_2
 */
outModule.judgeEqualPos = function (pos_1, pos_2) {
    if (!pos_1 || !pos_2) {
        return false;
    }
    return pos_1.x === pos_2.x && pos_1.y === pos_2.y;
};

/**
 * 新建一个二维坐标
 */
outModule.buildPos = function (x, y) {
    return {
        x: x,
        y: y
    };
};

/**
 * 获取一个最近的拥有指定id建筑的城市数据
 * @param buildingId 建筑id
 * @param nowCityId 出发城市id
 * @param nowCityData 出发城市的数据
 * @param personData 
 */
outModule.getNearBuildingCity = function (buildingId, nowCityId, nowCityData, personData) {
    var nowMapPos = void 0;
    if (nowCityId === -1) {
        nowMapPos = personData._nowMapPos;
    } else {
        nowCityData = nowCityData || g_GameGlobalManager.gameData.getCityById(nowCityId);
        if (nowCityData.getBuildingById(buildingId)) {
            return nowCityData;
        }
        nowMapPos = nowCityData._cityPos;
    }
    if (buildingId === -1) {
        return g_GameGlobalManager.gameData.getCityById(personData._homePos);
    }
    var hasBuildingCityArr = g_GameGlobalManager.gameData._allCityArr.filter(function (oneCityData) {
        return oneCityData.getBuildingById(buildingId);
    });
    var i = void 0,
        len = void 0,
        minDis = -1,
        dis = void 0,
        returnCityData = void 0;
    for (i = 0, len = hasBuildingCityArr.length; i < len; i++) {
        var cityData = hasBuildingCityArr[i];
        dis = (cityData._cityPos.x - nowMapPos.x) * (cityData._cityPos.x - nowMapPos.x) + (cityData._cityPos.y - nowMapPos.y) * (cityData._cityPos.y - nowMapPos.y);
        if (minDis === -1 || minDis > dis) {
            minDis = dis;
            returnCityData = cityData;
        }
    }
    return returnCityData;
};

/**
 * 获取两个城市之间的距离
 * @param cityId_1
 * @param cityId_2
 */
outModule.getCityDis = function (cityId_1, cityId_2) {
    var cityData_1 = void 0,
        cityData_2 = void 0;
    cityData_1 = g_GameGlobalManager.gameData.getCityById(cityId_1);
    cityData_2 = g_GameGlobalManager.gameData.getCityById(cityId_2);
    return Math.sqrt((cityData_1._cityPos.x - cityData_2._cityPos.x) * (cityData_1._cityPos.x - cityData_2._cityPos.x) + (cityData_1._cityPos.y - cityData_2._cityPos.y) * (cityData_1._cityPos.y - cityData_2._cityPos.y));
};

module.exports = outModule;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GameTool.js.map
        