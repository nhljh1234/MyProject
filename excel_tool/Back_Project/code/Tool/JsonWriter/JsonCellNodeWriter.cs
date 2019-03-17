using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code.Tool.JsonWriter
{
    class JsonCellNodeWriter
    {
        public string getString(Data.CellNode cellNode)
        {
            if (cellNode.getType() == GlobalData.DATA_TYPE.DOUBLE)
            {
                return GlobalData.getJsonCellBlock() + "    " + "    " + '"' +
                    cellNode.getKey() + '"' + ": " + cellNode.getNum();
            }
            if (cellNode.getType() == GlobalData.DATA_TYPE.BOOLEAN)
            {
                return GlobalData.getJsonCellBlock() + "    " + "    " + '"' +
                    cellNode.getKey() + '"' + ": " + (cellNode.getBoolData() ? "true" : "false");
            }
            if (cellNode.getType() == GlobalData.DATA_TYPE.STRING)
            {
                return GlobalData.getJsonCellBlock() + "    " + "    " + '"' +
                    cellNode.getKey() + '"' + ": " + '"' + cellNode.getStr() + '"';
            }
            return "";
        }
    }
}
