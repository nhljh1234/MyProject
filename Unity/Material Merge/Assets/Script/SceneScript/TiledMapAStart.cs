using System;
using System.IO;
using UnityEngine;
using UnityEngine.Tilemaps;
using TJ_UNITY_TOOL;

public class TiledMapAStart : MonoBehaviour
{
    public Tilemap ground;
    void Start()
    {
        string outputPathResult = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory) + "/output.json";
        AStarBlockJsonTool aStarBlockJsonTool = new AStarBlockJsonTool();
        AStarBlockJsonTool.TileMapBlockJsonData tileMapBlockJsonData = aStarBlockJsonTool.GetJsonData(outputPathResult);
        AStartTool aStartTool = new AStartTool(tileMapBlockJsonData.xMin, tileMapBlockJsonData.yMin, 
            tileMapBlockJsonData.xMax, tileMapBlockJsonData.yMax, tileMapBlockJsonData.ways);
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
}
