(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Data/Item/EquipmentFactory.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c1454uu63JMW6ZYLxUV9gDU', 'EquipmentFactory', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=EquipmentFactory.js.map
        