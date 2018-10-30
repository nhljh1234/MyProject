/*global module, require, cc, client */
/**
 * @desc 预制体加载管理模块
 * @author Administrator
 */
var outModule = {};
var local = {};

//预制体缓存
/**
 * {
        prefabPath: prefabPath,
        prefab: prefab,
        prefabNodeArr: [],
        frequency: frequency || -1 -1表示永远不会被清除
    }
 */
outModule.prefabSave = {};

//初始化会加载的预制体
/**
 * {
 *      pathStr: xxx
 *      frequency: xxx
 * }
 */
const PREFAB_INIT_LOAD_ARR = [

];

/**
 * 获取一个节点在prefabNodeArr的位置
 * @param {String} prefabPath 
 * @param {cc.Node} node 
 */
local.getNodeIndexInPrefabNodeArr = (prefabPath, node) => {
    if (!outModule.prefabSave[prefabPath]) {
        return;
    }
    let len = outModule.prefabSave[prefabPath].prefabNodeArr.length, i;
    for (i = 0; i < len; i++) {
        if (outModule.prefabSave[prefabPath].prefabNodeArr[i] === node) {
            return i;
        }
    }
};

/**
 * 判断一个预制体是否可以被清理
 * @param {Object} prefabData 
 * @param {Array} canNotClearPrefabDataArr 可以被清理的话应该是和这边的Depends数据没有冲突
 */
outModule.judgeCanClearPrefab = (prefabData, canNotClearPrefabDataArr) => {
    //先获取所有的依赖
    let dependArr = [];
    canNotClearPrefabDataArr.forEach((oneData) => {
        let depends = cc.loader.getDependsRecursively(oneData.prefab);
        depends.forEach((dependStr) => {
            if (dependArr.indexOf(dependStr) < 0) {
                dependArr.push(dependStr);
            }
        });
    });
    let depends = cc.loader.getDependsRecursively(prefabData.prefab);
    let i, len = depends.length;
    for (i = 0; i < len; i++) {
        if (dependArr.indexOf(depends[i]) >= 0) {
            return false;
        }
    }
    return true;
};

/**
 * 获取预制体
 * @param {String} prefabPath 
 */
outModule.getPrefab = (prefabPath) => {
    return outModule.prefabSave[prefabPath].prefab;
};

//清除所有的预制体
//没有绝对的把握不能使用，清除所有的依赖引用有可能会导致现有的其他界面出错
outModule.clearAll = () => {
    let key;
    for (key in outModule.prefabSave) {
        if (!outModule.prefabSave.hasOwnProperty(key)) {
            return;
        }
        outModule.clearPrefab(key);
    }
    outModule.prefabSave = {};
};

//清除制定预制体
//没有绝对的把握不能使用，清除所有的依赖引用有可能会导致现有的其他界面出错
/**
 * @param {String} prefabPath 
 */
outModule.clearPrefab = (prefabPath) => {
    if (!outModule.prefabSave[prefabPath]) {
        return;
    }
    //清除节点
    outModule.prefabSave[prefabPath].prefabNodeArr.forEach(function (node) {
        node.destroy();
    });
    let depends = cc.loader.getDependsRecursively(outModule.prefabSave[prefabPath].prefab);
    cc.loader.release(depends);
    outModule.prefabSave[prefabPath] = undefined;
};

/**
 * 对指定的prefab增加一个node引用
 * @param {String} prefabPath 
 * @param {cc.Node} node 
 */
outModule.addPrefabNode = (prefabPath, node) => {
    if (!outModule.prefabSave[prefabPath]) {
        return;
    }
    if (local.getNodeIndexInPrefabNodeArr(prefabPath, node) !== undefined) {
        return;
    }
    outModule.prefabSave[prefabPath].prefabNodeArr.push(node);
};

/**
 * 加载初始化需要的预制体
 * PREFAB_INIT_LOAD_ARR所有这边标记的预制件都会被预先加载起来
 * @param {Function} finishCb
 */
outModule.init = (finishCb) => {
    var loadedCount = 0;
    //处理加载选项数量为0的情况
    if (loadedCount === PREFAB_INIT_LOAD_ARR.length) {
        if (finishCb) {
            finishCb();
        }
        return;
    }
    PREFAB_INIT_LOAD_ARR.forEach((pathData) => {
        outModule.loadPrefab(pathData.pathStr, (prefab) => {
            loadedCount++;
            if (loadedCount === PREFAB_INIT_LOAD_ARR.length) {
                if (finishCb) {
                    finishCb();
                }
            }
        }, (error) => {
            g_LogTool.showLog(`PrefabManager init error! path is ${path}, error is ${error}`);
            loadedCount++;
            if (loadedCount === PREFAB_INIT_LOAD_ARR.length) {
                if (finishCb) {
                    finishCb();
                }
            }
        }, pathData.frequency);
    });
};

/**
 * 加载一个预制体
 * @param {String} prefabPath
 * @param {Function} successCb
 * @param {Function} failCb
 * @param {Number} frequency 使用频率，这个值越高的越不会再自动清理中被清除
 */
outModule.loadPrefab = (prefabPath, successCb, failCb, frequency) => {
    //看看是否有缓存
    if (outModule.prefabSave[prefabPath]) {
        if (successCb) {
            successCb(outModule.prefabSave[prefabPath]);
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
        outModule.prefabSave[prefabPath] = {
            prefabPath: prefabPath,
            prefab: prefab,
            prefabNodeArr: [],
            frequency: frequency || -1
        };
        if (successCb) {
            successCb(prefab);
        }
        g_MemoryManager.memoryCheck();
    });
};

module.exports = outModule;