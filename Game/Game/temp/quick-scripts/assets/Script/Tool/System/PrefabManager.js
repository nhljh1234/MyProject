(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Tool/System/PrefabManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '859154IvVNOJ7wZv/R2r8ht', 'PrefabManager', __filename);
// Script/Tool/System/PrefabManager.js

'use strict';

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
var PREFAB_INIT_LOAD_ARR = [];

/**
 * 获取一个节点在prefabNodeArr的位置
 * @param {String} prefabPath 
 * @param {cc.Node} node 
 */
local.getNodeIndexInPrefabNodeArr = function (prefabPath, node) {
    if (!outModule.prefabSave[prefabPath]) {
        return;
    }
    var len = outModule.prefabSave[prefabPath].prefabNodeArr.length,
        i = void 0;
    for (i = 0; i < len; i++) {
        if (outModule.prefabSave[prefabPath].prefabNodeArr[i] === node) {
            return i;
        }
    }
};

/**
 * 根据一个依赖的路径来获取loadres需要使用的路径
 * @param {String} assetsPathStr 
 */
local.getLoadResPathStr = function (assetsPathStr) {
    var splitArr = void 0;
    splitArr = assetsPathStr.split('resources/');
    if (splitArr.length < 2) {
        return;
    }
    splitArr = splitArr[1].split('.');
    return splitArr[0];
};

/**
 * 获取所有要清除的资源
 * @param {Array} clearArr 
 */
local.getAllClearDepends = function (clearArr) {
    var allDepends = [];
    clearArr.forEach(function (onePrefabData) {
        //先处理要release的图集
        onePrefabData.prefabNodeArr.forEach(function (oneNode) {
            var pathArr = g_SpriteFrameManager.getAllUINodeUseSprite(oneNode);
            pathArr.forEach(function (onePath) {
                var spriteDepends = cc.loader.getDependsRecursively(onePath);
                spriteDepends.forEach(function (assetsPathStr) {
                    if (allDepends.indexOf(assetsPathStr) < 0) {
                        allDepends.push(assetsPathStr);
                    }
                });
            });
        });
        var depends = cc.loader.getDependsRecursively(onePrefabData.prefab);
        depends.forEach(function (assetsPathStr) {
            if (allDepends.indexOf(assetsPathStr) < 0) {
                allDepends.push(assetsPathStr);
            }
        });
    });
    return allDepends;
};

/**
 * 判断一个预制体是否可以被清理
 * @param {Object} prefabData 
 * @param {Array} canNotClearPrefabDataArr 可以被清理的话应该是和这边的Depends数据没有冲突
 */
