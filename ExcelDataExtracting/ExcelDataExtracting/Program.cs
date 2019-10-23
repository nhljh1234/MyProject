using DataClass;
using Tool;
using Config;
using System;

namespace ExcelDataExtracting
{
    class Program
    {
        static void Main(string[] args)
        {
            OutPutConfig outPutConfig = JsonFileRead.GetInstance().GetObject<OutPutConfig>(GlobalConfig.outputConfigPath);
            FileConfig fileConfig = JsonFileRead.GetInstance().GetObject<FileConfig>(GlobalConfig.fileConfigPath);

            Console.WriteLine("sssssssssssssss");
        }
    }
}
