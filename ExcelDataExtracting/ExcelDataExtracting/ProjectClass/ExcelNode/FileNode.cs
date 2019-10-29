using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace ProjectClass
{
    class FileNode : ExcelDataNode
    {
        public FileNode(IWorkbook iWorkBook, string fileName)
        {
            _CreateChildSheetNode(iWorkBook, fileName);
        }

        public override string GetJsonString()
        {
            return null;
        }

        public override string GetLuaString()
        {
            return null;
        }

        private void _CreateChildSheetNode(IWorkbook iWorkBook, string fileName)
        {
            for (int i = 0; i < iWorkBook.NumberOfSheets; i++)
            {
                ISheet iSheet = iWorkBook.GetSheetAt(i);
                _listExcelDataNode.Add(new SheetNode(iSheet, fileName));
            }
        }
    }
}
