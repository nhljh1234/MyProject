using System;
using UnityEngine;
using Object = UnityEngine.Object;

namespace TJ
{
    public class AssetBundleAsset : Asset
    {
        Object asset;
        AssetBundleBundle bundle;

        public override string AssetName { get; protected set; }


        public AssetBundleAsset(Object asset, string assetName, AssetBundleBundle bundle)
        {
            this.asset = asset;
            this.bundle = bundle;
            AssetName = assetName;
        }


        public override GameObject Instantiate()
        {
            //Object.Instantiate应该只能作用于GameObject和Component, 但是Component无法独立打包, 所以应该只有GameObject
            if (CheckDispose())
                return null;

            var prefab = asset as GameObject;
            if (!prefab)
                return null;

            var inst = Object.Instantiate<GameObject>(prefab);
            inst.name = prefab.name;
            Bundle.Hold(inst);
            return inst;
        }

        public override GameObject Instantiate(Vector3 position, Quaternion rotation)
        {
            if (CheckDispose())
                return null;

            var prefab = asset as GameObject;
            if (!prefab)
                return null;

            var inst = Object.Instantiate<GameObject>(prefab, position, rotation);
            inst.name = prefab.name;
            Bundle.Hold(inst);
            return inst;
        }

        public override GameObject Instantiate(Vector3 position, Quaternion rotation, Transform parent)
        {
            if (CheckDispose())
                return null;

            var prefab = asset as GameObject;
            if (!prefab)
                return null;

            var inst = Object.Instantiate<GameObject>(prefab, position, rotation, parent);
            inst.name = prefab.name;
            Bundle.Hold(inst);
            return inst;
        }

        //public override Object TakeAsset(Object owner)
        //{
        //    if (CheckDispose())
        //        return null;

        //    Bundle.Hold(owner);
        //    return asset;
        //}

        //public override void ReturnAsset(Object owner)
        //{
        //    if (CheckDispose())
        //        return;

        //    Bundle.Return(owner);
        //}

        //以此方式获得的资源, 需要留意 BundleManager.Instance.UnloadUnusedBundles(true); 如果移除所属的包, 会资源无效
        public override Object RawAsset
        {
            get
            {
                if (CheckDispose())
                    return null;
                return asset;
            }
        }

        public override Bundle Bundle
        {
            get
            {
                if (IsDispose)
                    return null;
                return bundle;
            }
        }

        public override bool IsDispose
        {
            get
            {
                return bundle.IsDispose;
            }
        }

        public override string ToString()
        {
            return string.Format("{0}({1})", base.ToString(), AssetName);
        }


        bool CheckDispose()
        {
            if (IsDispose)
            {
                Debug.LogErrorFormat("AssetBundleAsset '{0}' is Dispose!", AssetName);
                return true;
            }
            return false;
        }

        internal void SetAsset(Object rawseet)
        {
            asset = rawseet;
        }
    }

}