outModule.judgeCanClearPrefab = function (prefabData, canNotClearPrefabDataArr) {
    //先获取所有的依赖
    var dependArr = [];
    canNotClearPrefabDataArr.forEach(function (oneData) {
        var depends = cc.loader.getDependsRecursively(oneData.prefab);
        depends.forEach(function (dependStr) {
            if (dependArr.indexOf(dependStr) < 0) {
                dependArr.push(dependStr);
            }
        });
    });
    var depends = cc.loader.getDependsRecursively(prefabData.prefab);
    var i = void 0,
        len = depends.length;
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
outModule.getPrefab = function (prefabPath) {
    return outModule.prefabSave[prefabPath].prefab;
};

//清除所有的预制体
//没有绝对的把握不能使用，清除所有的依赖引用有可能会导致现有的其他界面出错
outModule.clearAll = function () {
    var key = void 0;
    for (key in outModule.prefabSave) {
        if (!outModule.prefabSave.hasOwnProperty(key)) {
            return;
        }
        outModule.clearPrefab(key);
    }
    outModule.prefabSave = {};
};

//清除指定预制体
//没有绝对的把握不能使用，清除所有的依赖引用有可能会导致现有的其他界面出错
//这个函数不会清除动态加载的依赖
/**
 * @param {Array} clearArr 
 */
outModule.clearPrefabWithoutUseSpreite = function (clearArr) {
    //先把所有的节点都清除了
    clearArr.forEach(function (onePrefabData) {
        onePrefabData.prefabNodeArr.forEach(function (node) {
            node.destroy();
            node._tj_isDestroy = true;
        });
    });
    var allClearDepends = local.getAllClearDepends(clearArr);
    var dependClearArr = [];
    allClearDepends.forEach(function (assetsPathStr) {
        var loadResPathStr = local.getLoadResPathStr(assetsPathStr);
        if (!loadResPathStr || !loadResPathStr.length) {
            dependClearArr.push(assetsPathStr);
            return;
        }
        var spriteUseNodeArr = g_SpriteFrameManager.spriteUseNodeObj[loadResPathStr];
        if (!spriteUseNodeArr) {
            dependClearArr.push(assetsPathStr);
            return;
        }
        var i = void 0,
            len = spriteUseNodeArr.length;
        for (i = 0; i < len; i++) {
            if (spriteUseNodeArr[i] && spriteUseNodeArr[i].isValid && !spriteUseNodeArr[i]._tj_isDestroy) {
                return;
            } else {
                g_SpriteFrameManager.clearSprite(loadResPathStr);
            }
        }
        dependClearArr.push(assetsPathStr);
    });
    cc.loader.release(dependClearArr);
    clearArr.forEach(function (onePrefabData) {
        outModule.prefabSave[onePrefabData.prefabPath] = undefined;
    });
};

//清除指定预制体
//没有绝对的把握不能使用，清除所有的依赖引用有可能会导致现有的其他界面出错
//这个函数不会清除动态加载的依赖
/**
 * @param {Array} clearArr 
 * @param {Array} canNotClearArr 
 */
outModule.clearPrefabInStrongMode = function (clearArr, canNotClearArr) {
    //先获取现在显示的界面所有依赖的资源
    var dependArr = [];
    canNotClearArr.forEach(function (oneData) {
        var depends = cc.loader.getDependsRecursively(oneData.prefab);
        depends.forEach(function (dependStr) {
            if (dependArr.indexOf(dependStr) < 0) {
                dependArr.push(dependStr);
            }
        });
    });
    clearArr.forEach(function (onePrefabData) {
        onePrefabData.prefabNodeArr.forEach(function (node) {
            node.destroy();
            node._tj_isDestroy = true;
        });
    });
    var allClearDepends = local.getAllClearDepends(clearArr);
    var dependClearArr = [];
    allClearDepends.forEach(function (assetsPathStr) {
        if (dependArr.indexOf(assetsPathStr) >= 0) {
            return;
        }
        var loadResPathStr = local.getLoadResPathStr(assetsPathStr);
        if (!loadResPathStr || !loadResPathStr.length) {
            dependClearArr.push(assetsPathStr);
            return;
        }
        var spriteUseNodeArr = g_SpriteFrameManager.spriteUseNodeObj[loadResPathStr];
        if (!spriteUseNodeArr) {
            dependClearArr.push(assetsPathStr);
            return;
        }
        var i = void 0,
            len = spriteUseNodeArr.length;
        for (i = 0; i < len; i++) {
            if (spriteUseNodeArr[i] && spriteUseNodeArr[i].isValid && !spriteUseNodeArr[i]._tj_isDestroy) {
                return;
            } else {
                g_SpriteFrameManager.clearSprite(loadResPathStr);
            }
        }
        dependClearArr.push(assetsPathStr);
    });
    cc.loader.release(dependClearArr);
    clearArr.forEach(function (onePrefabData) {
        outModule.prefabSave[onePrefabData.prefabPath] = undefined;
    });
};

//清除指定预制体
//没有绝对的把握不能使用，清除所有的依赖引用有可能会导致现有的其他界面出错
/**
 * @param {String} prefabPath 
 */
outModule.clearPrefab = function (prefabPath) {
    if (!outModule.prefabSave[prefabPath]) {
        return;
    }
    //清除节点
    outModule.prefabSave[prefabPath].prefabNodeArr.forEach(function (node) {
        node.destroy();
        node._tj_isDestroy = true;
    });
    var depends = cc.loader.getDependsRecursively(outModule.prefabSave[prefabPath].prefab);
    cc.loader.release(depends);
    outModule.prefabSave[prefabPath] = undefined;
};

/**
 * 对指定的prefab增加一个node引用
 * @param {String} prefabPath 
 * @param {cc.Node} node 
 */
outModule.addPrefabNode = function (prefabPath, node) {
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
outModule.init = function (finishCb) {
    var loadedCount = 0;
    //处理加载选项数量为0的情况
    if (loadedCount === PREFAB_INIT_LOAD_ARR.length) {
        if (finishCb) {
            finishCb();
        }
        return;
    }
    PREFAB_INIT_LOAD_ARR.forEach(function (pathData) {
        outModule.loadPrefab(pathData.pathStr, function (prefab) {
            loadedCount++;
            if (loadedCount === PREFAB_INIT_LOAD_ARR.length) {
                if (finishCb) {
                    finishCb();
                }
            }
        }, function (error) {
            g_LogTool.showLog('PrefabManager init error! path is ' + path + ', error is ' + error);
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
outModule.loadPrefab = function (prefabPath, successCb, failCb, frequency) {
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

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=PrefabManager.js.map
        