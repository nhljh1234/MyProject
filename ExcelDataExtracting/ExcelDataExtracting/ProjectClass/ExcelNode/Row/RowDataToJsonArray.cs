using Config;
using Interface;
using ProjectClass;
using System.Collections.Generic;

namespace ProjectClass
{
    class RowDataToJsonArray : IExcelNodeRead
    {
        private RowNode _rowNode;

        public RowDataToJsonArray(RowNode rowNode)
        {
            _rowNode = rowNode;
        }

        public string GetString(GlobalConfig.OUTPUT_TYPE type)
        {
            string jsonStr = "{\r\n";
            List<ExcelNode> listExcelDataNode = _rowNode.GetListExcelNode();
            for (int i = 0; i < listExcelDataNode.Count; i++)
            {
                jsonStr = "    " + '"' + _rowNode.GetKeyByIndex(i, type) + '"' + ": " + _rowNode.GetValueByIndex(i, type);
                jsonStr = jsonStr + ((i == _rowNode.GetMaxCellNum() - 1) ? "" : ",");
                jsonStr = jsonStr + "\r\n";
            }
            return jsonStr;
        }
    }
}
