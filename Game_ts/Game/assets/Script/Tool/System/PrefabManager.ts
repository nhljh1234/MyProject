import MyGame = require('./Game');
interface loadData {
    pathStr: string;
    frequency: number;
};
//预加载数组
const PREFAB_INIT_LOAD_ARR: loadData[] = [];

interface prefabSaveData {
    prefabPath: string;
    prefab: cc.Prefab;
    prefabNodeArr: cc.Node[];
    frequency: number;
};
export let prefabSave: { [prefabPath: string]: prefabSaveData; } = {};

/**
 * 获取一个节点在prefabNodeArr的位置
 * @param {String} prefabPath 
 * @param {cc.Node} node 
 */
function getNodeIndexInPrefabNodeArr(prefabPath: string, node: cc.Node): void {

};

/**
 * 根据一个依赖的路径来获取loadres需要使用的路径
 * @param {String} assetsPathStr 
 */
function getLoadResPathStr(assetsPathStr: string) {
    let splitArr: string[];
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
function getAllClearDepends(clearArr: prefabSaveData[]) {
    let allDepends = [];
    clearArr.forEach((onePrefabData) => {
        //先处理要release的图集
        onePrefabData.prefabNodeArr.forEach((oneNode) => {
            let pathArr = MyGame.SpriteFrameManager.getAllUINodeUseSprite(oneNode);
            pathArr.forEach((onePath) => {
                let spriteDepends = cc.loader.getDependsRecursively(onePath);
                spriteDepends.forEach((assetsPathStr) => {
                    if (allDepends.indexOf(assetsPathStr) < 0) {
                        allDepends.push(assetsPathStr);
                    }
                });
            });
        });
        let depends = cc.loader.getDependsRecursively(onePrefabData.prefab);
        depends.forEach((assetsPathStr) => {
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
export function judgeCanClearPrefab(prefabData: prefabSaveData, canNotClearPrefabDataArr: prefabSaveData[]) {
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
export function getPrefab(prefabPath) {
    return prefabSave[prefabPath].prefab;
};
//清除所有的预制体
//没有绝对的把握不能使用，清除所有的依赖引用有可能会导致现有的其他界面出错
export function clearAll() {
    let key;
    for (key in prefabSave) {
        if (!prefabSave.hasOwnProperty(key)) {
            return;
        }
        clearPrefab(key);
    }
    prefabSave = {};
};
//清除指定预制体
//没有绝对的把握不能使用，清除所有的依赖引用有可能会导致现有的其他界面出错
//这个函数不会清除动态加载的依赖
/**
 * @param {Array} clearArr 
 */
export function clearPrefabWithoutUseSpreite(clearArr: prefabSaveData[]) {
    //先把所有的节点都清除了
    clearArr.forEach((onePrefabData) => {
        onePrefabData.prefabNodeArr.forEach(function (node) {
            node.destroy();
            MyGame.NodeTool.saveNodeValue(node, '_tj_isDestroy', true);
        });
    });
    let allClearDepends = getAllClearDepends(clearArr);
    let dependClearArr = [];
    allClearDepends.forEach((assetsPathStr) => {
        let loadResPathStr = getLoadResPathStr(assetsPathStr);
        if (!loadResPathStr || !loadResPathStr.length) {
            dependClearArr.push(assetsPathStr);
            return;
        }
        let spriteUseNodeArr = MyGame.SpriteFrameManager.spriteUseNodeObj[loadResPathStr];
        if (!spriteUseNodeArr) {
            dependClearArr.push(assetsPathStr);
            return;
        }
        let i, len = spriteUseNodeArr.length;
        for (i = 0; i < len; i++) {
            if (spriteUseNodeArr[i] && spriteUseNodeArr[i].UINode.isValid && !MyGame.NodeTool.getNodeValue(spriteUseNodeArr[i].UINode, '_tj_isDestroy')) {
                return;
            } else {
                MyGame.SpriteFrameManager.clearSprite(loadResPathStr);
            }
        }
        //如果用了这个资源的所有节点都被清楚了，那么就表示这张图片可以被卸载
        dependClearArr.push(assetsPathStr);
    });
    cc.loader.release(dependClearArr);
    clearArr.forEach((onePrefabData) => {
        prefabSave[onePrefabData.prefabPath] = undefined;
    });
};

//清除指定预制体
//没有绝对的把握不能使用，清除所有的依赖引用有可能会导致现有的其他界面出错
//这个函数不会清除动态加载的依赖
/**
 * @param {Array} clearArr 
 * @param {Array} canNotClearArr 
 */
export function clearPrefabInStrongMode(clearArr: prefabSaveData[], canNotClearArr: prefabSaveData[]) {
    //先获取现在显示的界面所有依赖的资源
    let dependArr = [];
    canNotClearArr.forEach((oneData) => {
        let depends = cc.loader.getDependsRecursively(oneData.prefab);
        depends.forEach((dependStr) => {
            if (dependArr.indexOf(dependStr) < 0) {
                dependArr.push(dependStr);
            }
        });
    });
    clearArr.forEach((onePrefabData) => {
        onePrefabData.prefabNodeArr.forEach(function (node) {
            node.destroy();
            MyGame.NodeTool.saveNodeValue(node, '_tj_isDestroy', true);
        });
    });
    let allClearDepends = getAllClearDepends(clearArr);
    let dependClearArr = [];
    allClearDepends.forEach((assetsPathStr) => {
        if (dependArr.indexOf(assetsPathStr) >= 0) {
            return;
        }
        let loadResPathStr = getLoadResPathStr(assetsPathStr);
        if (!loadResPathStr || !loadResPathStr.length) {
            dependClearArr.push(assetsPathStr);
            return;
        }
        let spriteUseNodeArr = MyGame.SpriteFrameManager.spriteUseNodeObj[loadResPathStr];
        if (!spriteUseNodeArr) {
            dependClearArr.push(assetsPathStr);
            return;
        }
        let i, len = spriteUseNodeArr.length;
        for (i = 0; i < len; i++) {
            if (spriteUseNodeArr[i] && spriteUseNodeArr[i].UINode.isValid && !MyGame.NodeTool.getNodeValue(spriteUseNodeArr[i].UINode, '_tj_isDestroy')) {
                return;
            } else {
                MyGame.SpriteFrameManager.clearSprite(loadResPathStr);
            }
        }
        dependClearArr.push(assetsPathStr);
    });
    cc.loader.release(dependClearArr);
    clearArr.forEach((onePrefabData) => {
        prefabSave[onePrefabData.prefabPath] = undefined;
    });
};

//清除指定预制体
//没有绝对的把握不能使用，清除所有的依赖引用有可能会导致现有的其他界面出错
/**
 * @param {String} prefabPath 
 */
export function clearPrefab(prefabPath: string) {
    if (!prefabSave[prefabPath]) {
        return;
    }
    //清除节点
    prefabSave[prefabPath].prefabNodeArr.forEach(function (node) {
        node.destroy();
        MyGame.NodeTool.saveNodeValue(node, '_tj_isDestroy', true);
    });
    let depends = cc.loader.getDependsRecursively(prefabSave[prefabPath].prefab);
    cc.loader.release(depends);
    prefabSave[prefabPath] = undefined;
};

/**
 * 对指定的prefab增加一个node引用
 * @param {String} prefabPath 
 * @param {cc.Node} node 
 */
export function addPrefabNode(prefabPath: string, node: cc.Node) {
    if (!prefabSave[prefabPath]) {
        return;
    }
    if (getNodeIndexInPrefabNodeArr(prefabPath, node) !== undefined) {
        return;
    }
    prefabSave[prefabPath].prefabNodeArr.push(node);
};

/**
 * 加载初始化需要的预制体
 * PREFAB_INIT_LOAD_ARR所有这边标记的预制件都会被预先加载起来
 * @param {Function} finishCb
 */
export function init(finishCb: Function) {
    var loadedCount = 0;
    //处理加载选项数量为0的情况
    if (loadedCount === PREFAB_INIT_LOAD_ARR.length) {
        if (finishCb) {
            finishCb();
        }
        return;
    }
    PREFAB_INIT_LOAD_ARR.forEach((pathData) => {
        loadPrefab(pathData.pathStr, (prefab) => {
            loadedCount++;
            if (loadedCount === PREFAB_INIT_LOAD_ARR.length) {
                if (finishCb) {
                    finishCb();
                }
            }
        }, (error) => {
            MyGame.LogTool.showLog(`PrefabManager init error! path is ${pathData.pathStr}, error is ${error}`);
            loadedCount++;
            if (loadedCount === PREFAB_INIT_LOAD_ARR.length) {
                if (finishCb) {
                    finishCb();
                }
            }
        }, pathData.frequency);
    });
}

/**
 * 加载一个预制体
 * @param {String} prefabPath
 * @param {Function} successCb
 * @param {Function} failCb
 * @param {Number} frequency 使用频率，这个值越高的越不会再自动清理中被清除
 */
export function loadPrefab(prefabPath, successCb, failCb, frequency) {
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
        prefabSave[prefabPath] = {
            prefabPath: prefabPath,
            prefab: prefab,
            prefabNodeArr: [],
            frequency: frequency || -1
        };
        if (successCb) {
            successCb(prefab);
        }
        MyGame.MemoryManager.memoryCheck();
    });
}