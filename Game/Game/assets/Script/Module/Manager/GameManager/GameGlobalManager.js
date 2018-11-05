/**
 * 这个模块下记录了一些全局性的东西，比如当前的时间
 */
var outModule = {};
var local = {};

//全局的游戏类
outModule.gameData;
//承载定时器的component
local.component;

//标记时间，就是现实中的1秒表示多少分钟
const ONE_SECOND_GAME_MINUTE = 50;
//定时器间隔时间
const TIMER_TIME = 0;

/**
 * 时间更新函数
 */
local.minuteUpdate = function () {
    //let addMinute = TIMER_TIME * ONE_SECOND_GAME_MINUTE;
    let addMinute = ONE_SECOND_GAME_MINUTE;
    if (outModule.gameData && outModule.gameData.timeUpdate) {
        outModule.gameData.timeUpdate(addMinute);
    }
};

/**
 * @param component 组件
 * @param gameData GameFactory生成的数据
 */
outModule.init = (component, gameData) => {
    local.component = component;
    outModule.gameData = gameData;
};

/**
 * 开始游戏中的定时器
 */
outModule.start = () => {
    if (local.component) {
        local.component.schedule(local.minuteUpdate, TIMER_TIME, cc.macro.REPEAT_FOREVER);
    }
};

/**
 * 停止游戏的定时器
 */
outModule.stop = () => {
    local.component.unschedule(local.minuteUpdate);
};

module.exports = outModule;