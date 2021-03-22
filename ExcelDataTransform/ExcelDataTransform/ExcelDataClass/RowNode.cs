using NPOI.SS.UserModel;
using ExcelDataTransform.ConfigDataClass;
using System.Collections.Generic;

namespace ExcelDataTransform.ExcelDataClass
{
    class RowNode
    {
        private List<CellNode> cellNodeList = new List<CellNode>();

        public RowNode(IRow row, IRow rowKey, IRow rowType, ConfigSheetNode configSheetNode)
        {
            for (int i = 0; i < rowKey.LastCellNum; i++)
            {
                string key = rowKey.GetCell(i).ToString();
                //在config中有配置的key才会输出
                if (configSheetNode.outputKeyList.Contains(key))
                {
                    cellNodeList.Add(new CellNode(row.GetCell(i), rowKey.GetCell(i), rowType.GetCell(i), i == rowKey.LastCellNum - 1));
                }
            }
        }

        public string GetString()
        {
            string str = "";
            for (int i = 0; i < cellNodeList.Count; i++)
            {
                str = str + cellNodeList[i].GetString();
            }
            return str;
        }
    }
}
