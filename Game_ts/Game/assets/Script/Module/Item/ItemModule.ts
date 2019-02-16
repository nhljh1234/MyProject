import { Person } from "../../Data/Person/PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { BasePerson } from "../../Data/Person/BasePersonFactory";
import { actionSaveData } from "../../Data/Action/ActionFactory";

/**
 * 判断一个物品是否有某个功能
 * @param {Number} itemId
 * @param {String} functionName
 */
export function judgeHaveFunctionByName(itemId: number, functionName: string) {
    let itemData = MyGame.JsonDataTool.getDataById('_table_item_sellGood', itemId);
    if (itemData && itemData.function && itemData.function.length > 0) {
        let funcIdArr = ('' + itemData.function).split(',');
        let i: number;
        for (i = 0; i < funcIdArr.length; i++) {
            let funcData = MyGame.JsonDataTool.getDataById('_table_item_itemFunction', funcIdArr[i]);
            if (funcData && funcData.type === functionName) {
                return true;
            }
        }
    }
    return false;
};

/**
 * 获取指定物品物品功能的参数
 * @param {Number} itemId
 * @param {String} functionName
 */
export function getItemFunctionNum(itemId: number, functionName: string): any {
    let itemData = MyGame.JsonDataTool.getDataById('_table_item_sellGood', itemId);
    if (itemData && itemData.function && itemData.function.length > 0) {
        let funcIdArr = ('' + itemData.function).split(',');
        let funcNumArr = ('' + itemData.functionNum).split(',');
        let i: number;
        for (i = 0; i < funcIdArr.length; i++) {
            let funcData = MyGame.JsonDataTool.getDataById('_table_item_itemFunction', funcIdArr[i]);
            if (funcData && funcData.type === functionName) {
                return funcNumArr[i];
            }
        }
    }
    return undefined;
};

/**
 * 获取指定物品功能名的数组
 * @param itemId 
 */
export function getItemFunctionNameArr(itemId: number): string[] {
    let returnArr: string[] = [];
    let itemData = MyGame.JsonDataTool.getDataById('_table_item_sellGood', itemId);
    if (itemData && itemData.function && itemData.function.length > 0) {
        let funcIdArr = ('' + itemData.function).split(',');
        let i: number;
        for (i = 0; i < funcIdArr.length; i++) {
            let funcData = MyGame.JsonDataTool.getDataById('_table_item_itemFunction', funcIdArr[i]);
            if (funcData) {
                returnArr.push(funcData.type);
            }
        }
    }
    return returnArr;
};

/**
 * 获取治疗自身的时候使用多少个指定的物品
 * @param {Person} personData
 * @param {Number} itemId
 */
export function getRestItemUseNum(personData: Person, itemId: number): number {
    //获取治疗量
    let restNumStr = getItemFunctionNum(itemId, MyGame.ITEM_FUNCTION_TYPE_REST);
    let restNum = parseInt(restNumStr);
    let needNum = MyGame.MIN_POWER_NUM - personData.power;
    if (!restNum) {
        return 0;
    }
    return Math.min(Math.ceil(needNum / restNum), personData.itemObj[itemId] || 0);
};

let useItemFuncObj: { [key: string]: Function } = {};
//治疗
useItemFuncObj.rest = function (personData: Person, itemId: number, funcName: string) {
    let funcNum = getItemFunctionNum(itemId, funcName);
    personData.changePowerNum(funcNum);
};

/**
 * 使用物品，默认使用1个
 * @param {Person} personData
 * @param {Number} itemId
 * @param {Number} useNum
 */
export function useItem(personData: Person, itemId: number, useNum: number = 1) {
    let functionNameArr = getItemFunctionNameArr(itemId);
    functionNameArr.forEach(function (funcName) {
        if (useItemFuncObj[funcName]) {
            useItemFuncObj[funcName](personData, itemId);
        }
    });
};
