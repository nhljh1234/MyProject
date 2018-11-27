import { Building } from "./BuildingFactory";
import { Person } from "../PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../UserRoleFactory";

export class SelfHome extends Building {
    //自宅

    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);

    }

    //使用自宅
    useBuilding(personData: Person, isUser: boolean, typeStr: string) {
        super.useBuilding(personData, isUser, typeStr);
        //回复体力
        if (!isUser) {
            personData.power = MyGame.MAX_POWER;
            MyGame.LogTool.showLog(`${personData.name} 在家休息结束`);
        } else {
            //玩家使用
            let userRole: UserRole = MyGame.GameManager.userRole;
        }
    }
}