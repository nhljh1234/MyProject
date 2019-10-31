using Interface;
using ProjectClass;

namespace ProjectClass
{
    class CellDataToJsonObject : IExcelNodeRead
    {
        private CellNode _cellNode;

        public CellDataToJsonObject(CellNode cellNode)
        {
            _cellNode = cellNode;
        }

        public string GetString()
        {
            return _cellNode.GetCellDataStr();
        }
    }
}
