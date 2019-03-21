让Unity能像cocos2dx一样方便的更新资源和逻辑代码.

## 特性
* 使用AssetBundle作为资源管理方式, 而不是Resources. 
* 提供便捷的打包方案, 且可以有效的控制打包资源的粒度. 可实现类似Cocos2dx游戏的零散资源包, 有可以打成少数几个包.
* 实现AssetBundle文件加载, 依赖的加载, 异步和同步的方式实现.
* 实现AssetBundle内的资源asset加载, 异步和同步方式.
* 使用弱引用和包的依赖关系, 管理AssetBundle是否被使用. 可以统一移除没有被使用的包释放资源.
* 在编辑器模式, 额外提供Simulation Mode, 可以不用打包也能运行.
* 使用XLua框架. 
* 实现LuaManager. 实现LBehaviour, 作为Lua版的MonoBehavior.

## 快速开始
点击菜单TJ/Build AssetBundles,  编译AssetBundle资源.   
打开场景Assets/TJTest/Scene/Launch.unity  
运行  
  
TJ/Mode/Simulation Mode, 资源直接从Assets目录读取, 而不是从AssetBundle读取  
TJ/Mode/Extern Lua Mode, lua代码文件直接从Assets目录读取, 方便程序开发  

TJTest项目, 演示框架运作的一般流程.

## AssetBundle打包
打开Assets/TJFramework/Config.cs, 配置AssetBundleBuildRulePath字段, 修改指定的打包规则.  
点击菜单 TJ/Build AssetBundles 打包.  
规则描述: Assets/TJFramework/AssetBundleBuilder/BuildRuleTemplate.json

## 资源自动管理的原理
查看AssetBundleManager.cs文件  
