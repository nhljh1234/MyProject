using System.Collections.Generic;
using System.Xml;

namespace ExcelDataTransform.ConfigDataClass
{
    class ConfigNode
    {
        public Dictionary<string, ConfigFileNode> configFileNodeDic = new Dictionary<string, ConfigFileNode>();

        public ConfigNode()
        {
            XmlDocument doc = new XmlDocument();
            doc.Load(@".\config.xml");
            XmlNode filesNode = doc.SelectSingleNode("files");
            XmlElement filesElement = (XmlElement)filesNode;
            XmlNodeList fileNodeList = filesNode.ChildNodes;
            foreach (XmlNode fileNode in fileNodeList)
            {
                ConfigFileNode configFileNode = new ConfigFileNode((XmlElement)fileNode, filesElement.GetAttribute("outputDir"));
                configFileNodeDic[configFileNode.fileName] = configFileNode;
            }
        }
    }
}
