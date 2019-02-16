import { actionSaveData } from "../../Data/Action/ActionFactory";
import { BasePerson } from "../../Data/Person/BasePersonFactory";
import { MyGame } from "../../Tool/System/Game";

/**
 * 获取行动运行的最大时间
 * @param actionId 
 * @param personData 
 */
export function getActionRunMaxTime(actionId: number, personData: BasePerson) : number {
    let actionData = MyGame.JsonDataTool.getDataById('_table_action_action', actionId);
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