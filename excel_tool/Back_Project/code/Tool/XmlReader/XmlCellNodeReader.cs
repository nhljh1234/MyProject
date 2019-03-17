using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

//cellNode数据读取器
namespace Back_Project.code.Tool.XmlReader
{
    class XmlCellNodeReader
    {
        private XmlElement _cellElement;
        private XmlElement _dataElement;
        private string _sheetName;
        private string _key;
        //标记是数据节点还是key节点
        private Boolean isKeyNode;

        public XmlCellNodeReader(XmlElement cellElement, string sheetName, string key)
        {
            _cellElement = cellElement;
            _sheetName = sheetName;
            _key = key;
            isKeyNode = false;
        }

        public XmlCellNodeReader(XmlElement cellElement, string sheetName)
        {
            _cellElement = cellElement;
            _sheetName = sheetName;
            isKeyNode = true;
        }

        //更具xml node节点生成对应的CellNode实例
        public Data.CellNode getCellNode()
        {
            GlobalData.DATA_TYPE dataType;
            double num = 0;
            Boolean boolData = false;
            string str = null;
            string type;
            if (_cellElement.GetElementsByTagName("Data").Count <= 0)
            {
                return null;
            }
            //拿到真正存储数据的Data节点
            foreach (XmlElement dataElement in _cellElement.GetElementsByTagName("Data"))
            {
                _dataElement = dataElement;
            }
            //在node中存储类型是更新字符串来存储的
            //总格有三类 Number String Boolean
            type = _dataElement.GetAttribute("ss:Type");
            if (type == "Number")
            {
                num = Double.Parse(_dataElement.InnerText);
                dataType = GlobalData.DATA_TYPE.DOUBLE;
            }
            else if (type == "Boolean")
            {
                boolData = (Int32.Parse(_dataElement.InnerText) != 0);
                dataType = GlobalData.DATA_TYPE.BOOLEAN;
            }
            else
            {
                str = _dataElement.InnerText;
                dataType = GlobalData.DATA_TYPE.STRING;
            }
            return new Data.CellNode(dataType, _key, num, boolData, str);
        }
    }
}
