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
        }

        private string _newFileName;
        private string _use;
        private Dictionary<string, TranslateData> _dic = new Dictionary<string, TranslateData>();

        public TranslateFileData(string newFileName)
        {
            _newFileName = newFileName;
        }

        public string getFileNewMame()
        {
            return _newFileName;
        }

        public void addTableName(string oldName, string newName, string key, string output)
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
            data.outputStrs = strs.ToList();
            //添加数据
            _dic.Add(oldName, data);
        }

        //不存在的话返回oldName
        public TranslateData getTranslateData(string oldName)
        {
            if (!_dic.ContainsKey(oldName))
            {
                return null;
            }
            return _dic[oldName];
        }
    }
}
