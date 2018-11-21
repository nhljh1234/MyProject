/**
 * 装备工厂
 */
var outModule = {};
var local = {};

/**
 * @param sellGood 已经加好数据的装备，再增加一些操作函数
 */
local.buildFunc = function (sellGood) {
    /**
     * 使用物品
     */
    this.use = () => {

    };

    /**
     * 出售物品
     */
    this.sell = () => {

    };
};

/**
 * 新建一个装备
 */
local.createOneEquipment = function (equipmentId) {

    //新增函数
    local.buildFunc(this);
};

/**
 * @param saveData 存储的数据
 */
local.createOneEquipmentSaveData = function (saveData) {

    //新增函数
    local.buildFunc(this);
};

/**
 * @param equipmentId 装备id
 * @param saveData 存储的数据
 */
outModule.createOneSellGood = (equipmentId, saveData) => {
    let data;
    if (saveData) {
        data = new local.createOneSellGoodBySaveData(saveData);
    }
    data = new local.createOneSellGood(equipmentId);
    g_VsCodeTool.getClassVsCodeStr(data, 'EquipmentClass');
    return data;
};

module.exports = outModule;