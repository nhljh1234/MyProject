using System.Collections.Generic;
using Interface;

namespace DataClass
{
    abstract class ExcelDataNode: IExcelDataNode
    {
        List<ExcelDataNode> _listExcelDataNode = new List<ExcelDataNode>();

        public string GetChildJsonString()
        {
            string jsonStr = "";
            for (int i = 0; i < _listExcelDataNode.Count; i++)
            {
                jsonStr = jsonStr + _listExcelDataNode[i].GetJsonString();
            }
            return jsonStr;
        }

        public string GetChildLuaString()
        {
            string luaStr = "";
            for (int i = 0; i < _listExcelDataNode.Count; i++)
            {
                luaStr = luaStr + _listExcelDataNode[i].GetLuaString();
            }
            return luaStr;
        }

        public abstract string GetJsonString();

        public abstract string GetLuaString();
    }
}
