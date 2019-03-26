using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace TJUnityControlPogrammer.Code
{
    class XmlReader
    {
        private DataClass.WorkData _workData = null;

        public XmlReader(string xmlFilePath)
        {
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(xmlFilePath);
            XmlElement root = xmlDoc.DocumentElement;//取到根结点
            //输出配置
            string windowPath, outputPath, assetBundlePath;
            windowPath = getFirstElement(root, "window").InnerText;
            outputPath = getFirstElement(root, "output").InnerText;
            assetBundlePath = getFirstElement(root, "assetBundle").InnerText;
            _workData = new DataClass.WorkData(windowPath, outputPath, assetBundlePath);
        }

        public DataClass.WorkData getWorkData()
        {
            return _workData;
        }

        //获取第一个改名字的子节点
        private XmlElement getFirstElement(XmlElement parent, string tagName)
        {
            foreach (XmlElement childElement in parent.GetElementsByTagName(tagName))
            {
                return childElement;
            }
            return null;
        }
    }
}
