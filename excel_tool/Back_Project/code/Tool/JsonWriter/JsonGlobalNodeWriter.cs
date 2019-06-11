using System.IO;

namespace Back_Project.code.Tool.JsonWriter
{
    class JsonGlobalNodeWriter
    {
        public void xmlDataWrite(Data.GloablNode globalNode, string excelDirFullPathClient)
        {
            string returnStr = "";
            for (int i = 0; i < globalNode.getFileNodes().Count; i++)
            {
                string fileName = globalNode.getFileNodes()[i].getFileName();
                returnStr = returnStr + GlobalData.getJsonGlobalBlock() + '"' + fileName + '"' + ": {\r\n";
                returnStr = returnStr + new JsonFileNodeWriter().GetString(globalNode.getFileNodes()[i]);
                if (i == globalNode.getFileNodes().Count - 1)
                {
                    returnStr = returnStr + GlobalData.getJsonGlobalBlock() + "}\r\n";
                }
                else
                {
                    returnStr = returnStr + GlobalData.getJsonGlobalBlock() + "},\r\n";
                }
            }
            returnStr = "{\r\n" + returnStr + "}";
            string jsonFileName = excelDirFullPathClient + @"\_table_global.json";
            if (File.Exists(jsonFileName))
            {
                File.Delete(jsonFileName);
            }
            FileStream fs = new FileStream(jsonFileName, FileMode.OpenOrCreate);
            StreamWriter sw = new StreamWriter(fs);
            //开始写入
            sw.Write(returnStr);
            //清空缓冲区
            sw.Flush();
            //关闭流
            sw.Close();
            fs.Close();
        }
    }
}
