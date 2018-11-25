(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Module/Event/EventName.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c79eenw0tBOEJ8MVdftB2Oi', 'EventName', __filename);
// Script/Module/Event/EventName.js

'use strict';

/**
 * 记录全局的事件名称，方便查阅
 */
var outModule = {};

outModule.WORLD_TIME_CHANGE = 'WORLD_TIME_CHANGE';

//时间变化消息
//小时数变化
outModule.TIME_UPDATE_HOUR = 'TIME_UPDATE_HOUR';
//天变化
outModule.TIME_UPDATE_DAY = 'TIME_UPDATE_DAY';
//月变化
outModule.TIME_UPDATE_MONTH = 'TIME_UPDATE_MONTH';
//季节变化
outModule.TIME_UPDATE_SEASON = 'TIME_UPDATE_SEASON';
//年变化
outModule.TIME_UPDATE_YEAR = 'TIME_UPDATE_YEAR';

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
        //# sourceMappingURL=EventName.js.map
        