using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;

namespace DataClass
{
    class CellNode : ExcelDataNode
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

        public override string GetJsonString()
        {
            return null;
        }

        public override string GetLuaString()
        {
            return null;
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
