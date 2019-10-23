namespace Interface
{
    interface IExcelDataNode
    {
        string GetJsonString();
        string GetLuaString();

        string GetChildJsonString();
        string GetChildLuaString();
    }
}
