using ExcelDataTransform.ConfigDataClass;
using ExcelDataTransform.ExcelDataClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ExcelDataTransform
{
    class Program
    {
        static void Main(string[] args)
        {
            //先读取配置
            new GlobalNode(new ConfigNode());                
        }
    }
}
