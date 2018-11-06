/**
 * 城市数据工厂
 */
var outModule = {};
var local = {};

/**
 * @param city 为城市数据绑定相应的函数
 */
local.buildFunc = function (city) {
    //根据建筑id获取一个建筑
    city.getBuildingById = function (buildingId) {
        return this._buildingArr.find((oneBuildingData) => {
            return oneBuildingData._id === buildingId;
        });
    };
};

/**
 * @param saveData 存储的数据
 */
local.createOneCityBySaveData = function (saveData) {

    local.buildFunc(this);
};

/**
 * @param cityId 城市id
 * 新建一个城市数据
 */
local.createOneCity = function (cityId) {

    //人物列表
    this._personArr = [];
    //建筑列表
    this._buildingArr = [];
    //居民数量
    this._peopleNum;
    //军队数量
    this._soldierNum;
    //马匹数量
    this._horseNum;
    //军粮数量
    this._commissariatNum;
    //金币数量
    this._moneyNum;
    //城市防御
    this._cityDefNum;
    //连通的城市列表
    this._linkCityArr = [];
    //城市名字
    this._cityName;
    //城市位置
    //用两个元素表示，类似于经纬度
    this._cityPos = [];

    local.buildFunc(this);
};

/**
 * @param cityId
 * @param saveData 
 */
outModule.createOneCity = (cityId, saveData) => {
    if (saveData) {
        return new local.createOneCityBySaveData(saveData);
    }
    return new local.createOneCity(cityId);
};

module.exports = outModule;