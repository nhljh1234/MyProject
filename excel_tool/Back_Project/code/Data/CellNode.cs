using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//单元格node
//这边会检测一个单元格内是否存在多种字体，也就是Font节点的存在
//存在多种字体的时候可能会无法确定数据类型，所以Font节点是非法的存在
namespace Back_Project.code.Data
{
    class CellNode
    {
        //存储数据类型
        private int _dataType;
        //存储数据
        private double _num;
        private Boolean _boolData;
        private string _str;
        //存储key
        private string _key;

        //新建一个CellNode
        public CellNode(int dataType, string key, double num, Boolean boolData, string str)
        {
            _dataType = dataType;
            _key = key;
            _num = num;
            _boolData = boolData;
            _str = str;
        }

        //获取数据类型
        public int getType()
        {
            return _dataType;
        }

        //获取存储的double类型的数据
        public double getNum()
        {
            return _num;
        }

        //获取存储的布尔型数据
        public Boolean getBoolData()
        {
            return _boolData;
        }

        //获取存储的字符串型数据
        public string getStr()
        {
            return _str;
        }

        //获取key
        public string getKey()
        {
            return _key;
        }
    }
}
