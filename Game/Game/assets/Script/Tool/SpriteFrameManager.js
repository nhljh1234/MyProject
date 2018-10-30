/*global module, require, cc, client */
/**
 * @desc 图片加载模块
 * @author Administrator
 */
var outModule = {};
var spriteFrameSave = {};

const SPRITE_FRAME_INIT_LOAD_ARR = [
  
];

outModule.getIcon = (key) => {
    let spriteAtlas = spriteFrameSave['ui/icon'];
    if (spriteAtlas) {
        return spriteAtlas.getSpriteFrame(key);
    }
};

/**
 * 初始化函数，会预先吧SPRITE_FRAME_INIT_LOAD_ARR下的图集全部加载起来
 * @param {Function} finishCb 
 */
outModule.init = (finishCb) => {
    let loadedCount = 0;
    //处理加载选项数量为0的情况
    if (loadedCount === SPRITE_FRAME_INIT_LOAD_ARR.length) {
        if (finishCb) {
            finishCb();
        }
        return;
    }
    SPRITE_FRAME_INIT_LOAD_ARR.forEach((path) => {
        outModule.loadSpriteFrame(path, (spriteAtlas) => {
            spriteFrameSave[path] = spriteAtlas;
            loadedCount++;
            if (loadedCount === SPRITE_FRAME_INIT_LOAD_ARR.length) {
                if (finishCb) {
                    finishCb();
                }
            }
        }, (error) => {
            g_LogTool.showLog(`SpriteFrameManager init error! path is ${path}, error is ${error}`);
            loadedCount++;
            if (loadedCount === SPRITE_FRAME_INIT_LOAD_ARR.length) {
                if (finishCb) {
                    finishCb();
                }
            }
        });
    });
};

/**
 * 动态加载一个图集
 * @param {String} path 
 * @param {Function} successCb 
 * @param {Function} failCb 
 */
outModule.loadSpriteFrame = (path, successCb, failCb) => {
    if (!path) {
        return;
    }
    if (spriteFrameSave[path]) {
        if (successCb) {
            successCb(spriteFrameSave[path]);
        }
        return;
    }
    cc.loader.loadRes(path, cc.SpriteAtlas, function (error, spriteAtlas) {
        if (error) {
            if (failCb) {
                failCb(error);
            }
            return;
        }
        spriteFrameSave[path] = spriteAtlas;
        if (successCb) {
            successCb(spriteAtlas);
        }
    });
};

module.exports = outModule;

