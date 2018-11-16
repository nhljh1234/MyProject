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
    city.getSaveData = function () {
        return {
            id: city._id,
            peopleNum: city._peopleNum,
            soldierNum: city._soldierNum,
            horseNum: city._horseNum,
            commissariatNum: city._commissariatNum,
            moneyNum: city._moneyNum,
            cityDefNum: city._cityDefNum,
            personArr: city._personArr.map(function (onePersonData) {
                return onePersonData._id;
            })
        }
    };
};

/**
 * @param saveData 存储的数据
 */
local.createOneCityBySaveData = function (saveData) {
    //城市id
    this._id = parseInt(saveData.id);
    //配置数据
    var jsonData = g_JsonDataTool.getDataById('_table_city_city', this._id);
    //居民数量
    this._peopleNum = saveData.peopleNum;
    //军队数量
    this._soldierNum = saveData.soldierNum;
    //马匹数量
    this._horseNum = saveData.horseNum;
    //粮食数量
    //一个人一天需要消耗1的粮食
    this._commissariatNum = saveData.commissariatNum;
    //金币数量
    this._moneyNum = saveData.moneyNum;
    //城市防御
    this._cityDefNum = saveData.cityDefNum;
    //城市名字
    this._name = jsonData.name;
    //城市位置
    //用两个元素表示，类似于经纬度
    this._cityPos = jsonData.cityPos.split(',').map(function (num) {
        return parseInt(num);
    });
    this._cityPos = g_GameTool.buildPos(this._cityPos[0], this._cityPos[1]);

    local.buildFunc(this);

    //人物列表
    //表示家在这个城市的人
    this._personArr = saveData.personArr.map((personId) => {
        return g_GameGlobalManager.gameData.getPersonById(personId);
    });
    //建筑列表
    this._buildingArr = ('' + jsonData.building).split(',').map((buildingId) => {
        return BuildingFactory.createOneBuilding(buildingId, undefined);
    });
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
    this._cityPos = jsonData.cityPos.split(',').map(function (num) {
        return parseInt(num);
    });
    this._cityPos = g_GameTool.buildPos(this._cityPos[0], this._cityPos[1]);

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