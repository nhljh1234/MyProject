using Interface;
using ProjectClass;

namespace ProjectClass
{
    class CellDataToLuaTable : IExcelNodeRead
    {
        private CellNode _cellNode;

        public CellDataToLuaTable(CellNode cellNode)
        {
            _cellNode = cellNode;
        }

        public string GetString()
        {
            return _cellNode.GetCellDataStr();
        }
    }
}
