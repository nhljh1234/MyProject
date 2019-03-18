import { MyGame } from "../../Tool/System/Game";
import { Game } from "../../Data/GameFactory";
import { UserRole } from "../../Data/Person/UserRoleFactory";

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
let componentSave: cc.Component;

//标记时间，就是每帧世界运行的分钟数
const ONE_SECOND_GAME_MINUTE = 1;
//定时器间隔时间
export let gameSpeed = 1;
//设定为可变的
export let timerTime = 1;
//初始的定时器时间
const TIMER_TIME = 1;
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
    componentSave.unschedule(timeUpdate);
    if (timerTime === 0) {
        //表示停止
        return;
    }
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
    componentSave.schedule(timeUpdate, (timerTime - useSeconds) < 0 ? 0 : (timerTime - useSeconds), 1);
};

/**
 * 改变游戏循环的熟虑
 */
export function changeGameSpeed(speed) {
    gameSpeed = speed;
    timerTime = gameSpeed ? (TIMER_TIME / gameSpeed) : 0;
    if (speed !== 0) {
        componentSave.schedule(timeUpdate, timerTime, 1);
    }
};

export function gameSpeedResetting() {
    gameSpeed = 0;
    changeGameSpeed(gameSpeed);
}

//获取一个新的人物id
export function getNewPersonId() {
    maxPersonId++;
    return maxPersonId - 1;
};

/**
 * @param component 组件
 */
export function initComponent(component: cc.Component) {
    componentSave = component;
};

/**
 * @param component 组件
 */
export function initGame(gameData: Game) {
    gameDataSave = gameData;
    //将配置中的名字都设置为不可随机的
    MyGame.RandomNameTool.initAllNameArr(MyGame.JsonDataTool.getTableArrByName('person', 'person'));
};

/**
 * 开始游戏中的定时器
 */
export function start() {
    if (componentSave) {
        this.gameSpeedResetting();
        //componentSave.schedule(timeUpdate, timerTime, 1);
    }
};

/**
 * 停止游戏的定时器
 */
export function stop() {
    componentSave.unschedule(timeUpdate);
};

/**
 * 暂停游戏
 */
export function pause() {
    pauseFlag = true;
};
