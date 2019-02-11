import { Building } from "./BuildingFactory";
import { Person } from "../PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../UserRoleFactory";

export class BuildingHotel extends Building {
    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);
    }

    //旅馆
    useBuilding(personData: Person, typeStr: string) {

    }

    roleUseBuilding(personData: UserRole, typeStr: string) {
        super.roleUseBuilding(personData, typeStr);
        switch (typeStr) {
            case MyGame.BUILDING_FUNCTION_TYPE_REST:
                this.rest(personData, typeStr);
                break;
        }
    }
}