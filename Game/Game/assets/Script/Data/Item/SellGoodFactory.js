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
    this.dayUpdate = () => {

    };

    /**
     * 使用物品
     */
    this.use = () => {

    };

    /**
     * 出售物品
     */
    this.sell = () => {

    };
};

/**
 * 新建一个商品
 */
local.createOneSellGood = function (sellGoodId) {
    //存储id
    this._id = parseInt(sellGoodId);
    //数据
    var jsonData = g_JsonDataTool.getDataById('_table_item_sellGood', sellGoodId);
    //名字
    this._name = jsonData.name;
    //价格
    this._price = jsonData.price;
    //过期时间
    this._overdue = jsonData.overdue;
    //过期后转换成的物品
    this._overdueGood = jsonData.overdueGood;

    this._overdueTime = this._overdueGood;

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
outModule.createOneSellGood = (sellGoodId, saveData) => {
    if (saveData) {
        return new local.createOneSellGoodBySaveData(saveData);
    }
    return new local.createOneSellGood(sellGoodId);
};

module.exports = outModule;