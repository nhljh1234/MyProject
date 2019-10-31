using Interface;
using ProjectClass;

namespace ProjectClass
{
    class SheetDataToLuaArray : IExcelNodeRead
    {
        private SheetNode _sheetNode;

        public SheetDataToLuaArray(SheetNode sheetNode)
        {
            _sheetNode = sheetNode;
        }

        public string GetString()
        {
            return null;
        }
    }
}
