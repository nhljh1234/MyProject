using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Object = UnityEngine.Object;

namespace TJ
{

    public class AssetBundleBundle : Bundle
    {
        AssetBundle assetBundle;
        HashSet<AssetBundleBundle> deps;
        Dictionary<int, WeakReference> references = new Dictionary<int, WeakReference>();
        Dictionary<string, WeakReference> assetReferences = new Dictionary<string, WeakReference>();

        int depRefCount = 0;    //被依赖的引用计数
        int asyncCount = 0;     //异步加载的次数

        public override string BundleName { get; protected set; }
        public AssetBundle AssetBundle { get { return assetBundle; } }
        public override bool IsDispose { get; protected set; }
        public bool IsLoadingAsync { get { return asyncCount > 0; } }


        public AssetBundleBundle(AssetBundleLoader loader, HashSet<AssetBundleBundle> deps)
        {
            IsDispose = false;

            BundleName = loader.bundleName;
            assetBundle = loader.assetBundleCache;
            loader.assetBundleCache = null;

            this.deps = deps;
            //引用关系
            foreach (var depInfo in this.deps)
            {
                if (!depInfo.IsDispose)
                    depInfo.depRefCount++;
            }
        }


        internal void Dispose(bool unloadAllLoadedObjects)
        {
            if (IsDispose)
                return;

            IsDispose = true;

            references.Clear();
            foreach (var depInfo in this.deps)
            {
                if (!depInfo.IsDispose)
                    depInfo.depRefCount--;
            }
            deps = null;

            assetBundle.Unload(unloadAllLoadedObjects);
            assetBundle = null;

            Debug.LogFormat("Unload AssetBundle({0}): {1}", unloadAllLoadedObjects, BundleName);
        }

        public override void Hold(Object owner)
        {
            if (owner == null)
                throw new System.Exception("Please set the owner!");

            int uid = owner.GetInstanceID();
            if (!references.ContainsKey(uid))
            {
                references.Add(uid, new WeakReference(owner));
            }
            else
            {
                //这部分代码不知道怎么测试啊. 听天由命吧
                //假设InstanceID在同一时间不会重复, 但是在不同时间跨度会被复用. 这只能猜测.
                WeakReference wr = references[uid];
                //object obj = wr.Target;
                //if (obj == null || System.Object.ReferenceEquals(obj, owner))
                //    wr.Target = owner;
                //简化为如下, 总之得覆盖
                wr.Target = owner;
            }
        }

        public override void Return(Object owner)
        {
            int uid = owner.GetInstanceID();
            if (references.ContainsKey(uid))
            {
                references.Remove(uid);
            }
        }

        AssetBundleAsset CreateAsset(Object rawasset, string assetName)
        {
            //根据名字匹配规则, 可能出现多个assetName 对应 一个rawasset的情况. 不过这没关系
            AssetBundleAsset asset;
            WeakReference wr;
            if (assetReferences.TryGetValue(assetName, out wr))
            {
                asset = wr.Target as AssetBundleAsset;
                if (asset != null)
                {
                    //强行更新资源. 一般来说, 资源应该是一样的.
                    asset.SetAsset(rawasset);
                    return asset;
                }
                else
                    assetReferences.Remove(assetName);
            }

            asset = new AssetBundleAsset(rawasset, assetName, this);
            assetReferences.Add(assetName, new WeakReference(asset));

            return asset;
        }

        int UpdateReference()
        {
            {
                List<int> li = new List<int>();
                foreach (KeyValuePair<int, WeakReference> pair in references)
                {
                    object o = pair.Value.Target;
                    if (o == null)
                    {
                        //空处理
                        li.Add(pair.Key);
                    }
                    else
                    {
                        //UnityEngine.Object的destroy处理
                        Object uo = (Object)o;
                        if (!uo)
                            li.Add(pair.Key);
                    }
                }

                foreach (var i in li)
                {
                    references.Remove(i);
                }
            }

            {
                List<string> li = new List<string>();
                foreach (KeyValuePair<string, WeakReference> pair in assetReferences)
                {
                    object o = pair.Value.Target;
                    if (o == null)
                        li.Add(pair.Key);
                }

                foreach (var i in li)
                {
                    assetReferences.Remove(i);
                }
            }

            return references.Count + assetReferences.Count;
        }

        //释放没有被使用
        public bool IsUnused
        {
            get { return depRefCount <= 0 && asyncCount <= 0 && UpdateReference() == 0; }
        }



        public override Asset LoadAsset(string assetName)
        {
            return LoadAsset(assetName, typeof(Object));
        }

        public override Asset LoadAsset(string assetName, Type type)
        {
            var asset = assetBundle.LoadAsset(assetName, type);
            return asset != null ? CreateAsset(asset, assetName) : null;
        }

        public override AssetLoadRequest LoadAssetAsync(string assetName)
        {
            return LoadAssetAsync(assetName, typeof(Object));
        }

        public override AssetLoadRequest LoadAssetAsync(string assetName, Type type)
        {
            return new AssetBundleAssetLoadRequest(this, assetName, type);
        }



        //-----------------------------------
        public IEnumerator LoadAssetAsyncImpl(string assetName, Type type, AssetBundleAssetLoadRequest req)
        {
            asyncCount++;
            AssetBundleRequest abr = assetBundle.LoadAssetAsync(assetName, type);
            yield return abr;
            asyncCount--;

            if (IsDispose)
            {
                //应该不会执行. 首先asyncCount>0的时候不会被处置. 如果是重置Mangager, 会停止所有协程
                Debug.LogError("AssetBundleBundle is Dispose!");
            }

            if (abr.asset && !IsDispose)
                req.SetAsset(CreateAsset(abr.asset, assetName));
            req.SetComplete();
        }
    }
}
