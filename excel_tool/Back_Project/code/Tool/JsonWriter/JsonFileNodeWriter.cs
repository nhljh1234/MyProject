using System.IO;

namespace Back_Project.code.Tool.JsonWriter
{
    class JsonFileNodeWriter
    {
        public void xmlDataWrite(Data.FileNode fileNode, string excelDirFullPathClient)
        {
            string fileName = fileNode.getFileName();
            for (int i = 0; i < fileNode.getTableNodeList().Count; i++)
            {
                string sheetName = fileNode.getTableNodeList()[i].getSheetName();
                string xmlFileName = excelDirFullPathClient + @"\_table_" + fileName + "_" + sheetName + ".json";
                FileStream fs = new FileStream(xmlFileName, FileMode.OpenOrCreate);
                StreamWriter sw = new StreamWriter(fs);
                //开始写入
                sw.Write(new JsonTableNodeWriter().GetClientString(fileNode.getTableNodeList()[i]));
                //清空缓冲区
                sw.Flush();
                //关闭流
                sw.Close();
                fs.Close();
            }
        }

        public string getString(Data.FileNode fileNode)
        {
            string fileName = fileNode.getFileName();
            string returnStr = "";
            for (int i = 0; i < fileNode.getTableNodeList().Count; i++)
            {
                string sheetName = fileNode.getTableNodeList()[i].getSheetName();
                returnStr = returnStr + GlobalData.getJsonFileBlock() + '"' + sheetName + '"' + ": ";
                returnStr = returnStr + new JsonTableNodeWriter().GetClientString(fileNode.getTableNodeList()[i]);
                if (i != fileNode.getTableNodeList().Count - 1)
                {
                    returnStr = returnStr + ",\r\n";
                }
                else
                {
                    returnStr = returnStr + "\r\n";
                }
            }
            return returnStr;
        }
    }
}
