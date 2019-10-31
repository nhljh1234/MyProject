using Interface;
using ProjectClass;

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
            return null;
        }
    }
}
