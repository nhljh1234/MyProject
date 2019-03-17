using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System.IO;

namespace Back_Project.code.Tool.ExcelReader
{
    class ExcelFileNodeReader
    {
        private string _fileName;
        IWorkbook _workBook = null;

        public ExcelFileNodeReader(string fileName, string fileFullPath)
        {
            _fileName = fileName;
            FileStream fileStream = new FileStream(fileFullPath, FileMode.Open, FileAccess.Read);
            if (fileFullPath.IndexOf(".xlsx") > 0) // 2007版本  
            {
                _workBook = new XSSFWorkbook(fileStream);  //xlsx数据读入workbook  
            }
            else if (fileFullPath.IndexOf(".xls") > 0) // 2003版本  
            {
                _workBook = new HSSFWorkbook(fileStream);  //xls数据读入workbook  

            }
        }

        public Data.FileNode getFileNode()
        {
            Data.FileNode fileNode = new Data.FileNode(_fileName);
            for (int i = 0; i < _workBook.NumberOfSheets; i++)
            {
                ISheet sheet = _workBook.GetSheetAt(i);
                string sheetName = sheet.SheetName;
                ExcelTableNodeReader tableReader = new ExcelTableNodeReader(sheetName, sheet, _fileName);
                fileNode.addTableNode(tableReader.getTableNode());
            }
            return fileNode;
        }
    }
}
