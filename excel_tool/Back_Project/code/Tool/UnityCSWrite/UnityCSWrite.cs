using System;
using System.Collections.Generic;
using System.IO;
using Back_Project.code.Data;

namespace Back_Project.code.Tool.UnityCSWrite
{
    class UnityCSWrite
    {
        //这个是倒着加的
        private List<string> _backCodeList = new List<string>();

        public void WriteCSJsonClass(TranslateFileData.TranslateData translateData, string jsonFileName)
        {
            if (translateData.CSClassName == "" || translateData.CSDirPath == "" || translateData.CSTypes.Count == 0)
            {
                return;
            }
            if (translateData.outputStrs.Count != translateData.CSTypes.Count)
            {
                Console.WriteLine(translateData.newFileName + " is error!");
                return;
            }
            string codeStr = "";
            _backCodeList = new List<string>();
            AddUsing(ref codeStr);
            AddClassName(ref codeStr, translateData);
            AddDataClass(ref codeStr, translateData);
            AddDictionary(ref codeStr, translateData);
            AddSetAndGetFunc(ref codeStr, translateData);
            AddLoadFunc(ref codeStr, translateData, jsonFileName);
            //增加结尾
            for (int i = _backCodeList.Count - 1; i >= 0; i --)
            {
                codeStr = codeStr + _backCodeList[i];
            }
            //输出文件
            if (!Directory.Exists(translateData.CSDirPath))
            {
                Directory.CreateDirectory(translateData.CSDirPath);
            }
            string filePath = translateData.CSDirPath + "\\" + translateData.CSClassName + ".cs";
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            File.WriteAllText(filePath, codeStr);
        }

        private void AddUsing(ref string codeStr)
        {
            codeStr = codeStr + "using System;\r\n";
            codeStr = codeStr + "using System.Collections;\r\n";
            codeStr = codeStr + "using System.Collections.Generic;\r\n";
            codeStr = codeStr + "using UnityEngine;\r\n";
            codeStr = codeStr + "using NHLJH_1234;\r\n";
            codeStr = codeStr + "using System.IO;\r\n";
            codeStr = codeStr + "\r\n";
        }

        private void AddClassName(ref string codeStr, TranslateFileData.TranslateData translateData)
        {
            codeStr = codeStr + "public class " + translateData.CSClassName + " : Singleton<" + translateData.CSClassName + ">, IDisposable\r\n";
            codeStr = codeStr + "{\r\n";
            _backCodeList.Add("}");
            _backCodeList.Add("    }\r\n");
            _backCodeList.Add("\r\n");
            _backCodeList.Add("    {\r\n");
            _backCodeList.Add("    public void Dispose()\r\n");
        }

        private void AddDataClass(ref string codeStr, TranslateFileData.TranslateData translateData)
        {
            codeStr = codeStr + "    [Serializable]\r\n";
            codeStr = codeStr + "    public class " + GetJsonDataClass(translateData.CSClassName) + "\r\n";
            codeStr = codeStr + "    {\r\n";
            //开始增加数据
            for (int i = 0; i < translateData.CSTypes.Count; i++)
            {
                codeStr = codeStr + "        public " + translateData.CSTypes[i] + " " + translateData.outputStrs[i] + ";\r\n";
            }
            codeStr = codeStr + "    }\r\n";
            codeStr = codeStr + "\r\n";
        }

        private void AddDictionary(ref string codeStr, TranslateFileData.TranslateData translateData)
        {
            codeStr = codeStr + "    public Dictionary<string, " + GetJsonDataClass(translateData.CSClassName) + "> dataDict;\r\n";
            codeStr = codeStr + "\r\n";
        }

        private void AddSetAndGetFunc(ref string codeStr, TranslateFileData.TranslateData translateData)
        {
            codeStr = codeStr + "    public void Set" + GetJsonDataClass(translateData.CSClassName) + "Data(Dictionary<string, " + GetJsonDataClass(translateData.CSClassName) + "> dict)\r\n";
            codeStr = codeStr + "    {\r\n";
            codeStr = codeStr + "        dataDict = dict;\r\n";
            codeStr = codeStr + "    }\r\n";
            codeStr = codeStr + "\r\n";
            codeStr = codeStr + "    public " + GetJsonDataClass(translateData.CSClassName) + " Get" + GetJsonDataClass(translateData.CSClassName) + "ByID(int id)\r\n";
            codeStr = codeStr + "    {\r\n";
            codeStr = codeStr + "        dataDict.TryGetValue(id.ToString(), out " + GetJsonDataClass(translateData.CSClassName) + " value);\r\n";
            codeStr = codeStr + "        return value;\r\n";
            codeStr = codeStr + "    }\r\n";
            codeStr = codeStr + "\r\n";
        }

        private void AddLoadFunc(ref string codeStr, TranslateFileData.TranslateData translateData, string jsonFileName)
        {
            codeStr = codeStr + "    public IEnumerator Load" + GetJsonDataClass(translateData.CSClassName) + "()\r\n";
            codeStr = codeStr + "    {\r\n";
            codeStr = codeStr + "        string jsonFilePath = Application.dataPath + \"/Game/JsonData/" + jsonFileName + "\";\r\n";
            codeStr = codeStr + "        string jsonStr = null;\r\n";
            codeStr = codeStr + "        if (File.Exists(jsonFilePath))\r\n";
            codeStr = codeStr + "        {\r\n";
            codeStr = codeStr + "            jsonStr = File.ReadAllText(jsonFilePath);\r\n";
            codeStr = codeStr + "        }\r\n";
            codeStr = codeStr + "        if (jsonStr == null)\r\n";
            codeStr = codeStr + "        {\r\n";
            codeStr = codeStr + "            yield return null;\r\n";
            codeStr = codeStr + "        }\r\n";
            codeStr = codeStr + "        dataDict = JsonTool.Instance.GetDic<string, " + GetJsonDataClass(translateData.CSClassName) + ">(jsonStr);\r\n";
            codeStr = codeStr + "        yield return null;\r\n";
            codeStr = codeStr + "    }\r\n";
        }

        private string GetJsonDataClass(string CSClassName)
        {
            return CSClassName + "Data";
        }
    }
}
