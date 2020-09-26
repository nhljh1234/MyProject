package Manager;

import android.app.Activity;
import android.util.Log;

import com.arcsoft.face.ErrorInfo;
import com.arcsoft.face.FaceEngine;

import Data.AppGlobalData;

public class ArcFaceManager {

    public Boolean active(Activity activity) {
        int activeCode = FaceEngine.activeOnline(activity, AppGlobalData.APP_ID, AppGlobalData.SDK_KEY);
        if (activeCode == ErrorInfo.MOK || activeCode == ErrorInfo.MERR_ASF_ALREADY_ACTIVATED) {
            return true;
        }
        return false;
    }
}
