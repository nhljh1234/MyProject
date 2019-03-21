using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;

namespace TJ
{
    public class FrameworkMenuItems
    {
        [MenuItem("TJ/Build AssetBundles")]
        static void BuildAssetBundles()
        {
            AssetBundleBuilder builder = new AssetBundleBuilder(new AssetBundlePathResolver(), Config.AssetBundleBuildRulePath);
            builder.Begin();
            builder.ParseRule();
            builder.Export();
            builder.End();

            Debug.Log("Build AssetBundles OK!");
        }

        //[MenuItem("TJ/Sync Lua Files")]
        //static void SyncLuaFiles()
        //{
        //    //是否强行复制. 不考虑修改日期
        //    const bool FORCE_COPY = false;

        //    List<string> luafiles = new List<string>();
        //    HashSet<string> luafileset = new HashSet<string>();

        //    {
        //        //收集文件
        //        DirectoryInfo rootdi = new DirectoryInfo(Config.LuaScriptExternDirectory);
        //        int rootpathLength = rootdi.FullName.Length + 1;
        //        FileInfo[] allfile = rootdi.GetFiles("*.lua", SearchOption.AllDirectories);
        //        foreach (FileInfo fi in allfile)
        //        {
        //            string fn = fi.FullName.Replace('\\', '/').Substring(rootpathLength);
        //            luafiles.Add(fn);
        //            luafileset.Add(fn);
        //        }
        //    }

        //    {
        //        //复制修改日期比较新的文件
        //        foreach (var fn in luafiles)
        //        {
        //            string srcfn = Path.Combine(Config.LuaScriptExternDirectory, fn);
        //            string dstfn = Path.Combine(Config.LuaScriptDirectory, fn + ".bytes");
        //            FileInfo src = new FileInfo(srcfn);
        //            FileInfo dst = null;
        //            if (File.Exists(dstfn))
        //                dst = new FileInfo(dstfn);

        //            if (FORCE_COPY || dst == null || src.LastWriteTime > dst.LastWriteTime)
        //            {
        //                Debug.Log("Copy file: " + fn);
        //                var dirname = Path.GetDirectoryName(dstfn);
        //                if (!Directory.Exists(dirname))
        //                    Directory.CreateDirectory(dirname);
        //                File.Copy(srcfn, dstfn, true);
        //            }
        //        }
        //    }

        //    {
        //        //删除多余的文件
        //        DirectoryInfo rootdi = new DirectoryInfo(Config.LuaScriptDirectory);
        //        int rootpathLength = rootdi.FullName.Length + 1;
        //        FileInfo[] allfile = rootdi.GetFiles("*", SearchOption.AllDirectories);
        //        foreach (FileInfo fi in allfile)
        //        {
        //            //不移除目录的meta
        //            if (fi.FullName.EndsWith(".meta") && Directory.Exists(fi.FullName.Substring(0, fi.FullName.Length - 5)))
        //            {
        //                continue;
        //            }

        //            string fn = fi.FullName.Replace('\\', '/').Substring(rootpathLength);
        //            string ffn = fn;
        //            if (fn.EndsWith(".lua.bytes"))
        //                ffn = fn.Substring(0, fn.Length - ".bytes".Length);
        //            else if (fn.EndsWith(".lua.bytes.meta"))
        //                ffn = fn.Substring(0, fn.Length - ".bytes.meta".Length);
        //            if (!luafileset.Contains(ffn))
        //            {
        //                Debug.Log("Delete file: " + fn);
        //                fi.Delete();
        //            }
        //        }
        //    }

        //    //删除空目录
        //    AssetBundleUtils.KillEmptyDirectoryWithMeta(Config.LuaScriptDirectory);
        //    //刷新资源
        //    AssetDatabase.Refresh();

        //    Debug.Log("Sync Lua Files complete!");
        //}


        const string kAssetBundleSimulationMode = "TJ/Mode/Simulation Mode";

        [MenuItem(kAssetBundleSimulationMode)]
        public static void ToggleSimulationMode()
        {
            BundleManager.IsAssetBundleSimulateMode = !BundleManager.IsAssetBundleSimulateMode;
        }

        [MenuItem(kAssetBundleSimulationMode, true)]
        public static bool ToggleSimulationModeValidate()
        {
            Menu.SetChecked(kAssetBundleSimulationMode, BundleManager.IsAssetBundleSimulateMode);
            return true;
        }


        const string kExternLuaMode = "TJ/Mode/Extern Lua Mode";

        [MenuItem(kExternLuaMode)]
        public static void ToggleExternLuaMode()
        {
            LuaManager.IsExternLuaMode = !LuaManager.IsExternLuaMode;
        }

        [MenuItem(kExternLuaMode, true)]
        public static bool ToggleExternLuaModeValidate()
        {
            Menu.SetChecked(kExternLuaMode, LuaManager.IsExternLuaMode);
            return true;
        }

    }
}
