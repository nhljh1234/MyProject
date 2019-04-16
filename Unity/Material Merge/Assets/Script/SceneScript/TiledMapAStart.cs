using System;
using System.IO;
using UnityEngine;
using UnityEngine.Tilemaps;
using TJ_UNITY_TOOL;

public class TiledMapAStart : MonoBehaviour
{
    public Tilemap ground, water, stone, stoneWater;
    public int xMin, yMin, xMax, yMax;
    void Start()
    {
        string outputPathResult = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory) + "/output.json";
        string jstr = File.ReadAllText(outputPathResult);
        TileMapAStarBlockToJson.TileMapBlockJsonData tileMapBlockJsonData = 
            JsonUtility.FromJson<TileMapAStarBlockToJson.TileMapBlockJsonData>(jstr);
        AStartTool aStartTool = new AStartTool(xMin, yMin, xMax, yMax, tileMapBlockJsonData.GetWays());
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
