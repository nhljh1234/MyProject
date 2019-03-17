using System;
using System.Collections.Generic;
using NPOI.SS.UserModel;

namespace Back_Project.code.Tool.ExcelReader
{
    class ExcelRowNodeReader
    {
        private Boolean _isKeyRow = false;
        private Data.TableNode _tableNode;
        private IRow _row;

        public ExcelRowNodeReader(Boolean isKeyRow, IRow row, Data.TableNode tableNode)
        {
            _isKeyRow = isKeyRow;
            _row = row;
            _tableNode = tableNode;
        }

        public Data.RowNode getRowNode()
        {
            Data.RowNode rowNode = new Data.RowNode();
            List<Data.CellNode> cellNodes = new List<Data.CellNode>();
            Data.CellNode keyNode = null;
            ExcelCellNodeReader excelCellNodeReader;
            for (int i = _row.FirstCellNum; i < _row.LastCellNum; i++)
            {
                ICell cell = _row.GetCell(i);
                if (cell == null)
                {
                    cellNodes.Add(null);
                }
                else if (_isKeyRow)
                {
                    excelCellNodeReader = new ExcelCellNodeReader(cell, _tableNode.getSheetName());
                    rowNode.addCellNode(excelCellNodeReader.getCellNode());
                }
                else
                {
                    //这边判断是不是key和output
                    string key = _tableNode.getKeyStrByIndex(i);
                    excelCellNodeReader = new ExcelCellNodeReader(cell, _tableNode.getSheetName(), key);
                    Data.TranslateFileData.TranslateData translateData = _tableNode.getTranslateData();
                    if (translateData.key == key)
                    {
                        keyNode = excelCellNodeReader.getCellNode();
                    }
                    if (translateData.outputStrs.Contains(key))
                    {
                        cellNodes.Add(excelCellNodeReader.getCellNode());
                    }
                }
            }
            if (!_isKeyRow)
            {
                rowNode.addCellNode(keyNode);
                for (int i = 0; i < cellNodes.Count; i++)
                {
                    rowNode.addCellNode(cellNodes[i]);
                }
            }
            return rowNode;
        }
    }
}
