using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;
using System.Text.RegularExpressions;
using Object = UnityEngine.Object;

namespace TJ
{

    public class AssetTarget : System.IComparable<AssetTarget>
    {
        /// <summary>
        /// 目标Object
        /// </summary>
        public Object asset;
        /// <summary>
        /// 文件路径
        /// </summary>
        public FileInfo file;
        /// <summary>
        /// 相对于Assets文件夹的目录
        /// </summary>
        public string assetPath;
        /// <summary>
        /// 导出类型
        /// </summary>
        public AssetBundleExportType exportType = AssetBundleExportType.Asset;
        /// <summary>
        /// BundleName
        /// </summary>
        public string bundleName;


        //是否已分析过依赖
        private bool _isAnalyzed = false;
        ////上次打好的AB的CRC值（用于增量打包）
        //private string _bundleCrc;
        ////是否是新打包的
        //private bool _isNewBuild;
        /// <summary>
        /// 我要依赖的项
        /// </summary>
        private HashSet<AssetTarget> _dependParentSet = new HashSet<AssetTarget>();
        /// <summary>
        /// 依赖我的项
        /// </summary>
        private HashSet<AssetTarget> _dependChildrenSet = new HashSet<AssetTarget>();

        public AssetTarget(Object o, FileInfo file, string assetPath)
        {
            this.asset = o;
            this.file = file;
            this.assetPath = assetPath;
            SetBundleName(assetPath + ".ab");
        }

        public void SetBundleName(string name)
        {
            if (string.IsNullOrEmpty(name))
                return;

            bundleName = AssetBundleUtils.ConvertToABName(name);
        }


        /// <summary>
        /// 分析引用关系
        /// </summary>
        public void Analyze()
        {
            if (_isAnalyzed) return;
            _isAnalyzed = true;


            Object[] deps = EditorUtility.CollectDependencies(new Object[] { asset });

            List<Object> depList = new List<Object>();
            for (int i = 0; i < deps.Length; i++)
            {
                Object o = deps[i];
                //不包含脚本对象
                //不包含LightingDataAsset对象
                if (o is MonoScript || o is LightingDataAsset)
                    continue;

                //不包含builtin对象
                string path = AssetDatabase.GetAssetPath(o);
                if (path.StartsWith("Resources"))
                    continue;

                depList.Add(o);
            }
            deps = depList.ToArray();


            var res = from s in deps
                      let obj = AssetDatabase.GetAssetPath(s)
                      select obj;
            var paths = res.Distinct().ToArray();

            for (int i = 0; i < paths.Length; i++)
            {
                if (File.Exists(paths[i]) == false)
                {
                    //Debug.Log("invalid:" + paths[i]);
                    continue;
                }
                FileInfo fi = new FileInfo(paths[i]);
                AssetTarget target = AssetBundleUtils.Load(fi);
                if (target == null)
                    continue;

                this.AddDependParent(target);

                target.Analyze();
            }
        }

        public void Merge()
        {
            if (this.NeedExportStandalone())
            {
                var children = new List<AssetTarget>(_dependChildrenSet);
                this.RemoveDependChildren();
                foreach (AssetTarget child in children)
                {
                    child.AddDependParent(this);
                }
            }
        }

        private void GetRoot(HashSet<AssetTarget> rootSet)
        {
            switch (this.exportType)
            {
                case AssetBundleExportType.Standalone:
                case AssetBundleExportType.Root:
                    rootSet.Add(this);
                    break;
                default:
                    foreach (AssetTarget item in _dependChildrenSet)
                    {
                        item.GetRoot(rootSet);
                    }
                    break;
            }
        }

        private bool beforeExportProcess;

        /// <summary>
        /// 在导出之前执行
        /// </summary>
        public void BeforeExport()
        {
            if (beforeExportProcess) return;
            beforeExportProcess = true;

            foreach (AssetTarget item in _dependChildrenSet)
            {
                item.BeforeExport();
            }

            if (this.exportType == AssetBundleExportType.Asset)
            {
                HashSet<AssetTarget> rootSet = new HashSet<AssetTarget>();
                this.GetRoot(rootSet);
                if (rootSet.Count > 1)
                {
                    HashSet<string> set = new HashSet<string>();
                    foreach (var r in rootSet)
                        set.Add(r.bundleName);

                    if (set.Count > 1)
                        this.exportType = AssetBundleExportType.Standalone;
                }
            }
        }


        /// <summary>
        /// 获取所有依赖项
        /// </summary>
        /// <param name="list"></param>
        public void GetDependencies(HashSet<AssetTarget> list)
        {
            var ie = _dependParentSet.GetEnumerator();
            while (ie.MoveNext())
            {
                AssetTarget target = ie.Current;
                if (target.NeedSelfExport)
                {
                    list.Add(target);
                }
                else
                {
                    target.GetDependencies(list);
                }
            }
        }

