import { BasePerson } from "../../Data/Person/BasePersonFactory";
import { MyGame } from "../../Tool/System/Game";

const MAX_TIME = 60 * 24 * 365;

export const ACTION_FISH_ID = 1;
export const ACTION_HUNT_ID = 2;
export const ACTION_REST_IN_HOTEL_ID = 3;
export const ACTION_REST_IN_HOME_ID = 4;
export const ACTION_REST_IN_HOSPITAL_ID = 5;

export const ACTION_TYPE_WORK = 'work';
export const ACTION_TYPE_REST = 'rest';

/**
 * 获取休息恢复体力的最小时间
 */
export function getRestMinTime(actionData: any, personData: BasePerson) {
    let restPower = MyGame.MAX_POWER - personData.power;
    return restPower / Math.abs(actionData.costPower);
};

/**
 * 获取行动运行的最大时间
 * @param actionId 
 * @param personData 
 */
export function getActionRunMaxTime(actionId: number, personData: BasePerson): number {
    let actionData = MyGame.JsonDataTool.getDataById('action', 'action', actionId);
    switch (actionData.type) {
        case ACTION_TYPE_WORK:
            return getWorkActionRunMaxTime(actionData, personData);
        case ACTION_TYPE_REST:
            return getRestActionRunMaxTime(actionData, personData);
    }
    return 0;
};

/**
 * 获取休息类行动运行的最大时间
 * @param actionId 
 * @param personData 
 */
function getRestActionRunMaxTime(actionData: any, personData: BasePerson): number {
    if (!actionData) {
        return 0;
    }
    let moneyMinTime: number = MAX_TIME;
    //计算金钱最多能执行多久
    if (actionData.costMoney) {
        moneyMinTime = Math.ceil(personData.money / Math.abs(actionData.costMoney));
    }
    if (personData.isUserRole) {
        return moneyMinTime;
    } else {
        //计算恢复需要多少时间
        let restNeedTime = getRestMinTime(actionData, personData);
        return Math.min(moneyMinTime, restNeedTime);
    }
}

/**
 * 获取工作类行动运行的最大时间
 * @param actionId 
 * @param personData 
 */
function getWorkActionRunMaxTime(actionData: any, personData: BasePerson): number {
    if (!actionData) {
        return 0;
    }
    let powerMinTime: number, itemNumMinTime: number;
    //计算体力最多能执行多久
    powerMinTime = Math.ceil(personData.power / actionData.costPower);
    //计算物品最多能执行多久
    let oneMinuteAddNum: number = 0;
    let rewardNums = actionData.rewardNums ? ('' + actionData.rewardNums).split(',') : [];
    rewardNums.map(function (number: string) {
        return parseFloat(number);
    });
    rewardNums.forEach(function (addNum: string) {
        oneMinuteAddNum = oneMinuteAddNum + parseFloat(addNum);
    });
    itemNumMinTime = Math.ceil((MyGame.MAX_ITEM_NUM - personData.getItemTotalNum()) / oneMinuteAddNum);
    return Math.min(powerMinTime, itemNumMinTime);
};