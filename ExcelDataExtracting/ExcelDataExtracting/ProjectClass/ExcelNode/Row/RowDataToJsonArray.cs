using Interface;
using ProjectClass;

namespace ProjectClass
{
    class RowDataToJsonArray : IExcelNodeRead
    {
        private RowNode _rowNode;

        public RowDataToJsonArray(RowNode rowNode)
        {
            _rowNode = rowNode;
        }

        public string GetString()
        {
            return null;
        }
    }
}