        public List<AssetTarget> Dependencies
        {
            get { return new List<AssetTarget>(_dependParentSet); }
        }

        public AssetBundleExportType CompositeType
        {
            get
            {
                AssetBundleExportType type = exportType;
                if (type == AssetBundleExportType.Root && _dependChildrenSet.Count > 0)
                    type |= AssetBundleExportType.Asset;
                return type;
            }
        }


        /// <summary>
        /// 是不是自身的原因需要导出如指定的类型prefab等，有些情况下是因为依赖树原因需要单独导出
        /// </summary>
        public bool NeedSelfExport
        {
            get
            {
                bool v = exportType == AssetBundleExportType.Root || exportType == AssetBundleExportType.Standalone;

                return v;
            }
        }


        /// <summary>
        /// (作为AssetType.Asset时)是否需要单独导出
        /// </summary>
        /// <returns></returns>
        private bool NeedExportStandalone()
        {
            return _dependChildrenSet.Count > 1;
        }

        /// <summary>
        /// 增加依赖项
        /// </summary>
        /// <param name="target"></param>
        private void AddDependParent(AssetTarget target)
        {
            if (target == this || this.ContainsDepend(target))
                return;

            _dependParentSet.Add(target);
            target.AddDependChild(this);
            this.ClearParentDepend(target);
        }

        /// <summary>
        /// 是否已经包含了这个依赖（检查子子孙孙）
        /// </summary>
        /// <param name="target"></param>
        /// <param name="recursive"></param>
        /// <returns></returns>
        private bool ContainsDepend(AssetTarget target, bool recursive = true)
        {
            if (_dependParentSet.Contains(target))
                return true;
            if (recursive)
            {
                var e = _dependParentSet.GetEnumerator();
                while (e.MoveNext())
                {
                    if (e.Current.ContainsDepend(target, true))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        private void AddDependChild(AssetTarget parent)
        {
            _dependChildrenSet.Add(parent);
        }

        /// <summary>
        /// 我依赖了这个项，那么依赖我的项不需要直接依赖这个项了
        /// </summary>
        private void ClearParentDepend(AssetTarget target = null)
        {
            IEnumerable<AssetTarget> cols = _dependParentSet;
            if (target != null) cols = new AssetTarget[] { target };
            foreach (AssetTarget at in cols)
            {
                var e = _dependChildrenSet.GetEnumerator();
                while (e.MoveNext())
                {
                    AssetTarget dc = e.Current;
                    dc.RemoveDependParent(at);
                }
            }
        }

        /// <summary>
        /// 移除依赖项
        /// </summary>
        /// <param name="target"></param>
        /// <param name="recursive"></param>
        private void RemoveDependParent(AssetTarget target, bool recursive = true)
        {
            _dependParentSet.Remove(target);
            target._dependChildrenSet.Remove(this);

            //recursive
            var dcc = new HashSet<AssetTarget>(_dependChildrenSet);
            var e = dcc.GetEnumerator();
            while (e.MoveNext())
            {
                AssetTarget dc = e.Current;
                dc.RemoveDependParent(target);
            }
        }

        private void RemoveDependChildren()
        {
            var all = new List<AssetTarget>(_dependChildrenSet);
            _dependChildrenSet.Clear();
            foreach (AssetTarget child in all)
            {
                child._dependParentSet.Remove(this);
            }
        }

        /// <summary>
        /// 依赖我的项
        /// </summary>
        public List<AssetTarget> DependsChildren
        {
            get { return new List<AssetTarget>(_dependChildrenSet); }
        }


        public void AnalyzeBundleName()
        {
            var rules = AssetBundleUtils.GetDummyRules();
            string ap = assetPath.Replace('\\', '/');
            //倒序遍历
            for (int i = rules.Count - 1; i >= 0; i--)
            {
                var rule = rules[i];

                //目录匹配
                if (!ap.StartsWith(rule.directory + "/"))
                    continue;

                //获取'/'后的路径
                ap = ap.Substring(rule.directory.Length + 1);

                //如果没递归, 路径就不应该有'/'
                if (!rule.recursion && ap.IndexOf('/') != -1)
                    continue;

                //获取文件名
                int l = ap.LastIndexOf('/');
                string fn = l == -1 ? ap : ap.Substring(l + 1);

                //模式匹配
                foreach (var pattern in rule.patterns)
                {
                    var mac = Regex.Matches(fn, pattern, RegexOptions.IgnoreCase);
                    //foreach (Match match in mac)
                    //    Debug.Log(match.Value);
                    if (mac.Count > 0)
                    {
                        //成功, 设置新的bundlename
                        SetBundleName(Path.Combine(rule.directory, rule.bundle));
                        return;
                    }
                }
            }
        }

        int System.IComparable<AssetTarget>.CompareTo(AssetTarget other)
        {
            return other._dependChildrenSet.Count.CompareTo(_dependChildrenSet.Count);
        }

    }
}
