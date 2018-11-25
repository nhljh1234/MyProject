(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Tool/System/SpriteFrameManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3fe6dZ+jBdLv4HP46zaa054', 'SpriteFrameManager', __filename);
// Script/Tool/System/SpriteFrameManager.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*global module, require, cc, client */
/**
 * @desc 图片加载模块
 * @author Administrator
 */
var outModule = {};
var local = {};
var spriteAtlasSave = {};
var spriteFrameSave = {};

//记录一个动态加载的图集或者图片
//用path作为key
//value是一个Obj数据
/**
 * UINode: 是一个存储UI节点的列表，如果这个UI节点内部有不能移除的prefab，那么这个资源再自动清除的时候不能被删除
 * useSprite: 释放的时候每个节点都需要释放SpriteFrame/SpriteAtlas资源和Texture2D资源
 * useNodeArr: 释放的时候每个节点的SpriteFrame设置为undefined
 */
outModule.spriteUseNodeObj = {};

var SPRITE_FRAME_INIT_LOAD_ARR = [];

/**
 * 获取UINode所处的index
 * @param {String} spritePath
 * @param {cc.Node} UINode 
 */
local.getUINodeIndex = function (spritePath, UINode) {
    if (!outModule.spriteUseNodeObj[spritePath]) {
        return;
    }
    var i = void 0,
        len = outModule.spriteUseNodeObj[spritePath].length;
    for (i = 0; i < len; i++) {
        if (outModule.spriteUseNodeObj[spritePath][i].UINode === UINode) {
            return i;
        }
    }
};

/**
 * 获取一个UINode所有运用的图集，返回一个路径的合集
 * @param {cc.Node} path 
 */
outModule.getAllUINodeUseSprite = function (UINode) {
    var pathArr = [];
    for (var key in outModule.spriteUseNodeObj) {
        if (!outModule.spriteUseNodeObj.hasOwnProperty(key)) {
            return;
        }
        if (local.getUINodeIndex(key, UINode) !== undefined) {
            if (pathArr.indexOf(key) < 0) {
                pathArr.push(key);
            }
        }
    }
    return pathArr;
};

/**
 * 清除缓存
 * @param {String} path 
 * 会清除所有的useSprite的资源依赖
 */
outModule.clearSprite = function (path) {
    if (outModule.spriteUseNodeObj[path]) {
        outModule.spriteUseNodeObj[path].forEach(function (oneObjData) {
            //oneObjData.useNodeArr.forEach((oneNode) => {
            //    oneNode.getComponent(cc.Sprite).SpriteFrame = undefined;
            //});
            var deps = cc.loader.getDependsRecursively(oneObjData.useSprite);
            cc.loader.release(deps);
        });
    }
    if (spriteAtlasSave[path]) {
        spriteAtlasSave[path] = undefined;
    }
    if (spriteFrameSave[path]) {
        spriteFrameSave[path] = undefined;
    }
};

/**
 * 清除被删除的节点
 */
outModule.clearDestroyNode = function () {
    var _loop = function _loop() {
        if (!outModule.spriteUseNodeObj.hasOwnProperty(key)) {
            return {
                v: void 0
            };
        }
        var array = outModule.spriteUseNodeObj[key];
        var newArray = [];
        array.forEach(function (nodeObj) {
            if (nodeObj.UINode && nodeObj.UINode.isValid && !nodeObj.UINode._tj_isDestroy) {
                newArray.push(nodeObj);
            }
        });
        outModule.spriteUseNodeObj[key] = newArray;
    };

    for (var key in outModule.spriteUseNodeObj) {
        var _ret = _loop();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    }
};

/**
 * 设置图片，因为图集走的是动态加载，所以你不知道什么时候会有用
 * @param {cc.Node} UINode node节点归属的UI节点，传入的原因是为了标记这个资源被这个UI界面动态使用过一次
 * @param {cc.Node} node 设置图片的节点
 * @param {String} spritePath 图片的路径
 * @param {Function} successCb
 * @param {Function} failCb
 */
outModule.setSpriteFrame = function (UINode, node, spritePath, successCb, failCb) {
    if (!node.getComponent(cc.Sprite)) {
        return;
    }
    if (!outModule.spriteUseNodeObj[spritePath]) {
        outModule.spriteUseNodeObj[spritePath] = [];
    }
    var index = local.getUINodeIndex(spritePath, UINode);
    if (index === undefined) {
        outModule.spriteUseNodeObj[spritePath].push({
            UINode: UINode,
            useSprite: undefined,
            useNodeArr: []
        });
        index = outModule.spriteUseNodeObj[spritePath].length - 1;
    }
    if (!spriteFrameSave[spritePath]) {
        //动态加载
        outModule.loadSpriteFrame(spritePath, function (spriteFrame) {
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            outModule.spriteUseNodeObj[spritePath][index].useSprite = spriteFrame;
            if (outModule.spriteUseNodeObj[spritePath][index].useNodeArr.indexOf(node) < 0) {
                outModule.spriteUseNodeObj[spritePath][index].useNodeArr.push(node);
            }
            if (successCb) {
                successCb();
            }
        }, function () {
            if (failCb) {
                successCb();
            }
        });
        return;
    }
    node.getComponent(cc.Sprite).spriteFrame = spriteFrameSave[spritePath];
    outModule.spriteUseNodeObj[spritePath][index].useSprite = spriteFrameSave[spritePath];
    if (outModule.spriteUseNodeObj[spritePath][index].useNodeArr.indexOf(node) < 0) {
        outModule.spriteUseNodeObj[spritePath][index].useNodeArr.push(node);
    }
    if (successCb) {
        successCb();
    }
};

/**
 * 设置图集中的一张图片，因为图集走的是动态加载，所以你不知道什么时候会有用
 * @param {cc.Node} UINode node节点归属的UI节点，传入的原因是为了标记这个资源被这个UI界面动态使用过一次
 * @param {cc.Node} node 设置图集的节点
 * @param {String} spriteAtlasPath 图集的路径
 * @param {String} spriteName 图片的名字
 * @param {Function} successCb
 * @param {Function} failCb
 */
outModule.setSpriteFrameInAtlas = function (UINode, node, spriteAtlasPath, spriteName, successCb, failCb) {
    if (!node.getComponent(cc.Sprite)) {
        return;
    }
    if (!outModule.spriteUseNodeObj[spriteAtlasPath]) {
        outModule.spriteUseNodeObj[spriteAtlasPath] = [];
    }
    var index = local.getUINodeIndex(spriteAtlasPath, UINode);
    if (index === undefined) {
        outModule.spriteUseNodeObj[spriteAtlasPath].push({
            UINode: UINode,
            useSprite: undefined,
            useNodeArr: []
        });
        index = outModule.spriteUseNodeObj[spriteAtlasPath].length - 1;
    }
    if (!spriteAtlasSave[spriteAtlasPath]) {
        //动态加载
        outModule.loadSpriteAtlas(spriteAtlasPath, function (spriteAtlas) {
            node.getComponent(cc.Sprite).spriteFrame = spriteAtlas.getSpriteFrame(spriteName);
            outModule.spriteUseNodeObj[spriteAtlasPath][index].useSprite = spriteAtlas;
            if (outModule.spriteUseNodeObj[spriteAtlasPath][index].useNodeArr.indexOf(node) < 0) {
                outModule.spriteUseNodeObj[spriteAtlasPath][index].useNodeArr.push(node);
            }
            if (successCb) {
                successCb();
            }
        }, function () {
            if (failCb) {
                failCb();
            }
        });
        return;
    }
    node.getComponent(cc.Sprite).spriteFrame = spriteAtlasSave[spriteAtlasPath].getSpriteFrame(spriteName);
    outModule.spriteUseNodeObj[spriteAtlasPath][index].useSprite = spriteAtlasSave[spriteAtlasPath];
    if (outModule.spriteUseNodeObj[spriteAtlasPath][index].useNodeArr.indexOf(node) < 0) {
        outModule.spriteUseNodeObj[spriteAtlasPath][index].useNodeArr.push(node);
    }
    if (successCb) {
        successCb();
    }
};

/**
 * 初始化函数，会预先吧SPRITE_FRAME_INIT_LOAD_ARR下的图集全部加载起来
 * @param {Function} finishCb 
 */
outModule.init = function (finishCb) {
    var loadedCount = 0;
    //处理加载选项数量为0的情况
    if (loadedCount === SPRITE_FRAME_INIT_LOAD_ARR.length) {
        if (finishCb) {
            finishCb();
        }
        return;
    }
    SPRITE_FRAME_INIT_LOAD_ARR.forEach(function (path) {
        outModule.loadSpriteAtlas(path, function (spriteAtlas) {
            loadedCount++;
            if (loadedCount === SPRITE_FRAME_INIT_LOAD_ARR.length) {
                if (finishCb) {
                    finishCb();
                }
            }
        }, function (error) {
            g_LogTool.showLog("SpriteFrameManager init error! path is " + path + ", error is " + error);
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
outModule.loadSpriteAtlas = function (path, successCb, failCb) {
    if (!path) {
        return;
    }
    if (spriteAtlasSave[path]) {
        if (successCb) {
            successCb(spriteAtlasSave[path]);
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
        spriteAtlasSave[path] = spriteAtlas;
        if (successCb) {
            successCb(spriteAtlas);
        }
    });
};

/**
 * 动态加载一个图片
 * @param {String} path 
 * @param {Function} successCb 
 * @param {Function} failCb 
 */
outModule.loadSpriteFrame = function (path, successCb, failCb) {
    if (!path) {
        return;
    }
    if (spriteFrameSave[path]) {
        if (successCb) {
            successCb(spriteFrameSave[path]);
        }
        return;
    }
    cc.loader.loadRes(path, cc.SpriteFrame, function (error, spriteFrame) {
        if (error) {
            if (failCb) {
                failCb(error);
            }
            return;
        }
        spriteFrameSave[path] = spriteFrame;
        if (successCb) {
            successCb(spriteFrame);
        }
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
        //# sourceMappingURL=SpriteFrameManager.js.map
        