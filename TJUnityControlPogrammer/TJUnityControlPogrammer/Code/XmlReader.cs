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
            string windowPath, outputPath, assetBundlePathTo, assetBundlePathFrom;
            windowPath = getFirstElement(root, "window").InnerText;
            outputPath = getFirstElement(root, "output").InnerText;
            assetBundlePathTo = getFirstElement(root, "assetBundleTo").InnerText;
            assetBundlePathFrom = getFirstElement(root, "assetBundleFrom").InnerText;
            _workData = new DataClass.WorkData(windowPath, outputPath, assetBundlePathTo, assetBundlePathFrom);
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
