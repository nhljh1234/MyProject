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
 * 新建一个人物
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
    if (saveData) {
        return new local.createOneSellGoodBySaveData(saveData);
    }
    return new local.createOneSellGood(equipmentId);
};

module.exports = outModule;