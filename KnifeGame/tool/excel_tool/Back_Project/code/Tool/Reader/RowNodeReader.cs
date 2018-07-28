using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Back_Project.code.Tool.Reader
{
    class RowNodeReader
    {
        private Boolean _isKeyRow = false;
        private XmlElement _rowElement;
        private CellNodeReader _cellNodeReader;
        private Data.TableNode _tableNode;
        private int _rowIndex;

        public RowNodeReader(Boolean isKeyRow, XmlElement rowElement, Data.TableNode tableNode, int rowIndex)
        {
            _isKeyRow = isKeyRow;
            _rowElement = rowElement;
            _tableNode = tableNode;
            _rowIndex = rowIndex;
        }

        public Data.RowNode getRowNode()
        {
            int count = 0;
            int ssIndex;
            Data.RowNode rowNode = new Data.RowNode();
            foreach (XmlElement cellElement in _rowElement.GetElementsByTagName("Cell"))
            {
                if (cellElement.GetAttribute("ss:Index") != "")
                {
                    ssIndex = Int32.Parse(cellElement.GetAttribute("ss:Index"));
                    while(count < ssIndex - 1)
                    {
                        rowNode.addCellNode(null);
                        count++;
                    }
                }
                if (_isKeyRow)
                {
                    _cellNodeReader = new CellNodeReader(cellElement, _tableNode.getSheetName());
                }
                else
                {
                    _cellNodeReader = new CellNodeReader(cellElement, _tableNode.getSheetName(), 
                        _tableNode.getKeyStrByIndex(count), _rowIndex);
                }
                if (_cellNodeReader.getCellNode() == null)
                {
                    continue;
                }
                rowNode.addCellNode(_cellNodeReader.getCellNode());
                count++;
            }
            return rowNode;
        }
    }
}
