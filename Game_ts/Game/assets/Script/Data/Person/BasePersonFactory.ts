import { Action, actionSaveData } from '../Action/ActionFactory';
import { MyGame } from '../../Tool/System/Game';
import { SelfHome } from '../Building/SelfHome';
import ProgressNotice from '../../UI/Prefab/ProgressNotice_script';

export interface PersonPos {
    cityId: number;
    buildingId: number;
}

export interface MapPos {
    x: number;
    y: number;
}

export class BasePerson {
    //任务姓名
    name: string;
    //攻击力
    attack: number;
    //防御力
    def: number;
    //统率
    command: number;
    //智力
    intelligence: number;
    //魅力
    charm: number;
    //政治
    politics: number;
    //性别
    sex: number;
    //个人技能
    presonSkillIdArr: number[];
    //武器装备
    equipAttack: number;
    //防御装备
    equipDef: number;
    //首饰
    equipJewelry: number;
    //坐骑
    equipHorse: number;
    //唯一id
    personId: number;
    //位置
    personPos: PersonPos;
    //家的位置
    //就是一个城市id
    homePos: number;
    //大地图移动的目的地的位置
    goalCityMapPos: MapPos;
    //现在在大地图上的位置
    nowMapPos: MapPos;
    //大地图移动的目的地
    goalCityId: number;
    //当前的人物的物品数据
    //物品id -> 物品数量
    itemObj: { [itemId: number]: number };
    //货币
    money: number;
    //体力
    power: number;
    //是否在战斗中
    //暂定是不记录战斗信息
    inInBattle: boolean;
    //自宅
    home: SelfHome;
    //是否是主角
    isUserRole: boolean;
    //正在执行的行动id
    nowActionIds: number[];
    //正在执行的行动
    nowActions: Action[];
    //正在执行的动作的进度保存
    nowActionData: { [actionId: number]: actionSaveData };
    //绑定一个progressBar
    travelProgressNotice: ProgressNotice;
    //上一个城市
    lastCityId: number;


    constructor() {

    }

