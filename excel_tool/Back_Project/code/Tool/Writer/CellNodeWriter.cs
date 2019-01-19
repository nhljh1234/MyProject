using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code.Tool.Writer
{
    class CellNodeWriter
    {
        public string getString(Data.CellNode cellNode)
        {
            if (cellNode.getType() == GlobalData.DATA_TYPE_DOUBLE)
            {
                return "    " + "    " + '"' + cellNode.getKey() + '"' + " : " + cellNode.getNum();
            }
            if (cellNode.getType() == GlobalData.DATA_TYPE_BOOLEAN)
            {
                return "    " + "    " + '"' + cellNode.getKey() + '"' + " : " + (cellNode.getBoolData() ? "true" : "false");
            }
            if (cellNode.getType() == GlobalData.DATA_TYPE_STRING)
            {
                return "    " + "    " + '"' + cellNode.getKey() + '"' + " : " + '"'  + cellNode.getStr() + '"';
            }
            return "";
        }
    }
}
