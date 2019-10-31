using Interface;
using ProjectClass;

namespace ProjectClass
{
    class SheetDataToJsonObject : IExcelNodeRead
    {
        private SheetNode _sheetNode;

        public SheetDataToJsonObject(SheetNode sheetNode)
        {
            _sheetNode = sheetNode;
        }

        public string GetString()
        {
            return null;
        }
    }
}
