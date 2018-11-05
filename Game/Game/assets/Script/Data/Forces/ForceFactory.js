/**
 * 割据势力数据工厂
 */
var outModule = {};
var local = {};

/**
 * @param force 为割据数据绑定相应的函数
 */
local.buildFunc = function (force) {

};

/**
 * @param saveData 存储的数据
 */
local.createOneForceBySaveData = function (saveData) {

    local.buildFunc(this);
};

/**
 * @param forceId 割据势力id
 * 新建一个城市数据
 */
local.createOneForce = function (forceId) {

    local.buildFunc(this);
};

/**
 * @param cityId
 * @param saveData 
 */
outModule.createOneForce = (forceId, saveData) => {
    if (saveData) {
        return new local.createOneForceBySaveData(saveData);
    }
    return new local.createOneForce(forceId);
};

module.exports = outModule;