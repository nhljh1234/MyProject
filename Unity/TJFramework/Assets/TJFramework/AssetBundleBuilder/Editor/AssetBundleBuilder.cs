using System.Collections.Generic;
using System.IO;
using System;
using UnityEditor;
using UnityEngine;
using System.Linq;

namespace TJ
{



    public class AssetBundleBuilder
    {
        AssetBundlePathResolver pathResolver;
        readonly string ruleFilePath;

        public AssetBundleBuilder(AssetBundlePathResolver resolver, string ruleFilePath)
        {
            this.pathResolver = resolver;
            this.ruleFilePath = ruleFilePath;
            this.InitDirs();
            AssetBundleUtils.pathResolver = pathResolver;
        }

        void InitDirs()
        {
            new DirectoryInfo(pathResolver.BundleSavePath).Create();
        }

        public void Begin()
        {
            AssetDatabase.Refresh();
            EditorUtility.DisplayProgressBar("Loading", "Loading...", 0.1f);
            AssetBundleUtils.Init();
        }

        public void End()
        {
            AssetBundleUtils.ClearCache();
            EditorUtility.ClearProgressBar();
        }

        public virtual void Analyze()
        {
            var all = AssetBundleUtils.GetAll();
            foreach (AssetTarget target in all)
            {
                target.Analyze();
            }
            all = AssetBundleUtils.GetAll();
            foreach (AssetTarget target in all)
            {
                target.Merge();
            }
            all = AssetBundleUtils.GetAll();
            foreach (AssetTarget target in all)
            {
                target.AnalyzeBundleName();
            }
            foreach (AssetTarget target in all)
            {
                target.BeforeExport();
            }
        }

        public virtual void Export()
        {
            this.Analyze();


            Dictionary<string, AssetBundleBuild> dic = new Dictionary<string, AssetBundleBuild>();
            //标记所有 asset bundle name
            var all = AssetBundleUtils.GetAll();
            for (int i = 0; i < all.Count; i++)
            {
                AssetTarget target = all[i];
                if (target.NeedSelfExport)
                {
                    string assetName = target.assetPath.Replace('\\', '/');
                    if (dic.ContainsKey(target.bundleName))
                    {
                        AssetBundleBuild build = dic[target.bundleName];
                        string[] ans = new string[build.assetNames.Length + 1];
                        for (int j = 0; j < build.assetNames.Length; j++)
                            ans[j] = build.assetNames[j];
                        ans[build.assetNames.Length] = assetName;
                        build.assetNames = ans;
                        dic[target.bundleName] = build;
                    }
                    else
                    {
                        AssetBundleBuild build = new AssetBundleBuild() {
                            assetBundleName = target.bundleName,
                            assetNames = new string[] { assetName },
                        };
                        dic[target.bundleName] = build;
                    }
                }
            }

            AssetBundleBuild[] builds = dic.Values.ToArray();
            

            //开始打包
            AssetBundleManifest manifest = BuildPipeline.BuildAssetBundles(pathResolver.BundleSavePath, builds, BuildAssetBundleOptions.ChunkBasedCompression, EditorUserBuildSettings.activeBuildTarget);

            //
            CheckAssetBundleName(manifest, builds);

            SaveFileList(builds);

            //移除无用资源
            RemoveUnused(manifest);


            //
            AssetDatabase.RemoveUnusedAssetBundleNames();
            AssetDatabase.Refresh();

        }


        //检查导出的文件名必须和输入的一致
        protected void CheckAssetBundleName(AssetBundleManifest manifest, AssetBundleBuild[] builds)
        {
            HashSet<string> set = new HashSet<string>();
            string[] abs = manifest.GetAllAssetBundles();
            foreach (var ab in abs)
            {
                set.Add(ab);
            }

            foreach (var li in builds)
            {
                if (!set.Contains(li.assetBundleName))
                    throw new Exception("Can't locate ab file: " + li.assetBundleName);
            }
        }


