using System.Collections.Generic;

namespace Back_Project.code.Tool.JsonWriter
{
    class JsonTableNodeWriter
    {
        public string getClientString(Data.TableNode tableNode)
        {
            string returnStr;
            bool isGlobal = code.Data.Setting.getInstance().getSettingClassByType(GlobalData.OUTPUT_TYPE.JSON).globalSetting;
            List<string> strList = new List<string>();
            JsonRowNodeWriter rowNodeWrite = new JsonRowNodeWriter();
            returnStr = "{\r\n";
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
            returnStr = returnStr + GlobalData.getJsonTableBlock() + "}";
            return returnStr;
        }
    }
}
