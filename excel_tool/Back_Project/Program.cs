using Back_Project.code;
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
                    string oldTableName, newTableName, key, output;
                    oldTableName = tableNode.GetAttribute("name");
                    newTableName = GlobalData.getFirstElement(tableNode, "newName").InnerText;
                    key = GlobalData.getFirstElement(tableNode, "key").InnerText;
                    output = GlobalData.getFirstElement(tableNode, "output").InnerText;
                    translateFileData.addTableName(oldTableName, newTableName, key, output);
                }
                GlobalData.translateDic.Add(oldName, translateFileData);
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
            //读取输出配置
            code.Data.Setting setting = code.Data.Setting.getInstance(outputFilePath);
            //初始化
            code.Data.Setting.SettingClass jsonSetting = setting.getSettingClassByType(GlobalData.OUTPUT_TYPE.JSON);
            code.Data.Setting.SettingClass luaSetting = setting.getSettingClassByType(GlobalData.OUTPUT_TYPE.LUA);
            DirectoryInfo workExcelDirInfo = new DirectoryInfo(workDirInfo.FullName);
            //开始执行每一个file
            //拷贝一次
            code.Data.GloablNode globalNode = new code.Data.GloablNode();
            foreach (FileInfo file in workExcelDirInfo.GetFiles())
            {
                if (file.Name.Equals("_translate.xml") || file.Name.Equals("_output.xml"))
                {
                    continue;
                }
                if (file.Name.IndexOf(".xml") >= 0)
                {
                    //判断有没有在装换列表中
                    if (!GlobalData.translateDic.ContainsKey(file.Name.Split('.')[0]))
                    {
                        continue;
                    }
                    string newName = @"\_copy_" + file.Name;
                    string newFullName = workExcelDirInfo.FullName + @"\_copy_" + file.Name;
                    file.CopyTo(workExcelDirInfo.FullName + @"\_copy_" + file.Name, true);
                    string fileName = file.Name.Split('.')[0];
                    //判断是否输出JSON文件
                    code.Tool.XmlReader.XmlFileNodeReader xmlFileNodeReader =
                        new code.Tool.XmlReader.XmlFileNodeReader(fileName, newFullName);
                    code.Data.FileNode fileNode = xmlFileNodeReader.getFileNode();
                    globalNode.addFileNode(fileNode);
                    if (jsonSetting.workFlag)
                    {
                        if (!jsonSetting.globalSetting)
                        {
                            new code.Tool.JsonWriter.JsonFileNodeWriter().xmlDataWrite(fileNode, jsonSetting.clientOutputPath);
                        }
                    }
                    if (luaSetting.workFlag)
                    {
                        if (!luaSetting.globalSetting)
                        {
                            new code.Tool.LuaWrite.LuaFileNodeWriter().xmlDataWrite(fileNode, luaSetting.clientOutputPath);
                        }
                    }
                    //删除临时文件
                    File.Delete(newFullName);
                }
                if (file.Name.IndexOf(".xlsx") >= 0 || file.Name.IndexOf(".xls") >= 0)
                {
                    //判断有没有在装换列表中
                    if (!GlobalData.translateDic.ContainsKey(file.Name.Split('.')[0]))
                    {
                        continue;
                    }
                    string newName = @"\_copy_" + file.Name;
                    string newFullName = workExcelDirInfo.FullName + @"\_copy_" + file.Name;
                    file.CopyTo(workExcelDirInfo.FullName + @"\_copy_" + file.Name, true);
                    string fileName = file.Name.Split('.')[0];
                    //判断是否输出JSON文件
                    code.Tool.ExcelReader.ExcelFileNodeReader excelFileNodeReader =
                        new code.Tool.ExcelReader.ExcelFileNodeReader(fileName, newFullName);
                    code.Data.FileNode fileNode = excelFileNodeReader.getFileNode();
                    globalNode.addFileNode(fileNode);
                    if (jsonSetting.workFlag)
                    {
                        if (!jsonSetting.globalSetting)
                        {
                            new code.Tool.JsonWriter.JsonFileNodeWriter().xmlDataWrite(fileNode, jsonSetting.clientOutputPath);
                        }
                    }
                    if (luaSetting.workFlag)
                    {
                        if (!luaSetting.globalSetting)
                        {
                            new code.Tool.LuaWrite.LuaFileNodeWriter().xmlDataWrite(fileNode, luaSetting.clientOutputPath);
                        }
                    }
                    //删除临时文件
                    File.Delete(newFullName);
                }
            }
            if (jsonSetting.globalSetting && jsonSetting.workFlag)
            {
                new code.Tool.JsonWriter.JsonGlobalNodeWriter().xmlDataWrite(globalNode, jsonSetting.clientOutputPath);
            }
            if (luaSetting.globalSetting && luaSetting.workFlag)
            {
                new code.Tool.LuaWrite.LuaGlobalNodeWriter().xmlDataWrite(globalNode, luaSetting.clientOutputPath);
            }
            Console.WriteLine("结束！按回车结束！");
            Console.ReadLine();
        }
    }
}
