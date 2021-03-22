using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using ExcelDataTransform.ConfigDataClass;

namespace ExcelDataTransform.ExcelDataClass
{
    class FileNode
    {
        private List<SheetNode> sheetNodeList = new List<SheetNode>();

        public FileNode(string filePath, ConfigFileNode configFileNode)
        {
            FileStream fs = File.OpenRead(filePath);
            string extension = Path.GetExtension(filePath);
            string fileName = Path.GetFileName(filePath);
            if (extension.Equals(".xls"))
            {
                ManageData(new HSSFWorkbook(fs), configFileNode);
            }
            else if (extension.Equals(".xlsx"))
            {
                ManageData(new XSSFWorkbook(fs), configFileNode);
            }
            else
            {
                Console.WriteLine("文件错误，文件名是：" + fileName);
            }
        }

        private void ManageData(IWorkbook wk, ConfigFileNode configFileNode)
        {
            for (int i = 0; i < wk.NumberOfSheets; i++)
            {
                ISheet sheet = wk.GetSheetAt(i);
                string sheetName = wk.GetSheetName(i);
                if (configFileNode.configSheetNodeDic.TryGetValue(sheetName, out ConfigSheetNode configSheetNode))
                {
                    sheetNodeList.Add(new SheetNode(sheet, configSheetNode));
                }
            }
        }

        public void WriteOutputFile()
        {
            for (int i = 0; i < sheetNodeList.Count; i++)
            {
                sheetNodeList[i].WriteOutputFile();
            }
        }
    }
}
