using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TJ_UNITY_TOOL
{
    //这个工具就是帮助输出一个完整的_ways二维数组
    public class AStarBlockTool
    {

        //存储地图信息
        private readonly bool[,] _ways;
        //地图的宽度和高度
        private readonly int _width;
        private readonly int _height;

        public AStarBlockTool(int width, int height)
        {
            _width = width;
            _height = height;
            _ways = new bool[width, height];
        }

        public bool[,] getWays()
        {
            return _ways;
        }

        //增加可以走的路径
        public void AddWay(bool[,] way)
        {
            int row = way.GetLength(0);
            int col = way.GetLength(1);
            for (int i = 0; i < row && i < _width; i++)
            {
                for (int j = 0; j < col && j < _height; j++)
                {
                    //如果已经是可以通过的，就算这次不能通过，也可以通过
                    if (!_ways[i, j])
                    {
                        _ways[i, j] = way[i, j];
                    }
                }
            }
        }

        //增加阻碍
        //阻碍可以有通过的方式，比如河上架设桥
        public void AddBlock(bool[,] blockWay, bool[][,] blockPassWay)
        {
            int row = blockWay.GetLength(0);
            int col = blockWay.GetLength(1);
            if (blockPassWay != null)
            {
                //先处理blockPassWay
                for (int z = 0; z < blockPassWay.Length; z++)
                {
                    for (int i = 0; i < row && i < _width; i++)
                    {
                        for (int j = 0; j < col && j < _height; j++)
                        {
                            if (blockPassWay[z][i, j])
                            {
                                blockWay[i, j] = false;
                            }
                        }
                    }
                }
            }
            for (int i = 0; i < row && i < _width; i++)
            {
                for (int j = 0; j < col && j < _height; j++)
                {
                    //只有原来是可以通过，加上阻碍就不能通过了
                    if (_ways[i, j] && blockWay[i, j])
                    {
                        _ways[i, j] = false;
                    }
                }
            }
        }
    }
}
