(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Tool/System/EventManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '50523szqOZON7QXLS/AWGmX', 'EventManager', __filename);
// Script/Tool/System/EventManager.js

"use strict";

/**
 * 消息模块
 */
var outModule = {};
var local = {};

//存储事件数据
local.eventSaveObj = {};

/**
 * 查找一个回调函数所处的index
 * @param {String} eventName 
 * @param {Function} func 
 */
local.findFuncIndex = function (eventName, func) {
    if (!local.eventSaveObj[eventName]) {
        return undefined;
    }
    var i = void 0,
        len = void 0;
    for (i = 0, len = local.eventSaveObj[eventName].length; i < len; i++) {
        if (local.eventSaveObj[eventName][i].func === func) {
            return i;
        }
    }
    return undefined;
};

/**
 * 同一个函数在一个事件下只能监听一次
 * @param {String} eventName 
 * @param {Function} func 
 * @param {Object} thisObj this，记录了当前调用的作用域
 */
outModule.on = function (eventName, func, thisObj) {
    if (!local.eventSaveObj[eventName]) {
        local.eventSaveObj[eventName] = [];
    }
    //判断是否添加了
    if (local.findFuncIndex(eventName, func)) {
        return;
    }
    local.eventSaveObj[eventName].push({
        func: func,
        thisObj: thisObj
    });
};

/**
 * 取消监听
 * @param {String} eventName 事件名称
 * @param {Function} func 函数指针，可以通过函数指针判定一个函数是否相等
 * 默认一个事件下的一个函数只能被注册一次
 */
outModule.off = function (eventName, func) {
    if (!local.eventSaveObj[eventName]) {
        return;
    }
    var index = local.findFuncIndex(eventName, func);
    if (index !== undefined) {
        local.eventSaveObj[eventName].splice(index, 1);
    }
};

//发送消息
outModule.send = function () {
    var eventName = arguments[0];
    if (!local.eventSaveObj[eventName]) {
        return;
    }
    //组织参数
    var argArr = [];
    var i = void 0,
        len = void 0;
    for (i = 1, len = arguments.length; i < len; i++) {
        argArr.push(arguments[i]);
    }
    local.eventSaveObj[eventName].forEach(function (oneFuncObj) {
        //本地的时候需要调用try
        if (cc.sys.isNative) {
            try {
                oneFuncObj.func.apply(oneFuncObj.thisObj, argArr);
            } catch (e) {}
        } else {
            oneFuncObj.func.apply(oneFuncObj.thisObj, argArr);
        }
    });
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
        //# sourceMappingURL=EventManager.js.map
        