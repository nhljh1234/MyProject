using NPOI.SS.UserModel;
using Config;
using Interface;
using System.IO;

namespace ProjectClass
{
    class SheetNode : ExcelNode
    {
        private RowNode _keyRowNode;
        private ExcelFileConfig _excelFileConfig;
        private FileInfo _excelFileInfo;
        private string _sheetName;

        public SheetNode(ISheet iSheet, FileInfo excelFileInfo, ExcelFileConfig excelFileConfig)
        {
            _excelFileConfig = excelFileConfig;
            _excelFileInfo = excelFileInfo;
            _sheetName = iSheet.SheetName;
            _CreateChildRowNode(iSheet);
        }

        public override IExcelNodeRead GetExcelNodeReadModule(GlobalConfig.OUTPUT_TYPE type)
        {
            switch (type)
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

        public RowNode GetKeyRowNode()
        {
            return _keyRowNode;
        }

        public string GetOutputFileFullPath(GlobalConfig.OUTPUT_TYPE type)
        {
            string fileName = _excelFileInfo.Name.Split('.')[1];
            string outputFileFullPath = "";
            string outputFileExtension = "";
            switch (type)
            {
                case GlobalConfig.OUTPUT_TYPE.LUA_ARRAY:
                case GlobalConfig.OUTPUT_TYPE.LUA_TABLE:
                    outputFileExtension = ".lua";
                    break;
                case GlobalConfig.OUTPUT_TYPE.JSON_ARRAY:
                case GlobalConfig.OUTPUT_TYPE.JSON_OBJECT:
                    outputFileExtension = ".json";
                    break;
            }
            outputFileFullPath = _excelFileInfo.DirectoryName + "/" + fileName + "." + outputFileExtension;
            return outputFileFullPath;
        }

        private void _CreateChildRowNode(ISheet iSheet)
        {
            for (int i = iSheet.FirstRowNum + 1; i <= iSheet.LastRowNum; i++)
            {
                IRow iRow = iSheet.GetRow(i);
                bool isKeyRow = (i == (iSheet.FirstRowNum + 1));
                if (isKeyRow)
                {
                    _keyRowNode = new RowNode(iRow);
                }
                else
                {
                    RowNode rowNode = new RowNode(iRow);
                    rowNode.SetKeyRowNode(_keyRowNode);
                    _listExcelNode.Add(rowNode);
                }
            }
        }
    }
}
