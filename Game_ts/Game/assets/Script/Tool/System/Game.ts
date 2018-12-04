//全局代码提示相关
import RandomNameTool = require('../../Tool/GameUse/RandomNameTool');
import Language_CHS = require('../../Tool/Language/Language_CHS');
import Language_EN = require('../../Tool/Language/Language_EN');
import EventManager = require('../../Tool/System/EventManager');
import GameSceneManager = require('../../Tool/System/GameSceneManager');
import JsonDataTool = require('../../Tool/System/JsonDataTool');
import LanguageTool = require('../../Tool/System/LanguageTool');
import LogTool = require('../../Tool/System/LogTool');
import MemoryManager = require('../../Tool/System/MemoryManager');
import PrefabManager = require('../../Tool/System/PrefabManager');
import SpriteFrameManager = require('../../Tool/System/SpriteFrameManager');
import Tool = require('../../Tool/System/Tool');
import TimeTool = require('../../Tool/Time/TimeTool');
import NodeTool = require('../../UI/Base/NodeTool');
import ItemNodeTool = require('../../UI/Normal/ItemNodeTool');
import ScrollViewTool = require('../../UI/Base/ScrollViewTool');
import BattleManager = require('../../Module/Manager/BattleManager');
import GameManager = require('../../Module/Manager/GameManager');
import GameDataSaveTool = require('../../Module/Tool/GameDataSaveTool');
import GameSaveTool = require('../../Module/Tool/GameSaveTool');
import GameTool = require('../../Module/Tool/GameTool');
import EventName = require('../../ModulE/Event/EventName');
import MapRandomEvent = require('../../ModulE/Event/MapRandomEvent');
import ItemModule = require('../../Module/Item/ItemModule');
import BuildModule = require('../../Module/Building/BuildModule');
import GMTool = require('../GameUse/GMTool');

class Game {
    RandomNameTool = RandomNameTool;
    Language_CHS = Language_CHS;
    Language_EN = Language_EN;
    EventManager = EventManager;
    GameSceneManager = GameSceneManager;
    JsonDataTool = JsonDataTool;
    LanguageTool = LanguageTool;
    LogTool = LogTool;
    MemoryManager = MemoryManager;
    PrefabManager = PrefabManager;
    SpriteFrameManager = SpriteFrameManager;
    TimeTool = TimeTool;
    NodeTool = NodeTool;
    ItemNodeTool = ItemNodeTool;
    ScrollViewTool = ScrollViewTool;
    BattleManager = BattleManager;
    GameManager = GameManager;
    GameDataSaveTool = GameDataSaveTool;
    GameSaveTool = GameSaveTool;
    GameTool = GameTool;
    EventName = EventName;
    MapRandomEvent = MapRandomEvent;
    ItemModule = ItemModule;
    BuildModule = BuildModule;
    GMTool = GMTool;
    Tool = Tool;

    //多语言相关
    LanguageType_CHS: string = 'CHS';
    LanguageType_EN: string = 'EN';

    //最大内存使用量，超过这个会开始清除
    MAX_MEMORY_NUM: number = 600;
    //使用开启自动清理内存
    AUTO_CLEAR_MEMORY_FLAG: boolean = true;
    //是否启动强清除模式，这种模式下所有的隐藏的界面都会被清除
    USE_STRONG_CLEAR_MODE: boolean = true;

    //性别
    SEX_MAN: number = 1;
    SEX_WOMAN: number = 2;

    //主场景结点相关
    GameSceneUINode: cc.Node = undefined;
    GameSceneAlertNode: cc.Node = undefined;
    GameSceneNetNode: cc.Node = undefined;

    GAME_SCENE_UI_NODE: number = 1;
    GAME_SCENE_ALERT_NODE: number = 2;
    GAME_SCENE_NET_NODE: number = 3;

    MAP_RANDOM_EVENT_RECORD: number = undefined;
    MAX_POWER: number = undefined;
    MAX_ITEM_NUM: number = undefined;
    MIN_POWER_NUM: number = undefined;
    BATTLE_TIMER_TIME: number = undefined;
    QUICK_GAME_SPEED: number = undefined;

    ITEM_FUNCTION_TYPE_REST = 'rest';

    BUILDING_FUNCTION_TYPE_COME_BACK = 'comeBack';
    BUILDING_FUNCTION_TYPE_REST = 'rest';
    BUILDING_FUNCTION_TYPE_WAREHOUSE = 'warehouse';

    WAREHOUSEUI_TYPE_WAREHOUSE = 'warehouse';
    WAREHOUSEUI_TYPE_BAG = 'bag';

    //自宅
    SELF_HOUSE_ID = 1000;
    //野外
    USER_IN_FIELD = -1;

    init() {
        //大地图随机事件几率
        this.MAP_RANDOM_EVENT_RECORD = JsonDataTool.getDataById('_table_Game_gameParameter', 1).num;
        //最大体力值
        this.MAX_POWER = JsonDataTool.getDataById('_table_Game_gameParameter', 2).num;
        //背包最大数量
        this.MAX_ITEM_NUM = JsonDataTool.getDataById('_table_Game_gameParameter', 3).num;
        //体力最小值，低于这个体力会自动去吃药或者医馆
        this.MIN_POWER_NUM = JsonDataTool.getDataById('_table_Game_gameParameter', 4).num;
        //自动战斗间隔
        //单位分钟
        this.BATTLE_TIMER_TIME = JsonDataTool.getDataById('_table_Game_gameParameter', 5).num;
        //快速游戏时间
        this.QUICK_GAME_SPEED = MyGame.JsonDataTool.getDataById('_table_Game_gameParameter', 6).num;
    }
}

export function init(oneTaskFinishCb, finishCb) {
    /**
     * 初始化的时候加载所有需要的数据
     * @param {Function} oneTaskFinishCb 完成一个任务的回调
     * @param {Function} finishCb 所有数据加载完成的回调
     */
    let finishNum = 0;
    const TASK_NUM = 3;
    PrefabManager.init(() => {
        finishNum++;
        if (finishNum === TASK_NUM && finishCb) {
            finishCb();
        }
        if (oneTaskFinishCb) {
            oneTaskFinishCb(finishNum / TASK_NUM);
        }
    });
    SpriteFrameManager.init(() => {
        finishNum++;
        if (finishNum === TASK_NUM && finishCb) {
            finishCb();
        }
        if (oneTaskFinishCb) {
            oneTaskFinishCb(finishNum / TASK_NUM);
        }
    });
    JsonDataTool.init(() => {
        finishNum++;
        if (finishNum === TASK_NUM && finishCb) {
            finishCb();
        }
        if (oneTaskFinishCb) {
            oneTaskFinishCb(finishNum / TASK_NUM);
        }
        MyGame.init();
    });
}

let MyGame = new Game();
export { MyGame }