        protected void SaveFileList(AssetBundleBuild[] builds, bool prettyPrint = true)
        {
            List<string> list = new List<string>();

            foreach (var build in builds)
            {
                foreach (var assetName in build.assetNames)
                {
                    list.Add(assetName + " | " + build.assetBundleName);
                }
            }

            list.Sort();

            AssetBundleFileList abfl = new AssetBundleFileList()
            {
                list = list.ToArray(),
            };
            string jstr = JsonUtility.ToJson(abfl, prettyPrint);    //TODO:需要配置打印效果
            //Debug.Log(jstr);
            File.WriteAllText(pathResolver.BundleSavePath + "/" + pathResolver.AssetBundleFileList, jstr, new System.Text.UTF8Encoding(false)); //无BOM头
        }

        //移除无用资源. 比如删除未使用的AB，可能是上次打包出来的，而这一次没生成的
        protected void RemoveUnused(AssetBundleManifest manifest)
        {
            HashSet<string> needfiles = new HashSet<string>();
            string[] abs = manifest.GetAllAssetBundles();
            foreach (var ab in abs)
            {
                needfiles.Add(ab);
                needfiles.Add(ab + ".manifest");
            }

            //主文件与目录同名
            needfiles.Add(pathResolver.BundleSaveDirName);
            needfiles.Add(pathResolver.BundleSaveDirName + ".manifest");

            //
            needfiles.Add(pathResolver.AssetBundleFileList);


            //
            DirectoryInfo rootdi = new DirectoryInfo(pathResolver.BundleSavePath);
            int rootpathLength = rootdi.FullName.Length + 1;
            FileInfo[] allfile = rootdi.GetFiles("*", SearchOption.AllDirectories);
            foreach (FileInfo fi in allfile)
            {
                //不移除目录的meta
                if (fi.FullName.EndsWith(".meta") && Directory.Exists(fi.FullName.Substring(0, fi.FullName.Length - 5)))
                {
                    continue;
                }

                string fn = fi.FullName.Replace('\\', '/').Substring(rootpathLength);
                string ffn = fn;
                if (fn.EndsWith(".meta"))
                    ffn = fn.Substring(0, fn.Length - ".meta".Length);
                if (!needfiles.Contains(ffn))
                {
                    Debug.Log("Delete unused file: " + fn);
                    fi.Delete();
                }
            }


            //删除空目录
            AssetBundleUtils.KillEmptyDirectoryWithMeta(pathResolver.BundleSavePath);
        }


        protected void AddRootTargets(AssetBundleBuildRuleData.Rule rule)
        {
            var bundleDir = new DirectoryInfo(rule.directory);
            //Debug.Log(bundleDir.FullName);
            var patterns = rule.patterns;
            SearchOption searchOption = rule.recursion ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;

            for (int i = 0; i < patterns.Length; i++)
            {
                FileInfo[] prefabs = bundleDir.GetFiles(patterns[i], searchOption);
                foreach (FileInfo file in prefabs)
                {
                    if (file.Extension.Contains("meta"))
                        continue;

                    AssetTarget target = AssetBundleUtils.Load(file);
                    target.exportType = AssetBundleExportType.Root;
                    if (!string.IsNullOrEmpty(rule.bundle))
                        target.SetBundleName(Path.Combine(rule.directory, rule.bundle));
                }
            }
        }

        public void ParseRule()
        {
            string jstr = File.ReadAllText(ruleFilePath);
            var buildRule = JsonUtility.FromJson<AssetBundleBuildRuleData>(jstr);
            foreach (var rule in buildRule.rules)
            {
                if (string.IsNullOrEmpty(rule.directory))
                    throw new Exception("'directory' field must be setted!");

                if (rule.patterns == null || rule.patterns.Length == 0)
                    throw new Exception("'patterns' field must be setted!");

                rule.directory = rule.directory.Replace('\\', '/');
                if (rule.directory[rule.directory.Length - 1] == '/')
                    rule.directory = rule.directory.Substring(0, rule.directory.Length - 1);

                if (!rule.dummy)
                    AddRootTargets(rule);
                else
                {
                    if (string.IsNullOrEmpty(rule.bundle))
                        throw new Exception("dummy rule, 'bundle' field must be setted!");
                    AssetBundleUtils.AddDummyRule(rule);
                }
            }


        }


    }


}