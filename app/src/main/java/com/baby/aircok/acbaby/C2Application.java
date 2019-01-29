package com.baby.aircok.acbaby;

import android.app.Application;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.telephony.TelephonyManager;

import com.baby.aircok.acbaby.login.sns.kakao.KakaoSDKAdapter;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.kakao.auth.KakaoSDK;


/**
 * Created by CHO on 2016. 10. 11..
 */

public class C2Application extends Application {

    private static C2Application mInstance;

    @Override
    public void onCreate() {
        super.onCreate();
        mInstance = this;

        KakaoSDK.init(new KakaoSDKAdapter());
        C2HTTPProcessor.getInstance();
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
        try {
            C2HTTPProcessor.getInstance().shutdown();
        } catch (Exception e) {
        }
    }

    /**
     * 디바이스 아이디를 얻는다..<br/>
     * @return device_id 디바이스 아이디
     * @since 1.0.0
     */
    public String getDeviceId() {
        TelephonyManager tm = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
        if (tm != null) {
            String id = tm.getDeviceId();
            if (id != null && id.length() > 0 && Long.parseLong(id, 16) != 0) {
                return "SAND" + id;
            }
        }
        WifiManager wm = (WifiManager) getSystemService(Context.WIFI_SERVICE);
        if (wm != null) {
            WifiInfo wi = wm.getConnectionInfo();
            if (wi != null) {
                String id = wi.getMacAddress();
                if (id != null) {
                    return "SANM" + id.replace(":", "");
                }
            }
        }

        if (android.os.Build.MODEL.equals("sdk")) {
            return "ANDROIDEMULAOR";
        }

        return null;
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

    public static C2Application getACFApplicationContext() {
        if(mInstance == null)
            throw new IllegalStateException("this application does not inherit com.family.aircok.acfamily.ACFApplication");
        return mInstance;
    }
}
