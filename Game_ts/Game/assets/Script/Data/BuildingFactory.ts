/**
 * 城市数据工厂
 */
import { MyGame } from "../Tool/System/Game";
import { Person } from "./PersonFactory";
//玩家进入建筑的处理函数
let buildingUserUseTypeFunc: { [key: string]: Function } = {};
//NPC进入建筑的处理函数
let buildingUseTypeFunc: { [key: string]: Function } = {};

//森林
/**
 * 森林处理函数
 */
buildingUseTypeFunc.forest = function (personData) {

}
/**
 * 池塘处理函数
 */
buildingUseTypeFunc.pool = function (personData) {

}
/**
 * 旅舍处理函数
 */
buildingUseTypeFunc.hotel = function (personData) {

}
/**
 * 商店处理函数
 */
buildingUseTypeFunc.shop = function (personData: Person) {
    //会出售所有的商品
    //personData.sellGood();
    MyGame.LogTool.showLog(`${personData.name} 卖东西`);
}
/**
 * 医馆处理函数
 */
buildingUseTypeFunc.hospital = function (personData: Person) {
    personData.power = MyGame.MIN_POWER_NUM;
    MyGame.LogTool.showLog(`${personData.name} 医馆治疗`);
}

export class Building {
    //建筑id
    buildingId: number;
    //在这个建筑的人
    personArr: Person[];
    //名称
    buildingName: string;
    //调用函数
    useType: string;

    constructor(buildingId: number, saveData: any) {
        if (saveData) {
            this.initBuildingBySaveData(saveData);
        } else {
            this.initBuilding(buildingId);
        }
    }

    initBuildingBySaveData(saveData: any) {

    }

    initBuilding(buildingId: number) {
        //配置数据
        let jsonData = MyGame.JsonDataTool.getDataById('_table_building_building', buildingId);
        this.buildingId = buildingId;
        this.personArr = [];
        this.buildingName = jsonData.name;
        this.useType = jsonData.useType;
    }
    //使用建筑
    /**
     * @param personData 使用者
     * @param isUser 是否是玩家使用
     */
    useBuilding (personData: Person, isUser: boolean) {
        if (isUser) {
            return buildingUseTypeFunc[this.useType] ? buildingUseTypeFunc[this.useType](personData) : undefined;
        }
        return buildingUserUseTypeFunc[this.useType] ? buildingUserUseTypeFunc[this.useType](personData) : undefined;
    }
}
