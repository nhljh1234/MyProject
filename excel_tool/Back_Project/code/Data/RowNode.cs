using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//存储一行的多个cell节点
namespace Back_Project.code.Data
{
    class RowNode
    {
        //cell节点的list
        private List<CellNode> _cellNodeList;

        public RowNode()
        {
            _cellNodeList = new List<CellNode>();
        }

        public void addCellNode(CellNode cellNode)
        {
            _cellNodeList.Add(cellNode);
        }

        public List<CellNode> getCellNodeList()
        {
            return _cellNodeList;
        }
    }
}
