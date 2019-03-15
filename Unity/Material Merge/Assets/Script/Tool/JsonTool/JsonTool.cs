using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace TJ_UNITY_TOOL
{
    public class JsonTool
    {

        // List<T>
        [Serializable]
        private class Serialization<T>
        {
            [SerializeField]
            List<T> target;
            public List<T> ToList() { return target; }

            public Serialization(List<T> target)
            {
                this.target = target;
            }
        }

        // Dictionary<TKey, TValue>
        [Serializable]
        private class Serialization<TKey, TValue> : ISerializationCallbackReceiver
        {
            [SerializeField]
            List<TKey> keys;
            [SerializeField]
            List<TValue> values;

            Dictionary<TKey, TValue> target;
            public Dictionary<TKey, TValue> ToDictionary() { return target; }

            public Serialization(Dictionary<TKey, TValue> target)
            {
                this.target = target;
            }

            public void OnBeforeSerialize()
            {
                keys = new List<TKey>(target.Keys);
                values = new List<TValue>(target.Values);
            }

            public void OnAfterDeserialize()
            {
                var count = Math.Min(keys.Count, values.Count);
                target = new Dictionary<TKey, TValue>(count);
                for (var i = 0; i < count; ++i)
                {
                    target.Add(keys[i], values[i]);
                }
            }
        }
        //list转换JSON
        public static String getListJsonStr<T>(List<T> list)
        {
            return JsonUtility.ToJson(new Serialization<T>(list));
        }
        public static List<T> getList<T>(String jsonStr)
        {
            return JsonUtility.FromJson<Serialization<T>>(jsonStr).ToList();
        }
        //字典转换JSON
        public static String getDicJsonStr<TKey, TValue>(Dictionary<TKey, TValue> dic)
        {
            return JsonUtility.ToJson(new Serialization<TKey, TValue>(dic));
        }
        public static Dictionary<TKey, TValue> getDic<TKey, TValue>(String jsonStr)
        {
            return JsonUtility.FromJson<Serialization<TKey, TValue>>(jsonStr).ToDictionary();
        }
    }
}