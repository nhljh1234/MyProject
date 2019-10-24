using System.Collections.Generic;
using Interface;

namespace DataClass
{
    abstract class ExcelDataNode: IExcelDataNode
    {
        protected List<ExcelDataNode> _listExcelDataNode = new List<ExcelDataNode>();

        public List<ExcelDataNode> GetListExcelDataNode()
        {
            return _listExcelDataNode;
        }

        public abstract string GetJsonString();

        public abstract string GetLuaString();
    }
}
