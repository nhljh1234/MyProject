using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Back_Project.code.Tool.Reader
{
    class TableNodeReader
    {
        private RowNodeReader _rowNodeReader;
        private string _sheetName;
        private string _fileName;
        private XmlElement _tableElement;

        public TableNodeReader(string sheetName, XmlElement tableElement, string fileName)
        {
            _sheetName = sheetName;
            _tableElement = tableElement;
            _fileName = fileName;
        }

        public Data.TableNode getTableNode()
        {
            Data.TableNode tableNode = new Data.TableNode(_sheetName, _fileName);
            int count = 0;
            foreach(XmlElement rowElement in _tableElement.GetElementsByTagName("Row"))
            {
                if (rowElement.GetElementsByTagName("Cell").Count <= 0)
                {
                    Console.WriteLine(_sheetName + "表格中存在空的Row节点");
                    return null;
                }
                _rowNodeReader = new RowNodeReader(count == 1, rowElement, tableNode, count);
                if (count == 1)
                {
                    Data.RowNode keyRowNode = _rowNodeReader.getRowNode();
                    if (keyRowNode.getCellNodeList()[0].getStr() != "main_id")
                    {
                        Console.WriteLine(_sheetName + "表格第一列标记列必须是main_id");
                    }
                    tableNode.setKeyRowNode(_rowNodeReader.getRowNode());
                }
                else if (count > 1) 
                {
                    tableNode.addDataRowNode(_rowNodeReader.getRowNode());
                }
                count++;
            }
            return tableNode;
        }
    }
}
