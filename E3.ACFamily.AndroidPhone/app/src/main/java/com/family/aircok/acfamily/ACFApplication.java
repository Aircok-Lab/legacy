package com.family.aircok.acfamily;

import android.app.Activity;
import android.app.Application;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.family.aircok.acfamily.login.sns.kakao.KakaoSDKAdapter;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.kakao.auth.KakaoSDK;

/**
 * Created by ssong on 2017. 4. 19..
 */

public class ACFApplication extends Application {

    private static ACFApplication mInstance;
    private static volatile Activity currentActivity = null;

    @Override
    public void onCreate() {
        mInstance = this;

        KakaoSDK.init(new KakaoSDKAdapter());
        C2HTTPProcessor.getInstance();
    }

    @Override
    public void onTerminate() {
        try {
            mInstance = null;
            C2HTTPProcessor.getInstance().shutdown();
        } catch (Exception e) {
        }
    }

    public static Activity getCurrentActivity() {
        Log.d("TAG", "++ currentActivity : " + (currentActivity != null ? currentActivity.getClass().getSimpleName() : ""));
        return currentActivity;
    }

    public static void setCurrentActivity(Activity currentActivity) {
        ACFApplication.currentActivity = currentActivity;
    }

    public static ACFApplication getACFApplicationContext() {
        if(mInstance == null)
            throw new IllegalStateException("this application does not inherit com.family.aircok.acfamily.ACFApplication");
        return mInstance;
    }


    /**
     * 버전 네임을 얻는다.<br/>
     * @return 버전 네임
     */
    public String getVersionName() {
        String versionName = "";
        try {
            PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), 0);
            versionName = info.versionName;
        } catch (PackageManager.NameNotFoundException e) {
        }
        return versionName;
    }
//    public static ACFApplication getTopActivity() {
//        re
//    }

}
