using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace Back_Project.code.Tool.Writer
{
    class FileNodeWriter
    {
        public void xmlDataWrite(Data.FileNode fileNode, string excelDirFullPathClient, string excelDirFullPathServer)
        {
            string fileName = fileNode.getFileName();
            for(int i = 0; i < fileNode.getTableNodeList().Count; i++)
            {
                string use = fileNode.getTableNodeList()[i].getUse();
                if (use == "server")
                {
                    continue;
                }
                string sheetName = fileNode.getTableNodeList()[i].getSheetName();
                string xmlFileName = excelDirFullPathClient + @"\_table_" + fileName + "_" + sheetName + ".json";
                FileStream fs = new FileStream(xmlFileName, FileMode.OpenOrCreate);
                StreamWriter sw = new StreamWriter(fs);
                //开始写入
                sw.Write(new TableNodeWriter().getClientString(fileNode.getTableNodeList()[i]));
                //清空缓冲区
                sw.Flush();
                //关闭流
                sw.Close();
                fs.Close();
            }
            //输出服务端使用的数据文档
            for (int i = 0; i < fileNode.getTableNodeList().Count; i++)
            {
                string use = fileNode.getTableNodeList()[i].getUse();
                if (use == "client")
                {
                    continue;
                }
                string sheetName = fileNode.getTableNodeList()[i].getSheetName();
                string xmlFileName = excelDirFullPathServer + @"\_table_" + fileName + "_" + sheetName + "_server.js";
                FileStream fs = new FileStream(xmlFileName, FileMode.OpenOrCreate);
                StreamWriter sw = new StreamWriter(fs);
                //开始写入
                sw.Write(new TableNodeWriter().getServerString(fileNode.getTableNodeList()[i]));
                //清空缓冲区
                sw.Flush();
                //关闭流
                sw.Close();
                fs.Close();
            }
        }
    }
}
