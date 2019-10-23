namespace Config
{
    class GlobalConfig
    {
        public static int OUTPUT_TYPE_LUA = 1;
        public static int OUTPUT_TYPE_JSON = 2;

        public static string outputConfigPath = "./config/outputConfig.json";
        public static string fileConfigPath = "./config/fileConfig.json";

        public enum EXCEL_DATE_NODE_TYPE
        {
            FILE,
            SHEET,
            ROW,
            CELL
        }
    }
}
