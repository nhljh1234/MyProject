using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//一个Excel文件就是一个FileNode节点
namespace Back_Project.code.Data
{
    class FileNode
    {
        private string _fileName;
        private List<TableNode> _tableNodeList;

        public FileNode(string fileName)
        {
            if (code.GlobalData.translateDic.ContainsKey(fileName))
            {
                fileName = code.GlobalData.translateDic[fileName].getFileNewMame();
            }
            _fileName = fileName;
            _tableNodeList = new List<TableNode>();
        }

        public string getFileName()
        {
            return _fileName;
        }


        public void addTableNode(TableNode tableNode)
        {
            _tableNodeList.Add(tableNode);
        }

        public List<TableNode> getTableNodeList()
        {
            return _tableNodeList;
        }
    }
}
