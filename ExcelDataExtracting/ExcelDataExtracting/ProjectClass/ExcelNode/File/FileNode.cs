using Config;
using Interface;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace ProjectClass
{
    class FileNode : ExcelNode
    {
        private GlobalConfig.OUTPUT_TYPE _outputType;
        private string _fileName;

        public FileNode(IWorkbook iWorkBook, string fileName, GlobalConfig.OUTPUT_TYPE outputType)
        {
            _outputType = outputType;
            _fileName = fileName;
            _CreateChildSheetNode(iWorkBook, fileName, outputType);
        }

        public override IExcelNodeRead GetExcelNodeReadModule()
        {
            return null;
        }

        private void _CreateChildSheetNode(IWorkbook iWorkBook, string fileName, GlobalConfig.OUTPUT_TYPE outputType)
        {
            for (int i = 0; i < iWorkBook.NumberOfSheets; i++)
            {
                ISheet iSheet = iWorkBook.GetSheetAt(i);
                _listExcelNode.Add(new SheetNode(iSheet, fileName, outputType));
            }
        }
    }
}
