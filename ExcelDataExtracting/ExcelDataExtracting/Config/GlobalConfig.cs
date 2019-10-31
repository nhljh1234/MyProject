namespace Config
{
    class GlobalConfig
    {
        public static int OUTPUT_TYPE_LUA_TABLE = 1;
        public static int OUTPUT_TYPE_LUA_ARRAY = 2;
        public static int OUTPUT_TYPE_JSON_OBJECT = 3;
        public static int OUTPUT_TYPE_JSON_ARRAY = 4;

        public enum OUTPUT_TYPE
        {
            LUA_TABLE,
            LUA_ARRAY,
            JSON_OBJECT,
            JSON_ARRAY
        }

        public static OUTPUT_TYPE GetOutputType(int type)
        {
            if (type == OUTPUT_TYPE_LUA_TABLE)
            {
                return OUTPUT_TYPE.LUA_TABLE;
            }

            if (type == OUTPUT_TYPE_LUA_ARRAY)
            {
                return OUTPUT_TYPE.LUA_ARRAY;
            }

            if (type == OUTPUT_TYPE_JSON_OBJECT)
            {
                return OUTPUT_TYPE.JSON_OBJECT;
            }

            return OUTPUT_TYPE.JSON_ARRAY;
        }

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
