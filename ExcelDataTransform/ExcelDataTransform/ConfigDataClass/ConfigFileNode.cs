using System.Collections.Generic;
using System.Xml;

namespace ExcelDataTransform.ConfigDataClass
{
    class ConfigFileNode
    {
        public string fileName;
        public string outputName;
        public string outputDir;
        public Dictionary<string, ConfigSheetNode> configSheetNodeDic = new Dictionary<string, ConfigSheetNode>();

        public ConfigFileNode(XmlElement fileElement, string outputDir)
        {
            fileName = fileElement.GetAttribute("name").ToString();
            outputName = fileElement.GetAttribute("output").ToString();
            this.outputDir = outputDir;

            XmlNodeList sheetElementList = fileElement.ChildNodes;

            foreach(XmlNode sheetNode in sheetElementList)
            {
                ConfigSheetNode configSheetNode = new ConfigSheetNode((XmlElement)sheetNode, this);
                configSheetNodeDic[configSheetNode.sheetName] = configSheetNode;
            }
        }
    }
}
