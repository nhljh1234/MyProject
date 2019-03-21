using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Test : MonoBehaviour {
    delegate void mycall(string str);
    //event mycall call;

    // Use this for initialization
    IEnumerator Start () {
        //AssetBundle.LoadFromFile(Application.streamingAssetsPath + "/assetbundles/assets/scenes/materials/sha.ab");
        //string fn = "/assetbundles/assets/scenes/cylinder.prefab.ab";
        //string path = Application.streamingAssetsPath + fn;
        ////Debug.Log(path);
        ////AssetBundle ab = AssetBundle.LoadFromFile(path);
        ////ab = AssetBundle.LoadFromFile(path);
        ////Debug.Log(ab);

        //AssetBundleCreateRequest abc = AssetBundle.LoadFromFileAsync(path);
        ////AssetBundle.LoadFromFile(path);
        ////AssetBundle.LoadFromFileAsync(path);
        ////Debug.Log(abc.isDone);

        //yield return abc;

        ////Debug.Log(abc.assetBundle);

        //var ab = abc.assetBundle;
        ////foreach (var n in ab.GetAllAssetNames())
        ////    Debug.Log(n);

        //var abr = ab.LoadAssetAsync<GameObject>("cylinder");
        //AssetBundleRequest abr1 = ab.LoadAssetAsync<GameObject>("cylinder");
        //var go = ab.LoadAsset<GameObject>("cylinder");
        //Debug.Log(abr.isDone);
        ////yield return abr;
        //yield return abr1;
        //Debug.Log(abr.isDone);
        //Debug.Log(abr.asset.GetInstanceID());
        //Debug.Log(go.GetInstanceID());

        //WaitWhile
        //WaitForSecondsRealtime
        //CustomYieldInstruction

        ////Debug.Log(call);
        //mycall x = (string str) =>
        //{
        //    Debug.Log("1=== " + str);
        //};

        //var call = x;
        ////call -= x;

        //Debug.Log(call);
        //call("dddd test");

        Debug.Log(Application.persistentDataPath);
        Debug.Log(Application.streamingAssetsPath);

        //TJ.BundleManager.Create();
        //TJ.BundleManager.CreateInstance<TJ.AssetBundleManager>();
        //TJ.BundleManager.CreateInstance<TJ.SimulateBundleManager>();
        //var mgr = TJ.BundleManager.Instance;

        //var req = mgr.LoadBundleAsync("assets/scenes/materials/sha.ab");
        //Debug.Log(mgr.LoadBundle("assets/scenes/samplescene.unity.ab"));
        //yield return req;
        ////Debug.Log(req.AssetBundle);
        //Debug.Log(mgr.LoadBundle("assets/scenes/samplescene.unity.ab"));

        //var req = mgr.LoadAssetAsync("assets/scenes/cylinder.prefab");
        //yield return req;
        //var asset = req.Asset;
        //mgr.UnloadUnusedBundles(true);

        //var inst = asset.Instantiate(); //生成的对象到下一帧才会被移除
        //Destroy(inst);
        //inst = null;
        //yield return null;
        //System.GC.Collect();
        //System.GC.WaitForPendingFinalizers();
        //mgr.UnloadUnusedBundles(true);

        //并行加载
        //var bi = mgr.LoadBundle("assets/scenes/cylinder.prefab.ab");
        //var req = bi.LoadAssetAsync("assets/scenes/cylinder.prefab");
        //Debug.Log(bi.LoadAsset("assets/scenes/cylinder.prefab"));
        //yield return req;
        //Debug.Log(req.Asset);
        //req.Asset.Instantiate();


        //var req = TJ.BundleManager.Instance.LoadAssetAsync("assets/tjtest/cylinder.prefab");
        //yield return req;
        //var asset = req.Asset;
        //var go  = asset.Instantiate();
        //object goobj = go;
        //Destroy(go);
        //yield return null;
        //Debug.Log("go: " + (go == null));
        //Debug.Log("goobj: " + (goobj == null));

        //yield return null;
        //System.GC.Collect();
        //System.GC.WaitForPendingFinalizers();
        ////mgr.UnloadUnusedBundles(false);


        yield return null;

        //Object obj = new Object();
        //Debug.Log(!obj);
        //object oo = obj;
        //oo = null;
        //Debug.Log(!obj);

        //string a = "sfs";
        //oo = a;
        //obj = oo as Object;
        //Debug.Log(!obj);

        //mgr.AssetExists("Assets/StreamingAssets/assetbundles/assets/tjframework/test/cube.prefab.ab");

        //TJ.LuaManager.Instance.DoString(@"require('test')");


    }

}


