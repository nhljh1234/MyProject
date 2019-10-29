using NPOI.SS.UserModel;

namespace ProjectClass
{
    class SheetNode : ExcelDataNode
    {
        private RowNode _keyRowNode;

        public SheetNode(ISheet iSheet, string fileName)
        {
            _CreateChildRowNode(iSheet);
        }

        public override string GetJsonString()
        {
            return null;
        }

        public override string GetLuaString()
        {
            return null;
        }

        private void _CreateChildRowNode(ISheet iSheet)
        {
            for (int i = iSheet.FirstRowNum + 1; i <= iSheet.LastRowNum; i++)
            {
                IRow iRow = iSheet.GetRow(i);
                bool isKeyRow = (i == (iSheet.FirstRowNum + 1));
                if (isKeyRow)
                {
                    _keyRowNode = new RowNode(iRow);
                }
                else
                {
                    RowNode rowNode = new RowNode(iRow);
                    rowNode.SetKeyRowNode(_keyRowNode);
                    _listExcelDataNode.Add(rowNode);
                }
            }
        }
    }
}
