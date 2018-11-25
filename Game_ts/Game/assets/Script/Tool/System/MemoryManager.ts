import { MyGame } from "./Game";

/**
 * 更具图片格式返回一个像素所占字节
 * @param {*} pixelFormat 
 */
function getPixelFormatSize(pixelFormat: cc.Texture2D.PixelFormat) {
    switch (pixelFormat) {
        case cc.Texture2D.PixelFormat.RGB565:
            return 16;
        case cc.Texture2D.PixelFormat.RGB5A1:
            return 16;
        case cc.Texture2D.PixelFormat.RGBA4444:
            return 16;
        case cc.Texture2D.PixelFormat.RGB888:
            return 24;
        case cc.Texture2D.PixelFormat.RGBA8888:
            return 32;
        case cc.Texture2D.PixelFormat.A8:
            return 8;
        case cc.Texture2D.PixelFormat.I8:
            return 8;
        case cc.Texture2D.PixelFormat.AI88:
            return 16;
    }
    return 16;
}

/**
 * 获取一张图片所占的内存
 * @param {Number} width 
 * @param {Number} height 
 * @param {enum} pixelFormat 图片格式
 */
function getImgUseMemoryBySize(width, height, pixelFormat) {
    return width * height * getPixelFormatSize(pixelFormat) / (8 * 1024 * 1024);
}

/**
 * 获取当前图片使用的内存数量
 * 返回的数量是MB
 */
export function getNowSpriteUseMemory() {
    let textureArr = cc.textureCache.getAllTextures();
    let totleUseMemory = 0;
    textureArr.forEach((oneTexture) => {
        totleUseMemory = totleUseMemory + getImgUseMemoryBySize(oneTexture.pixelWidth, oneTexture.pixelHeight, oneTexture.pixelFormat);
    });
    return totleUseMemory;
}

/**
 * 检测内存情况
 */
export function memoryCheck() {
    //if (getNowSpriteUseMemory() > MyGame.MAX_MEMORY_NUM) {
        clearMemory();
    //}
}

/**
 * 开始自动清除内存
 *  {
        prefabPath: prefabPath,
        prefab: prefab,
        prefabNodeArr: [],
        frequency: frequency || -1 -1表示永远不会被清除
    }
 */
export function clearMemory() {
    if (!MyGame.AUTO_CLEAR_MEMORY_FLAG) {
        return;
    }
    let prefabSave = MyGame.PrefabManager.prefabSave;
    let clearArr = [];
    let allPrefabArr = [];
    //这个是不可以清除的预制体数组
    let canNotClearArr = [];
    for (var key in prefabSave) {
        if (!prefabSave.hasOwnProperty(key) || !prefabSave[key]) {
            continue;
        }
        allPrefabArr.push(prefabSave[key]);
    }
    //先排除不可清理的
    allPrefabArr.forEach((onePrefabData) => {
        //如果prefabNodeArr里面有一个节点的node的active是true的话就不能清除了
        let i, len = onePrefabData.prefabNodeArr.length;
        for (i = 0; i < len; i++) {
            if (onePrefabData.prefabNodeArr[i].active) {
                canNotClearArr.push(onePrefabData);
                return;
            }
        }
        if (onePrefabData.frequency !== -1) {
            clearArr.push(onePrefabData);
        }
    });
    if (MyGame.USE_STRONG_CLEAR_MODE) {
        MyGame.PrefabManager.clearPrefabInStrongMode(clearArr, canNotClearArr);
        MyGame.SpriteFrameManager.clearDestroyNode();
        return;
    }
    //按frequency从小到大排序
    clearArr.sort((data_1, data_2) => {
        return data_1.frequency - data_2.frequency;
    });
    //再次判断，如果清除的prefab有依赖和canNotClearArr里面的prefab冲突，则不能被清除
    while (true) {
        let newClearArr = [];
        clearArr.forEach((onePrefabData) => {
            if (MyGame.PrefabManager.judgeCanClearPrefab(onePrefabData, canNotClearArr)) {
                newClearArr.push(onePrefabData);
            }
        });
        if (newClearArr.length === clearArr.length) {
            break;
        }
        clearArr = newClearArr;
    }
    //开始清除，剩余内存小于g_MAX_MEMORY_NUM时停止
    MyGame.PrefabManager.clearPrefabWithoutUseSpreite(clearArr);
    MyGame.SpriteFrameManager.clearDestroyNode();
}