namespace Back_Project.code.Tool.JsonWriter
{
    class JsonRowNodeWriter
    {
        public string ObjectString(Data.RowNode dataRowNode)
        {
            string returnStr;
            int count = 0;
            JsonCellNodeWriter cellNodeWrite = new JsonCellNodeWriter();
            if (dataRowNode.getCellNodeList().Count == 0 || dataRowNode.getCellNodeList()[0] == null)
            {
                return null;
            }
            returnStr = GlobalData.getJsonRowBlock() + '"' + dataRowNode.getCellNodeList()[0].getData() + '"' + ": {";
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
            returnStr = returnStr + "\r\n" + GlobalData.getJsonRowBlock() + "    " + "}";
            return returnStr;
        }

        //获取Unity解析Dict形式Json所需要的keys
        public string UnityGetKeyString(Data.RowNode dataRowNode)
        {
            JsonCellNodeWriter cellNodeWrite = new JsonCellNodeWriter();
            if (dataRowNode.getCellNodeList().Count == 0 || dataRowNode.getCellNodeList()[0] == null)
            {
                return null;
            }
            return GlobalData.getJsonRowBlock() + "    " + '"' + dataRowNode.getCellNodeList()[0].getData() + '"';
        }

        //获取Unity解析Dict形式Json所需要的keys
        public string UnityGetValueString(Data.RowNode dataRowNode)
        {
            string returnStr;
            int count = 0;
            JsonCellNodeWriter cellNodeWrite = new JsonCellNodeWriter();
            if (dataRowNode.getCellNodeList().Count == 0 || dataRowNode.getCellNodeList()[0] == null)
            {
                return null;
            }
            returnStr = GlobalData.getJsonRowBlock() + "    " + "{";
            for (int i = 1; i < dataRowNode.getCellNodeList().Count; i++)
            {
                if (dataRowNode.getCellNodeList()[i] == null)
                {
                    continue;
                }
                returnStr = returnStr + ((count == 0) ? "\r\n" : ",\r\n")
                    + "    " + cellNodeWrite.getString(dataRowNode.getCellNodeList()[i]);
                count++;
            }
            returnStr = returnStr + "\r\n" + GlobalData.getJsonRowBlock() + "    " + "    " + "}";
            return returnStr;
        }
    }
}
