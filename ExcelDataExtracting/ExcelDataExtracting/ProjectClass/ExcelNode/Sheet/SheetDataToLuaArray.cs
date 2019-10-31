using Interface;
using ProjectClass;

namespace ProjectClass
{
    class SheetDataToLuaTable : IExcelNodeRead
    {
        private SheetNode _sheetNode;

        public SheetDataToLuaTable(SheetNode sheetNode)
        {
            _sheetNode = sheetNode;
        }

        public string GetString()
        {
            return null;
        }
    }
}
