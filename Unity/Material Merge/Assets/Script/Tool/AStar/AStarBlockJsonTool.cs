using System;
using UnityEngine;
using UnityEngine.Tilemaps;
using System.IO;
using System.Collections.Generic;

namespace TJ_UNITY_TOOL
{
    public class AStarBlockJsonTool : MonoBehaviour
    {
        //[Serializable]
        public class TileMapBlockJsonData
        {
            public int xMin;
            public int yMin;
            public int xMax;
            public int yMax;
            //true表示可以走，false表示不能走
            public List<bool> wayList;
            public bool[,] ways;
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

        private readonly bool[,] _ways;

        public TileMapBlockJsonData GetJsonData(string outputPath)
        {
            string jsonStr = File.ReadAllText(outputPath);
            if (string.IsNullOrEmpty(jsonStr))
            {
                return null;
            }
            TileMapBlockJsonData tileMapBlockJsonData =  JsonUtility.FromJson<TileMapBlockJsonData>(jsonStr);
            int width = tileMapBlockJsonData.xMax - tileMapBlockJsonData.xMin + 1;
            int height = tileMapBlockJsonData.yMax - tileMapBlockJsonData.yMin + 1;
            tileMapBlockJsonData.ways = GetWays(tileMapBlockJsonData.wayList, width, height);
            return tileMapBlockJsonData;
        }

        //构建json数据
        public void BuildJsonData(int xMin, int yMin, int xMax, int yMax, bool[,] _ways, string outputPath)
        {
#if UNITY_EDITOR
            //初始化数据
            TileMapBlockJsonData tileMapBlockJsonData = new TileMapBlockJsonData
            {
                xMin = xMin,
                yMin = yMin,
                xMax = xMax,
                yMax = yMax,
                wayList = BuildWays(_ways)
            };
            FileStream fs = new FileStream(outputPath, FileMode.Create);
            byte[] data = System.Text.Encoding.Default.GetBytes(JsonUtility.ToJson(tileMapBlockJsonData));
            //开始写入
            fs.Write(data, 0, data.Length);
            //清空缓冲区、关闭流
            fs.Flush();
            fs.Close();
#endif
        }

        //List转bool
        private bool[,] GetWays(List<bool> wayList, int width, int height)
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

        //List转bool
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
    }
}
