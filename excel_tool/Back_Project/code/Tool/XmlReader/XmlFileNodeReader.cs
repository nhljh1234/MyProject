using System.Xml;

namespace Back_Project.code.Tool.XmlReader
{
    class XmlFileNodeReader
    {
        private string _fileName;
        private XmlElement _fileElement;
        private XmlTableNodeReader _tableNodeReader;

        public XmlFileNodeReader(string fileName, string fileFullPath)
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
                _tableNodeReader = new XmlTableNodeReader(sheetName, tableElement, _fileName);
                fileNode.addTableNode(_tableNodeReader.getTableNode());
            }
            return fileNode;
        }
    }
}
