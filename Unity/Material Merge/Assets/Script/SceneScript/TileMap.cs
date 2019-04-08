using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

public class TileMap : MonoBehaviour
{

    const int TILE_SIZE = 3;

    private Tilemap buildMap;
    private Tilemap showMap;
    private TileBase selectTile = null;
    private Vector3Int showTilePos;

    void Start()
    {
        buildMap = transform.Find("Build").GetComponent<Tilemap>();
        showMap = transform.Find("show").GetComponent<Tilemap>();
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            //获取点击的地方
            Vector3 mouseWorldPos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            Vector3Int cellPosition = buildMap.WorldToCell(mouseWorldPos);
            //第一次保证不一样，避免下面的cellPosition != showTilePos起作用
            showTilePos = Vector3Int.left + cellPosition;
            selectTile = getSelectTile(cellPosition);
            if (selectTile != null)
            {
                //清除
                buildMap.SetTile(cellPosition, null);
            }
        }

        if (Input.GetMouseButtonUp(0) && selectTile != null)
        {
            //获取点击的地方
            Vector3 mouseWorldPos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            Vector3Int cellPosition = buildMap.WorldToCell(mouseWorldPos);
            //显示在最新的位置
            buildMap.SetTile(cellPosition, selectTile);
            selectTile = null;
            //清除show层显示的东西
            showMap.SetTile(showTilePos, null);
        }

        if (selectTile != null)
        {
            Vector3 mouseWorldPos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            Vector3Int cellPosition = buildMap.WorldToCell(mouseWorldPos);
            if (cellPosition != showTilePos)
            {
                //清除
                showMap.SetTile(showTilePos, null);
                showTilePos = cellPosition;
                showMap.SetTile(showTilePos, selectTile);
            }
        }
    }

    private TileBase getSelectTile(Vector3Int cellPosition)
    {
        TileBase selectTile = null;
        for (int x = -1; x <= 1; x++)
        {
            for (int y = -1; y <= 1; y++)
            {
                selectTile = buildMap.GetTile(cellPosition);
                if (selectTile != null)
                {
                    return selectTile;
                }
            }
        }
        return selectTile;
    }
}
