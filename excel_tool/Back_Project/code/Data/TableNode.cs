using System.Collections.Generic;

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
        //根据_translate的key和output决定输出的数据
        TranslateFileData.TranslateData _translateData;
        public TableNode(string sheetName, string fileName)
        {
            if (code.GlobalData.translateDic.ContainsKey(fileName))
            {
                _translateData = code.GlobalData.translateDic[fileName].getTranslateData(sheetName);
                sheetName = _translateData.newFileName;
            }
            _sheetName = sheetName;
            _rowNodeList = new List<RowNode>();
        }

        public string getSheetName()
        {
            return _sheetName;
        }

        public TranslateFileData.TranslateData getTranslateData()
        {
            return _translateData;
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
