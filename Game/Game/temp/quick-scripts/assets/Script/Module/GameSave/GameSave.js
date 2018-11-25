(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Module/GameSave/GameSave.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dd857SZBbdFL617J+BFitLw', 'GameSave', __filename);
// Script/Module/GameSave/GameSave.js

'use strict';

var outModule = {};
var local = {};

//记住，有一个是自动的存储位置
//提供给玩家的存储位置是10个
outModule.MAX_SAVE_NUM = 10;

/**
 * 获取游戏存储的对象
 * @param index 存储的index
 */
local.getSaveData = function (index) {
    var jsonStr = index ? cc.sys.localStorage.getItem('game_save_' + index) : cc.sys.localStorage.getItem('auto_save');
    return JSON.parse(jsonStr);
};

/**
 * 保存游戏
 * @param index 存储的index，不传表示自动存储
 */
local.saveGameData = function (index, jsonData) {
    //存成一个json数据
    if (index) {
        if (index > outModule.MAX_SAVE_NUM) {
            return;
        }
        cc.sys.localStorage.setItem('game_save_' + index, JSON.stringify(jsonData));
    } else {
        cc.sys.localStorage.setItem('auto_save', JSON.stringify(jsonData));
    }
};

/**
 * 储存游戏数据
 */
outModule.saveGame = function () {
    return;
    var gameData = g_GameGlobalManager.gameData;
    local.saveGameData(undefined, gameData.getSaveJsonData());
};

/**
 * 使用存档
 * 会返回一个是否存在存档
 */
outModule.useGameSaveData = function () {
    var saveData = local.getSaveData();
    if (!saveData) {
        return false;
    }
    g_GameGlobalManager.gameData = require('GameFactory').createOneGame(saveData);
    g_GameGlobalManager.gameData.setGameData(saveData);
    return true;
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
        //# sourceMappingURL=GameSave.js.map
        