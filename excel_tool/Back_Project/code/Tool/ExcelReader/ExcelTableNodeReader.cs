using NPOI.SS.UserModel;

namespace Back_Project.code.Tool.ExcelReader
{
    class ExcelTableNodeReader
    {
        private string _sheetName;
        private string _fileName;
        private ISheet _workSheet;

        public ExcelTableNodeReader(string sheetName, ISheet workSheet, string fileName)
        {
            _sheetName = sheetName;
            _workSheet = workSheet;
            _fileName = fileName;
        }

        public Data.TableNode getTableNode()
        {
            Data.TableNode tableNode = new Data.TableNode(_sheetName, _fileName);
            for (int i = _workSheet.FirstRowNum + 1; i <= _workSheet.LastRowNum; i++)
            {
                ExcelRowNodeReader rowNodeReader =
                    new ExcelRowNodeReader(i == _workSheet.FirstRowNum + 1, _workSheet.GetRow(i), tableNode);
                if (i == _workSheet.FirstRowNum + 1)
                {
                    tableNode.setKeyRowNode(rowNodeReader.getRowNode());
                }
                else if (i > _workSheet.FirstRowNum + 1)
                {
                    tableNode.addDataRowNode(rowNodeReader.getRowNode());
                }
            }
            return tableNode;
        }
    }
}
