using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code.Tool.LuaWrite
{
    class LuaGlobalNodeWriter
    {
        public void xmlDataWrite(Data.GloablNode globalNode, string excelDirFullPathClient)
        {
            string returnStr = "";
            for (int i = 0; i < globalNode.getFileNodes().Count; i++)
            {
                string fileName = globalNode.getFileNodes()[i].getFileName();
                returnStr = returnStr + GlobalData.getLuaGlobalBlock() + fileName + " = {\r\n";
                returnStr = returnStr + new LuaFileNodeWriter().getString(globalNode.getFileNodes()[i]);
                if (i == globalNode.getFileNodes().Count - 1)
                {
                    returnStr = returnStr + GlobalData.getLuaGlobalBlock() + "}\r\n";
                }
                else
                {
                    returnStr = returnStr + GlobalData.getLuaGlobalBlock() + "},\r\n";
                }
            }
            returnStr = "return {\r\n" + returnStr + "}";
            string luaFileName = excelDirFullPathClient + @"\_table_global.lua";
            if (File.Exists(luaFileName))
            {
                File.Delete(luaFileName);
            }
            FileStream fs = new FileStream(luaFileName, FileMode.OpenOrCreate);
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
