import { MyGame } from "../../Tool/System/Game";
import { Game } from "../../Data/GameFactory";
import { UserRole } from "../../Data/UserRoleFactory";

/*global module, require, cc, client */
/**
 * 这个模块下记录了一些全局性的东西，比如当前的时间
 */

//全局的游戏类
export let gameDataSave: Game;
//玩家数据
export let userRole: UserRole;
//已用的最大人物id
export let maxPersonId: number = 1;
//承载定时器的component
let componentDave: cc.Component;

//标记时间，就是每帧世界运行的分钟数
const ONE_SECOND_GAME_MINUTE = 10;
//定时器间隔时间
//设定为可变的
export const TIMER_TIME = 1;
//是否暂停时间运行
let pauseFlag = false;

/**
 * 时间更新函数
 */
function minuteUpdate() {
    let addMinute = ONE_SECOND_GAME_MINUTE;
    if (gameDataSave && gameDataSave.timeUpdate) {
        gameDataSave.timeUpdate(addMinute);
    }
};

/**
 * 定时器函数
 * local.pause作用于此
 */
function timeUpdate() {
    let lastTime, nowTime;
    lastTime = new Date().getTime();
    if (!pauseFlag) {
        minuteUpdate();
    }
    nowTime = new Date().getTime();
    let useSeconds = (nowTime - lastTime) / 1000;
    //保证不超过1
    useSeconds = useSeconds > 1 ? 1 : useSeconds;
    //再次执行定时器
    componentDave.unschedule(timeUpdate);
    componentDave.schedule(timeUpdate, TIMER_TIME - useSeconds, 1);
};

//获取一个新的人物id
export function getNewPersonId() {
    maxPersonId++;
    return maxPersonId - 1;
};

/**
 * @param component 组件
 * @param gameData GameFactory生成的数据
 */
export function init(component: cc.Component, gameData: any) {
    componentDave = component;
    gameDataSave = gameData;
    //将配置中的名字都设置为不可随机的
    MyGame.RandomNameTool.initAllNameArr(MyGame.JsonDataTool.getTableByName('_table_person_person').array);
};

/**
 * 开始游戏中的定时器
 */
export function start() {
    if (componentDave) {
        componentDave.schedule(timeUpdate, TIMER_TIME, 1);
    }
};

/**
 * 停止游戏的定时器
 */
export function stop() {
    componentDave.unschedule(timeUpdate);
};

/**
 * 暂停游戏
 */
export function pause() {
    pauseFlag = true;
};
