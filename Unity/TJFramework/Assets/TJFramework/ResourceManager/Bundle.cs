using System;
using Object = UnityEngine.Object;

namespace TJ
{
    public abstract class Bundle
    {
        public abstract string BundleName { get; protected set; }
        public abstract bool IsDispose { get; protected set; }
        public abstract void Hold(Object owner);
        public abstract void Return(Object owner);
        public abstract Asset LoadAsset(string assetName);
        public abstract Asset LoadAsset(string assetName, Type type);
        public abstract AssetLoadRequest LoadAssetAsync(string assetName);
        public abstract AssetLoadRequest LoadAssetAsync(string assetName, Type type);
    }
}
