using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code
{
    class GlobalData
    {
        //这边标记数据类型
        public static int DATA_TYPE_DOUBLE = 1;
        public static int DATA_TYPE_BOOLEAN = 2;
        public static int DATA_TYPE_STRING = 3;

        public static Dictionary<string, code.Data.TranslateFileData> translateDic =
            new Dictionary<string, code.Data.TranslateFileData>();

        public static int server = 1;
        public static int client = 2;
    }
}
