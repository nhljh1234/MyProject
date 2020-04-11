using Interface;
using ProjectClass;
using System.Collections.Generic;

namespace ProjectClass
{
    class SheetDataToJsonArray : IExcelNodeRead
    {
        private SheetNode _sheetNode;

        public SheetDataToJsonArray(SheetNode sheetNode)
        {
            _sheetNode = sheetNode;
        }

        public string GetString()
        {
            string jsonStr = "{\r\n";
            //RowNode _keyRowNode = _sheetNode.GetKeyRowNode();
            jsonStr = jsonStr + "    [\r\n";
            List<ExcelNode> listExcelDataNode = _sheetNode.GetListExcelNode();
            for (int i = 0; i < listExcelDataNode.Count; i++)
            {
                jsonStr = jsonStr + listExcelDataNode[i].GetExcelNodeReadModule();
            }
            jsonStr = "    ]\r\n";
            jsonStr = jsonStr + "}";
            return jsonStr;
        }
    }
}
