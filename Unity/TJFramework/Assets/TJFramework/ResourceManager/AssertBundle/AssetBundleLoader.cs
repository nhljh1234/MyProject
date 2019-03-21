using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
using UnityEngine;

namespace TJ
{

    public class AssetBundleLoader
    {
        public enum State
        {
            None,
            Loading,
            Complete,
            Error,
        }

        public State state = State.None;
        public string bundleName;
        public string bundleFullPath;
        public int waitDepCount;
        public bool hold = false;
        public bool depError = false;
        public AssetBundle assetBundleCache;
        public AssetBundleBundle bundle;

        //加载完成回调. 依赖加载完成. 参数bool表示是否错误, 必须依赖和自身都没问题才没错误
        public event Action<bool> OnComplete;


        public IEnumerator LoadAsync()
        {
            Debug.Assert(state == State.None);
            if (state != State.None)
                yield break;

            state = State.Loading;

            if (bundleFullPath == "")
            {
                yield return null;
                state = State.Error;
                Debug.LogError("CANNOT locate file: " + bundleName);
            }
            else if (depError)
            {
                yield return null;
                state = State.Error;
            }
            else
            {
                AssetBundleCreateRequest req = AssetBundle.LoadFromFileAsync(bundleFullPath);
                yield return req;
                assetBundleCache = req.assetBundle;
                if (!assetBundleCache)
                    CheckBundleExists();

                state = assetBundleCache ? State.Complete : State.Error;
                if (state == State.Error)
                    Debug.LogError("AssetBundle.LoadFromFileAsync fail : " + bundleFullPath);
            }

            CheckComplete();
        }

        public void Load()
        {
            Debug.Assert(state == State.None);
            if (state != State.None)
                return;

            state = State.Loading;

            if (bundleFullPath == "")
            {
                state = State.Error;
                Debug.LogError("CANNOT locate file: " + bundleName);
            }
            else if (depError)
            {
                state = State.Error;
            }
            else
            {
                assetBundleCache = AssetBundle.LoadFromFile(bundleFullPath);
                if (!assetBundleCache)
                    CheckBundleExists();

                state = assetBundleCache ? State.Complete : State.Error;
                if (state == State.Error)
                    Debug.LogError("AssetBundle.LoadFromFile fail : " + bundleFullPath);
            }

            CheckComplete();
        }


        void CheckBundleExists()
        {
            if (assetBundleCache)
                return;

            //假设可能存在已经加载过的情况. 所以遍历一下
            IEnumerable<AssetBundle> allbundles = AssetBundle.GetAllLoadedAssetBundles();
            foreach (var bu in allbundles)
            {
                if (bu.name == bundleName)
                {
                    assetBundleCache = bu;
                    break;
                }
            }
        }


        public void DepComplete(bool err)
        {
            waitDepCount--;
            depError = depError || err;
            CheckComplete();
        }

        //是否已经完成. 包括自身加载完毕, 且等待依赖也加载完毕.
        //如果加载成功. state == State.Complete  同时  bundle有值
        //加载失败. state == State.Error 同时 bundle == null
        public bool IsComplete
        {
            get
            {
                return ((state == State.Complete || state == State.Error) && waitDepCount == 0);
            }
        }

        void CheckComplete()
        {
            if (IsComplete)
            {
                if (depError)
                {
                    state = State.Error;
                    if (assetBundleCache)
                    {
                        assetBundleCache.Unload(true);   //如果依赖出错. 则没有加载的必要
                        assetBundleCache = null;
                    }
                }

                //成功, 需要创建AssetBundleBundle
                if (state == State.Complete)
                {
                    Debug.Assert(bundle == null);
                    AssetBundleManager mgr = AssetBundleManager.Instance as AssetBundleManager;
                    bundle = new AssetBundleBundle(this, mgr.CollectDepAssetBundleBundles(bundleName));
                    if (hold)
                        mgr.SetBundleHold(bundle, true);
                }

                //通知
                if (OnComplete != null)
                {
                    var handler = OnComplete;
                    OnComplete = null;
                    handler(state == State.Error);
                }
            }
        }


    }
}
