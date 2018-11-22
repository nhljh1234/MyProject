//存储事件数据
interface EventObj {
    func: Function,
    thisObj: any
}
let eventSaveObj: { [eventName: string]: EventObj[] } = {};

/**
 * 查找一个回调函数所处的index
 * @param {String} eventName 
 * @param {Function} func 
 */
function findFuncIndex(eventName: string, func: Function) {
    if (eventSaveObj[eventName]) {
        return undefined;
    }
    let i, len;
    for (i = 0, len = eventSaveObj[eventName].length; i < len; i++) {
        if (eventSaveObj[eventName][i].func === func) {
            return i;
        }
    }
    return undefined;
}

/**
 * 同一个函数在一个事件下只能监听一次
 * @param {String} eventName 
 * @param {Function} func 
 * @param {Object} thisObj this，记录了当前调用的作用域
 */
export function on(eventName: string, func: Function, thisObj: any) {
    if (!eventSaveObj[eventName]) {
        eventSaveObj[eventName] = [];
    }
    //判断是否添加了
    if (findFuncIndex(eventName, func)) {
        return;
    }
    eventSaveObj[eventName].push({
        func: func,
        thisObj: thisObj
    });
}

/**
 * 取消监听
 * @param {String} eventName 事件名称
 * @param {Function} func 函数指针，可以通过函数指针判定一个函数是否相等
 * 默认一个事件下的一个函数只能被注册一次
 */
export function off(eventName: string, func: Function) {
    if (!eventSaveObj[eventName]) {
        return;
    }
    let index = findFuncIndex(eventName, func);
    if (index !== undefined) {
        eventSaveObj[eventName].splice(index, 1);
    }
}

//发送消息
export function send(eventName: string, ...args: any[]) {
    if (!eventSaveObj[eventName]) {
        return;
    }
    //组织参数
    let argArr: any[] = [];
    let i: number, len: number;
    for (i = 0, len = args.length; i < len; i++) {
        argArr.push(arguments[i]);
    }
    eventSaveObj[eventName].forEach(function (oneFuncObj) {
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
}