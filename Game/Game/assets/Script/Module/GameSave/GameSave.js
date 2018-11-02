var outModule = {};
var local = {};

//记住，有一个是自动的存储位置
//提供给玩家的存储位置是10个
outModule.MAX_SAVE_NUM = 10;

/**
 * 保存游戏
 * @param index 存储的index，不传表示自动存储
 */
outModule.saveGame = (index) => {
    //存成一个json数据
    var jsonData = {};

    if (index) {
        if (index > outModule.MAX_SAVE_NUM) {
            return;
        }
        cc.sys.localStorage.setItem(`game_save_${index}`, JSON.stringify(jsonData));
    } else {
        cc.sys.localStorage.setItem('auto_save', JSON.stringify(jsonData));
    }
};

/**
 * 获取游戏存储的对象
 * @param index 存储的index
 */
outModule.getSaveData = (index) => {
    return index ? cc.sys.localStorage.getItem(`game_save_${index}`) : cc.sys.localStorage.getItem('auto_save');
};

module.exports = outModule;