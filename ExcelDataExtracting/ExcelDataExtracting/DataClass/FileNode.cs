using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace DataClass
{
    class FileNode : ExcelDataNode
    {
        public FileNode(IWorkbook iWorkBook)
        {

        }

        public override string GetJsonString()
        {
            return null;
        }

        public override string GetLuaString()
        {
            return null;
        }

        private void _CreateChildSheetNode(IWorkbook iWorkBook)
        {
            
        }
    }
}
