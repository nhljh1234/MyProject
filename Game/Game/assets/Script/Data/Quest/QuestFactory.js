/**
 * 任务工厂
 */
var outModule = {};
var local = {};

/**
 * @param quest 已经加好数据的任务，再增加一些操作函数
 */
local.buildFunc = function (quest) {
    //执行任务
    quest.doQuest = function (personData) {
        //第一步判断是否在位置
        if (personData._pos[0] !== quest._pos[0] || personData._pos[1] !== quest._pos[1]) {
            personData.goToBuilding(quest._pos[0], quest._pos[1]);
            return;
        }
        if (!quest._isDoing) {
            //表示刚开始做
            quest._isDoing = true;
            quest._nowUseTime = 0;
        }
    };
    quest.timeUpdate = function (personData, addMinutes) {
        if (!quest._isDoing) {
            return;
        }
        quest._nowUseTime = quest._nowUseTime + addMinutes;
        if (quest._nowUseTime > this._questCostTime) {
            personData.questFinishCb(quest);
            quest._isDoing = false;
        }
    };
};

/**
 * 新建一个任务
 */
local.createOneQuest = function (questId) {
    //配置数据
    this._id = questId;
    //总用时
    this._questCostTime = 0;
    //位置用一个数组表示，第一个元素表示城市id，第二个表示建筑id
    //配置表里面只会配置一个建筑id，当前城市没有这个建筑的话就需要去寻找最近的城市
    this._pos = 0;
    //收益列表
    //单数是id，双数是数量
    this._rewardArr = [];

    //当前已执行的时间
    this._nowUseTime = 0;

    //新增函数
    local.buildFunc(this);
};

/**
 * @param saveData 存储的数据
 */
local.createOneQuestSaveData = function (saveData) {
    this._id = saveData.id;

    //当前已执行的时间
    this._nowUseTime = saveData.nowUseTime;

    //新增函数
    local.buildFunc(this);
};

/**
 * @param equipmentId 任务id
 * @param saveData 存储的数据
 * 任务的计时
 */
outModule.createOneSellGood = (equipmentId, saveData) => {
    if (saveData) {
        return new local.createOneQuestSaveData(saveData);
    }
    return new local.createOneQuest(equipmentId);
};

module.exports = outModule;