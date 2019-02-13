import { Building } from "./BuildingFactory";
import { Person } from "../PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../UserRoleFactory";
import ProgressNotice from "../../UI/Prefab/ProgressNotice_script";

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
        let that = this;
        //开始钓鱼
        MyGame.UITool.showAskTimeNode(MyGame.LanguageTool.getLanguageStr('fish_time_title_label'),
            MyGame.LanguageTool.getLanguageStr('fish_time_max_label', `${maxHour}`), maxHour, 0, 1, function (fishTimeHour: number) {
                if (!fishTimeHour) {
                    return;
                }
                MyGame.GameSceneManager.addNode('Prefab/Notice/ProgressNotice', MyGame.GAME_SCENE_ALERT_NODE, 'ProgressNotice',
                    false, function (scriptComp: ProgressNotice) {
                        //更新提示标题
                        scriptComp.updateTitle(MyGame.LanguageTool.getLanguageStr('progress_notice_title'));
                        //调用基本函数
                        that.work(fishTimeHour, maxMinuteNum, fishFunctionData.functionNumArr[2], 
                            fishFunctionData.functionNumArr[0], fishFunctionData.functionNumArr[1], scriptComp);
                    }, undefined, 100);
            });
    }
}