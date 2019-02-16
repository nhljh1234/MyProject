import { MyGame } from "../../Tool/System/Game";
import { Person } from "../Person/PersonFactory";
import { Building } from "../Building/BuildingFactory";
import { BasePerson } from "../Person/BasePersonFactory";
import ProgressNotice from "../../UI/Prefab/ProgressNotice_script";

export interface actionSaveData {
    //行动持续的分钟
    actionTimeMinute: number;
    //已经运行的时间
    actionRunTimeMinute: number;
};

export class Action {
    //配置属性
    //行动名字
    name: string;
    //执行动作的建筑id
    pos: number;
    //奖励物品列表
    rewards: number[];
    //奖励物品每分钟数量
    rewardNums: number[];
    //每分钟消耗体力
    costPower: number;
    //每分钟消耗金钱
    costMoney: number;
    //成果加成属性
    property: string;
    //成果加成基本值
    propertyNum: number;
    //是否显示进度条
    showProgressFlag: boolean;
    //提示文本
    noticeLabel: string;

    //需要补充的属性
    //行动持续的分钟
    actionTimeMinute: number;
    //已经运行的时间
    actionRunTimeMinute: number;

    //缓存进度条脚本
    _progressScriptComp: ProgressNotice;

    constructor(actionId: number, actionTimeMinute: number, saveData: any) {
        if (saveData) {
            this.initActionBySave(actionId, saveData);
        } else {
            this.initAction(actionId, actionTimeMinute);
        }
    }

    /**
     * 获取存储的数据
     */
    getSaveData(): actionSaveData {
        return {
            actionTimeMinute: this.actionTimeMinute,
            actionRunTimeMinute: this.actionRunTimeMinute
        }
    }

    /**
     * 初始化行动
     * @param saveData
     */
    initActionBySave(actionId: number, saveData: actionSaveData) {
        let jsonData = MyGame.JsonDataTool.getDataById('_table_action_action', actionId);
        //初始化数据
        this.name = jsonData.name || '';
        this.pos = jsonData.pos || 0;
        this.rewards = jsonData.rewards || [];
        this.rewardNums = jsonData.rewardNums || [];
        this.costPower = jsonData.costPower || 0;
        this.costMoney = jsonData.costMoney || 0;
        this.property = jsonData.property || 0;
        this.propertyNum = jsonData.propertyNum || 100;
        this.showProgressFlag = jsonData.showProgressFlag ? true : false;
        this.noticeLabel = jsonData.noticeLabel || '';
        this.actionTimeMinute = saveData.actionTimeMinute;
        this.actionRunTimeMinute = saveData.actionRunTimeMinute;
    }

    /**
     * 初始化行动
     * @param actionId 
     */
    initAction(actionId: number, actionTimeMinute: number) {
        let jsonData = MyGame.JsonDataTool.getDataById('_table_action_action', actionId);
        //初始化数据
        this.name = jsonData.name || '';
        this.pos = jsonData.pos || 0;
        this.rewards = jsonData.rewards ? ('' + jsonData.rewards).split(',').map(function (number: string) {
            return parseFloat(number);
        }) : [];
        this.rewardNums = jsonData.rewardNums ? ('' + jsonData.rewardNums).split(',').map(function (number: string) {
            return parseFloat(number);
        }) : [];
        this.costPower = jsonData.costPower || 0;
        this.costMoney = jsonData.costMoney || 0;
        this.property = jsonData.property || 0;
        this.propertyNum = jsonData.propertyNum || 100;
        this.showProgressFlag = jsonData.showProgressFlag ? true : false;
        this.noticeLabel = jsonData.noticeLabel || '';
        this.actionTimeMinute = actionTimeMinute;
        this.actionRunTimeMinute = 0;
    }

    /**
     * 会返回一个是否完成了行动
     * @param addMinute 
     * @param personData 
     */
    timeUpdate(addMinute: number, personData: BasePerson): boolean {
        //计算奖励的物品
        this.actionRunTimeMinute = this.actionRunTimeMinute + addMinute;
        //扣除体力
        personData.changePowerNum(-1 * this.costPower * addMinute);
        if (this._progressScriptComp) {
            this._progressScriptComp.updateProgressNum(this.actionRunTimeMinute / this.actionTimeMinute);
        }
        if (this.actionRunTimeMinute >= this.actionTimeMinute) {
            this.finish(personData);
            return true;
        }
        return false;
    }

    start(personData: BasePerson) {
        //扣除金钱
        let costMoney = this.costMoney * this.actionTimeMinute;
        if ((-1 * costMoney) > personData.money) {
            MyGame.LogTool.showLog(`action start error! money is not enough`);
            return;
        }
        personData.changeMoneyNum(costMoney);
        this._progressScriptComp = undefined;
        if (personData.isUserRole) {
            //加快游戏速度
            MyGame.GameManager.changeGameSpeed(MyGame.QUICK_GAME_SPEED);
            if (this.showProgressFlag) {
                MyGame.GameSceneManager.addNode('Prefab/Notice/ProgressNotice', MyGame.GAME_SCENE_ALERT_NODE, 'ProgressNotice',
                    false, function (scriptComp: ProgressNotice) {
                        //更新提示标题
                        scriptComp.updateTitle(this.noticeLabel);
                        this._progressScriptComp = scriptComp;
                        if (this.actionRunTimeMinute > this.actionTimeMinute) {
                            this._progressScriptComp.hide(false);
                        }
                    }.bind(this), undefined, 100);
            }
        }
    }

    finish(personData: BasePerson) {
        //增加物品
        this.rewards.forEach(function (itemId: number, index: number) {
            let ratio = 1;
            if (personData[this.property]) {
                ratio = personData[this.property] / this.propertyNum;
            }
            let addNum = this.rewardNums[index] * this.actionRunTimeMinute * ratio;
            personData.addItemNum(itemId, addNum);
        }.bind(this));
        if (personData.isUserRole) {
            MyGame.GameManager.gameSpeedResetting();
        }
        if (this._progressScriptComp) {
            this._progressScriptComp.hide(false);
        }
        personData.actionFinishCb();
    }

    /**
     * 判断行动是否结束
     */
    isFinish(): boolean {
        return this.actionRunTimeMinute >= this.actionTimeMinute;
    }
}