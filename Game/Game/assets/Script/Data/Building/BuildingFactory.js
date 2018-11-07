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
 * @param buildingId 建筑id
 * 新建一个城市数据
 */
local.createOneBuilding = function (buildingId) {

    this._id = parseInt(buildingId);
    //配置数据
    var jsonData = g_JsonDataTool.getDataById('_table_building_building', buildingId);
    //在这个建筑的人
    this._personArr = [];
    //名称
    this._name = jsonData.name;

    local.buildFunc(this);
};

/**
 * @param buildingId
 * @param saveData 
 */
outModule.createOneBuilding = (buildingId, saveData) => {
    if (saveData) {
        return new local.createOneBuildingBySaveData(saveData);
    }
    return new local.createOneBuilding(buildingId);
};

module.exports = outModule;