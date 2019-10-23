using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System.IO;

namespace Tool
{
    //单例
    class ExcelFileRead
    {
        private static ExcelFileRead _instance = null;

        public IWorkbook GetIWorkbookFromExcelFile(string fileFullPath)
        {
            IWorkbook iWorkBook = null;
            FileStream fileStream = new FileStream(fileFullPath, FileMode.Open, FileAccess.Read);
            if (fileFullPath.IndexOf(".xlsx") > 0) // 2007版本  
            {
                iWorkBook = new XSSFWorkbook(fileStream);  //xlsx数据读入workbook  
            }
            else if (fileFullPath.IndexOf(".xls") > 0) // 2003版本  
            {
                iWorkBook = new HSSFWorkbook(fileStream);  //xls数据读入workbook  
            }
            return iWorkBook;
        }

        public static ExcelFileRead GetInstance()
        {
            if (_instance == null)
            {
                _instance = new ExcelFileRead();
            }
            return _instance;
        }

        private ExcelFileRead()
        {

        }
    }
}
