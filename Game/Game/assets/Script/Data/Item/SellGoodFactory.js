/**
 * 商品工厂
 */
var outModule = {};
var local = {};

local.useSellGoodFunc = {};

//治疗
local.useSellGoodFunc.treat = function (person, sellGood, index) {
    let numArr = sellGood._functionNumArr[index];
    person._nowHp = person._nowHp + numArr[0];
    if (person._nowHp > person._maxHp) {
        person._nowHp = person._maxHp;
    }
};

/**
 * @param sellGood 已经加好数据的商品，再增加一些操作函数
 */
local.buildFunc = function (sellGood) {
    /**
     * 每天的更新函数
     */
    sellGood.dayUpdate = (personData) => {
        if (sellGood._overdueTime !== -1) {
            sellGood._getTime++;
            if (sellGood._getTime >= sellGood._overdueTime) {
                //转变物品
                personData.removeItemByItemId(sellGood._itemId);
                //新增一个物品
                personData.getItem([sellGood._overdueGood, 1]);
            }
        }
    };

    /**
     * 使用物品
     */
    sellGood.use = (personData) => {
        g_LogTool.showLog(`${personData._name} 使用 ${sellGood._name}`);
        sellGood._functionArr.forEach(function (oneData, index) {
            if (local.useSellGoodFunc[oneData.type]) {
                local.useSellGoodFunc[oneData.type](personData, sellGood, index);
            }
        });
        //消耗物品
        personData.removeItemByItemId(sellGood.itemId);
    };

    /**
     * 出售物品
     */
    sellGood.sell = (personData) => {
        personData.money = personData.money + sellGood._price;
    };
    //获取存储数据
    sellGood.getSaveData = function () {
        return {
            id: sellGood._id,
            itemId: sellGood._itemId,
            getTime: sellGood._getTime
        }
    };
    //判断物品是否有一个功能
    sellGood.judgeHaveFunctionByName = function (typeName) {
        return sellGood._functionArr.find(function (oneData) {
            oneData.type === typeName;
        });
    };
};

/**
 * 新建一个商品
 */
local.createOneSellGood = function (sellGoodId, personData) {
    //存储id
    this._itemId = parseInt(sellGoodId);
    //数据
    var jsonData = g_JsonDataTool.getDataById('_table_item_sellGood', sellGoodId);
    //名字
    this._name = jsonData.name;
    //价格
    this._price = jsonData.price;
    //过期时间
    this._overdueTime = jsonData.overdue;
    //过期后转换成的物品
    this._overdueGood = jsonData.overdueGood;
    //功能
    this._functionArr = jsonData.function ? ('' + jsonData.function).split(',') : [];
    this._functionArr = this._functionArr.map(function (id) {
        return g_JsonDataTool.getDataById('_table_item_itemFunction', id);
    });
    this._functionNumArr = jsonData.functionNum ? ('' + jsonData.functionNum).split(',') : [];
    this._functionNumArr = this._functionNumArr.map(function (str) {
        return ('' + str).split('/');
    });
    //唯一id
    this._id = personData.getNewItemId();

    //获得的时间
    //单位是天
    this._getTime = 0;

    //新增函数
    local.buildFunc(this);
};

/**
 * @param saveData 存储的数据
 */
local.createOneSellGoodBySaveData = function (saveData) {
    //存储id
    this._itemId = parseInt(saveData.itemId);
    //数据
    var jsonData = g_JsonDataTool.getDataById('_table_item_sellGood', this._itemId);
    //名字
    this._name = jsonData.name;
    //价格
    this._price = jsonData.price;
    //过期时间
    this._overdueTime = jsonData.overdue;
    //过期后转换成的物品
    this._overdueGood = jsonData.overdueGood;
    //功能
    this._functionArr = jsonData.function ? ('' + jsonData.function).split(',') : [];
    this._functionArr = this._functionArr.map(function (id) {
        return g_JsonDataTool.getDataById('_table_item_itemFunction', id);
    });
    this._functionNumArr = jsonData.functionNum ? ('' + jsonData.functionNum).split(',') : [];
    this._functionNumArr = this._functionNumArr.map(function (str) {
        return ('' + str).split('/');
    });
    //唯一id
    this._id = saveData.id;

    //获得的时间
    //单位是天
    this._getTime = saveData.getTime;
    //新增函数
    local.buildFunc(this);
};

/**
 * @param sellGoodId 商品id
 * @param saveData 存储的数据
 */
outModule.createOneSellGood = (sellGoodId, saveData, personData) => {
    if (saveData) {
        return new local.createOneSellGoodBySaveData(saveData);
    }
    return new local.createOneSellGood(sellGoodId, personData);
};

module.exports = outModule;