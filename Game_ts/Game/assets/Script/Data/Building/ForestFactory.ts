import { Building } from "./BuildingFactory";
import { Person } from "../PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../UserRoleFactory";

export class BuildingForest extends Building {
    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);
    }

    //使用商店
    roleUseBuilding(personData: UserRole, typeStr: string) {
        super.roleUseBuilding(personData, typeStr);
        switch (typeStr) {
            case MyGame.BUILDING_FUNCTION_TYPE_HUNT:
                //打猎
                this.hunt(personData);
                break;
        }
    }

    private hunt(personData: UserRole) {
        let nowBagItemNum = personData.getItemTotalNum();
        if (nowBagItemNum > MyGame.MAX_ITEM_NUM) {
            MyGame.LogTool.showLog(`hunt error, max item num in bag`);
            return;
        }
        //计算最大时间
        let huntFunctionData = this.getFunctionByType(MyGame.BUILDING_FUNCTION_TYPE_HUNT);
        let oneMinuteGetHuntNum = huntFunctionData.functionNumArr[1];
        let maxGetNum = MyGame.MAX_ITEM_NUM - nowBagItemNum;
        let maxMinuteNum = Math.ceil(maxGetNum / oneMinuteGetHuntNum);
        let maxHour = Math.ceil(maxMinuteNum / 60);
        //开始打猎
        MyGame.UITool.showAskTimeNode(MyGame.LanguageTool.getLanguageStr('hunt_time_title_label'),
            MyGame.LanguageTool.getLanguageStr('hunt_time_max_label', `${maxHour}`), maxHour, 0, 1, function (huntTimeHour: number) {
                if (!huntTimeHour) {
                    return;
                }
                //转为分钟
                let finshTimeMinute = Math.min(huntTimeHour * 60, maxMinuteNum);
                let costTimeMinuteTotal = 0;
                //加入回调函数
                this.restUpdateFuncId = personData.addOneFunction(function (personData: UserRole, addMinute: number, data: any) {
                    if (costTimeMinuteTotal < finshTimeMinute) {
                        MyGame.GameManager.changeGameSpeed(MyGame.QUICK_GAME_SPEED);
                        costTimeMinuteTotal = costTimeMinuteTotal + addMinute;
                        if (costTimeMinuteTotal >= finshTimeMinute) {
                            let addNum = finshTimeMinute * oneMinuteGetHuntNum;
                            personData.addItemNum(huntFunctionData.functionNumArr[0], addNum);
                            //清除掉这个回调
                            personData.removeOneFunctionById(this.restUpdateFuncId);
                            //恢复运行速度
                            MyGame.GameManager.gameSpeedResetting();
                        }
                    } else {
                        //清除回调
                        personData.removeOneFunctionById(this.restUpdateFuncId);
                    }
                }.bind(this), {
                        restOneMinuteAddPowerNum: this.restOneMinuteAddPowerNum
                    });
            });
    }
}