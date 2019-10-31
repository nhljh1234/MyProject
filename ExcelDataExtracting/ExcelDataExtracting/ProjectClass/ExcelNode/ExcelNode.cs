using System.Collections.Generic;
using Config;
using Interface;

namespace ProjectClass
{
    abstract class ExcelNode : IExcelNode
    {
        protected List<ExcelNode> _listExcelNode = new List<ExcelNode>();

        public abstract IExcelNodeRead GetExcelNodeReadModule(GlobalConfig.OUTPUT_TYPE type);

        public List<ExcelNode> GetListExcelNode()
        {
            return _listExcelNode;
        }
    }
}
