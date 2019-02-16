import { Building } from "./BuildingFactory";
import { Person } from "../Person/PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";
import { UserRole } from "../Person/UserRoleFactory";
import WarehouseUI from "../../UI/Prefab/WarehouseUI_script";

export class SelfHome extends Building {
    //自宅
    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);

    }

    //使用自宅
    useBuilding(personData: Person, typeStr: string) {
        super.useBuilding(personData, typeStr);
        //回复体力
        personData.setPowerNum(MyGame.MAX_POWER);
        MyGame.LogTool.showLog(`${personData.name} 在家休息结束`);
    }

    roleUseBuilding(personData: UserRole, typeStr: string) {
        super.roleUseBuilding(personData, typeStr);
        switch (typeStr) {
            case MyGame.BUILDING_FUNCTION_TYPE_REST:
                //this.rest(personData, typeStr);
                break;
            case MyGame.BUILDING_FUNCTION_TYPE_WAREHOUSE:
                //调用显示仓库界面
                //MyGame.EventManager.send(MyGame.EventName.SHOW_WAREHOUSE_UI);
                //标记一下打开的是什么界面
                //背包和仓库都是用一个界面
                MyGame.GameSceneManager.addNode('Prefab/WarehouseUI/WarehouseUI', MyGame.GAME_SCENE_UI_NODE, 'WarehouseUI',
                    false, function (scriptComp: WarehouseUI) {
                        scriptComp.setWarehouseType(MyGame.WAREHOUSEUI_TYPE_WAREHOUSE);
                    }, undefined, 100);
                break;
        }
    }
}