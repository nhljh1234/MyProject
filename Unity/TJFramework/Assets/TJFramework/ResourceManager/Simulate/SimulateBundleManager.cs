#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;
using Object = UnityEngine.Object;


namespace TJ
{
    public class SimulateBundleManager : BundleManager
    {
        Dictionary<string, SimulateBundle> bundles = new Dictionary<string, SimulateBundle>();
        HashSet<string> holdBundleNames = new HashSet<string>();

        public override bool CanDispose()
        {
            return true;
        }


        public override bool AssetExists(string assetName)
        {
            //assetName = assetName.ToLower();
            //Type t = AssetDatabase.GetMainAssetTypeAtPath(assetName);
            //return t != null;
            return File.Exists(assetName);
        }

        public override string AssetBundleName(string assetName)
        {
            return AssetExists(assetName) ? assetName.ToLower() + ".ab" : null;
        }

        public override Asset LoadAsset(string assetName)
        {
            return LoadAsset(assetName, typeof(Object));
        }

        public override Asset LoadAsset(string assetName, Type type)
        {
            Object rawasset = AssetDatabase.LoadAssetAtPath(assetName, type);
            if (rawasset == null)
                return null;

            string bundleName = ResourceUtils.ConvertToABName(assetName) + ".ab";
            SimulateBundle bundle = LoadBundle(bundleName) as SimulateBundle;

            return new SimulateAsset(rawasset, assetName, bundle);
        }

        public override AssetLoadRequest LoadAssetAsync(string assetName)
        {
            return LoadAssetAsync(assetName, typeof(Object));
        }

        public override AssetLoadRequest LoadAssetAsync(string assetName, Type type)
        {
            Object rawasset = AssetDatabase.LoadAssetAtPath(assetName, type);
            if (rawasset == null)
                return new SimulateAssetLoadRequest(null);

            string bundleName = ResourceUtils.ConvertToABName(assetName) + ".ab";
            SimulateBundle bundle = LoadBundle(bundleName) as SimulateBundle;

            var asset =  new SimulateAsset(rawasset, assetName, bundle);
            return new SimulateAssetLoadRequest(asset);
        }

        public override Bundle LoadBundle(string bundleName, bool hold = false)
        {
#if DEBUG
            if (System.Text.RegularExpressions.Regex.IsMatch(bundleName, "[A-Z]"))
                Debug.LogError("AssertBundle name must be lowercase letters");
#endif

            SimulateBundle bundle;
            if (!bundles.TryGetValue(bundleName, out bundle))
            {
                bundle = new SimulateBundle(bundleName);
                bundles.Add(bundleName, bundle);
            }
            return bundle;
        }

        public override LoaderLoadRequest LoadBundleAsync(string bundleName, bool hold = false)
        {
#if DEBUG
            if (System.Text.RegularExpressions.Regex.IsMatch(bundleName, "[A-Z]"))
                Debug.LogError("AssertBundle name must be lowercase letters");
#endif

            SimulateBundle bundle;
            if (!bundles.TryGetValue(bundleName, out bundle))
            {
                bundle = new SimulateBundle(bundleName);
                bundles.Add(bundleName, bundle);
            }

            return new SimulateLoaderLoadRequest(bundle);
        }

        public override void SetBundleHold(Bundle bundle, bool hold)
        {
            var bundleName = bundle.BundleName;

            if (hold && !holdBundleNames.Contains(bundleName))
            {
                bundle.Hold(this);
                holdBundleNames.Add(bundleName);
            }
            else if (!hold && holdBundleNames.Contains(bundleName))
            {
                bundle.Return(this);
                holdBundleNames.Remove(bundleName);
            }
        }

        public override void UnloadUnusedBundles(bool unloadAllLoadedObjects) { }
    }


}

#endif