using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using ExcelDataTransform.ConfigDataClass;
using System.IO;

namespace ExcelDataTransform.ExcelDataClass
{
    class SheetNode
    {
        private struct property
        {
            string key;
            string type;
        }

        private List<property> propertyList = new List<property>();

        private List<RowNode> rowNodeList = new List<RowNode>();

        private ConfigSheetNode configSheetNode;

        private IRow rowKey;
        private IRow rowType;

        public SheetNode(ISheet sheet, ConfigSheetNode configSheetNode)
        {
            this.configSheetNode = configSheetNode;

            //LastRowNum 是当前表的总行数-1（注意）
            if (sheet.LastRowNum < 2)
            {
                Console.WriteLine("文件表错误，文件表名是：" + configSheetNode.sheetName);
                return;
            }

            //第一行都是key
            //第二行是type
            rowKey = sheet.GetRow(0);
            rowType = sheet.GetRow(1);
            //LastCellNum 是当前行的总列数
            for (int i = 2; i <= sheet.LastRowNum; i++)
            {
                IRow row = sheet.GetRow(i);
                if (row != null)
                {
                    rowNodeList.Add(new RowNode(row, rowKey, rowType, configSheetNode));
                }
            }
        }

        public void WriteOutputFile()
        {
            string str = "";
            string className = configSheetNode.configFileNode.outputName + "_" + configSheetNode.outputName;

            str = str + "export interface" + " " + className + " {" + "\n";
            for (int i = 0; i < rowKey.LastCellNum; i++)
            {
                //输出结构体
                str = str + Global.Space + rowKey.GetCell(i).ToString() + ": ";
                ICell typeCell = rowType.GetCell(i);
                if (typeCell.ToString().Equals(Global.TypeStr))
                {
                    str = str + "string;\n";
                }
                else if (typeCell.ToString().Equals(Global.TypeInt))
                {
                    str = str + "number;\n";
                }
                else if (typeCell.ToString().Equals(Global.TypeFloat))
                {
                    str = str + "number;\n";
                }
            }
            str = str + "}\n";
            str = str + "\n";

            str = str + "function getDataArr() : " + className + " {" + "\n";
            //数据
            str = str + Global.Space + "let arr = [];\n\n";
            str = str + Global.Space + "let data;\n\n";
            for (int i = 0; i < rowNodeList.Count; i++)
            {
                str = str + Global.Space + "data = new " + className + "()\n"; 
                str = str + rowNodeList[i].GetString();
                str = str + Global.Space + "arr.push(data);\n";
                str = str + "\n";
            }
            str = str + Global.Space + "return arr\n";
            str = str + "}\n";
            str = str + "export { getDataArr }\n";

            string path = configSheetNode.configFileNode.outputDir + className + ".ts";
            byte[] conBytes = System.Text.Encoding.UTF8.GetBytes(str);
            File.WriteAllBytes(path, conBytes);
            Console.WriteLine(path + " 写入成功！");
        }
    }
}
