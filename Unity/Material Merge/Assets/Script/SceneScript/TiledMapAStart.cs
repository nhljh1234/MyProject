using System;
using UnityEngine;
using UnityEngine.Tilemaps;

public class TiledMapAStart : MonoBehaviour
{
    public Tilemap ground, water, stone, stoneWater;
    public int xMin, yMin, xMax, yMax;
    void Start()
    {
        TJ_UNITY_TOOL.AStartTool aStartTool = new TJ_UNITY_TOOL.AStartTool(xMin, yMin, xMax, yMax);
        aStartTool.Init();
        aStartTool.AddWay(GetWayInfo(ground));
        aStartTool.AddBlock(GetWayInfo(water), new TJ_UNITY_TOOL.AStartTool.WayInfo[] { GetWayInfo(stoneWater) });
        aStartTool.AddBlock(GetWayInfo(stone), null);
        long nowTime = DateTime.Now.Ticks;
        Vector2Int[] ways = aStartTool.GetWays(new Vector2Int(-17, -18), new Vector2Int(-16, 16));
        //Vector2Int[] ways = aStartTool.GetWays(new Vector2Int(-17, -18), new Vector2Int(-17, -19));
        print(((DateTime.Now.Ticks - nowTime) / 10).ToString() + "us");
        if (ways != null)
        {
            ChangeColor(ways, Color.blue);
        }
    }

    private void ChangeColor(Vector2Int[] ways, Color color)
    {
        for (int i = 0; i < ways.Length; i++)
        {
            //TileBase tile = ground.GetTile(new Vector3Int(ways[i].x, ways[i].y, 0));
            ground.SetTile(new Vector3Int(ways[i].x, ways[i].y, 0), null);
        }
    }

    private TJ_UNITY_TOOL.AStartTool.WayInfo GetWayInfo(Tilemap tileMap)
    {
        TJ_UNITY_TOOL.AStartTool.WayInfo wayInfo = new TJ_UNITY_TOOL.AStartTool.WayInfo
        {
            startX = 0,
            startY = 0
        };
        bool[,] wayInfos = new bool[xMax - xMin + 1, yMax - yMin + 1];
        for (int i = xMin; i <= xMax; i++)
        {
            for (int j = yMin; j <= yMax; j++)
            {
                wayInfos[i - xMin, j - yMin] = tileMap.GetTile(new Vector3Int(i, j, 0)) != null;
            }
        }
        wayInfo.wayInfos = wayInfos;
        return wayInfo;
    }
}
