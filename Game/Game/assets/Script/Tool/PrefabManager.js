/*global module, require, cc, client */
/**
 * @desc 预制体加载管理模块
 * @author Administrator
 */
var outModule = {};

//预制体缓存
var prefabSave = {};

//初始化会加载的预制体
const PREFAB_INIT_LOAD_ARR = [

];

/**
 * 获取预制体
 */
outModule.getPrefab = (path) => {
    return prefabSave[path];
};

//清除所有的预制体
outModule.clearAll = () => {
    let key;
    for (key in prefabSave) {
        if (!prefabSave.hasOwnProperty(key)) {
            return;
        }
        let depends = cc.loader.getDependsRecursively(prefabSave[key]);
        cc.loader.release(depends);
    }
    prefabSave = {};
};

//清除制定预制体
outModule.clearPrefab = (prefabPath) => {
    if (!prefabSave[prefabPath]) {
        return;
    }
    let depends = cc.loader.getDependsRecursively(prefabSave[prefabPath]);
    cc.loader.release(depends);
};

/**
 * 加载初始化需要的预制体
 * @param cb
 */
outModule.init = (cb) => {
    var loadedCount = 0;
    PREFAB_INIT_LOAD_ARR.forEach((path) => {
        outModule.loadPrefab(path, false, (prefab) => {
            //判断是否加入了，有的话会覆盖原先的
            prefabSave[path] = prefab;
            loadedCount++;
            if (loadedCount === PREFAB_INIT_LOAD_ARR.length) {
                if (cb) {
                    cb();
                }
            }
        }, (error) => {
            Global.LogTool.showLog(`PrefabManager init error! path is ${path}, error is ${error}`);
            loadedCount++;
            if (loadedCount === PREFAB_INIT_LOAD_ARR.length) {
                if (cb) {
                    cb();
                }
            }
        });
    });
};

/**
 * 加载一个预制体
 * @param prefabPath
 * @param deleteFlag 是否清除预制体，就是会不会在cb之后清除预制体，默认不清除
 * @param successCb
 * @param failCb
 */
outModule.loadPrefab = (prefabPath, deleteFlag, successCb, failCb) => {
    //看看是否有缓存
    if (prefabSave[prefabPath]) {
        if (successCb) {
            successCb(prefabSave[prefabPath]);
        }
        return;
    }
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
            let depends = cc.loader.getDependsRecursively(prefab);
            cc.loader.release(depends);
        }
    });
};

module.exports = outModule;