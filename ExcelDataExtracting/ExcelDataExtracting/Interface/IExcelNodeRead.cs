using Config;

namespace Interface
{
    interface IExcelNodeRead
    {
        string GetString(GlobalConfig.OUTPUT_TYPE type);
    }
}
