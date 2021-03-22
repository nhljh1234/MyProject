using System.Collections.Generic;
using System.Xml;

namespace ExcelDataTransform.ConfigDataClass
{
    class ConfigSheetNode
    {
        public string sheetName;
        public string outputName;
        public ConfigFileNode configFileNode;
        public List<string> outputKeyList = new List<string>();

        public ConfigSheetNode(XmlElement sheetElement, ConfigFileNode configFileNode)
        {
            sheetName = sheetElement.GetAttribute("name").ToString();
            outputName = sheetElement.GetAttribute("output").ToString();

            this.configFileNode = configFileNode;

            string outputKeyStr = sheetElement.InnerText;
            string[] outputKeyArr = outputKeyStr.Split(',');
            outputKeyList = new List<string>(outputKeyArr);
        }
    }
}
