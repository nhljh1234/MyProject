/*global module, require, cc, client */
/**
 * @desc 预制体加载管理模块
 * @author Administrator
 */
var outModule = {};

/**
 * 加载一个预制体
 * @param prefabPath
 * @param deleteFlag 是否清除预制体，就是会不会在cb之后清除预制体，默认不清除
 * @param successCb
 * @param failCb
 */
outModule.loadPrefab = (prefabPath, deleteFlag, successCb, failCb) => {
    cc.loader.loadRes(prefabPath, cc.Prefab, function (err, prefab) {
        if (err) {
            if (failCb) {
                failCb(err);
            }
            return;
        }
        if (successCb) {
            successCb(prefab);
        }
        if (deleteFlag) {
            //清除所有的依赖资源
            var depends = cc.loader.getDependsRecursively(prefab);
            cc.loader.release(depends);
        }
    });
};

module.exports = outModule;