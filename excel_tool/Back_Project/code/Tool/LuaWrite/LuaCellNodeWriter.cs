using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code.Tool.LuaWrite
{
    class LuaCellNodeWriter
    {
        public string getString(Data.CellNode cellNode)
        {
            if (cellNode.getType() == GlobalData.DATA_TYPE.DOUBLE)
            {
                return GlobalData.getLuaCellBlock() + "    " + "    " +
                    cellNode.getKey() + " = " + cellNode.getNum();
            }
            if (cellNode.getType() == GlobalData.DATA_TYPE.BOOLEAN)
            {
                return GlobalData.getLuaCellBlock() + "    " + "    " +
                    cellNode.getKey() + " = " + (cellNode.getBoolData() ? "true" : "false");
            }
            if (cellNode.getType() == GlobalData.DATA_TYPE.STRING)
            {
                return GlobalData.getLuaCellBlock() + "    " + "    " +
                    cellNode.getKey() + " = " + '"' + cellNode.getStr() + '"';
            }
            return "";
        }
    }
}
