using System;
using System.IO;

namespace CocosCreatorPrefabCheckTool.Tool
{
    class PrefabCopy
    {
        private String _assetsDirPath;
        private String _prefabDirPath;
        private String _sceneDirPath;

        private void visitDir(String dirPath, string pathStr)
        {
            DirectoryInfo dirInfo = new DirectoryInfo(dirPath);
            //遍历文件
            foreach (FileInfo fileInfo in dirInfo.GetFiles())
            {
                if (fileInfo.Extension == ".prefab")
                {
                    //拷贝
                    File.Copy(fileInfo.FullName, this._prefabDirPath + @"/" + pathStr + @"__" + fileInfo.Name, true);
                }
                else if (fileInfo.Extension == ".fire")
                {
                    //拷贝
                    File.Copy(fileInfo.FullName, this._sceneDirPath + @"/" + pathStr + @"__" + fileInfo.Name, true);
                }
            }
            //遍历文件夹
            foreach (DirectoryInfo childDirInfo in dirInfo.GetDirectories())
            {
                this.visitDir(childDirInfo.FullName, pathStr + @"__" + childDirInfo.Name);
            }
        }

        public PrefabCopy (String assetsDirPath, String nowPath)
        {
            this._assetsDirPath = assetsDirPath;
            //新建两个文件夹，一个存放prefab，一个存放scene
            this._prefabDirPath = nowPath + @"/prefab";
            this._sceneDirPath = nowPath + @"/scene";
            //删除源文件夹
            if (Directory.Exists(this._prefabDirPath))
            {
                Directory.Delete(this._prefabDirPath, true);
            }
            if (Directory.Exists(this._sceneDirPath))
            {
                Directory.Delete(this._sceneDirPath, true);
            }
            //创建
            Directory.CreateDirectory(this._prefabDirPath);
            Directory.CreateDirectory(this._sceneDirPath);
        }

        //递归拷贝文件
        public void start()
        {
            this.visitDir(this._assetsDirPath, @"assets");
        }
    }
}
