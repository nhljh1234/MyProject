using System;
using UnityEngine;

namespace TJ
{
    /// <summary>
    /// assetName的路径必须以/分隔
    /// bundleName必须全部小写, 且以/分隔
    /// </summary>
    public abstract class BundleManager : Singleton<BundleManager, BundleManager.SingletonType>, IDisposable
    {
        public abstract bool CanDispose();
        public virtual void Dispose() { }
        public abstract bool AssetExists(string assetName);
        public abstract string AssetBundleName(string assetName);
        public abstract Asset LoadAsset(string assetName);
        public abstract Asset LoadAsset(string assetName, Type type);
        //LoadAssetAsync方法执行使用同步的LoadBundle方法
        //对于同一个AssetBunlde, 无法先执行异步的AssetBundle.LoadFromFileAsync, 再执行同步的AssetBundle.LoadFromFile, 所以提供提供此配置
        public bool IsLoadAssetAsyncButBundleSync { get; set; } = false;
        public abstract AssetLoadRequest LoadAssetAsync(string assetName);
        public abstract AssetLoadRequest LoadAssetAsync(string assetName, Type type);
        public abstract Bundle LoadBundle(string bundleName, bool hold = false);
        public abstract LoaderLoadRequest LoadBundleAsync(string bundleName, bool hold = false);
        public abstract void SetBundleHold(Bundle bundle, bool hold);
        public abstract void UnloadUnusedBundles(bool unloadAllLoadedObjects);



#if UNITY_EDITOR
        static int assetBundleSimulateMode = -1;
        public static bool IsAssetBundleSimulateMode
        {
            get
            {
                if (assetBundleSimulateMode == -1)
                    assetBundleSimulateMode = UnityEditor.EditorPrefs.GetBool("AssetBundleSimulateMode", false) ? 1 : 0;
                return assetBundleSimulateMode != 0;
            }
            set
            {
                int newValue = value ? 1 : 0;
                if (newValue != assetBundleSimulateMode)
                {
                    assetBundleSimulateMode = newValue;
                    UnityEditor.EditorPrefs.SetBool("AssetBundleSimulateMode", value);
                }
            }
        }
#endif

        public class SingletonType : ISingletonType<BundleManager>
        {
            public Type Type()
            {
#if UNITY_EDITOR
                if (IsAssetBundleSimulateMode)
                {
                    return typeof(SimulateBundleManager);
                }
                else
#endif
                {
                    return typeof(AssetBundleManager);
                }
            }
        }

    }


}
