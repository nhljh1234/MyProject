using System;
using TJ_UNITY_TOOL;
using UnityEngine;
using UnityEngine.Tilemaps;

//用这个comp输入tilemap数据，生成路径二维数组
public class AStarComp : MonoBehaviour
{
    [Serializable]
    public class BlockData
    {
        public Tilemap block;
        public Tilemap[] ways;
    }

    public Tilemap[] ways;
    public BlockData[] blocks;
    //输出路径，生成在桌面
    public string outputPath = "output.json";
    public int xMin, yMin, xMax, yMax;

    // Start is called before the first frame update
    void Start()
    {
#if UNITY_EDITOR
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
        bool[,] _ways = aStarBlockTool.getWays();
        //输出json数据
        AStarBlockJsonTool aStarBlockJsonTool = new AStarBlockJsonTool();
        aStarBlockJsonTool.BuildJsonData(xMin, yMin, xMax, yMax, _ways, 
            Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory) + "/" + outputPath);
#endif
    }

    //根据tilemap获取bool二维数据
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
