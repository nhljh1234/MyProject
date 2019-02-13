using System;
using System.IO;
using System.Xml;

namespace Back_Project
{
    class Program
    {
        static void translateFileRead()
        {
            string workDir = Environment.CurrentDirectory;
            DirectoryInfo workDirInfo = new DirectoryInfo(workDir);
            string translateFilePath = workDirInfo.FullName + @"\_translate.xml";
            //读取文件
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(translateFilePath);
            XmlElement root = xmlDoc.DocumentElement;//取到根结点
            foreach (XmlElement fileNode in root.GetElementsByTagName("file"))
            {
                string oldName, newName;
                oldName = fileNode.GetAttribute("oldName");
                newName = fileNode.GetAttribute("newName");
                code.Data.TranslateFileData translateFileData = new code.Data.TranslateFileData(newName);
                foreach (XmlElement tableNode in root.GetElementsByTagName("table"))
                {
                    string oldTableName, newTableName, use;
                    oldTableName = tableNode.GetAttribute("oldName");
                    newTableName = tableNode.GetAttribute("newName");
                    use = tableNode.GetAttribute("use");
                    translateFileData.addTableName(oldTableName, newTableName, use);
                }
                code.GlobalData.translateDic.Add(oldName, translateFileData);
            }
        }

        static void Main(string[] args)
        {
            //先获取和处理translate文件
            translateFileRead();
            //先清除原有的配置数据
            string workDir = Environment.CurrentDirectory;
            //输出配置
            DirectoryInfo workDirInfo = new DirectoryInfo(workDir);
            string outputFilePath = workDirInfo.FullName + @"\_output.xml";
            Console.WriteLine(workDir);
            //读取配置
            //读取文件
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(outputFilePath);
            XmlElement root = xmlDoc.DocumentElement;//取到根结点
            //客户端数据文件夹
            string excelDataDirPathClient = "";
            //服务端数据库文件夹
            string excelDataDirPathServer = "";
            foreach (XmlElement fileNode in root.GetElementsByTagName("client"))
            {
                excelDataDirPathClient = fileNode.GetAttribute("path");
            }
            foreach (XmlElement fileNode in root.GetElementsByTagName("server"))
            {
                excelDataDirPathServer = fileNode.GetAttribute("path");
            }
            DirectoryInfo workExcelDirInfo = new DirectoryInfo(workDirInfo.FullName);
            if (Directory.Exists(excelDataDirPathClient))
            {
                Directory.Delete(excelDataDirPathClient, true);
            }
            if (Directory.Exists(excelDataDirPathServer))
            {
                Directory.Delete(excelDataDirPathServer, true);
            }
            Directory.CreateDirectory(excelDataDirPathClient);
            Directory.CreateDirectory(excelDataDirPathServer);
            //开始执行每一个file
            foreach (FileInfo xmlFile in workExcelDirInfo.GetFiles())
            {
                if (xmlFile.Name.Equals("_translate.xml"))
                {
                    continue;
                }
                if (xmlFile.Name.IndexOf(".xml") >= 0)
                {
                    //拷贝一次
                    string newName = @"\_copy_" + xmlFile.Name;
                    string newFullName = workExcelDirInfo.FullName + @"\_copy_" + xmlFile.Name;
                    xmlFile.CopyTo(workExcelDirInfo.FullName + @"\_copy_" + xmlFile.Name, true);
                    string fileName = xmlFile.Name.Split('.')[0];
                    code.Tool.Reader.FileNodeReader fileNodeReader = 
                        new code.Tool.Reader.FileNodeReader(fileName, newFullName);
                    code.Data.FileNode fileNode = fileNodeReader.getFileNode();
                    new code.Tool.Writer.FileNodeWriter().xmlDataWrite(fileNode, 
                        excelDataDirPathClient, excelDataDirPathServer);
                    //删除临时文件
                    File.Delete(newFullName);
                }
            }
            Console.WriteLine("结束！按回车结束！");
            Console.ReadLine();
        }
    }
}
