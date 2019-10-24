using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;

namespace DataClass
{
    class RowNode : ExcelDataNode
    {
        RowNode _keyRowNode = null;

        public RowNode(IRow iRow)
        {
            _CreateChildCellNode(iRow);
        }

        public void SetKeyRowNode(RowNode keyRowNode)
        {
            _keyRowNode = keyRowNode;
        }

        public override string GetJsonString()
        {
            string jsonStr = "{\r\n";
            List<ExcelDataNode> listExcelDataNode = GetListExcelDataNode();
            for (int i = 0; i < listExcelDataNode.Count; i++)
            {
                jsonStr = "    " + '"' + _GetKeyByIndex(i) + '"' + ": " + _GetValueByIndex(i);
                jsonStr = jsonStr + ((i == _GetMaxCellNum() - 1) ? "" : ",");
                jsonStr = jsonStr + "\r\n";
            }
            return jsonStr;
        }

        public override string GetLuaString()
        {
            string luaStr = "{\r\n";
            List<ExcelDataNode> listExcelDataNode = GetListExcelDataNode();
            for (int i = 0; i < listExcelDataNode.Count; i++)
            {
                luaStr = "    " + _GetKeyByIndex(i) + " = " + _GetValueByIndex(i);
                luaStr = luaStr + ((i == _GetMaxCellNum() - 1) ? "" : ",");
                luaStr = luaStr + "\r\n";
            }
            return luaStr;
        }

        private int _GetMaxCellNum()
        {
            return Math.Max(_keyRowNode.GetListExcelDataNode().Count, GetListExcelDataNode().Count);
        }

        private string _GetKeyByIndex(int index)
        {
            return _keyRowNode.GetListExcelDataNode()[index].GetJsonString();
        }

        private string _GetValueByIndex(int index)
        {
            return GetListExcelDataNode()[index].GetJsonString();
        }

        private void _CreateChildCellNode(IRow iRow)
        {
            for (int i = iRow.FirstCellNum + 1; i <= iRow.LastCellNum; i++)
            {
                ICell cell = iRow.GetCell(i);
                _listExcelDataNode.Add(new CellNode(cell));
            }
        }
    }
}
