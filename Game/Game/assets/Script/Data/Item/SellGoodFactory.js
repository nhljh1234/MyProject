/**
 * 商品工厂
 */
var outModule = {};
var local = {};

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

    };

    /**
     * 出售物品
     */
    sellGood.sell = (personData) => {

    };
};

/**
 * 新建一个商品
 */
local.createOneSellGood = function (sellGoodId, personData) {
    //存储id
    this._id = parseInt(sellGoodId);
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
    //唯一id
    this._itemId = personData.getNewItemId();

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