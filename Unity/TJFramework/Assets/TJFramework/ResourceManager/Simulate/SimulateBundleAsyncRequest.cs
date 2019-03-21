#if UNITY_EDITOR


namespace TJ
{
    public class SimulateAssetLoadRequest : AssetLoadRequest
    {
        readonly SimulateAsset asset;

        public SimulateAssetLoadRequest(SimulateAsset asset)
        {
            this.asset = asset;
        }

        public override Asset Asset { get { return asset; } }

        public override bool keepWaiting { get { return false; } }
    }

    public class SimulateLoaderLoadRequest : LoaderLoadRequest
    {
        readonly SimulateBundle bundle;

        public override Bundle Bundle { get { return bundle; } }

        public SimulateLoaderLoadRequest(SimulateBundle bundle)
        {
            this.bundle = bundle;
        }

        public override bool keepWaiting { get { return false; } }
    }

}

#endif
