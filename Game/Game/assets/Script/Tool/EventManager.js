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
    let i, len;
    for (i = 0, len = local.eventSaveObj[eventName].length; i < len; i++) {
        if (local.eventSaveObj[eventName][i].func === func) {
            return i;
        }
    }
    return undefined;
};

//函数名需要在这边注册，方便查阅
outModule.SELECT_HERO_FINISH = "SELECT_HERO_FINISH";//英雄选择完成

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
    local.eventSaveObj[eventName].forEach(function (oneFuncObj) {
        //本地的时候需要调用try
        if (cc.sys.isNative) {
            try {
                oneFuncObj.func.apply(oneFuncObj.thisObj, argArr);
            } catch (e) {

            }
        } else {
            oneFuncObj.func.apply(oneFuncObj.thisObj, argArr);
        }
    });
};

module.exports = outModule;