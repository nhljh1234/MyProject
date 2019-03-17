using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code.Tool.LuaWrite
{
    class LuaTableNodeWriter
    {
        public string getClientString(Data.TableNode tableNode)
        {
            string returnStr;
            bool isGlobal = code.Data.Setting.getInstance().getSettingClassByType(GlobalData.OUTPUT_TYPE.JSON).globalSetting;
            List<string> strList = new List<string>();
            LuaRowNodeWriter rowNodeWrite = new LuaRowNodeWriter();
            Data.Setting.SettingClass luaSetting = Data.Setting.getInstance().getSettingClassByType(GlobalData.OUTPUT_TYPE.LUA);
            if (luaSetting.globalSetting)
            {
                returnStr = "{\r\n";
            }
            else
            {
                returnStr = "return {\r\n";
            }
            for (int i = 0; i < tableNode.getRowNodeList().Count; i++)
            {
                string str = rowNodeWrite.ObjectString(tableNode.getRowNodeList()[i]);
                if (str == null)
                {
                    continue;
                }
                strList.Add(str);
            }
            for (int i = 0; i < strList.Count; i++)
            {
                returnStr = returnStr + "    " + strList[i] + ((i == strList.Count - 1) ? "" : ",");
                returnStr = returnStr + "    " + "\r\n";
            }
            returnStr = returnStr + GlobalData.getLuaTableBlock() + "}";
            return returnStr;
        }
    }
}
