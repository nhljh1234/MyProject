﻿namespace DataClass
{
    class OutPutConfig
    {
        public class OnceConfig
        {
            //输出类型
            public int outputType;
            //输出路径
            public string outputDirPath;
            //是否整合为一个文件
            public bool outputAsOneFile;
        }

        public OnceConfig[] arrayOfConfigs;
    }
}