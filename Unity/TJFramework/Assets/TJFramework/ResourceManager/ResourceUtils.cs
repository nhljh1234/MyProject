
using System;
using System.IO;
using UnityEngine;

namespace TJ
{
    //TODO: 非编辑器模式还没测试过
    public static class ResourceUtils
    {
        //热更新目录名
        public static string HotUpdateFolder = "hotupdate";
        public static string HotUpdatePath { get { return Path.Combine(Application.persistentDataPath, HotUpdateFolder); } }

        public const string AssetBundleFolder = "assetbundles";
        public const string AssetBundleFileList = "assetlist.txt";

        //path可以是绝对路径
        public static byte[] LoadBytes(string path)
        {
            //外部热更新目录
            string pdpath = Path.Combine(HotUpdatePath, path);
            if (File.Exists(pdpath))
                return File.ReadAllBytes(pdpath);

            //streamingAssetsPath目录
            return LoadFromStreamingAssets(path);
        }

        public static bool FileExists(string path)
        {
            bool inApp;
            return FileExists(path, out inApp);
        }

        public static bool FileExists(string path, out bool inApp)
        {
            inApp = true;
            //外部热更新目录
            string pdpath = Path.Combine(HotUpdatePath, path);
            if (File.Exists(pdpath))
            {
                inApp = false;
                return true;
            }

            //streamingAssetsPath目录
            return IsStreamingAssetsExists(path);
        }

        public static string FullPathForAssetBundleApi(string path)
        {
            bool inApp;
            return FullPathForAssetBundleApi(path, out inApp);
        }

        /// <summary>
        /// 获取完整的路径, 路径是AssetBundle Api可识别的方式.
        /// 大部分情况, 返回值都可以用C#的文件函数直接读取. 一些特殊情况除外, 比如android
        /// TODO:anroid的路径需要另外处理
        /// </summary>
        /// <param name="path"></param>
        /// <param name="inApp"></param>
        /// <returns>返回完整路径. 返回空字符表示无法定位到文件</returns>
        public static string FullPathForAssetBundleApi(string path, out bool inApp)
        {
            inApp = true;
            string pdpath = Path.Combine(HotUpdatePath, path);
            if (File.Exists(pdpath))
            {
                inApp = false;
                return pdpath;
            }

            if (!IsStreamingAssetsExists(path))
                return "";
            else
                return Path.Combine(Application.streamingAssetsPath, path);
        }

        //TODO: 返回一个适合www格式的路径 FullPathForWWWApi



        /// <summary>
        /// check file exists of streamingAssets. On Android will use plugin to do that.
        /// </summary>
        /// <param name="path">relative path,  when file is "file:///android_asset/test.txt", the pat is "test.txt"</param>
        /// <returns></returns>
        public static bool IsStreamingAssetsExists(string path)
        {
#if TODO_ANDROID
            if (Application.platform == RuntimePlatform.Android)
                return KEngineAndroidPlugin.IsAssetExists(path);
#endif

            var fullPath = Path.Combine(Application.streamingAssetsPath, path);
            return File.Exists(fullPath);
        }

        /// <summary>
        /// Load file from streamingAssets. On Android will use plugin to do that.
        /// </summary>
        /// <param name="path">relative path,  when file is "file:///android_asset/test.txt", the pat is "test.txt"</param>
        /// <returns></returns>
        public static byte[] LoadFromStreamingAssets(string path)
        {
            if (!IsStreamingAssetsExists(path))
                throw new Exception("Not exist StreamingAssets path: " + path);

#if TODO_ANDROID
            if (Application.platform == RuntimePlatform.Android)
                return KEngineAndroidPlugin.GetAssetBytes(path);
#endif

            var fullPath = Path.Combine(Application.streamingAssetsPath, path);
            return File.ReadAllBytes(fullPath);
        }

        //public static bool IsPersistentDataExists(string path)
        //{
        //    var fullPath = Path.Combine(Application.persistentDataPath, path);
        //    return File.Exists(fullPath);
        //}

        //public static byte[] LoadFromPersistentDataPath(string path)
        //{
        //    if (!IsPersistentDataExists(path))
        //        throw new Exception("Not exist PersistentData path: " + path);

        //    var fullPath = Path.Combine(Application.persistentDataPath, path);
        //    return ReadAllBytes(fullPath);
        //}

        ///// <summary>
        ///// 无视锁文件，直接读bytes
        ///// </summary>
        ///// <param name="resPath"></param>
        //public static byte[] ReadAllBytes(string resPath)
        //{
        //    byte[] bytes;
        //    using (FileStream fs = File.Open(resPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
        //    {
        //        bytes = new byte[fs.Length];
        //        fs.Read(bytes, 0, (int)fs.Length);
        //    }
        //    return bytes;
        //}


        public static string ConvertToABName(string assetPath)
        {
            string bn = assetPath
                .Replace('\\', '/')
                .ToLower();
            return bn;
        }


    }
}