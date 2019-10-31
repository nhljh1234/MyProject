using Interface;
using ProjectClass;
using System.Collections.Generic;

namespace ProjectClass
{
    class RowDataToJsonObject : IExcelNodeRead
    {
        private RowNode _rowNode;

        public RowDataToJsonObject(RowNode rowNode)
        {
            _rowNode = rowNode;
        }

        public string GetString()
        {
            string jsonStr = "{\r\n";
            List<ExcelNode> listExcelDataNode = _rowNode.GetListExcelNode();
            for (int i = 0; i < listExcelDataNode.Count; i++)
            {
                jsonStr = "    " + '"' + _rowNode.GetKeyByIndex(i) + '"' + ": " + _rowNode.GetValueByIndex(i);
                jsonStr = jsonStr + ((i == _rowNode.GetMaxCellNum() - 1) ? "" : ",");
                jsonStr = jsonStr + "\r\n";
            }
            return jsonStr;
        }
    }
}
