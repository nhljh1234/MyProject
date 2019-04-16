using System;
using UnityEngine;
using UnityEngine.Tilemaps;
using System.IO;
using System.Collections.Generic;

namespace TJ_UNITY_TOOL
{
    public class TileMapAStarBlockToJson : MonoBehaviour
    {
        //[Serializable]
        public class TileMapBlockJsonData
        {
            public int xMin;
            public int yMin;
            public int width;
            public int height;
            //true表示可以走，false表示不能走
            public List<bool> wayList;
            public bool[,] GetWays()
            {
                bool[,] ways = new bool[width, height];
                for (int i = 0; i < width; i++)
                {
                    for (int j = 0; j < height; j++)
                    {
                        ways[i, j] = wayList[i * height + j];
                    }
                }
                return ways;
            }
        }

        [Serializable]
        public class BlockData
        {
            public Tilemap block;
            public Tilemap[] ways;
        }

        public Tilemap[] ways;
        public BlockData[] blocks;
        public string outputPath = "output.json";
        public int xMin, yMin, xMax, yMax;

        private bool[,] _ways;

        void Start()
        {
            BuildJsonData();
        }

        public void BuildJsonData()
        {
#if UNITY_EDITOR
            //最终输出路径
            string outputPathResult = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory) + "/" + outputPath;
            //初始化数据
            int width = xMax - xMin + 1;
            int height = yMax - yMin + 1;
            AStarBlockTool aStarBlockTool = new AStarBlockTool(width, height);
            for (int i = 0; i < ways.Length; i++)
            {
                aStarBlockTool.AddWay(GetWayInfo(ways[i]));
            }
            for (int i = 0; i < blocks.Length; i++)
            {
                bool[][,] blockPassWay = new bool[blocks[i].ways.Length][,];
                for (int j = 0; j < blocks[i].ways.Length; j++)
                {
                    blockPassWay[j] = GetWayInfo(blocks[i].ways[j]);
                }
                aStarBlockTool.AddBlock(GetWayInfo(blocks[i].block), blockPassWay);
            }
            _ways = aStarBlockTool.getWays();
            TileMapBlockJsonData tileMapBlockJsonData = new TileMapBlockJsonData
            {
                xMin = xMin,
                yMin = yMin,
                width = width,
                height = height,
                wayList = BuildWays(_ways)
            };
            FileStream fs = new FileStream(outputPathResult, FileMode.Create);
            byte[] data = System.Text.Encoding.Default.GetBytes(JsonUtility.ToJson(tileMapBlockJsonData));
            //开始写入
            fs.Write(data, 0, data.Length);
            //清空缓冲区、关闭流
            fs.Flush();
            fs.Close();
#endif
        }

        private List<bool> BuildWays(bool[,] ways)
        {
            int row = ways.GetLength(0);
            int col = ways.GetLength(1);
            List<bool> waysReturn = new List<bool>();
            for (int i = 0; i < row; i ++)
            {
                for (int j = 0; j < col; j++)
                {
                    waysReturn.Add(ways[i, j]);
                }
            }
            return waysReturn;
        }

        private bool[,] GetWayInfo(Tilemap tileMap)
        {
            bool[,] wayInfos = new bool[xMax - xMin + 1, yMax - yMin + 1];
            for (int i = xMin; i <= xMax; i++)
            {
                for (int j = yMin; j <= yMax; j++)
                {
                    wayInfos[i - xMin, j - yMin] = tileMap.GetTile(new Vector3Int(i, j, 0)) != null;
                }
            }
            return wayInfos;
        }
    }
}