    /**
     * 改变人物大地图上的位置
     */
    changeMapPos(person: BasePerson, addMinutes: number) {
        if (!person.goalCityMapPos) {
            return;
        }
        if (!MyGame.GameTool.judgeEqualPos(person.nowMapPos, person.goalCityMapPos)) {
            //还没有到达目的地
            if (MyGame.MapRandomEvent.judgeMapRandomEvent(person)) {
                return;
            }
            //移动的距离
            let moveNum = addMinutes * MyGame.MAP_MOVE_SPEED_MINUTE;
            //这边暂时不使用三角函数计算，减少计算量
            let disX = Math.abs(person.goalCityMapPos.x - person.nowMapPos.x);
            let disY = Math.abs(person.goalCityMapPos.y - person.nowMapPos.y);
            let dis = Math.sqrt(disX * disX + disY * disY);
            let addX = disX / dis * moveNum;
            let addY = disY / dis * moveNum;
            //改变体力
            this.changePowerNum(-1 * MyGame.MAP_MOVE_COST_POWER_MINUTE * addMinutes);
            //x距离增加
            if (person.goalCityMapPos.x !== person.nowMapPos.x) {
                if (person.goalCityMapPos.x > person.nowMapPos.x) {
                    person.nowMapPos.x = person.nowMapPos.x + addX;
                    if (person.nowMapPos.x >= person.goalCityMapPos.x) {
                        person.nowMapPos.x = person.goalCityMapPos.x;
                    }
                } else {
                    person.nowMapPos.x = person.nowMapPos.x - addX;
                    if (person.nowMapPos.x <= person.goalCityMapPos.x) {
                        person.nowMapPos.x = person.goalCityMapPos.x;
                    }
                }
            }
            //y距离增加
            if (person.goalCityMapPos.y !== person.nowMapPos.y) {
                if (person.goalCityMapPos.y > person.nowMapPos.y) {
                    person.nowMapPos.y = person.nowMapPos.y + addY;
                    if (person.nowMapPos.y >= person.goalCityMapPos.y) {
                        person.nowMapPos.y = person.goalCityMapPos.y;
                    }
                } else {
                    person.nowMapPos.y = person.nowMapPos.y - addY;
                    if (person.nowMapPos.y <= person.goalCityMapPos.y) {
                        person.nowMapPos.y = person.goalCityMapPos.y;
                    }
                }
            }
            //改变进度条
            if (this.travelProgressNotice) {
                let lastCityData = MyGame.GameManager.gameDataSave.getCityById(this.lastCityId);
                if (lastCityData) {
                    let disXTotal = Math.abs(person.goalCityMapPos.x - lastCityData.cityPos.x);
                    let disYTotal = Math.abs(person.goalCityMapPos.y - lastCityData.cityPos.y);
                    let disTotal = Math.sqrt(disXTotal * disXTotal + disYTotal * disYTotal);
                    this.travelProgressNotice.updateProgressNum(1 - (dis / disTotal));
                }
            }
            if (MyGame.GameTool.judgeEqualPos(person.nowMapPos, person.goalCityMapPos)) {
                person.personPos.cityId = person.goalCityId;
                person.nowMapPos = person.goalCityMapPos;
                person.goalCityMapPos = undefined;
                person.goalCityId = undefined;
                if (this.mapMoveFinishCb) {
                    this.mapMoveFinishCb();
                    if (this.isUserRole) {
                        MyGame.GameManager.gameSpeedResetting();
                    }
                }
                if (this.travelProgressNotice) {
                    this.travelProgressNotice.hide(false);
                }
            }
        }
    }
    /**
     * 前往一个城市
     * @param cityId 
     */
    goToCity(cityId: number) {
        if (this.inInBattle) {
            return;
        }
        if (cityId === this.personPos.cityId) {
            return;
        }
        this.goalCityMapPos = MyGame.GameManager.gameDataSave.getCityById(cityId).cityPos;
        if (MyGame.GameTool.judgeEqualPos(this.nowMapPos, this.goalCityMapPos)) {
            //修正一下
            this.personPos.cityId = cityId;
            return;
        }
        this.goalCityId = cityId;
        //如果当前有大地图坐标的话就以这个数据为出发点，否则使用当前城市的大地图坐标为出发点
        if (this.personPos.cityId !== MyGame.USER_IN_FIELD) {
            let cityPos = MyGame.GameManager.gameDataSave.getCityById(this.personPos.cityId).cityPos;
            this.nowMapPos = MyGame.GameTool.createMapPos(cityPos.x, cityPos.y);
        }
        this.lastCityId = this.personPos.cityId;
        //立马出城
        this.personPos.cityId = MyGame.USER_IN_FIELD;
    }
    //前往一个设施
    goToBuilding(buildingId: number) {
        if (this.inInBattle) {
            return;
        }
        if (buildingId === MyGame.SELF_HOUSE_ID) {
            //自宅
            if (this.personPos.cityId === this.homePos) {
                this.personPos.buildingId = buildingId;
                return;
            }
        }
        let nearCityData = MyGame.GameTool.getNearBuildingCity(buildingId, this.personPos.cityId, undefined, this);
        if (nearCityData.cityId !== this.personPos.cityId) {
            this.goToCity(nearCityData.cityId);
            return;
        }
        //城市内的建筑是立马到达的
        this.personPos.buildingId = buildingId;
    }
    //获得了物品
    getItem(rewardArr: number[]) {
        if (rewardArr.length === 0) {
            return;
        }
        if (rewardArr.length % 2 !== 0) {
            MyGame.LogTool.showLog(`奖励列表错误 ${rewardArr}`);
            return;
        }
        let i;
        for (i = 0; i < rewardArr.length; i++) {
            let id = rewardArr[i];
            let num = rewardArr[i + 1];
            if (!this.itemObj[id]) {
                this.itemObj[id] = 0;
            }
            this.itemObj[id] = this.itemObj[id] + num;
            i++;
        }
    }
    //更新行动
    timeUpdateAction(addMinutes: number) {
        this.nowActions.forEach(function (action: Action) {
            action.timeUpdate(addMinutes, this);
        }.bind(this));
    }
    //时间变化函数
    timeUpdate(addMinutes: number) {

    }
    //日期变化函数
    dayUpdate() {

    }
    /**
     * 移除一个物品
     * @param itemId 物品id
     * @param removeNum 移除数量
     */
    removeItemByItemId(itemId: number, removeNum: number) {
        if (this.itemObj[itemId]) {
            this.itemObj[itemId] = this.itemObj[itemId] - removeNum;
            if (this.itemObj[itemId] < 0) {
                MyGame.LogTool.showLog(`removeItemByItemId error ! removeNum is ${removeNum} , nowNum is ${this.itemObj[itemId]}`);
                this.itemObj[itemId] = 0;
            }
        }
    }
    //获取存储的数据
    getSaveData() {
        return {
            name: this.name,
            attack: this.attack,
            def: this.def,
            command: this.command,
            intelligence: this.intelligence,
            charm: this.charm,
            politics: this.politics,
            sex: this.sex,
            presonSkillIdArr: this.presonSkillIdArr,
            equipAttack: this.equipAttack,
            equipDef: this.equipDef,
            equipJewelry: this.equipJewelry,
            equipHorse: this.equipHorse,
            personId: this.personId,
            personPos: this.personPos,
            homePos: this.homePos,
            goalCityMapPos: this.goalCityMapPos,
            nowMapPos: this.nowMapPos,
            goalCityId: this.goalCityId,
            itemObj: this.itemObj,
            money: this.money,
            power: this.power,
            inInBattle: this.inInBattle,
            nowActionIds: this.nowActionIds,
            nowActionData: this.nowActionData,
            lastCityId: this.lastCityId
        }
    }
    //死亡回调
    /**
     * @param personAttack 击杀者
     */
    deadCb(personAttack: BasePerson) {
        MyGame.LogTool.showLog(`${personAttack.name} 击杀了 ${this.name}`);
    }
    //开始战斗的回调
    startBattleCb() {
        this.inInBattle = true;
    }
    //战斗结束回调
    battleFinishCb() {
        this.inInBattle = false;
    }
    //触发大地图随机事件
    mapRandomEventCb() {

    }
    //移动结束的回调
    mapMoveFinishCb() {

    }
    //行动结束回掉
    actionFinishCb() {
        this.nowActions = this.nowActions.filter(function (action: Action) {
            return !action.isFinish();
        }.bind(this));
    }
    /**
     * 判断是否在自己家所在的城市
     */
    inInHomePos(): boolean {
        return this.personPos.cityId === this.homePos;
    }

