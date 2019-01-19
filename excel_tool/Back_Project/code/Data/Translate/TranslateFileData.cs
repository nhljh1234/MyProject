using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code.Data
{
    class TranslateFileData
    {
        public class TranslateData
        {
            public string newFileName;
            public string use;
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

        public void addTableName(string oldName, string newName, string use)
        {
            //理论上的话是没有相同的oldName的
            if (_dic.ContainsKey(oldName))
            {
                return;
            }
            TranslateData data = new TranslateData();
            data.newFileName = newName;
            data.use = use;
            _dic.Add(oldName, data);
            _use = use;
        }

        //不存在的话返回oldName
        public TranslateData getNewName(string oldName)
        {
            if (!_dic.ContainsKey(oldName))
            {
                return null;
            }
            return _dic[oldName];
        }

        //获取use
        public string getUse()
        {
            return _use;
        }
    }
}
