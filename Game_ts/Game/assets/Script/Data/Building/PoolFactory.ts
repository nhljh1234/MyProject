import { Building } from "./BuildingFactory";
import { Person } from "../PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../UserRoleFactory";

export class BuildingPool extends Building {
    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);
    }

    //使用商店
    roleUseBuilding(personData: UserRole, typeStr: string) {
        super.roleUseBuilding(personData, typeStr);
        switch (typeStr) {
            case MyGame.BUILDING_FUNCTION_TYPE_FISH:
                //钓鱼
                this.fish(personData);
                break;
        }
    }

    private fish(personData: UserRole) {
        let nowBagItemNum = personData.getItemTotalNum();
        if (nowBagItemNum > MyGame.MAX_ITEM_NUM) {
            MyGame.LogTool.showLog(`fish error, max item num in bag`);
            return;
        }
        //计算最大时间
        let fishFunctionData = this.getFunctionByType(MyGame.BUILDING_FUNCTION_TYPE_FISH);
        let oneMinuteGetFishNum = fishFunctionData.functionNumArr[1];
        let maxGetNum = MyGame.MAX_ITEM_NUM - nowBagItemNum;
        let maxMinuteNum = Math.ceil(maxGetNum / oneMinuteGetFishNum);
        let maxHour = Math.ceil(maxMinuteNum / 60);
        //开始钓鱼
        MyGame.UITool.showAskTimeNode(MyGame.LanguageTool.getLanguageStr('fish_time_title_label'),
            MyGame.LanguageTool.getLanguageStr('fish_time_max_label', `${maxHour}`), maxHour, 0, 1, function (fishTimeHour: number) {
                if (!fishTimeHour) {
                    return;
                }
                MyGame.GameManager.changeGameSpeed(MyGame.QUICK_GAME_SPEED);
                //转为分钟
                let finshTimeMinute = Math.min(fishTimeHour * 60, maxMinuteNum);
                let costTimeMinuteTotal = 0;
                //加入回调函数
                let fishUpdateFuncId = personData.addOneFunction(function (personData: UserRole, addMinute: number, data: any) {
                    if (costTimeMinuteTotal < finshTimeMinute) {
                        costTimeMinuteTotal = costTimeMinuteTotal + addMinute;
                        personData.changePowerNum(-1 * fishFunctionData.functionNumArr[2]);
                        if (costTimeMinuteTotal >= finshTimeMinute) {
                            let addNum = finshTimeMinute * oneMinuteGetFishNum;
                            personData.addItemNum(fishFunctionData.functionNumArr[0], addNum);
                            //清除掉这个回调
                            personData.removeOneFunctionById(fishUpdateFuncId);
                            //恢复运行速度
                            MyGame.GameManager.gameSpeedResetting();
                        }
                    } else {
                        //清除回调
                        personData.removeOneFunctionById(fishUpdateFuncId);
                    }
                }.bind(this), undefined);
            });
    }
}