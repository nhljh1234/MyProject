using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using Config;
using Interface;

namespace ProjectClass
{
    class RowNode : ExcelNode
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

        public override IExcelNodeRead GetExcelNodeReadModule(GlobalConfig.OUTPUT_TYPE type)
        {
            switch (type)
            {
                case GlobalConfig.OUTPUT_TYPE.LUA_ARRAY:
                    return new RowDataToLuaArray(this);
                case GlobalConfig.OUTPUT_TYPE.LUA_TABLE:
                    return new RowDataToLuaTable(this);
                case GlobalConfig.OUTPUT_TYPE.JSON_ARRAY:
                    return new RowDataToJsonArray(this);
                case GlobalConfig.OUTPUT_TYPE.JSON_OBJECT:
                    return new RowDataToJsonObject(this);
            }
            return null;
        }

        public int GetMaxCellNum()
        {
            return Math.Max(_keyRowNode.GetListExcelNode().Count, GetListExcelNode().Count);
        }

        public string GetKeyByIndex(int index, GlobalConfig.OUTPUT_TYPE type)
        {
            ExcelNode cell = _keyRowNode.GetListExcelNode()[index];
            return cell.GetExcelNodeReadModule(type).GetString();
        }

        public string GetValueByIndex(int index, GlobalConfig.OUTPUT_TYPE type)
        {
            ExcelNode cell = GetListExcelNode()[index];
            return cell.GetExcelNodeReadModule(type).GetString();
        }

        private void _CreateChildCellNode(IRow iRow)
        {
            for (int i = iRow.FirstCellNum + 1; i <= iRow.LastCellNum; i++)
            {
                ICell cell = iRow.GetCell(i);
                _listExcelNode.Add(new CellNode(cell));
            }
        }
    }
}
