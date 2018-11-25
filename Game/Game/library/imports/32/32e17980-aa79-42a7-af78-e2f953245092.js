"use strict";
cc._RF.push(module, '32e17mAqnlCp6944vlTJFCS', 'GameData');
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