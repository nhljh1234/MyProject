using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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
            //这边特殊写的
            nowDir = nowDir.Parent.Parent;
            //遍历文件夹
            Boolean hasAssetsFolder = false;
            String assetsDirPath = "";
            foreach (DirectoryInfo dir in nowDir.GetDirectories())
            {
                if (dir.Name.IndexOf("assets") >= 0)
                {
                    assetsDirPath = dir.FullName;
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
            //抓取需要检查的component的名字
            Tool.AssetsCheck assetsCheckTool = new Tool.AssetsCheck(assetsDirPath);
            String checkComponentNameStr = assetsCheckTool.getFileContent(nowPath + @"/check_component_name.txt");
            if (checkComponentNameStr == null)
            {
                Console.WriteLine("check_component_name加载错误，回车退出");
                Console.ReadLine();
                return;
            }
            //获取需要检查的component名字的列表
            string[] checkComponentNameArr = Regex.Split(checkComponentNameStr, ",", RegexOptions.IgnoreCase);
            //开始检查
            assetsCheckTool.startCheck(checkComponentNameArr);
            Console.WriteLine("检查完成，回车退出");
            Console.ReadLine();
        }
    }
}
