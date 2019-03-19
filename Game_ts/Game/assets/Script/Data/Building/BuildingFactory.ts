/**
 * 城市数据工厂
 * 生成一个城市数据
 * 
 */
import { MyGame } from "../../Tool/System/Game";
import { Person } from "../Person/PersonFactory";
import { City } from "../CityFactory";
import { UserRole } from "../Person/UserRoleFactory";
import { ChoiceBoxButtonData } from "../../UI/Prefab/ChoiceBox_script";
import { BasePerson } from "../Person/BasePersonFactory";
import { Action } from "../Action/ActionFactory";

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
        let jsonData: _table_building_building = MyGame.JsonDataTool.getDataById('building', 'building', buildingId);
        this.buildingId = buildingId;
        this.personArr = [];
        this.buildingName = jsonData.name;
        this.useType = jsonData.useType;
        this.city = city;
        this.showFlag = jsonData.showFlag === 1;
        this.functionArr = [];
        //初始化建筑功能函数
        let functionArr: number[] = jsonData.functionList ? ('' + jsonData.functionList).split(',').map(function (idStr) {
            return parseInt(idStr);
        }) : [];
        let functionNumArr: string[] = jsonData.functionNum ? ('' + jsonData.functionNum).split(',').map(function (numStr) {
            return numStr;
        }) : [];
        this.functionArr = functionArr.map(function (typeId: number, index: number) {
            let buildingFunctionTypeData: _table_building_buildingFunction =
                MyGame.JsonDataTool.getDataById('building', 'buildingFunction', typeId);
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
     * 休息
     */
    rest(actionId: number, personData: BasePerson) {
        if (personData.power >= MyGame.MAX_POWER) {
            MyGame.LogTool.showLog(`rest error! power is max!`);
            return;
        }
        if (personData.isUserRole) {
            let choiceBoxButtonDatas: ChoiceBoxButtonData[] = [];
            //自己休息
            choiceBoxButtonDatas.push({
                label: MyGame.LanguageTool.getLanguageStr('rest_recover_label'),
                //休息好体力
                func: function () {
                    let actionData = MyGame.JsonDataTool.getDataById('action', 'action', actionId);
                    let restTime = MyGame.ActionModule.getRestMinTime(actionData, personData);
                    if (restTime <= 0) {
                        MyGame.LogTool.showLog(`rest error! restTime is error!`);
                        return;
                    }
                    personData.addOneAction(new Action(actionId, restTime, undefined));
                },
                funcData: undefined
            });
            //指定时间
            choiceBoxButtonDatas.push({
                label: MyGame.LanguageTool.getLanguageStr('rest_user_time_label'),
                //指定时间
                func: function () {
                    //计算最大时间
                    let maxMinute = MyGame.ActionModule.getActionRunMaxTime(actionId, personData);
                    let maxHour = Math.ceil(maxMinute / 60);
                    //开始休息
                    MyGame.UITool.showAskTimeNode(MyGame.LanguageTool.getLanguageStr('rest_time_title_label'),
                        MyGame.LanguageTool.getLanguageStr('rest_time_max_label', `${maxHour}`), maxHour, 0, 1, function (fishTimeHour: number) {
                            if (!fishTimeHour) {
                                return;
                            }
                            personData.addOneAction(new Action(actionId, Math.min(fishTimeHour * 60, maxMinute), undefined));
                        }, undefined);
                },
                funcData: undefined
            });
            MyGame.UITool.showChoiceListNode(choiceBoxButtonDatas);
        } else {
            let restTime = MyGame.ActionModule.getActionRunMaxTime(actionId, personData);
            personData.addOneAction(new Action(actionId, restTime, undefined));
        }
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
