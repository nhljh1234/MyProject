using System;
using UnityEngine;

/// <summary>
/// Inherit from this base class to create a singleton.
/// e.g. public class MyClassName : Singleton<MyClassName> {}
/// http://wiki.unity3d.com/index.php/Singleton
/// </summary>
namespace TJ
{
    public class Singleton<T> : Singleton<T, SingletonType<T>>
        where T : MonoBehaviour, IDisposable
    {
    }

    public interface ISingletonType<T> { Type Type(); }
    public class SingletonType<T> : ISingletonType<T> { public Type Type() { return typeof(T); } }

    public class Singleton<T, U> : MonoBehaviour
        where T : MonoBehaviour, IDisposable
        where U : ISingletonType<T>, new()
    {
        private static T m_Instance;

        public static T Instance
        {
            get
            {
                if (m_Instance == null)
                {
                    Type t = new U().Type();
                    Type bt = typeof(T);
                    if (t != bt && !t.IsSubclassOf(bt))
                    {
                        throw new Exception("Fail Create Sinleton!");
                    }

                    // Search for existing instance.
                    m_Instance = (T)FindObjectOfType(t);

                    // Create new instance if one doesn't already exist.
                    if (m_Instance == null)
                    {
                        // Need to create a new GameObject to attach the singleton to.
                        var singletonObject = new GameObject();
                        m_Instance = singletonObject.AddComponent(t) as T;
                        singletonObject.name = t.ToString() + " (Singleton)";

                        // Make instance persistent.
                        DontDestroyOnLoad(singletonObject);
                    }
                }
                return m_Instance;
            }
        }

        public static void DoDispose()
        {
            if (m_Instance)
            {
                m_Instance.Dispose();

                string name = m_Instance.gameObject.name;
                m_Instance.gameObject.SetActive(false); //防止被FindObjectOfType找到
                Destroy(m_Instance.gameObject);         //延迟到这帧结束前删除
                m_Instance = null;

                Debug.LogFormat("'{0} Dispose!", name);
            }
        }


        //函数改成私有, 防止继承. 由于Destroy调用是延迟执行, 且多个SingletonT的OnDestroy调用顺序无法预期, 所以用Dispose完成
        void OnDestroy()
        {
        }
    }


    //public class Singleton<T> : MonoBehaviour where T : MonoBehaviour, IDisposable
    //{
    //    private static T m_Instance;

    //    public static T Instance
    //    {
    //        get
    //        {
    //            if (m_Instance == null)
    //            {
    //                // Search for existing instance.
    //                m_Instance = (T)FindObjectOfType(typeof(T));

    //                // Create new instance if one doesn't already exist.
    //                if (m_Instance == null)
    //                {
    //                    // Need to create a new GameObject to attach the singleton to.
    //                    var singletonObject = new GameObject();
    //                    m_Instance = singletonObject.AddComponent<T>();
    //                    singletonObject.name = typeof(T).ToString() + " (Singleton)";

    //                    // Make instance persistent.
    //                    DontDestroyOnLoad(singletonObject);
    //                }
    //            }
    //            return m_Instance;
    //        }
    //    }


    //    public static void DoDispose()
    //    {
    //        if (m_Instance)
    //        {
    //            m_Instance.Dispose();

    //            m_Instance.gameObject.SetActive(false); //防止被FindObjectOfType找到
    //            Destroy(m_Instance.gameObject);         //延迟到这帧结束前删除
    //            m_Instance = null;
    //        }
    //    }


    //    //由于Destroy会延迟, 且可能OnDestroy调用顺序问题, 所以Dispose完成了清除工作, 此函数改成私有, 防止继承
    //    void OnDestroy()
    //    {
    //    }
    //}


    //public class SingletonC<T> : MonoBehaviour where T : MonoBehaviour
    //{
    //    private static T m_Instance;

    //    public static T Instance
    //    {
    //        get
    //        {
    //            return m_Instance;
    //        }
    //    }

    //    public static T CreateInstance<S>() where S : T
    //    {
    //        if (m_Instance == null)
    //        {
    //            // Search for existing instance.
    //            m_Instance = (T)FindObjectOfType(typeof(T));

    //            // Create new instance if one doesn't already exist.
    //            if (m_Instance == null)
    //            {
    //                // Need to create a new GameObject to attach the singleton to.
    //                var singletonObject = new GameObject();
    //                m_Instance = singletonObject.AddComponent<S>();
    //                singletonObject.name = typeof(S).ToString() + " (Singleton)";

    //                // Make instance persistent.
    //                DontDestroyOnLoad(singletonObject);
    //            }
    //        }

    //        return m_Instance;
    //    }

    //    protected virtual void OnDestroy()
    //    {
    //        m_Instance = null;
    //    }
    //}
}