    /**
     * 获取物品的数量
     */
    getItemTotalNum(): number {
        let totalNum = 0;
        for (var key in this.itemObj) {
            if (!this.itemObj.hasOwnProperty(key)) {
                continue;
            }
            totalNum = totalNum + this.itemObj[key];
        }
        return totalNum;
    }

    /**
     * 增加物品数量
     */
    addItemNum(itemId: number, num: number) {
        this.itemObj[itemId] = (this.itemObj[itemId] || 0) + num;
        if (this.itemObj[itemId] < 0) {
            MyGame.LogTool.showLog(`addItemNum error ! now num is ${this.itemObj[itemId]}`);
            this.itemObj[itemId] = 0;
        }
    }

    /**
     * 设置物品数量
     */
    setItemNum(itemId: number, num: number) {
        this.itemObj[itemId] = num;
    }

    /**
     * 改变金钱数量
     * @param changeMoneyNum 改变金钱数量
     */
    changeMoneyNum(changeMoneyNum: number) {
        this.money = this.money + changeMoneyNum;
        MyGame.LogTool.showLog(`money change num is ${changeMoneyNum}`);
        MyGame.EventManager.send(MyGame.EventName.USER_ROLE_STATUS_CHANGE);
    }

    /**
     * 直接设置当前的金钱数量
     * @param newMoneyNum 
     */
    setMoneyNum(newMoneyNum: number) {
        this.money = newMoneyNum;
        MyGame.LogTool.showLog(`money now num is ${newMoneyNum}`);
        MyGame.EventManager.send(MyGame.EventName.USER_ROLE_STATUS_CHANGE);
    }

    /**
     * 改变体力数量
     * @param changePowerNum
     */
    changePowerNum(changePowerNum: number) {
        this.power = this.power + changePowerNum;
        if (this.power > MyGame.MAX_POWER) {
            this.power = MyGame.MAX_POWER;
        }
        if (this.power < 0) {
            this.power = 0;
        }
        this.power = Math.floor(this.power * 100000) / 100000;
        MyGame.LogTool.showLog(`power change num is ${changePowerNum}`);
        MyGame.EventManager.send(MyGame.EventName.USER_ROLE_STATUS_CHANGE);
    }

    /**
     * 直接设置当前的体力数量
     * @param newPowerNum 
     */
    setPowerNum(newPowerNum: number) {
        this.power = newPowerNum;
        if (this.power > MyGame.MAX_POWER) {
            this.power = MyGame.MAX_POWER;
        }
        if (this.power < 0) {
            this.power = 0;
        }
        this.power = Math.floor(this.power * 100000) / 100000;
        MyGame.LogTool.showLog(`power now num is ${newPowerNum}`);
        MyGame.EventManager.send(MyGame.EventName.USER_ROLE_STATUS_CHANGE);
    }

    /**
     * 设置所在的地点
     */
    setPersonCityPos(cityId: number) {
        this.personPos.cityId = cityId;
    }
    /**
     * 增加一个行动
     */
    addOneAction(action: Action) {
        this.nowActions.push(action);
        action.start(this);
    }
}