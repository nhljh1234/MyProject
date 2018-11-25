(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Data/Global/GlobalData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a1a9aeIGeNAb4BA8gupUog7', 'GlobalData', __filename);
// Script/Data/Global/GlobalData.js

"use strict";

/**
 * 定义了所有的常量
 */
var outModule = {};
var local = {};

outModule.SEX_MAN = 1;
outModule.SEX_WOMAN = 2;

outModule.MAX_POWER = 100;

//背包最大数量
outModule.MAX_ITEM_NUM = 100;
//血量最小值，低于这个血量会自动去吃药或者医馆
outModule.MIN_HP_NUM = 0.4;
//自动战斗间隔
//单位分钟
outModule.BATTLE_TIMER_TIME = 10;

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
        //# sourceMappingURL=GlobalData.js.map
        