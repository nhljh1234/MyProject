/**
 * 城市数据工厂
 */
var outModule = {};
var local = {};

//玩家进入建筑的处理函数
local.buildingUserUseTypeFunc = {};
//NPC进入建筑的处理函数
local.buildingUseTypeFunc = {};

//森林
/**
 * 森林处理函数
 */
local.buildingUserUseTypeFunc.forest = function (personData) {

};
/**
 * 池塘处理函数
 */
local.buildingUserUseTypeFunc.pool = function (personData) {

};
/**
 * 旅舍处理函数
 */
local.buildingUserUseTypeFunc.hotel = function (personData) {

};
/**
 * 商店处理函数
 */
local.buildingUserUseTypeFunc.shop = function (personData) {
    //会出售所有的商品
    personData.sellGood();
    g_LogTool.showLog(`${personData._name} 卖东西`);
};
/**
 * 医馆处理函数
 */
local.buildingUserUseTypeFunc.hospital = function (personData) {
    personData._power = g_GlobalData.MIN_POWER_NUM;
    g_LogTool.showLog(`${personData._name} 医馆治疗`);
};

/**
 * @param building 为建筑数据绑定相应的函数
 */
local.buildFunc = function (building) {
    //使用建筑
    /**
     * @param personData 使用者
     * @param isUser 是否是玩家使用
     */
    building.useBuilding = function (personData, isUser) {
        if (isUser) {
            return local.buildingUseTypeFunc[building._useType] ? local.buildingUseTypeFunc[building._useType](personData) : undefined;
        }
        return local.buildingUserUseTypeFunc[building._useType] ? local.buildingUserUseTypeFunc[building._useType](personData) : undefined;
    };
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
    //调用函数
    this._useType = jsonData.useType;

    local.buildFunc(this);
};

/**
 * @param buildingId
 * @param saveData 
 */
outModule.createOneBuilding = (buildingId, saveData) => {
    let data;
    if (saveData) {
        data = new local.createOneBuildingBySaveData(saveData);
    }
    data = new local.createOneBuilding(buildingId);
    g_VsCodeTool.getClassVsCodeStr(data, 'BuildingClass');
    return data;
};

module.exports = outModule;