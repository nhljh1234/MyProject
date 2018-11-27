import { Building } from "./BuildingFactory";
import { Person } from "../PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";

export class BuildingHospital extends Building {
    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);
    }

    //使用商店
    useBuilding(personData: Person, isUser: boolean, typeStr: string) {
        super.useBuilding(personData, isUser, typeStr);
        //回复体力
        personData.power = MyGame.MIN_POWER_NUM;
        MyGame.LogTool.showLog(`${personData.name} 医馆治疗`);
    }
}