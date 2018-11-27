import { MyGame } from "../Tool/System/Game";
import { Person } from "./PersonFactory";
import { Building } from "./Building/BuildingFactory";

export class Action {
    //行动id
    actionId: number = undefined;
    //总用时
    actionCostTime: number;
    //位置用一个数组表示，第一个元素表示城市id，第二个表示建筑id
    //配置表里面只会配置一个建筑id，当前城市没有这个建筑的话就需要去寻找最近的城市
    actionPos: number;
    //收益列表
    //单数是id，双数是数量
    rewardArr: number[];
    //名字
    actionName: string;
    //消耗体力
    costPower: number;
    //消耗的金钱
    costMoney: number;
    //当前已经执行的时间
    nowCostTime: number;
    //是否开始进行行动了
    isDoing: boolean;

    constructor(actionId: number, saveData: any) {
        if (saveData) {
            this.initActionBySave(saveData);
        } else {
            this.initAction(actionId);
        }
    }

    initAction(actionId: number) {
        let jsonData = MyGame.JsonDataTool.getDataById('_table_action_action', actionId);
        this.actionId = actionId;
        this.actionCostTime = jsonData.costTime;
        this.actionPos = parseInt(jsonData.pos);
        this.rewardArr = ('' + jsonData.rewardArr).split(',').map(function (idStr) {
            return parseInt(idStr);
        });
        this.actionName = jsonData.name;
        this.costPower = jsonData.costPower;
        this.costMoney = jsonData.costMoney;
        this.nowCostTime = 0;
        this.isDoing = false;
    }

    initActionBySave(saveData: any) {
        this.actionId = parseInt(saveData.id);
        let jsonData = MyGame.JsonDataTool.getDataById('_table_action_action', this.actionId);
        this.actionCostTime = jsonData.costTime;
        this.actionPos = parseInt(jsonData.pos);
        this.rewardArr = ('' + jsonData.rewardArr).split(',').map(function (idStr) {
            return parseInt(idStr);
        });
        this.actionName = jsonData.name;
        this.costPower = jsonData.costPower;
        this.costMoney = jsonData.costMoney;
        this.nowCostTime = saveData.nowUseTime;
        this.isDoing = saveData.isDoing;
    }

    //执行动作，返回一个是否开始做了
    doAction(personData: Person): boolean {
        //开始做的话就直接返回
        if (this.isDoing) {
            return true;
        }
        //第一步判断是否在位置
        if (personData.personPos.buildingId !== this.actionPos) {
            personData.goToBuilding(this.actionPos);
            return false;
        }
        if (!this.isDoing) {
            //表示刚开始做
            this.isDoing = true;
            this.nowCostTime = 0;
        }
        return true;
    }

    timeUpdate(personData: Person, addMinutes: number) {
        if (!this.isDoing) {
            return;
        }
        //在野外
        if (personData.personPos.cityId === MyGame.USER_IN_FIELD) {
            this.isDoing = false;
            personData.goToBuilding(this.actionPos);
            return;
        }
        let buildingData: Building;
        if (this.actionPos !== MyGame.SELF_HOUSE_ID) {
            //判断是否在使用的建筑中，没有的话需要先移动到指定建筑
            buildingData = MyGame.GameManager.gameDataSave.getCityById(personData.personPos.cityId).getBuildingById(this.actionPos);
            if (!buildingData) {
                this.isDoing = false;
                personData.goToBuilding(this.actionPos);
                return;
            }
        } else if (personData.personPos.cityId !== personData.homePos) {
            //自宅需要区别开来
            this.isDoing = false;
            personData.goToBuilding(this.actionPos);
            return;
        }
        this.nowCostTime = this.nowCostTime + addMinutes;
        if (this.nowCostTime > this.actionCostTime) {
            //判断是否要使用建筑功能
            if (this.actionPos !== MyGame.SELF_HOUSE_ID) {
                buildingData.useBuilding(personData, false, undefined);
            } else {
                personData.home.useBuilding(personData, false, undefined);
            }
            personData.actionFinishCb(this);
            this.isDoing = false;
        }
    }

    //获取存储的数据
    getSaveData() {
        return {
            id: this.actionId,
            nowUseTime: this.nowCostTime
        }
    }
}