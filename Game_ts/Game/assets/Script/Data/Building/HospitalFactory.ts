import { Building } from "./BuildingFactory";
import { Person } from "../Person/PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../Person/UserRoleFactory";

export class BuildingHospital extends Building {
    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);
    }

    //使用医院
    useBuilding(personData: Person, typeStr: string) {

    }

    roleUseBuilding(personData: UserRole, typeStr: string) {
        super.roleUseBuilding(personData, typeStr);
        switch (typeStr) {
            case MyGame.BUILDING_FUNCTION_TYPE_TREAT:
                //this.rest(personData, typeStr);
                break;
        }
    }
}