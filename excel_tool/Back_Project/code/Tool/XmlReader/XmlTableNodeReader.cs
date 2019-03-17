using System;
using System.Collections.Generic;
using System.Xml;

namespace Back_Project.code.Tool.XmlReader
{
    class XmlTableNodeReader
    {
        private XmlRowNodeReader _rowNodeReader;
        private string _sheetName;
        private string _fileName;
        private XmlElement _tableElement;
        //要刷出的节点顺序
        private List<int> indexs;

        public XmlTableNodeReader(string sheetName, XmlElement tableElement, string fileName)
        {
            _sheetName = sheetName;
            _tableElement = tableElement;
            _fileName = fileName;
        }

        public Data.TableNode getTableNode()
        {
            Data.TableNode tableNode = new Data.TableNode(_sheetName, _fileName);
            int count = 0;
            foreach (XmlElement rowElement in _tableElement.GetElementsByTagName("Row"))
            {
                if (rowElement.GetElementsByTagName("Cell").Count <= 0)
                {
                    Console.WriteLine(_sheetName + "表格中存在空的Row节点");
                    return null;
                }
                if (count == 1)
                {
                    _rowNodeReader = new XmlRowNodeReader(true, rowElement, tableNode);
                    tableNode.setKeyRowNode(_rowNodeReader.getRowNode());
                }
                else if (count > 1)
                {
                    _rowNodeReader = new XmlRowNodeReader(false, rowElement, tableNode);
                    tableNode.addDataRowNode(_rowNodeReader.getRowNode());
                }
                count++;
            }
            return tableNode;
        }
    }
}
