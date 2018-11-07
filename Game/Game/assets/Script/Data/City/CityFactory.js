/**
 * 城市数据工厂
 */
var outModule = {};
var local = {};
var BuildingFactory = require('BuildingFactory');
var PersonFactory = require('PersonFactory');
var GlobalData = require('GlobalData');

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
    //在这个城市新建一个随机人物
    city.createOneRandomPerson = function (sex, cityId) {
        sex = sex ? sex : (cc.random0To1() < 0.5 ? GlobalData.SEX_MAN : GlobalData.SEX_WOMAN);
        return PersonFactory.createRandomPerson(sex, cityId);
    };
    //新的一天
    city.dayUpdate = function () {
        
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
 * 城市内有一个特殊的情况就是人会处于自宅，这个自宅标记为-1
 */
local.createOneCity = function (cityId) {
    //城市id
    this._id = parseInt(cityId);
    //配置数据
    var jsonData = g_JsonDataTool.getDataById('_table_city_city', cityId);
    //居民数量
    this._peopleNum = jsonData.peopleNum;
    //军队数量
    this._soldierNum = jsonData.soldierNum;
    //马匹数量
    this._horseNum = jsonData.horseNum;
    //粮食数量
    //一个人一天需要消耗1的粮食
    this._commissariatNum = jsonData.commissariatNum;
    //金币数量
    this._moneyNum = jsonData.moneyNum;
    //城市防御
    this._cityDefNum = jsonData.cityDef;
    //城市名字
    this._name = jsonData.name;
    //城市位置
    //用两个元素表示，类似于经纬度
    this._cityPos = jsonData.cityPos.split(',');

    local.buildFunc(this);

    //人物列表
    this._personArr = ('' + jsonData.npc).split(',').map((personId) => {
        return PersonFactory.createOneBasePerson(personId, undefined, this._id);
    });
    //随机人物
    for (let i = 0; i < jsonData.randomNpcNum; i++) {
        this._personArr.push(this.createOneRandomPerson(undefined, this._id));
    }
    //建筑列表
    this._buildingArr = ('' + jsonData.building).split(',').map((buildingId) => {
        return BuildingFactory.createOneBuilding(buildingId, undefined);
    });
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