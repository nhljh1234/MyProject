#if UNITY_EDITOR
using UnityEngine;
using Object = UnityEngine.Object;

namespace TJ
{
    public class SimulateAsset : Asset
    {
        readonly Object asset;
        readonly SimulateBundle bundle;

        public override string AssetName { get; protected set; }


        public SimulateAsset(Object asset, string assetName, SimulateBundle bundle)
        {
            this.asset = asset;
            this.bundle = bundle;
            AssetName = assetName;
        }

        public override GameObject Instantiate()
        {
            var prefab = asset as GameObject;
            if (!prefab)
                return null;

            var inst = Object.Instantiate<GameObject>(prefab);
            inst.name = prefab.name;
            return inst;
        }

        public override GameObject Instantiate(Vector3 position, Quaternion rotation)
        {
            var prefab = asset as GameObject;
            if (!prefab)
                return null;

            var inst = Object.Instantiate<GameObject>(prefab, position, rotation);
            inst.name = prefab.name;
            return inst;
        }

        public override GameObject Instantiate(Vector3 position, Quaternion rotation, Transform parent)
        {
            var prefab = asset as GameObject;
            if (!prefab)
                return null;

            var inst = Object.Instantiate<GameObject>(prefab, position, rotation, parent);
            inst.name = prefab.name;
            return inst;
        }

        //public override Object TakeAsset(Object owner) { return asset; }
        //public override void ReturnAsset(Object owner) { }
        public override Object RawAsset { get { return asset; } }
        public override Bundle Bundle { get { return bundle; } }
        public override bool IsDispose { get { return false; } }

        public override string ToString()
        {
            return string.Format("{0}({1})", base.ToString(), AssetName);
        }
    }

}

#endif