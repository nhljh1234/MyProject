/**
 * 城市数据工厂
 */
var outModule = {};
var local = {};

/**
 * @param building 为建筑数据绑定相应的函数
 */
local.buildFunc = function (building) {

};

/**
 * @param saveData 存储的数据
 */
local.createOneBuildingBySaveData = function (saveData) {

    local.buildFunc(this);
};

/**
 * @param cityId 城市id
 * 新建一个城市数据
 */
local.createOneBuilding = function (buildingId) {


    local.buildFunc(this);
};

/**
 * @param cityId
 * @param saveData 
 */
outModule.createOneCity = (buildingId, saveData) => {
    if (saveData) {
        return new local.createOneBuildingBySaveData(saveData);
    }
    return new local.createOneBuilding(buildingId);
};

module.exports = outModule;