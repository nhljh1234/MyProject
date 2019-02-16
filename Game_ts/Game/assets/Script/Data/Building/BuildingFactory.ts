/**
 * 城市数据工厂
 * 生成一个城市数据
 * 
 */
import { MyGame } from "../../Tool/System/Game";
import { Person } from "../Person/PersonFactory";
import { City } from "../CityFactory";
import { UserRole } from "../Person/UserRoleFactory";
import ProgressNotice from "../../UI/Prefab/ProgressNotice_script";

/**
 * 描述建筑某个功能的数据
 * 在建筑界面会把这个数据绑定在按钮上
 */
export interface buildingFunctionData {
    //显示的文本
    functionNameStr: string;
    //参数类型
    functionType: string;
    //参数列表
    functionNumArr: number[];
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
    //所属的城市
    city: City;
    //是否显示在城市建筑列表中
    showFlag: boolean;
    //功能列表
    functionArr: buildingFunctionData[];

    constructor(buildingId: number, saveData: any, city: City) {
        if (saveData) {
            this.initBuildingBySaveData(saveData, city);
        } else {
            this.initBuilding(buildingId, city);
        }
    }

    initBuildingBySaveData(saveData: any, city: City) {

    }

    initBuilding(buildingId: number, city: City) {
        //配置数据
        let jsonData: _table_building_building = MyGame.JsonDataTool.getDataById('_table_building_building', buildingId);
        this.buildingId = buildingId;
        this.personArr = [];
        this.buildingName = jsonData.name;
        this.useType = jsonData.useType;
        this.city = city;
        this.showFlag = jsonData.showFlag === 1;
        this.functionArr = [];
        //初始化建筑功能函数
        let functionArr: number[] = jsonData.function ? ('' + jsonData.function).split(',').map(function (idStr) {
            return parseInt(idStr);
        }) : [];
        let functionNumArr: string[] = jsonData.functionNum ? ('' + jsonData.functionNum).split(',').map(function (numStr) {
            return numStr;
        }) : [];
        this.functionArr = functionArr.map(function (typeId: number, index: number) {
            let buildingFunctionTypeData: _table_building_buildingFunction =
                MyGame.JsonDataTool.getDataById('_table_building_buildingFunction', typeId);
            return {
                functionNameStr: buildingFunctionTypeData.name,
                functionType: buildingFunctionTypeData.type,
                functionNumArr: functionNumArr.length ? functionNumArr[index].split('/').map(function (numStr) {
                    return parseFloat(numStr);
                }) : []
            }
        });
    }
    //NPC使用建筑
    /**
     * @param personData 使用者
     * @param typeStr 调用功能的类型
     */
    useBuilding(personData: Person, typeStr: string) {

    }

    //玩家使用建筑
    /**
     * @param personData 使用者
     * @param typeStr 调用功能的类型
     */
    roleUseBuilding(personData: UserRole, typeStr: string) {

    }

    /**
     * 每日更新函数
     */
    dayUpdate() {

    }

    /**
     * 获取所有的功能
     */
    getFunctionArr(): buildingFunctionData[] {
        //加入一个返回按钮
        return this.functionArr.concat({
            functionNameStr: MyGame.LanguageTool.getLanguageStr('come_back'),
            functionType: MyGame.BUILDING_FUNCTION_TYPE_COME_BACK,
            functionNumArr: []
        });
    }

    /**
     * 根据功能类型，获取缓存的功能参数
     * @param type 功能类型
     */
    protected getFunctionByType(type: string): buildingFunctionData {
        let i;
        for (i = 0; i < this.functionArr.length; i++) {
            if (this.functionArr[i].functionType === type) {
                return this.functionArr[i];
            }
        }
        return undefined;
    }
}
