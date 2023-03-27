package com.family.aircok.acfamily.common;

import android.content.Context;

import net.cruxware.android.base.util.PreferenceUtil;

/**
 * Created by CHO on 2016. 11. 1..
 */

public class C2Preference {
    private static final String C2_PREFERENCES_NAME = "c2_preferences_name";
    private static final String KEY_DEVICE = "key_device";
    private static final String AIRCOK_F_ID = "aircok_f_id";
    private static final String AIRCOK_F_PW = "aircok_f_pw";
    private static final String AIRCOK_F_REGI_TYPE = "aircok_f_regi_type";
    private static final String PUSH_TOKEN = "aircok_f_push_token";

    public static void setDevice(Context context, String value) {
        PreferenceUtil.putStringData(context, C2_PREFERENCES_NAME, KEY_DEVICE, value);
    }

    public static String getDevice(Context context) {
        return PreferenceUtil.getStringData(context, C2_PREFERENCES_NAME, KEY_DEVICE);
    }

    public static void setLoginID(Context context, String value) {
        PreferenceUtil.putStringData(context, AIRCOK_F_ID, C2_PREFERENCES_NAME, value);
    }

    public static String getLoginID(Context context) {
        return PreferenceUtil.getStringData(context, AIRCOK_F_ID, C2_PREFERENCES_NAME);
    }

    public static void setLoginPW(Context context, String value) {
        PreferenceUtil.putStringData(context, AIRCOK_F_PW, C2_PREFERENCES_NAME, value);
    }

    public static String getLoginPW(Context context) {
        return PreferenceUtil.getStringData(context, AIRCOK_F_PW, C2_PREFERENCES_NAME);
    }

    public static void setLoginRegiType(Context context, String value) {
        PreferenceUtil.putStringData(context, AIRCOK_F_REGI_TYPE, C2_PREFERENCES_NAME, value);
    }

    public static String getLoginRegiType(Context context) {
        return PreferenceUtil.getStringData(context, AIRCOK_F_REGI_TYPE, C2_PREFERENCES_NAME);
    }

    public static void setPushToken(Context context, String value) {
        PreferenceUtil.putStringData(context, C2_PREFERENCES_NAME, PUSH_TOKEN, value);
    }

    public static String getPushToken(Context context) {
        return PreferenceUtil.getStringData(context, C2_PREFERENCES_NAME, PUSH_TOKEN);
    }

}
