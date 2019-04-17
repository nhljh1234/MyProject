using System.Collections.Generic;
using UnityEngine;


namespace TJ_UNITY_TOOL
{
    //A星寻路
    //寻路路径
    class AStartTool
    {
        private static readonly int MAX_SAVE_LENGTH = 0;

        
        //记录指定坐标是否可以通过
        public bool[,] _ways
        {
            get;
            set;
        }
        private readonly int _width;
        private readonly int _height;
        private readonly int _xMin;
        private readonly int _yMin;

        private class AStarPoint
        {
            public Vector2Int pos;
            //移动距离
            public int gNum;
            //曼哈顿距离
            public int hNum;
            public int fNum;
            public bool isSearch = false;
            public AStarPoint(Vector2Int pointPos, int pointGNum, Vector2Int end)
            {
                pos = pointPos;
                gNum = pointGNum;
                //曼哈顿算法
                hNum = Mathf.Abs(pos.x - end.x) + Mathf.Abs(pos.y - end.y);
                fNum = hNum + gNum;
            }
            public bool JudgeIsNearPoint(AStarPoint point)
            {
                int xDis = Mathf.Abs((pos.x - point.pos.x));
                int yDis = Mathf.Abs((pos.y - point.pos.y));
                return xDis <= 1 && yDis <= 1 && (xDis + yDis) <= 1;
            }
        }

        //存储常用的路径
        private Dictionary<string, Vector2Int[]> _wayDict = new Dictionary<string, Vector2Int[]>();
        //存储已经搜索过的路径
        private Dictionary<int, bool> _wayHasSearchDict = new Dictionary<int, bool>();
        //根据F值维护一个最短路径
        private Dictionary<int, Stack<AStarPoint>> _openDict = new Dictionary<int, Stack<AStarPoint>>();
        //存储一个F的最大值
        private int fNumMax = 0;

        //构造函数
        public AStartTool(int xMin, int yMin, int xMax, int yMax, bool[,] ways)
        {
            //起始位置
            _xMin = xMin;
            _yMin = yMin;
            //长度宽度
            _width = xMax - xMin + 1;
            _height = yMax - yMin + 1;
            _ways = ways;
        }

        //获取位置
        public Vector2Int[] GetWays(Vector2Int start, Vector2Int end)
        {
            string key = GetDictKey(start, end);
            if (_wayDict.ContainsKey(key))
            {
                return _wayDict[key];
            }
            //转换一下
            start = start - new Vector2Int(_xMin, _yMin);
            end = end - new Vector2Int(_xMin, _yMin);
            //先判断位置是否合法
            if (!JudgePosIsRight(start) || !JudgePosIsRight(end))
            {
                return null;
            }
            //开始寻路
            List<AStarPoint> ways = new List<AStarPoint>();
            AStarPoint nowPoint = new AStarPoint(start, 0, end);
            SearchAStarPoint(nowPoint, end);
            int count = 0;
            while (true)
            {
                count++;
                AStarPoint nextPoint = GetNextPoint();
                if (nextPoint != null)
                {
                    SearchAStarPoint(nextPoint, end);
                    ways.Add(nowPoint);
                    //这个地方看要不要把end加进来
                    if (nextPoint.pos == end)
                    {
                        break;
                    }
                    nowPoint = nextPoint;
                }
                else
                {
                    return null;
                }
            }
            //清除缓存
            _wayHasSearchDict = new Dictionary<int, bool>();
            _openDict = new Dictionary<int, Stack<AStarPoint>>();
            //MonoBehaviour.print("搜索节点个数：" + ways.Count);
            Vector2Int[] shortWays = GetShortWay(ways);
            if (_wayDict.Count < MAX_SAVE_LENGTH)
            {
                _wayDict[key] = shortWays;
                return _wayDict[key];
            }
            else
            {
                return shortWays;
            }
        }

        private AStarPoint GetNextPoint()
        {
            AStarPoint next = null;
            for (int i = 0; i <= fNumMax; i++)
            {
                if (_openDict.ContainsKey(i) && _openDict[i].Count > 0)
                {
                    next = _openDict[i].Pop();
                    break;
                }
            }
            return next;
        }

        //从终点倒推最短路径
        private Vector2Int[] GetShortWay(List<AStarPoint> ways)
        {
            List<AStarPoint> shortWay = new List<AStarPoint>();
            List<Vector2Int> shortWayPos = new List<Vector2Int>();
            shortWay.Add(ways[ways.Count - 1]);
            for (int i = ways.Count - 2; i >= 0; i--)
            {
                if (shortWay[shortWay.Count - 1].JudgeIsNearPoint(ways[i]) &&
                    shortWay[shortWay.Count - 1].gNum == ways[i].gNum + 1)
                {
                    shortWay.Add(ways[i]);
                    shortWayPos.Add(ways[i].pos + new Vector2Int(_xMin, _yMin));
                }
            }
            shortWayPos.Reverse();
            return shortWayPos.ToArray();
        }

        //获取唯一的key值
        private string GetDictKey(Vector2Int start, Vector2Int end)
        {
            return GetWayHasGoDictKey(start) +  "|" + GetWayHasGoDictKey(end);
        }
        private int GetWayHasGoDictKey(Vector2Int go)
        {
            return go.x + go.y * _width;
        }

        //搜索这个点周围的点
        private void SearchAStarPoint(AStarPoint point, Vector2Int end)
        {
            if (point.isSearch)
            {
                return;
            }
            point.isSearch = true;
            AStarPoint left = GetAStarPointByPos(point.pos.x - 1, point.pos.y, point.gNum, end);
            AStarPoint up = GetAStarPointByPos(point.pos.x, point.pos.y + 1, point.gNum, end);
            AStarPoint right = GetAStarPointByPos(point.pos.x + 1, point.pos.y, point.gNum, end);
            AStarPoint down = GetAStarPointByPos(point.pos.x, point.pos.y - 1, point.gNum, end);
            AddToOpenNumDict(left);
            AddToOpenNumDict(up);
            AddToOpenNumDict(right);
            AddToOpenNumDict(down);
        }

        //放到Open列表中
        private void AddToOpenNumDict(AStarPoint point)
        {
            if (point == null)
            {
                return;
            }
            if (!_openDict.ContainsKey(point.fNum))
            {
                _openDict[point.fNum] = new Stack<AStarPoint>();
            }
            if (point.fNum > fNumMax)
            {
                fNumMax = point.fNum;
            }
            _openDict[point.fNum].Push(point);
        }

        private AStarPoint GetAStarPointByPos(int x, int y, int pointGNum, Vector2Int end)
        {
            Vector2Int pos = new Vector2Int(x, y);
            if (JudgeIsWay(new Vector2Int(x, y)))
            {
                _wayHasSearchDict[GetWayHasGoDictKey(pos)] = true;
                return new AStarPoint(pos, pointGNum + 1, end);
            }
            return null;
        }

        private bool JudgeIsWay(Vector2Int pos)
        {
            return JudgePosIsRight(pos) && _ways[pos.x, pos.y] && !_wayHasSearchDict.ContainsKey(GetWayHasGoDictKey(pos));
        }

        private bool JudgePosIsRight(Vector2Int pos)
        {
            if (pos.x < 0 || pos.x >= _width || pos.y < 0 || pos.y >= _height)
            {
                return false;
            }
            return true;
        }
    }
}
