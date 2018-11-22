/*global module, require, cc, client */
/**
 * @desc 存储一些游戏的临时变量
 * @author Administrator
 */
var outModule = {};
var local = {};

outModule.setData = (key, value) => {
    local[key] = value;
};

outModule.getData = (key) => {
    return local[key];
};

outModule.removeData = (key) => {
    local[key] = undefined;
};

module.exports = outModule;
