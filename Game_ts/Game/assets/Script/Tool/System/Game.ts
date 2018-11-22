export const GAME_SCENE_UI_NODE: number = 1;
export const GAME_SCENE_ALERT_NODE: number = 2;
export const GAME_SCENE_NET_NODE: number = 3;

//多语言相关
export const LanguageType_CHS: string = 'CHS';
export const LanguageType_EN: string = 'EN';
export let LanguageTypeSelect: string = LanguageType_CHS;

//最大内存使用量，超过这个会开始清除
export const MAX_MEMORY_NUM = 600;
//使用开启自动清理内存
export const AUTO_CLEAR_MEMORY_FLAG = true;
//是否启动强清除模式，这种模式下所有的隐藏的界面都会被清除
export const USE_STRONG_CLEAR_MODE = true;

//性别
export const SEX_MAN = 1;
export const SEX_WOMAN = 2;