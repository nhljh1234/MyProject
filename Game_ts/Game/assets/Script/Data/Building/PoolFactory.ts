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
        if (personData.getItemTotalNum() > MyGame.MAX_ITEM_NUM) {
            MyGame.LogTool.showLog(`fish error, max item num in bag`);
            return;
        }   
        //开始钓鱼
        
    }
}