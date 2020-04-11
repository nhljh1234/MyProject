using Config;
using Interface;
using ProjectClass;

namespace ProjectClass
{
    class CellDataToLuaArray : IExcelNodeRead
    {
        private CellNode _cellNode;

        public CellDataToLuaArray(CellNode cellNode)
        {
            _cellNode = cellNode;
        }

        public string GetString(GlobalConfig.OUTPUT_TYPE type)
        {
            return _cellNode.GetCellDataStr();
        }
    }
}
