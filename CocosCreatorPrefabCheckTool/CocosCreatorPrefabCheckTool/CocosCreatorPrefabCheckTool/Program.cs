using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CocosCreatorPrefabCheckTool
{
    class Program
    {
        static void Main(string[] args)
        {
            //当前文件夹
            String nowPath = System.Environment.CurrentDirectory;
            //判断当前文件夹下面有没有一个assets文件
            DirectoryInfo nowDir = new DirectoryInfo(nowPath);
            //遍历文件夹
            Boolean hasAssetsFolder = false;
            String assetsDirPatg = "";
            foreach (DirectoryInfo dir in nowDir.GetDirectories())
            {
                if (dir.Name.IndexOf("assets") >= 0)
                {
                    assetsDirPatg = dir.FullName;
                    hasAssetsFolder = true;
                    break;
                }
            }
            if (!hasAssetsFolder)
            {
                Console.WriteLine("未检测到assets文件夹，回车退出");
                Console.ReadLine();
                return;
            }
            //开始拷贝
            Tool.PrefabCopy prefabCopyTool = new Tool.PrefabCopy(assetsDirPatg, nowPath);
            prefabCopyTool.start();
            Console.WriteLine("拷贝完成，回车退出");
            Console.ReadLine();
        }
    }
}
