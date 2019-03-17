using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code.Tool.LuaWrite
{
    class LuaRowNodeWriter
    {
        public string ObjectString(Data.RowNode dataRowNode)
        {
            string returnStr;
            int count = 0;
            LuaCellNodeWriter cellNodeWrite = new LuaCellNodeWriter();
            if (dataRowNode.getCellNodeList().Count == 0 || dataRowNode.getCellNodeList()[0] == null)
            {
                return null;
            }
            string key = dataRowNode.getCellNodeList()[0].getData().ToString();
            if (key == int.Parse(key).ToString())
            {
                returnStr = GlobalData.getLuaRowBlock() + "{";
            }
            else
            {
                returnStr = GlobalData.getLuaRowBlock() + dataRowNode.getCellNodeList()[0].getData() + " = {";
            }
            for (int i = 1; i < dataRowNode.getCellNodeList().Count; i++)
            {
                if (dataRowNode.getCellNodeList()[i] == null)
                {
                    continue;
                }
                returnStr = returnStr + ((count == 0) ? "\r\n" : ",\r\n")
                    + cellNodeWrite.getString(dataRowNode.getCellNodeList()[i]);
                count++;
            }
            returnStr = returnStr + "\r\n" + GlobalData.getLuaRowBlock() + "    " + "}";
            return returnStr;
        }
    }
}
