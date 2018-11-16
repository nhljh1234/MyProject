/**
 * 任务工厂
 */
var outModule = {};
var local = {};

/**
 * @param action 已经加好数据的任务，再增加一些操作函数
 */
local.buildFunc = function (action) {
    //执行动作，返回一个是否开始做了
    action.doAction = function (personData) {
        //开始做的话就直接返回
        if (action._isDoing) {
            return true;
        }
        //第一步判断是否在位置
        if (personData._pos.buildingId !== action._pos) {
            personData.goToBuilding(action._pos);
            return false;
        }
        if (!action._isDoing) {
            //表示刚开始做
            action._isDoing = true;
            action._nowUseTime = 0;
        }
        return true;
    };
    action.timeUpdate = function (personData, addMinutes) {
        if (!action._isDoing) {
            return;
        }
        //在野外
        if (personData._pos.cityId === -1) {
            action._isDoing = false;
            personData.goToBuilding(action._pos);
            return;
        }
        //判断是否在使用的建筑中，没有的话需要先移动到指定建筑
        let buildingData = g_GameGlobalManager.gameData.getCityById(personData._pos.cityId).getBuildingById(action._pos);
        if (!buildingData) {
            action._isDoing = false;
            personData.goToBuilding(action._pos);
            return;
        }
        action._nowUseTime = action._nowUseTime + addMinutes;
        if (action._nowUseTime > action._actionCostTime) {
            //判断是否要使用建筑功能
            if (action._pos !== -1) {
                buildingData.useBuilding(personData);
            } else {
                personData.useHome();
            }
            personData.actionFinishCb(action);
            action._isDoing = false;
        }
    };
    //获取存储的数据
    action.getSaveData = function () {
        return {
            id: action._id,
            nowUseTime: action._nowUseTime
        }
    };
};

/**
 * 新建一个任务
 */
local.createOneAction = function (actionId) {
    //配置数据
    this._id = parseInt(actionId);
    //任务数据
    var jsonData = g_JsonDataTool.getDataById('_table_action_action', actionId);
    //总用时
    this._actionCostTime = jsonData.costTime;
    //位置用一个数组表示，第一个元素表示城市id，第二个表示建筑id
    //配置表里面只会配置一个建筑id，当前城市没有这个建筑的话就需要去寻找最近的城市
    this._pos = parseInt(jsonData.pos);
    //收益列表
    //单数是id，双数是数量
    this._rewardArr = ('' + jsonData.rewardArr).split(',');
    //任务名字
    this._name = jsonData.name;
    //消耗体力
    this._costPower = jsonData.costPower || 0;
    //消耗的金钱
    this._costMoney = jsonData.costMoney || 0;

    //当前已执行的时间
    this._nowUseTime = 0;

    //新增函数
    local.buildFunc(this);
};

/**
 * @param saveData 存储的数据
 */
local.createOneActionSaveData = function (saveData) {
    //配置数据
    this._id = parseInt(saveData.id);
    //任务数据
    var jsonData = g_JsonDataTool.getDataById('_table_action_action', this._id);
    //总用时
    this._actionCostTime = jsonData.costTime;
    //位置用一个数组表示，第一个元素表示城市id，第二个表示建筑id
    //配置表里面只会配置一个建筑id，当前城市没有这个建筑的话就需要去寻找最近的城市
    this._pos = parseInt(jsonData.pos);
    //收益列表
    //单数是id，双数是数量
    this._rewardArr = ('' + jsonData.rewardArr).split(',');
    //任务名字
    this._name = jsonData.name;
    //消耗体力
    this._costPower = jsonData.costPower || 0;
    //消耗的金钱
    this._costMoney = jsonData.costMoney || 0;

    //当前已执行的时间
    this._nowUseTime = saveData.nowUseTime;

    //新增函数
    local.buildFunc(this);

    //新增函数
    local.buildFunc(this);
};

/**
 * @param actionId 任务id
 * @param saveData 存储的数据
 * 任务的计时
 */
outModule.createOneAction = (actionId, saveData) => {
    if (saveData) {
        return new local.createOneActionSaveData(saveData);
    }
    return new local.createOneAction(actionId);
};

module.exports = outModule;