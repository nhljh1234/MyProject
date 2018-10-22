/*global module, require, cc, client */
/**
 * @desc 获取配置刷出来的JSON数据
 * @author Administrator
 */
var outModule = {};

outModule.init = () => {
    cc.loader.loadResDir('Excel_Data', function (err, objects, urls) {

    });
};

outModule.getTableByName = (table) => {

};

module.exports = outModule;