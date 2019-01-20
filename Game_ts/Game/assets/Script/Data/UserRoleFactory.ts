import { MyGame } from "../Tool/System/Game";
import { MapPos, PersonPos } from "./PersonFactory";
import { Action } from "./ActionFactory";
import { SelfHome } from "./Building/SelfHome";

/**
 * 获取一个玩家角色的随机数据
 * 性别和名字需要外部传入一个确定值
 */
export function getRandomUserRoleData(sex: number, name: string) {
    var randomData: { [key: string]: any } = {};
    randomData.sex = sex || MyGame.SEX_MAN;
    randomData.name = name || MyGame.RandomNameTool.getRandomName(randomData.sex);
    //随机数据
    randomData.attack = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 2).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 2).num));
    randomData.def = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 3).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 3).num));
    randomData.command = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 4).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 4).num));
    randomData.intelligence = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 5).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 5).num));
    randomData.charm = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 6).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 6).num));
    randomData.politics = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 7).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 7).num));
    randomData.moveSpeed = 5;
    return randomData;
}

export interface updateFuncData {
    func: Function;
    id: number;
    data: any;
}

export class UserRole {
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
    //地图移动速度
    mapMoveSpeed: number;
    //个人技能
    presonSkillIdArr: number[];
    //战争技能
    battleSkillIdArr: number[];
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
    //当前执行的任务
    nowAction: Action;
    //当前的人物的物品数据
    //物品id -> 物品数量
    itemObj: { [itemId: number]: number };
    //仓库物品数量数据
    //物品id -> 物品数量
    warehouseItemObj: { [itemId: number]: number };
    //装备数据
    equipObj: { [equipId: number]: number };
    //货币输了
    money: number;
    //体力
    power: number;
    //是否在战斗中
    //暂定是不记录战斗信息
    inInBattle: boolean;
    //回调列表
    //这么设计是主角比较特殊，可能存在多个要处理的状态，标记太多不好
    //比如在自宅休息的时候会存入一个回调，每次调用的时候更新人物的体力和生命值
    private updateFuncArr: updateFuncData[];
    //返回一个唯一id
    private updateFuncIndex: number;
    //自宅
    home: SelfHome;

    constructor(saveData: any, randomData: any) {
        if (saveData) {
            this.initUserRoleBySaveData(saveData);
        } else {
            this.initUserRole(randomData);
        }
    }

    private initUserRoleBySaveData(saveData: any) {

    }

    private initUserRole(randomData: any) {
        //名字
        this.name = randomData.name;
        //攻击力
        this.attack = randomData.attack;
        //防御力
        this.def = randomData.def;
        //统帅
        this.command = randomData.command;
        //智力
        this.intelligence = randomData.intelligence;
        //魅力
        this.charm = randomData.charm;
        //政治
        this.politics = randomData.politics;
        //性别
        this.sex = randomData.sex;
        //大地图移动速度
        this.mapMoveSpeed = randomData.moveSpeed;
        //个人技能
        this.presonSkillIdArr = randomData.presonSkillIdArr ? ('' + randomData.presonSkillIdArr).split(',').map(function (idStr) {
            return parseInt(idStr);
        }) : [];
        //TODO 需要新建一个技能

        //战争技能
        this.battleSkillIdArr = randomData.battleSkillIdArr ? ('' + randomData.battleSkillIdArr).split(',').map(function (idStr) {
            return parseInt(idStr);
        }) : [];
        //TODO 需要新建一个技能

        //这边是存储的配置
        //武器装备
        this.equipAttack = undefined;
        //防御装备
        this.equipDef = undefined;
        //首饰
        this.equipJewelry = undefined;
        //坐骑
        this.equipHorse = undefined;
        //位置
        //初始都是在家的
        this.personPos = {
            cityId: MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 1).num || 1,
            buildingId: MyGame.SELF_HOUSE_ID
        };
        //家的位置，是一个城市id
        this.homePos = this.personPos.cityId;
        //目的地的大地图坐标
        this.goalCityMapPos = undefined;
        //当前人物所在的大地图坐标
        this.nowMapPos = undefined;
        //目标城市的id
        this.goalCityId = undefined;
        //当前执行的任务
        this.nowAction = undefined;
        //当前的人物的物品数据
        this.itemObj = {};
        //仓库数据
        this.warehouseItemObj = {};
        //装备数据
        this.equipObj = {};
        //货币数量
        //初始的时候给玩家一点
        this.money = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 9).num;
        //体力
        this.power = MyGame.MAX_POWER;
        //是否在战斗中
        //暂定是不记录战斗信息
        this.inInBattle = false;
        //回调列表
        //这么设计是主角比较特殊，可能存在多个要处理的状态，标记太多不好
        //比如在自宅休息的时候会存入一个回调，每次调用的时候更新人物的体力和生命值
        this.updateFuncArr = [];
        this.updateFuncIndex = 0;
        //自宅
        this.home = new SelfHome(MyGame.SELF_HOUSE_ID, undefined, undefined);
    }

    getSaveData() {

    }

    changePower(nowPower) {
        if (nowPower > MyGame.MAX_POWER || nowPower < 0) {
            MyGame.LogTool.showLog(`nowPower error ! in is ${nowPower}`);
            return;
        }
        this.power = nowPower;
        MyGame.EventManager.send(MyGame.EventName.USER_ROLE_STATUS_CHANGE);
    }

    /**
     * 判断是否在自己家所在的城市
     */
    inInHomePos(): boolean {
        return this.personPos.cityId === this.homePos;
    }

    getIndexByFunc(func: Function, data: any): number {
        let i: number;
        for (i = 0; i < this.updateFuncArr.length; i++) {
            if (this.updateFuncArr[i].func === func) {
                //判断参数
                if (MyGame.Tool.equal(data, this.updateFuncArr[i].data)) {
                    return i;
                }
            }
        }
        return undefined;
    }

    /**
     * 在人物身上增加一个循环回调函数
     * @param func 
     * @param data 
     */
    addOneFunction(func: Function, data: any): number {
        if (this.getIndexByFunc(func, data) >= 0) {
            return;
        }
        this.updateFuncIndex++;
        this.updateFuncArr.push({
            func: func,
            id: this.updateFuncIndex,
            data: data
        });
        return this.updateFuncIndex;
    }

    /**
     * 在人物身上清除一个循环回调函数
     * @param id 
     */
    removeOneFunctionById(id: number): boolean {
        let i, len;
        for (i = 0, len = this.updateFuncArr.length; i < len; i++) {
            if (this.updateFuncArr[i].id === id) {
                this.updateFuncArr.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    /**
     * 时间回调函数
     */
    timeUpdate(addMinutes: number) {
        this.updateFuncArr.forEach(function (funcData) {
            funcData.func(this, addMinutes, funcData.data);
        }.bind(this));
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
    }

    /**
     * 设置物品数量
     */
    setItemNum(itemId: number, num: number) {
        this.itemObj[itemId] = num;
    }
}