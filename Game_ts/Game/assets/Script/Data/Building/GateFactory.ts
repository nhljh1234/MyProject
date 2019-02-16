import { Building } from "./BuildingFactory";
import { Person } from "../Person/PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../Person/UserRoleFactory";
import GateCityListUI from "../../UI/Prefab/GateCityListUI_script";

export class BuildingGate extends Building {
    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);
    }

    //使用医院
    useBuilding(personData: Person, typeStr: string) {

    }

    roleUseBuilding(personData: UserRole, typeStr: string) {
        super.roleUseBuilding(personData, typeStr);
        switch (typeStr) {
            case MyGame.BUILDING_FUNCTION_TYPE_TRAVEL:
                this.travel(personData);
                break;
        }
    }

    private travel(personData: UserRole) {
        //先显示所有城市的列表
        MyGame.GameSceneManager.addNode('Prefab/BuildingUI/GateCityListUI', MyGame.GAME_SCENE_UI_NODE, 'GateCityListUI',
        false, function (scriptComp: GateCityListUI) {
            scriptComp.showTravelCityList();
        }, undefined, 100);
    }
}