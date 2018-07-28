using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//存储多个Row节点
namespace Back_Project.code.Data
{
    class TableNode
    {
        //工作表的名字
        private string _sheetName;
        //存储key数据的row节点，不能存在空节点
        private RowNode _keyRowNode = null;
        private List<RowNode> _rowNodeList;
        private string _use;

        public TableNode(string sheetName, string fileName)
        {
            if (code.GlobalData.translateDic.ContainsKey(fileName))
            {
                TranslateFileData.TranslateData data = 
                    code.GlobalData.translateDic[fileName].getNewName(sheetName);
                sheetName = data.newFileName;
                _use = data.use;
            }
            _sheetName = sheetName;
            _rowNodeList = new List<RowNode>();
        }

        public string getUse()
        {
            return _use;
        }

        public string getSheetName()
        {
            return _sheetName;
        }

        public void setKeyRowNode(RowNode keyRowNode)
        {
            _keyRowNode = keyRowNode;
        }

        //获取第index个key对应的字符串
        public string getKeyStrByIndex(int index)
        {
            if (_keyRowNode == null || index >= _keyRowNode.getCellNodeList().Count)
            {
                return null;
            }
            return _keyRowNode.getCellNodeList()[index].getStr();
        }

        public void addDataRowNode(RowNode dataRowNode)
        {
            _rowNodeList.Add(dataRowNode);
        }

        public List<RowNode> getRowNodeList()
        {
            return _rowNodeList;
        }
    }
}
