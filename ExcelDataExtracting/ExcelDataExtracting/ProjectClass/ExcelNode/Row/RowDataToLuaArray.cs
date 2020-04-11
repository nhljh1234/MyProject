using Interface;
using ProjectClass;
using System.Collections.Generic;

namespace ProjectClass
{
    class RowDataToLuaArray : IExcelNodeRead
    {
        private RowNode _rowNode;

        public RowDataToLuaArray(RowNode rowNode)
        {
            _rowNode = rowNode;
        }

        public string GetString()
        {
            string luaStr = "{\r\n";
            List<ExcelNode> listExcelDataNode = _rowNode.GetListExcelNode();
            for (int i = 0; i < listExcelDataNode.Count; i++)
            {
                luaStr = "    " + _rowNode.GetKeyByIndex(i) + " = " + _rowNode.GetValueByIndex(i);
                luaStr = luaStr + ((i == _rowNode.GetMaxCellNum() - 1) ? "" : ",");
                luaStr = luaStr + "\r\n";
            }
            return luaStr;
        }
    }
}
