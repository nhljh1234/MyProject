using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code.Tool.Writer
{
    class RowNodeWriter
    {
        //buildType 表示建立的是服务端还是客户端
        public string ObjectString(Data.RowNode dataRowNode, int buildType)
        {
            string returnStr;
            int count = 0;
            Writer.CellNodeWriter cellNodeWrite = new CellNodeWriter();
            if (dataRowNode.getCellNodeList().Count == 0 || dataRowNode.getCellNodeList()[0] == null)
            {
                return null;
            }
            string key = dataRowNode.getCellNodeList()[0].getKey();
            if (buildType == code.GlobalData.client)
            {
                if (key != null && key.IndexOf("server") >= 0)
                {
                    return null;
                }
            }
            if (buildType == code.GlobalData.server)
            {
                if (key != null && key.IndexOf("client") >= 0)
                {
                    return null;
                }
            }
            returnStr = "    " + '"' + dataRowNode.getCellNodeList()[0].getNum() + '"' + " : {";
            for(int i = 1; i < dataRowNode.getCellNodeList().Count; i++)
            {
                if (dataRowNode.getCellNodeList()[i] == null)
                {
                    continue;
                }
                returnStr = returnStr + ((count == 0) ? "\r\n" : ",\r\n") 
                    +  "    " + cellNodeWrite.getString(dataRowNode.getCellNodeList()[i]);
                count++;
            }
            returnStr = returnStr + "\r\n    " + "    " + "}";
            return returnStr;
        }

        //buildType 表示建立的是服务端还是客户端
        public string ArrayString(Data.RowNode dataRowNode, int buildType)
        {
            string returnStr;
            int count = 0;
            Writer.CellNodeWriter cellNodeWrite = new CellNodeWriter();
            if (dataRowNode.getCellNodeList().Count == 0 || dataRowNode.getCellNodeList()[0] == null)
            {
                return null;
            }
            string key = dataRowNode.getCellNodeList()[0].getKey();
            if (buildType == code.GlobalData.client)
            {
                if (key != null && key.IndexOf("server") >= 0)
                {
                    return null;
                }
            }
            if (buildType == code.GlobalData.server)
            {
                if (key != null && key.IndexOf("client") >= 0)
                {
                    return null;
                }
            }
            returnStr = "    " + "{";
            for (int i = 0; i < dataRowNode.getCellNodeList().Count; i++)
            {
                if (dataRowNode.getCellNodeList()[i] == null)
                {
                    continue;
                }
                returnStr = returnStr + ((count == 0) ? "\r\n" : ",\r\n")
                    + "    " + cellNodeWrite.getString(dataRowNode.getCellNodeList()[i]);
                count++;
            }
            returnStr = returnStr + "\r\n    " + "    " + "}";
            return returnStr;
        }
    }
}
