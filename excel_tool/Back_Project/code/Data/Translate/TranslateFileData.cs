using System;
using System.Collections.Generic;
using System.Linq;

namespace Back_Project.code.Data
{
    public class TranslateFileData
    {
        public class TranslateData
        {
            //sheet表格的新名字
            public string newFileName;
            //以这个作为key
            public string key;
            //输出的属性
            public List<String> outputStrs = new List<string>();
            //如果是buildCS的话，需要生成CS文件的文件夹路径和类名
            //C#输出的属性字符串 string这样的
            public List<String> CSTypes = new List<string>();
            public string CSDirPath;
            public string CSClassName;
        }

        private string _newFileName;
        private Dictionary<string, TranslateData> _dic = new Dictionary<string, TranslateData>();

        public TranslateFileData(string newFileName)
        {
            _newFileName = newFileName;
        }

        public string GetFileNewMame()
        {
            return _newFileName;
        }

        public void AddTableName(string oldName, string newName, string key, string output, 
            string type, string CSDirPath, string CSClassName)
        {
            //理论上的话是没有相同的oldName的
            if (_dic.ContainsKey(oldName))
            {
                return;
            }
            TranslateData data = new TranslateData();
            data.newFileName = newName;
            data.key = key;
            //处理一下output
            output = output.Replace(" ", "");
            String[] strs = output.Split(',');
            for (int i = 0; i < strs.Length; i++)
            {
                strs[i] = strs[i].Replace(" ", "");
            }
            data.outputStrs = strs.ToList();
            String[] types = type.Split(',');
            for (int i = 0; i < types.Length; i++)
            {
                types[i] = types[i].Replace(" ", "");
            }
            data.CSTypes = types.ToList();
            data.CSDirPath = CSDirPath;
            data.CSClassName = CSClassName;
            //添加数据
            _dic.Add(oldName, data);
        }

        //不存在的话返回oldName
        public TranslateData GetTranslateData(string oldName)
        {
            if (!_dic.ContainsKey(oldName))
            {
                return null;
            }
            return _dic[oldName];
        }
    }
}
