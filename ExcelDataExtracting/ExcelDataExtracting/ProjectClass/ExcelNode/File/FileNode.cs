using Config;
using Interface;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System.IO;
using Tool;

namespace ProjectClass
{
    class FileNode : ExcelNode
    {
        private string _fileName;
        private ExcelFileConfig _excelFileConfig;

        public FileNode(string excelFileFullPath, ExcelFileConfig excelFileConfig)
        {
            IWorkbook iWorkbook = ExcelFileRead.GetInstance().GetIWorkbookFromExcelFile(excelFileFullPath);
            FileInfo excelFileInfo = new FileInfo(excelFileFullPath);
            _CreateChildSheetNode(iWorkbook, excelFileInfo, excelFileConfig);
        }

        public override IExcelNodeRead GetExcelNodeReadModule(GlobalConfig.OUTPUT_TYPE type)
        {
            return null;
        }

        public void BuildSheetFile()
        {

        }

        private void _CreateChildSheetNode(IWorkbook iWorkbook, FileInfo excelFileInfo, ExcelFileConfig excelFileConfig)
        {
            for (int i = 0; i < iWorkbook.NumberOfSheets; i++)
            {
                ISheet iSheet = iWorkbook.GetSheetAt(i);
                _listExcelNode.Add(new SheetNode(iSheet, excelFileInfo, excelFileConfig));
            }
        }
    }
}
