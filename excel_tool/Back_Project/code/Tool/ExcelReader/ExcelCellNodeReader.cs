using System;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;

namespace Back_Project.code.Tool.ExcelReader
{
    class ExcelCellNodeReader
    {
        private ICell _cell;
        private string _sheetName;
        private string _key;

        public ExcelCellNodeReader(ICell cell, string sheetName, string key)
        {
            _cell = cell;
            _sheetName = sheetName;
            _key = key;
        }

        public ExcelCellNodeReader(ICell cell, string sheetName)
        {
            _cell = cell;
            _sheetName = sheetName;
        }

        //更具xml node节点生成对应的CellNode实例
        public Data.CellNode getCellNode()
        {
            GlobalData.DATA_TYPE dataType;
            double num = 0;
            Boolean boolData = false;
            string str = null;
            CellType cellType = _cell.CellType == CellType.Formula ? _cell.CachedFormulaResultType : _cell.CellType;
            if (cellType == CellType.Blank)
            {
                return null;
            }
            else if (cellType == CellType.Numeric && !HSSFDateUtil.IsCellDateFormatted(_cell))
            {
                num = _cell.NumericCellValue;
                dataType = GlobalData.DATA_TYPE.DOUBLE;
            }
            else if (cellType == CellType.Boolean)
            {
                boolData = _cell.BooleanCellValue;
                dataType = GlobalData.DATA_TYPE.BOOLEAN;
            }
            else
            {
                str = _cell.StringCellValue;
                dataType = GlobalData.DATA_TYPE.STRING;
            }
            return new Data.CellNode(dataType, _key, num, boolData, str);
        }
    }
}
