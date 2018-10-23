/**
 * 消息模块
 */
var outModule = {};
var local = {};

local.eventSaveObj = {};

//查找一个回调函数所处的index
local.findFuncIndex = function (eventName, func) {
    if (!local.eventSaveObj[eventName]) {
        return undefined;
    }
    let i, len;
    for (i = 0, len = local.eventSaveObj[eventName].length; i < len; i++) {
        if (local.eventSaveObj[eventName][i] === func) {
            return i;
        }
    }
    return undefined;
};

//同一个函数在一个事件下只能监听一次
outModule.on = function (eventName, func) {
    if (!local.eventSaveObj[eventName]) {
        local.eventSaveObj[eventName] = [];
    }
    //判断是否添加了
    if (local.findFuncIndex(eventName, func)) {
        return;
    }
    local.eventSaveObj[eventName].push(func);
};

outModule.off = function (eventName, func) {
    if (!local.eventSaveObj[eventName]) {
        return;
    }
    let index = local.findFuncIndex(eventName, func);
    if (index !== undefined) {
        local.eventSaveObj[eventName].splice(index, 1);
    }
};

//发送消息
outModule.send = function () {
    let eventName = arguments[0];
    if (!local.eventSaveObj[eventName]) {
        return;
    }
    //组织参数
    let argArr = [];
    let i, len;
    for (i = 1, len = arguments.length; i < len; i++) {
        argArr.push(arguments[i]);
    }
    local.eventSaveObj[eventName].forEach(function (oneFunc) {
        oneFunc.apply(this, argArr);
    });
};

module.exports = outModule;