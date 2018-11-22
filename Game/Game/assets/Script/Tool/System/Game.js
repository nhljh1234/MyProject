/*global module, require, cc, client */
/**
 * @desc 全局模块
 * @author Administrator
 */
window.g_GAME_SCENE_UI_NODE = 1;
window.g_GAME_SCENE_ALERT_NODE = 2;
window.g_GAME_SCENE_NET_NODE = 3;

window.g_LanguageType = {};
window.g_LanguageType.CHS = 'CHS';
window.g_LanguageType.EN = 'EN';

//这边开始判断是哪个语言
window.g_LanguageTypeSelect = window.g_LanguageType.CHS;
window.g_LanguageObj = _g_require(`Language_${window.g_LanguageTypeSelect}`, undefined, false);

//基础框架相关
//VsCode工具
window.g_VsCodeTool = _g_require('VsCodeTool', 'g_VsCodeTool', false);
//多语言工具
window.g_LanguageTool = _g_require('LanguageTool', 'g_LanguageTool', false);
//预制件加载工具
window.g_PrefabManager = _g_require('PrefabManager', 'g_PrefabManager', false);
//动态场景管理工具
window.g_GameSceneManager = _g_require('GameSceneManager', 'g_GameSceneManager', false);
//滑动列表工具
window.g_ScrollViewTool = _g_require('ScrollViewTool', 'g_ScrollViewTool', false);
//日志工具
window.g_LogTool = _g_require('LogTool', 'g_LogTool', false);
//图集管理工具
window.g_SpriteFrameManager = _g_require('SpriteFrameManager', 'g_SpriteFrameManager', false);
//Json数据管理工具
window.g_JsonDataTool = _g_require('JsonDataTool', 'g_JsonDataTool', false);
//客户端事件工具
window.g_EventManager = _g_require('EventManager', 'g_EventManager', false);
//内存管理工具
window.g_MemoryManager = _g_require('MemoryManager', 'g_MemoryManager', false);

//内存管理选项
//内存使用超过600MB开始自动清除内存
window.g_MAX_MEMORY_NUM = 600;
//使用开启自动清理内存
window.g_AUTO_CLEAR_MEMORY_FLAG = true;
//是否启动强清除模式，这种模式下所有的隐藏的界面都会被清除
window.g_USE_STRONG_CLEAR_MODE = true;

//主场景相关结点缓存
window.g_GameScene = {};
window.g_GameScene.UINode = undefined;
window.g_GameScene.AlertNode = undefined;
window.g_GameScene.NetNode = undefined;

//************************************************************
//游戏相关
//************************************************************
window.g_GameGlobalManager = _g_require('GameGlobalManager', 'g_GameGlobalManager', false);
window.g_GameTool = _g_require('GameTool', 'g_GameTool', false);
window.g_GlobalData = _g_require('GlobalData', 'g_GlobalData', false);
window.g_BattleManager = _g_require('BattleManager', 'g_BattleManager', false);
window.g_GameData = _g_require('GameData', 'g_GameData', false);
window.g_EventName = _g_require('EventName', 'g_EventName', false);

var outModule = {};

/**
 * 初始化的时候加载所有需要的数据
 * @param {Function} oneTaskFinishCb 完成一个任务的回调
 * @param {Function} finishCb 所有数据加载完成的回调
 */
outModule.init = function (oneTaskFinishCb, finishCb) {
    let finishNum = 0;
    const TASK_NUM = 3;
    window.g_PrefabManager.init(() => {
        finishNum++;
        if (finishNum === TASK_NUM && finishCb) {
            finishCb();
        }
        if (oneTaskFinishCb) {
            oneTaskFinishCb(finishNum / TASK_NUM);
        }
    });
    window.g_SpriteFrameManager.init(() => {
        finishNum++;
        if (finishNum === TASK_NUM && finishCb) {
            finishCb();
        }
        if (oneTaskFinishCb) {
            oneTaskFinishCb(finishNum / TASK_NUM);
        }
    });
    window.g_JsonDataTool.init(() => {
        finishNum++;
        if (finishNum === TASK_NUM && finishCb) {
            finishCb();
        }
        if (oneTaskFinishCb) {
            oneTaskFinishCb(finishNum / TASK_NUM);
        }
        window.g_GlobalData.init();
    });
};

module.exports = outModule;