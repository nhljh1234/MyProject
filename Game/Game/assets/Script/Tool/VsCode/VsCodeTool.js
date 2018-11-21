/**
 * 这个用于生成一个VsCode代码提示的工具
 */
var outModule = {};
var local = {};

local.moduleObj = {};
local.classObj = {};
local.resultStr = '';

/**
 * 获取一个模块的注释
 * @param {Object} obj 对象
 * @param {String} moduleName 模块名
 */
outModule.getModuleVsCodeStr = (obj, moduleName) => {
    if (local.moduleObj[moduleName]) {
        return;
    }
    local.resultStr = local.resultStr + `declare module ${moduleName} {\n`;
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        switch (typeof obj[key]) {
            case 'function':
                local.resultStr = local.resultStr + `function ${key}();\n`;
                break;
            default:
                local.resultStr = local.resultStr + `var ${key};\n`;
                break;
        }
    }
    local.resultStr = local.resultStr + `}\n`;
    //表示这个类已经注释过了
    local.moduleObj[moduleName] = true;
};

/**
 * 获取一个对象的注释
 * @param {Object} obj 对象
 * @param {String} className 类名
 */
outModule.getClassVsCodeStr = function (obj, className) {
    if (local.classObj[className]) {
        return;
    }
    local.resultStr = local.resultStr + `declare class ${className} {\n`;
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        switch (typeof obj[key]) {
            case 'function':
                local.resultStr = local.resultStr + `${key}() : void;\n`;
                break;
            default:
                local.resultStr = local.resultStr + `${key} : any;\n`;
                break;
        }
    }
    local.resultStr = local.resultStr + `}\n`;
    //表示这个类已经注释过了
    local.classObj[className] = true;
};

/**
 * 获取最后的字符串
 */
outModule.getResultStr = function () {
    return local.resultStr;
};

module.exports = outModule;