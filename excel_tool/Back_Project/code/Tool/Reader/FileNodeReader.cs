using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Back_Project.code.Tool.Reader
{
    class FileNodeReader
    {
        private string _fileName;
        private XmlElement _fileElement;
        private TableNodeReader _tableNodeReader;

        public FileNodeReader(string fileName, string fileFullPath)
        {
            _fileName = fileName;
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(fileFullPath);
            _fileElement = xmlDoc.DocumentElement;//取到根结点
        }

        public Data.FileNode getFileNode()
        {
            Data.FileNode fileNode = new Data.FileNode(_fileName);
            foreach (XmlElement tableElement in _fileElement.GetElementsByTagName("Worksheet"))
            {
                string sheetName = tableElement.GetAttribute("ss:Name");
                _tableNodeReader = new TableNodeReader(sheetName, tableElement, _fileName);
                fileNode.addTableNode(_tableNodeReader.getTableNode());
            }
            return fileNode;
        }
    }
}
