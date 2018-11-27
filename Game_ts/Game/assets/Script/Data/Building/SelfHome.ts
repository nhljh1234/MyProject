import { Building } from "./BuildingFactory";
import { Person } from "../PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";

export class SelfHome extends Building {
    //自宅

    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);

    }
    
}