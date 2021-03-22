using ExcelDataTransform.ConfigDataClass;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExcelDataTransform.ExcelDataClass
{
    class GlobalNode
    {
        public GlobalNode(ConfigNode configNode)
        {
            string rootPath = Directory.GetCurrentDirectory();
            DirectoryInfo root = new DirectoryInfo(rootPath);
            FileInfo[] files = root.GetFiles();
            for (int i = 0; i < files.Length; i++)
            {
                FileInfo fileInfo = files[i];
                string fileName = fileInfo.Name;
                if (configNode.configFileNodeDic.TryGetValue(fileName, out ConfigFileNode configFileNode))
                {
                    FileNode fileNode = new FileNode(fileInfo.FullName, configFileNode);
                    fileNode.WriteOutputFile();
                }
            }
        }
    }
}
