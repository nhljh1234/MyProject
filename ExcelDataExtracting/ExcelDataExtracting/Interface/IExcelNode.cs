using Config;

namespace Interface
{
    interface IExcelNode
    {
        IExcelNodeRead GetExcelNodeReadModule(GlobalConfig.OUTPUT_TYPE type);
    }
}
