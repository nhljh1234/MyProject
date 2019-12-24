using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using Config;
using Interface;

namespace ProjectClass
{
    class RowNode : ExcelNode
    {
        GlobalConfig.OUTPUT_TYPE _outputType;
        RowNode _keyRowNode = null;

        public RowNode(IRow iRow, GlobalConfig.OUTPUT_TYPE outputType)
        {
            _outputType = outputType;
            _CreateChildCellNode(iRow, outputType);
        }

        public void SetKeyRowNode(RowNode keyRowNode)
        {
            _keyRowNode = keyRowNode;
        }

        public override IExcelNodeRead GetExcelNodeReadModule()
        {
            switch (_outputType)
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

        public string GetKeyByIndex(int index)
        {
            ExcelNode cell = _keyRowNode.GetListExcelNode()[index];
            return cell.GetExcelNodeReadModule().GetString();
        }

        public string GetValueByIndex(int index)
        {
            ExcelNode cell = GetListExcelNode()[index];
            return cell.GetExcelNodeReadModule().GetString();
        }

        private void _CreateChildCellNode(IRow iRow, GlobalConfig.OUTPUT_TYPE outputType)
        {
            for (int i = iRow.FirstCellNum + 1; i <= iRow.LastCellNum; i++)
            {
                ICell cell = iRow.GetCell(i);
                _listExcelNode.Add(new CellNode(cell, outputType));
            }
        }
    }
}
