using System;
using System.IO;

namespace LuaFileToTxtFile
{
    class Program
    {
        static void changeExtension(DirectoryInfo directoryInfo)
        {
            //先遍历文件
            foreach (FileInfo fileInfo in directoryInfo.GetFiles("*.lua"))
            {
                Console.WriteLine("修改：" + fileInfo.FullName);
                File.Copy(fileInfo.FullName, fileInfo.FullName + ".txt", true);
                fileInfo.Delete();
            }
            //再遍历文件夹
            foreach (DirectoryInfo childDirInfo in directoryInfo.GetDirectories())
            {
                changeExtension(childDirInfo);
            }
        }

        static void Main(string[] args)
        {
            changeExtension(new DirectoryInfo(Environment.CurrentDirectory));
            Console.WriteLine("完成，输入任何数值退出");
            Console.Read();
        }
    }
}
