using Interface;
using ProjectClass;

namespace ProjectClass
{
    class CellDataToJsonArray : IExcelNodeRead
    {
        private CellNode _cellNode;

        public CellDataToJsonArray(CellNode cellNode)
        {
            _cellNode = cellNode;
        }

        public string GetString()
        {
            return _cellNode.GetCellDataStr();
        }
    }
}
