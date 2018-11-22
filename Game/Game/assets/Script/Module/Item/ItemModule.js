var outModule = {};
var local = {};

/**
 * 判断一个物品是否有某个功能
 * @param {Number} itemId
 * @param {String} functionName
 */
outModule.judgeHaveFunctionByName = function (itemId, functionName) {
    let itemData = g_JsonDataTool.getDataById('_table_item_sellGood', itemId);
    if (itemData && itemData.function && itemData.function.length > 0) {
        let funcIdArr = ('' + itemData.function).split(',');
        return funcIdArr.find(function (functionId) {
            let funcData = g_JsonDataTool.getDataById('_table_item_itemFunction', functionId);
            return funcData && funcData.type === functionName;
        });
    }
    return false;
};

/**
 * 获取指定物品物品功能的参数
 * @param {Number} itemId
 * @param {String} functionName
 */
outModule.getItemFunctionNum = function (itemId, functionName) {
    let itemData = g_JsonDataTool.getDataById('_table_item_sellGood', itemId);
    if (itemData && itemData.function && itemData.function.length > 0) {
        let funcIdArr = ('' + itemData.function).split(',');
        let funcNumArr = ('' + itemData.functionNum).split(',');
        let i;
        for (i = 0; i < funcIdArr.length; i++) {
            let funcData = g_JsonDataTool.getDataById('_table_item_itemFunction', funcIdArr[i]);
            if (funcData && funcData.type === functionName) {
                return funcNumArr[i];
            }
        }
    }
    return undefined;
};

/**
 * 获取治疗自身的时候使用多少个指定的物品
 * @param {BasePersonClass} personData
 * @param {Number} itemId
 */
outModule.getTreatItemUseNum = function (personData, itemId) {
    //获取治疗量
    let treatNum = outModule.getItemFunctionNum(itemId, g_GlobalData.ITEM_FUNCTION_TYPE_TREAT);
    let needTreatNum = g_GlobalData.MIN_POWER_NUM - personData._power;
    if (!treatNum) {
        return 0;
    }
    return Math.min(Math.ceil(needTreatNum / treatNum), personData._itemObj[itemId] || 0);
};

/**
 * 使用物品，默认使用1个
 * @param {BasePersonClass} personData
 * @param {Number} itemId
 * @param {Number} useNum
 */
outModule.useItem = function (personData, itemId, useNum = 1) {
    personData
};

module.exports = outModule;