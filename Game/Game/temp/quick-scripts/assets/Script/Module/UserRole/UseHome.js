(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Module/UserRole/UseHome.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a12b5QPXUhGkpy316htCydu', 'UseHome', __filename);
// Script/Module/UserRole/UseHome.js

"use strict";

var outModule = {};

/**
 * 使用自宅休息
 * @param restDayNum 休息时间 不传表示休息到回复蛮体力和hp
 */
outModule.useHomeRest = function (restDayNum) {
    var userRole = g_GameGlobalManager.userRole;
    if (userRole._nowHp === userRole._maxHp && userRole._power === g_GlobalData.MAX_POWER) {
        //TODO 这边要表示一下不能休息了
        return;
    }
    //设计的模式都是增加一个回调，绑定一个单独数据
    userRole._useHomeRest_data = {};
    userRole._useHomeRest_data.restDayNum = restDayNum;
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
        //# sourceMappingURL=UseHome.js.map
        