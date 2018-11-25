(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Module/GameData/GameData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '32e17mAqnlCp6944vlTJFCS', 'GameData', __filename);
// Script/Module/GameData/GameData.js

"use strict";

/*global module, require, cc, client */
/**
 * @desc 存储一些游戏的临时变量
 * @author Administrator
 */
var outModule = {};
var local = {};

outModule.setData = function (key, value) {
    local[key] = value;
};

outModule.getData = function (key) {
    return local[key];
};

outModule.removeData = function (key) {
    local[key] = undefined;
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
        //# sourceMappingURL=GameData.js.map
        