#if UNITY_EDITOR
using System;
using Object = UnityEngine.Object;

namespace TJ
{
    public class SimulateBundle : Bundle
    {
        public SimulateBundle(string bundleName)
        {
            BundleName = bundleName;
            IsDispose = false;
        }

        public override string BundleName { get; protected set; }
        public override bool IsDispose { get; protected set; }
        public override void Hold(Object owner) { }
        public override void Return(Object owner) { }

        public override Asset LoadAsset(string assetName)
        {
            return LoadAsset(assetName, typeof(Object));
        }

        public override Asset LoadAsset(string assetName, Type type)
        {
            return SimulateBundleManager.Instance.LoadAsset(assetName, type);
        }

        public override AssetLoadRequest LoadAssetAsync(string assetName)
        {
            return LoadAssetAsync(assetName, typeof(Object));
        }

        public override AssetLoadRequest LoadAssetAsync(string assetName, Type type)
        {
            return SimulateBundleManager.Instance.LoadAssetAsync(assetName, type);
        }
    }
}

#endif