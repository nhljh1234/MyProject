import { Building } from "./BuildingFactory";
import { Person } from "../PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../UserRoleFactory";
import ProgressNotice from "../../UI/Prefab/ProgressNotice_script";

export class BuildingForest extends Building {
    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);
    }

    //使用森林
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
        let that = this;
        //开始打猎
        MyGame.UITool.showAskTimeNode(MyGame.LanguageTool.getLanguageStr('hunt_time_title_label'),
            MyGame.LanguageTool.getLanguageStr('hunt_time_max_label', `${maxHour}`), maxHour, 0, 1, function (huntTimeHour: number) {
                if (!huntTimeHour) {
                    return;
                }
                MyGame.GameSceneManager.addNode('Prefab/Notice/ProgressNotice', MyGame.GAME_SCENE_ALERT_NODE, 'ProgressNotice',
                    false, function (scriptComp: ProgressNotice) {
                        //更新提示标题
                        scriptComp.updateTitle(MyGame.LanguageTool.getLanguageStr('progress_notice_title'));
                        //调用基本函数
                        that.work(huntTimeHour, maxMinuteNum, huntFunctionData.functionNumArr[2], 
                            huntFunctionData.functionNumArr[0], huntFunctionData.functionNumArr[1], scriptComp);
                    }, undefined, 100);
            });
    }
}