using System.IO;
using System;
using Newtonsoft.Json;

namespace Tool
{
    //单例实现
    class JsonFileRead
    {
        private static JsonFileRead _instance = null;

        //泛型
        public T GetObject<T>(string filePath)
        {
            string fileText = _GetFileText(filePath);
            if (fileText == null)
            {
                return default(T);
            }
            return JsonConvert.DeserializeObject<T>(fileText);
        }

        public static JsonFileRead GetInstance()
        {
            if (_instance == null)
            {
                _instance = new JsonFileRead();
            }
            return _instance;
        }

        private string _GetFileText(string filePath)
        {
            if (!File.Exists(filePath))
            {
                Console.WriteLine("文件不存在，路径为：" + filePath);
                return null;
            }
            return File.ReadAllText(filePath);
        }

        private JsonFileRead()
        {

        }
    }
}
