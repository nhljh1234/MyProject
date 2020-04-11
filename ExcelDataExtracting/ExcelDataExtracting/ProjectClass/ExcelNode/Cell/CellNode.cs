using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using Interface;
using Config;

namespace ProjectClass
{
    class CellNode : ExcelNode
    {
        private string _cellDataStr = null;

        public CellNode(ICell cell)
        {
            _cellDataStr = _ReadCellNodeData(cell);
        }

        public bool IsEmpty()
        {
            return _cellDataStr == null;
        }

        public override IExcelNodeRead GetExcelNodeReadModule(GlobalConfig.OUTPUT_TYPE type)
        {
            switch (type)
            {
                case GlobalConfig.OUTPUT_TYPE.LUA_ARRAY:
                    return new CellDataToLuaArray(this);
                case GlobalConfig.OUTPUT_TYPE.LUA_TABLE:
                    return new CellDataToLuaTable(this);
                case GlobalConfig.OUTPUT_TYPE.JSON_ARRAY:
                    return new CellDataToJsonArray(this);
                case GlobalConfig.OUTPUT_TYPE.JSON_OBJECT:
                    return new CellDataToJsonObject(this);
            }
            return null;
        }

        public string GetCellDataStr()
        {
            return _cellDataStr;
        }

        private string _ReadCellNodeData(ICell cell)
        {
            string cellDataStr;
            CellType cellType = cell.CellType == CellType.Formula ? cell.CachedFormulaResultType : cell.CellType;
            if (cellType == CellType.Blank)
            {
                cellDataStr = null;
            }
            else if (cellType == CellType.Numeric && !HSSFDateUtil.IsCellDateFormatted(cell))
            {
                cellDataStr = "" + cell.NumericCellValue;
            }
            else if (cellType == CellType.Boolean)
            {
                cellDataStr = cell.BooleanCellValue ? "true" : "false";
            }
            else
            {
                cellDataStr = cell.StringCellValue;
            }
            return cellDataStr;
        }
    }
}
