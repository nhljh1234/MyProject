/**
 * 城市数据工厂
 */
import { MyGame } from "../../Tool/System/Game";
import { Person } from "../PersonFactory";
import { City } from "../CityFactory";

export class Building {
    //建筑id
    buildingId: number;
    //在这个建筑的人
    personArr: Person[];
    //名称
    buildingName: string;
    //调用函数
    useType: string;
    //所属的城市
    city: City;

    constructor(buildingId: number, saveData: any, city: City) {
        if (saveData) {
            this.initBuildingBySaveData(saveData, city);
        } else {
            this.initBuilding(buildingId, city);
        }
    }

    initBuildingBySaveData(saveData: any, city:City) {

    }

    initBuilding(buildingId: number, city:City) {
        //配置数据
        let jsonData = MyGame.JsonDataTool.getDataById('_table_building_building', buildingId);
        this.buildingId = buildingId;
        this.personArr = [];
        this.buildingName = jsonData.name;
        this.useType = jsonData.useType;
        this.city = city;
    }
    //使用建筑
    /**
     * @param personData 使用者
     * @param isUser 是否是玩家使用
     */
    useBuilding (personData: Person, isUser: boolean) {

    }

    /**
     * 每日更新函数
     */
    dayUpdate () {
        
    }
}
