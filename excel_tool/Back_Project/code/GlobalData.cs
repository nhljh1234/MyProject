using System.Xml;
using System.Collections.Generic;


namespace Back_Project.code
{
    public class GlobalData
    {
        public static Dictionary<string, Data.TranslateFileData> translateDic =
            new Dictionary<string, Data.TranslateFileData>();

        public static string getJsonCellBlock()
        {
            Data.Setting.SettingClass jsonSetting = Data.Setting.getInstance().getSettingClassByType(OUTPUT_TYPE.JSON);
            if (jsonSetting.globalSetting)
            {
                return "        ";
            }
            return "";
        }

        public static string getJsonRowBlock()
        {
            Data.Setting.SettingClass jsonSetting = Data.Setting.getInstance().getSettingClassByType(OUTPUT_TYPE.JSON);
            if (jsonSetting.globalSetting)
            {
                return "        ";
            }
            return "";
        }

        public static string getJsonTableBlock()
        {
            Data.Setting.SettingClass jsonSetting = Data.Setting.getInstance().getSettingClassByType(OUTPUT_TYPE.JSON);
            if (jsonSetting.globalSetting)
            {
                return "        ";
            }
            return "";
        }

        public static string getJsonFileBlock()
        {
            Data.Setting.SettingClass jsonSetting = Data.Setting.getInstance().getSettingClassByType(OUTPUT_TYPE.JSON);
            if (jsonSetting.globalSetting)
            {
                return "        ";
            }
            return "";
        }

        public static string getJsonGlobalBlock()
        {
            Data.Setting.SettingClass jsonSetting = Data.Setting.getInstance().getSettingClassByType(OUTPUT_TYPE.JSON);
            if (jsonSetting.globalSetting)
            {
                return "    ";
            }
            return "";
        }

        public static string getLuaCellBlock()
        {
            Data.Setting.SettingClass luaSetting = Data.Setting.getInstance().getSettingClassByType(OUTPUT_TYPE.LUA);
            if (luaSetting.globalSetting)
            {
                return "        ";
            }
            return "";
        }

        public static string getLuaRowBlock()
        {
            Data.Setting.SettingClass luaSetting = Data.Setting.getInstance().getSettingClassByType(OUTPUT_TYPE.LUA);
            if (luaSetting.globalSetting)
            {
                return "        ";
            }
            return "";
        }

        public static string getLuaTableBlock()
        {
            Data.Setting.SettingClass jsonSetting = Data.Setting.getInstance().getSettingClassByType(OUTPUT_TYPE.LUA);
            if (jsonSetting.globalSetting)
            {
                return "        ";
            }
            return "";
        }

        public static string getLuaFileBlock()
        {
            Data.Setting.SettingClass luaSetting = Data.Setting.getInstance().getSettingClassByType(OUTPUT_TYPE.LUA);
            if (luaSetting.globalSetting)
            {
                return "        ";
            }
            return "";
        }

        public static string getLuaGlobalBlock()
        {
            Data.Setting.SettingClass luaSetting = Data.Setting.getInstance().getSettingClassByType(OUTPUT_TYPE.LUA);
            if (luaSetting.globalSetting)
            {
                return "    ";
            }
            return "";
        }

        public static XmlElement getFirstElement(XmlElement element, string tag)
        {
            foreach (XmlElement childElement in element.GetElementsByTagName(tag))
            {
                return childElement;
            }
            return null;
        }

        //数据类型
        public enum DATA_TYPE
        {
            DOUBLE = 1,
            BOOLEAN = 2,
            STRING = 3
        }

        //输出类型
        public enum OUTPUT_TYPE
        {
            JSON = 1,
            LUA = 2
        }
    }
}
