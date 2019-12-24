using NPOI.SS.UserModel;
using Config;
using Interface;

namespace ProjectClass
{
    class SheetNode : ExcelNode
    {
        private RowNode _keyRowNode;
        private GlobalConfig.OUTPUT_TYPE _outputType;
        private string _fileName;

        public SheetNode(ISheet iSheet, string fileName, GlobalConfig.OUTPUT_TYPE outputType)
        {
            _outputType = outputType;
            _fileName = fileName;
            _CreateChildRowNode(iSheet, outputType);
        }

        public override IExcelNodeRead GetExcelNodeReadModule()
        {
            switch (_outputType)
            {
                case GlobalConfig.OUTPUT_TYPE.LUA_ARRAY:
                    return new SheetDataToLuaArray(this);
                case GlobalConfig.OUTPUT_TYPE.LUA_TABLE:
                    return new SheetDataToLuaTable(this);
                case GlobalConfig.OUTPUT_TYPE.JSON_ARRAY:
                    return new SheetDataToJsonArray(this);
                case GlobalConfig.OUTPUT_TYPE.JSON_OBJECT:
                    return new SheetDataToJsonObject(this);
            }
            return null;
        }

        private void _CreateChildRowNode(ISheet iSheet, GlobalConfig.OUTPUT_TYPE outputType)
        {
            for (int i = iSheet.FirstRowNum + 1; i <= iSheet.LastRowNum; i++)
            {
                IRow iRow = iSheet.GetRow(i);
                bool isKeyRow = (i == (iSheet.FirstRowNum + 1));
                if (isKeyRow)
                {
                    _keyRowNode = new RowNode(iRow, outputType);
                }
                else
                {
                    RowNode rowNode = new RowNode(iRow, outputType);
                    rowNode.SetKeyRowNode(_keyRowNode);
                    _listExcelNode.Add(rowNode);
                }
            }
        }
    }
}
