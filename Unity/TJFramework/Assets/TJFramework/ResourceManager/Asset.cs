using UnityEngine;
using Object = UnityEngine.Object;

namespace TJ
{
    public abstract class Asset
    {
        public abstract string AssetName { get; protected set; }
        public abstract GameObject Instantiate();
        public abstract GameObject Instantiate(Vector3 position, Quaternion rotation);
        public abstract GameObject Instantiate(Vector3 position, Quaternion rotation, Transform parent);
        //public abstract Object TakeAsset(Object owner);
        //public abstract void ReturnAsset(Object owner);
        public abstract Object RawAsset { get; }
        public abstract Bundle Bundle { get; }
        public abstract bool IsDispose { get; }
    }

}
