using System.IO;
using System.Xml;

namespace Back_Project.code.Data
{
    //单例模式
    public class Setting
    {
        private static Setting _setting = null;
        private SettingClass luaSetting = new SettingClass();
        private SettingClass jsonSetting = new SettingClass();
        public class SettingClass
        {
            //客户端输出路径
            public string clientOutputPath = null;
            //是否输出成一个文件
            public bool globalSetting;
            //是否输出
            public bool workFlag;
            //是否用于Unity Unity的JSON格式需要特殊处理一下，暂时只对json有效果
            public bool useInUnity;
            //初始化，会重新生成输出文件夹
            public void init()
            {
                if (!workFlag)
                {
                    return;
                }
                if (clientOutputPath != null)
                {
                    if (Directory.Exists(clientOutputPath))
                    {
                        Directory.Delete(clientOutputPath, true);
                    }
                    Directory.CreateDirectory(clientOutputPath);
                }
            }
        }

        private Setting(string translateFilePath)
        {
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(translateFilePath);
            XmlElement root = xmlDoc.DocumentElement;//取到根结点
            //JSON输出配置
            XmlElement jsonNode = GlobalData.getFirstElement(root, "json");
            jsonSetting.clientOutputPath = GlobalData.getFirstElement(jsonNode, "client").InnerText;
            jsonSetting.globalSetting = GlobalData.getFirstElement(jsonNode, "global").InnerText == "true";
            jsonSetting.workFlag = GlobalData.getFirstElement(jsonNode, "work").InnerText == "true";
            jsonSetting.useInUnity = GlobalData.getFirstElement(jsonNode, "useInUnity").InnerText == "true";
            jsonSetting.init();
            //Lua输出配置
            XmlElement luaNode = GlobalData.getFirstElement(root, "lua");
            luaSetting.clientOutputPath = GlobalData.getFirstElement(luaNode, "client").InnerText;
            luaSetting.globalSetting = GlobalData.getFirstElement(luaNode, "global").InnerText == "true";
            luaSetting.workFlag = GlobalData.getFirstElement(jsonNode, "work").InnerText == "true";
            luaSetting.useInUnity = GlobalData.getFirstElement(jsonNode, "useInUnity").InnerText == "true";
            luaSetting.init();
        }

        public static Setting getInstance(string translateFilePath = null)
        {
            if (_setting == null)
            {
                _setting = new Setting(translateFilePath);
            }
            return _setting;
        }

        public SettingClass getSettingClassByType(GlobalData.OUTPUT_TYPE dataType)
        {
            switch (dataType)
            {
                case GlobalData.OUTPUT_TYPE.JSON:
                    return jsonSetting;
                case GlobalData.OUTPUT_TYPE.LUA:
                    return luaSetting;
            }
            return null;
        }
    }
}