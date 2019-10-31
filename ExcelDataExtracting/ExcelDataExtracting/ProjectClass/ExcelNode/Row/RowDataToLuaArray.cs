using Interface;
using ProjectClass;

namespace ProjectClass
{
    class RowDataToLuaArray : IExcelNodeRead
    {
        private RowNode _rowNode;

        public RowDataToLuaArray(RowNode rowNode)
        {
            _rowNode = rowNode;
        }

        public string GetString()
        {
            return null;
        }
    }
}
