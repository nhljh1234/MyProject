using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Back_Project.code.Data;

namespace Back_Project.code.Tool.UnityCSWrite
{
    class UnityCSWrite
    {
        //这个是倒着加的
        private List<string> _backCodeList = new List<string>();

        public void WriteCSJsonClass(TranslateFileData.TranslateData translateData)
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
        }

        private void AddDictionary(ref string codeStr, TranslateFileData.TranslateData translateData)
        {
            codeStr = codeStr + "    private Dictionary<string, " + GetJsonDataClass(translateData.CSClassName) + "> _dict;\r\n";
        }

        private string GetJsonDataClass(string CSClassName)
        {
            return CSClassName + "Type";
        }
    }
}
