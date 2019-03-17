using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Back_Project.code.Tool.XmlReader
{
    class XmlRowNodeReader
    {
        private Boolean _isKeyRow = false;
        private XmlElement _rowElement;
        private XmlCellNodeReader _cellNodeReader;
        private Data.TableNode _tableNode;

        public XmlRowNodeReader(Boolean isKeyRow, XmlElement rowElement, Data.TableNode tableNode)
        {
            _isKeyRow = isKeyRow;
            _rowElement = rowElement;
            _tableNode = tableNode;
        }

        public Data.RowNode getRowNode()
        {
            int count = 0;
            int ssIndex;
            Data.RowNode rowNode = new Data.RowNode();
            List<Data.CellNode> cellNodes = new List<Data.CellNode>();
            Data.CellNode keyNode = null;
            foreach (XmlElement cellElement in _rowElement.GetElementsByTagName("Cell"))
            {
                if (cellElement.GetAttribute("ss:Index") != "")
                {
                    ssIndex = Int32.Parse(cellElement.GetAttribute("ss:Index"));
                    while (count < ssIndex - 1)
                    {
                        cellNodes.Add(null);
                        count++;
                    }
                }
                if (_isKeyRow)
                {
                    _cellNodeReader = new XmlCellNodeReader(cellElement, _tableNode.getSheetName());
                    if (_cellNodeReader.getCellNode() == null)
                    {
                        continue;
                    }
                    rowNode.addCellNode(_cellNodeReader.getCellNode());
                }
                else
                {
                    //这边判断是不是key和output
                    string key = _tableNode.getKeyStrByIndex(count);
                    _cellNodeReader = new XmlCellNodeReader(cellElement, _tableNode.getSheetName(), key);
                    if (_cellNodeReader.getCellNode() == null)
                    {
                        continue;
                    }
                    code.Data.TranslateFileData.TranslateData translateData = _tableNode.getTranslateData();
                    if (translateData.key == key)
                    {
                        keyNode = _cellNodeReader.getCellNode();
                    }
                    if (translateData.outputStrs.Contains(key))
                    {
                        cellNodes.Add(_cellNodeReader.getCellNode());
                    }
                }
                count++;
            }
            if (!_isKeyRow)
            {
                rowNode.addCellNode(keyNode);
                for (int i = 0; i < cellNodes.Count; i++)
                {
                    rowNode.addCellNode(cellNodes[i]);
                }
            }
            return rowNode;
        }
    }
}
