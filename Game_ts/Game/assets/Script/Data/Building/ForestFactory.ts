import { Building } from "./BuildingFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../Person/UserRoleFactory";
import { Action } from "../Action/ActionFactory";

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
        let maxMinute = MyGame.ActionModule.getActionRunMaxTime(MyGame.ActionModule.ACTION_HUNT_ID, personData);
        let maxHour = Math.ceil(maxMinute / 60);
        //开始打猎
        MyGame.UITool.showAskTimeNode(MyGame.LanguageTool.getLanguageStr('hunt_time_title_label'),
            MyGame.LanguageTool.getLanguageStr('hunt_time_max_label', `${maxHour}`), maxHour, 0, 1, function (huntTimeHour: number) {
                if (!huntTimeHour) {
                    return;
                }
                personData.addOneAction(new Action(MyGame.ActionModule.ACTION_HUNT_ID, Math.min(huntTimeHour * 60, maxMinute), undefined));
            });
    }
}