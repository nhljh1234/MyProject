using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectClass
{
    public class SheetConfig
    {
        public string name;
        public string new_name;
        public string key;
        public bool isArray;
        public string[] output_key;
    }

    public class ExcelFileConfig
    {
        public string name;
        public SheetConfig[] sheets;
    }

    public class FileConfig
    {
        public ExcelFileConfig[] files;
    }
}
