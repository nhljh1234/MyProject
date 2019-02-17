import { Building } from "./BuildingFactory";
import { Person } from "../Person/PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../Person/UserRoleFactory";
import ProgressNotice from "../../UI/Prefab/ProgressNotice_script";
import { Action } from "../Action/ActionFactory";

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
        let maxMinute = MyGame.ActionModule.getActionRunMaxTime(MyGame.ActionModule.ACTION_FISH_ID, personData);
        let maxHour = Math.ceil(maxMinute / 60);
        //开始打猎
        MyGame.UITool.showAskTimeNode(MyGame.LanguageTool.getLanguageStr('fish_time_title_label'),
            MyGame.LanguageTool.getLanguageStr('fish_time_max_label', `${maxHour}`), maxHour, 0, 1, function (fishTimeHour: number) {
                if (!fishTimeHour) {
                    return;
                }
                personData.addOneAction(new Action(MyGame.ActionModule.ACTION_FISH_ID, Math.min(fishTimeHour * 60, maxMinute), undefined));
            });
    }
}