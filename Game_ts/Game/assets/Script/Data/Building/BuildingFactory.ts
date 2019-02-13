/**
 * 城市数据工厂
 * 生成一个城市数据
 * 
 */
import { MyGame } from "../../Tool/System/Game";
import { Person } from "../PersonFactory";
import { City } from "../CityFactory";
import { UserRole } from "../UserRoleFactory";
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

    /**
     * 治疗体力
     */
    rest(personData: UserRole, typeStr: string) {
        if (personData.power >= MyGame.MAX_POWER) {
            MyGame.LogTool.showLog(`rest error ! power is max`);
            return;
        }
        //开始休息
        //获取恢复满体力需要的时间
        let restFunctionData = this.getFunctionByType(typeStr);
        //判断要不要钱
        let needMoney = restFunctionData.functionNumArr[1];
        if (personData.money < needMoney) {
            MyGame.LogTool.showLog(`${this.buildingName} use error, money error`);
            return;
        }
        MyGame.GameSceneManager.addNode('Prefab/Notice/ProgressNotice', MyGame.GAME_SCENE_ALERT_NODE, 'ProgressNotice',
            false, function (scriptComp: ProgressNotice) {
                MyGame.GameManager.changeGameSpeed(MyGame.QUICK_GAME_SPEED);
                personData.changeMoneyNum(-1 * needMoney);
                let restMaxPowerNeedTime: number = restFunctionData.functionNumArr[0];
                let restOneMinuteAddPowerNum: number = MyGame.MAX_POWER / restMaxPowerNeedTime;
                let restUpdateFuncId: number;
                //更新提示标题
                scriptComp.updateTitle(MyGame.LanguageTool.getLanguageStr('rest_progress_notice_title'));
                //加入回调函数
                restUpdateFuncId = personData.addOneFunction(function (personData: UserRole, addMinute: number, data: any) {
                    if (personData.power < MyGame.MAX_POWER) {
                        personData.changePowerNum(data.restOneMinuteAddPowerNum * addMinute);
                        scriptComp.updateProgressNum(personData.power / MyGame.MAX_POWER);
                        if (personData.power >= MyGame.MAX_POWER) {
                            //清除掉这个回调
                            personData.removeOneFunctionById(restUpdateFuncId);
                            //恢复运行速度
                            MyGame.GameManager.gameSpeedResetting();
                            scriptComp.hide(false);
                        }
                    } else {
                        //清除回调
                        personData.removeOneFunctionById(restUpdateFuncId);
                        scriptComp.hide(false);
                    }
                }.bind(this), {
                        restOneMinuteAddPowerNum: restOneMinuteAddPowerNum
                    });
            }, undefined, 100);
    }

    /**
     * 钓鱼、打猎啥的基本函数
     * @param workTimeHour 工作时间
     * @param maxMinuteNum 最长工作时间
     * @param oneMinUsePower 每分钟消耗体力
     * @param getItemId 获取的物品id
     * @param oneMinGetNum 每分钟获得数量
     * @param scriptComp 进度提示控件
     */
    work(workTimeHour: number, maxMinuteNum: number, oneMinUsePower: number, getItemId: number,
        oneMinGetNum: number, scriptComp: ProgressNotice) {
        //玩家数据
        let personData = MyGame.GameManager.userRole;
        //快速运行
        MyGame.GameManager.changeGameSpeed(MyGame.QUICK_GAME_SPEED);
        //转为分钟
        //计算结束时间，总时间超过这个这个就表示打猎完了
        let finshTimeMinute = Math.min(workTimeHour * 60, maxMinuteNum);
        let costTimeMinuteTotal = 0;
        //加入回调函数
        let huntUpdateFuncId = personData.addOneFunction(function (personData: UserRole, addMinute: number, data: any) {
            if (costTimeMinuteTotal < finshTimeMinute) {
                //打猎时间增加
                costTimeMinuteTotal = costTimeMinuteTotal + addMinute;
                personData.changePowerNum(-1 * oneMinUsePower * addMinute);
                scriptComp.updateProgressNum(costTimeMinuteTotal / finshTimeMinute);
                if (costTimeMinuteTotal >= finshTimeMinute) {
                    let addNum = finshTimeMinute * oneMinGetNum;
                    personData.addItemNum(getItemId, addNum);
                    //清除掉这个回调
                    personData.removeOneFunctionById(huntUpdateFuncId);
                    //恢复运行速度
                    MyGame.GameManager.gameSpeedResetting();
                    scriptComp.hide(false);
                }
            } else {
                //清除回调
                personData.removeOneFunctionById(huntUpdateFuncId);
                scriptComp.hide(false);
            }
        }.bind(this), undefined);
    }
}
