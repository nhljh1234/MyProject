"use strict";
cc._RF.push(module, 'c1454uu63JMW6ZYLxUV9gDU', 'EquipmentFactory');
// Script/Data/Item/EquipmentFactory.js

"use strict";

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
    this.use = function () {};

    /**
     * 出售物品
     */
    this.sell = function () {};
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
outModule.createOneSellGood = function (equipmentId, saveData) {
    if (saveData) {
        return new local.createOneSellGoodBySaveData(saveData);
    }
    return new local.createOneSellGood(equipmentId);
};

module.exports = outModule;

cc._RF.pop();