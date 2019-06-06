using System.Collections.Generic;

namespace Back_Project.code.Tool.JsonWriter
{
    class JsonTableNodeWriter
    {
        public string GetClientString(Data.TableNode tableNode)
        {
            //读取输出配置
            code.Data.Setting setting = code.Data.Setting.getInstance();
            //初始化
            code.Data.Setting.SettingClass jsonSetting = setting.getSettingClassByType(GlobalData.OUTPUT_TYPE.JSON);
            if (jsonSetting.useInUnity)
            {
                if (jsonSetting.buildCS)
                {
                    //新建一个CS读取类
                    new UnityCSWrite.UnityCSWrite().WriteCSJsonClass(tableNode.getTranslateData());
                }
                return GetUnityJsonStr(tableNode);
            }
            return GetNormalJsonStr(tableNode);
        }

        private string GetNormalJsonStr(Data.TableNode tableNode)
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
                returnStr = returnStr + "\r\n";
            }
            returnStr = returnStr + GlobalData.getJsonTableBlock() + "}";
            return returnStr;
        }

        private string GetUnityJsonStr(Data.TableNode tableNode)
        {
            string returnStr;
            returnStr = "{\r\n";

            //输出keys
            returnStr = returnStr + GetUnityJsonKeysStr(tableNode);
            //输出values
            returnStr = returnStr + GetUnityJsonValuesStr(tableNode);

            returnStr = returnStr + GlobalData.getJsonTableBlock() + "}";
            return returnStr;
        }

        private string GetUnityJsonKeysStr(Data.TableNode tableNode)
        {
            JsonRowNodeWriter rowNodeWrite = new JsonRowNodeWriter();
            List<string> strList = new List<string>();
            string returnStr = "    " + "\"keys\": [\r\n";
            for (int i = 0; i < tableNode.getRowNodeList().Count; i++)
            {
                string str = rowNodeWrite.UnityGetKeyString(tableNode.getRowNodeList()[i]);
                if (str == null)
                {
                    continue;
                }
                strList.Add(str);
            }
            for (int i = 0; i < strList.Count; i++)
            {
                returnStr = returnStr + "    " + strList[i] + ((i == strList.Count - 1) ? "" : ",");
                returnStr = returnStr + "\r\n";
            }
            returnStr = returnStr + "    " + "],\r\n";
            return returnStr;
        }

        //输出values
        private string GetUnityJsonValuesStr(Data.TableNode tableNode)
        {
            JsonRowNodeWriter rowNodeWrite = new JsonRowNodeWriter();
            List<string> strList = new List<string>();
            string returnStr = "    " + "\"values\": [\r\n";
            for (int i = 0; i < tableNode.getRowNodeList().Count; i++)
            {
                string str = rowNodeWrite.UnityGetValueString(tableNode.getRowNodeList()[i]);
                if (str == null)
                {
                    continue;
                }
                strList.Add(str);
            }
            for (int i = 0; i < strList.Count; i++)
            {
                returnStr = returnStr + "    " + strList[i] + ((i == strList.Count - 1) ? "" : ",");
                returnStr = returnStr + "\r\n";
            }
            returnStr = returnStr + "    " + "]\r\n";
            return returnStr;
        }
    }
}
