using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using System;
using Object = UnityEngine.Object;


namespace TJ
{
    public abstract class AssetLoadRequest : CustomYieldInstruction
    {
        public abstract Asset Asset { get; }
    }

    public abstract class LoaderLoadRequest : CustomYieldInstruction
    {
        public abstract Bundle Bundle { get; }
    }

}
