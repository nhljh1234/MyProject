using NPOI.SS.UserModel;

namespace ExcelDataTransform.ExcelDataClass
{
    class CellNode
    {
        private ICell _data;
        private ICell _key;
        private ICell _type;
        private bool _isLastOne;

        public CellNode(ICell data, ICell key, ICell type, bool isLastOne)
        {
            _data = data;
            _key = key;
            _type = type;
            _isLastOne = isLastOne;
        }

        public string GetString()
        {
            if (_data != null && _key != null && _type != null)
            {
                string str = "";
                string key = _key.ToString();
                str = str + Global.Space;
                str = str + "data.";
                if (_type.ToString().Equals(Global.TypeStr))
                {
                    str = str + key + " = " + '"' + _data.ToString() + '"' + ";";
                }
                else if (_type.ToString().Equals(Global.TypeInt))
                {
                    str = str + key + " = " + int.Parse(_data.ToString()) + ";";
                }
                else if (_type.ToString().Equals(Global.TypeFloat))
                {
                    str = str + key + " = " + float.Parse(_data.ToString()) + ";";
                }
                return str + "\n";
            }
            return "";
        }
    }
}
