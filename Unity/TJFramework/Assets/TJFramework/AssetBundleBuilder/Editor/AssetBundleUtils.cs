using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;
using System.Text.RegularExpressions;
using Object = UnityEngine.Object;

namespace TJ
{
    [System.Serializable]
    public class AssetBundleBuildRuleData
    {
        [System.Serializable]
        public class Rule
        {
            public string directory;
            public string[] patterns;
            public bool recursion;
            public string bundle;
            public bool dummy;
        }

        public Rule[] rules;
    }


    class AssetBundleUtils
    {
        public static AssetBundlePathResolver pathResolver;
        public static DirectoryInfo AssetDir = new DirectoryInfo(Application.dataPath);
        public static string AssetPath = AssetDir.FullName;
        public static DirectoryInfo ProjectDir = AssetDir.Parent;
        public static string ProjectPath = ProjectDir.FullName;

        static Dictionary<int, AssetTarget> _object2target;
        static Dictionary<string, AssetTarget> _assetPath2target;
        static List<AssetBundleBuildRuleData.Rule> _dummyRules;

        public static void Init()
        {
            _object2target = new Dictionary<int, AssetTarget>();
            _assetPath2target = new Dictionary<string, AssetTarget>();
            _dummyRules = new List<AssetBundleBuildRuleData.Rule>();
        }

        public static void ClearCache()
        {
            _object2target = null;
            _assetPath2target = null;
            _dummyRules = null;
        }


        public static List<AssetTarget> GetAll()
        {
            return new List<AssetTarget>(_object2target.Values);
        }


        public static AssetTarget Load(FileInfo file, System.Type t)
        {
            AssetTarget target = null;
            string fullPath = file.FullName;
            int index = fullPath.IndexOf("Assets");
            if (index != -1)
            {
                string assetPath = fullPath.Substring(index);
                if (_assetPath2target.ContainsKey(assetPath))
                {
                    target = _assetPath2target[assetPath];
                }
                else
                {
                    Object o = null;
                    if (t == null)
                        o = AssetDatabase.LoadMainAssetAtPath(assetPath);
                    else
                        o = AssetDatabase.LoadAssetAtPath(assetPath, t);

                    if (o != null)
                    {
                        int instanceId = o.GetInstanceID();

                        if (_object2target.ContainsKey(instanceId))
                        {
                            target = _object2target[instanceId];
                        }
                        else
                        {
                            target = new AssetTarget(o, file, assetPath);
                            string key = string.Format("{0}/{1}", assetPath, instanceId);
                            _assetPath2target[key] = target;
                            _object2target[instanceId] = target;
                        }
                    }
                }
            }

            return target;
        }

        public static AssetTarget Load(FileInfo file)
        {
            return Load(file, null);
        }

        public static string ConvertToABName(string assetPath)
        {
            string bn = assetPath
                .Replace('\\', '/')
                .ToLower();
            return bn;
        }

        public static void AddDummyRule(AssetBundleBuildRuleData.Rule rule)
        {
            //正则表达式转换
            List<string> newpa = new List<string>();
            foreach(var p in rule.patterns)
            {
                string pa = p;
                if (pa == "*.*")
                    pa = "*";
                pa = Regex.Escape(pa);           //转义
                pa = pa.Replace("\\*", ".*");   //处理 * 
                pa = pa.Replace("\\?", ".?");   //处理 ?
                pa = "^" + pa + "$";            //首尾
                newpa.Add(pa);
            }
            rule.patterns = newpa.ToArray();

            _dummyRules.Add(rule);
        }

        public static List<AssetBundleBuildRuleData.Rule> GetDummyRules() { return _dummyRules; }

        public static void KillEmptyDirectoryWithMeta(String storagepath)
        {
            bool isdel = false;
            DirectoryInfo dir = new DirectoryInfo(storagepath);
            DirectoryInfo[] subdirs = dir.GetDirectories("*.*", SearchOption.AllDirectories);
            foreach (DirectoryInfo subdir in subdirs)
            {
                FileSystemInfo[] subFiles = subdir.GetFileSystemInfos();
                if (subFiles.Length == 0)
                {
                    isdel = true;
                    string metapath = subdir.FullName + ".meta";
                    subdir.Delete();
                    if (File.Exists(metapath))
                        File.Delete(metapath);
                }
            }

            if (isdel)
                KillEmptyDirectoryWithMeta(storagepath);
        }
    }
}
