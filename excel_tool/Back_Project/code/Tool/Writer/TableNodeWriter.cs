using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code.Tool.Writer
{
    class TableNodeWriter
    {
        public string getClientString(Data.TableNode tableNode)
        {
            string returnStr;
            List<string> strList = new List<string>();
            RowNodeWriter rowNodeWrite = new RowNodeWriter();
            returnStr = "{\r\n";
            returnStr = returnStr + "    " + '"' + "object" + '"' + " : {" + "\r\n";
            for (int i = 0; i < tableNode.getRowNodeList().Count; i++)
            {
                string str = rowNodeWrite.ObjectString(tableNode.getRowNodeList()[i], code.GlobalData.client);
                if (str == null)
                {
                    continue;
                }
                strList.Add(str);
            }
            for (int i = 0; i < strList.Count; i++)
            {
                returnStr = returnStr + "    " + strList[i] + ((i == strList.Count - 1) ? "" : ",");
                returnStr = returnStr + "    " + "\r\n";
            }
            returnStr = returnStr + "    " + "},";

            returnStr = returnStr + "\r\n";
            returnStr = returnStr + "\r\n";

            returnStr = returnStr + "    " + '"' + "array" + '"' + " : [" + "\r\n";
            strList = new List<string>();
            for (int i = 0; i < tableNode.getRowNodeList().Count; i++)
            {
                string str = rowNodeWrite.ArrayString(tableNode.getRowNodeList()[i], code.GlobalData.client);
                if (str == null)
                {
                    continue;
                }
                strList.Add(str);
            }
            for (int i = 0; i < strList.Count; i++)
            {
                returnStr = returnStr + "    " + strList[i] + ((i == strList.Count - 1) ? "" : ",");
                returnStr = returnStr + "    " + "\r\n";
            }
            returnStr = returnStr + "    " + "]";

            returnStr = returnStr + "\r\n";

            returnStr = returnStr + "}";
            return returnStr;
        }

        public string getServerString(Data.TableNode tableNode)
        {
            string returnStr;
            List<string> strList = new List<string>();
            RowNodeWriter rowNodeWrite = new RowNodeWriter();
            returnStr = "var outModule = {};\r\n";

            returnStr = returnStr + "\r\n";

            returnStr = returnStr + "outModule.object = {" + "\r\n";
            for (int i = 0; i < tableNode.getRowNodeList().Count; i++)
            {
                string str = rowNodeWrite.ObjectString(tableNode.getRowNodeList()[i], code.GlobalData.server);
                if (str == null)
                {
                    continue;
                }
                strList.Add(str);
            }
            for (int i = 0; i < strList.Count; i++)
            {
                returnStr = returnStr + "    " + strList[i] + ((i == strList.Count - 1) ? "" : ",");
                returnStr = returnStr + "    " + "\r\n";
            }
            returnStr = returnStr + "};";

            returnStr = returnStr + "\r\n";
            returnStr = returnStr + "\r\n";

            returnStr = returnStr + "outModule.array = [" + "\r\n";
            strList = new List<string>();
            for (int i = 0; i < tableNode.getRowNodeList().Count; i++)
            {
                string str = rowNodeWrite.ArrayString(tableNode.getRowNodeList()[i], code.GlobalData.server);
                if (str == null)
                {
                    continue;
                }
                strList.Add(str);
            }
            for (int i = 0; i < strList.Count; i++)
            {
                returnStr = returnStr + "    " + strList[i] + ((i == strList.Count - 1) ? "" : ",");
                returnStr = returnStr + "    " + "\r\n";
            }
            returnStr = returnStr + "];\r\n";

            returnStr = returnStr + "\r\n";

            returnStr = returnStr + "module.exports = outModule;";

            return returnStr;
        }
    }
}
