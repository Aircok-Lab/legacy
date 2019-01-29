package com.family.aircok.acfamily.common;

import android.graphics.Color;
import android.text.TextUtils;


import com.family.aircok.acfamily.R;

/**
 * Created by CHO on 2016. 10. 25..
 */

public class C2Util {

    public static final int DUST_STATE_0 = 0;//좋
    public static final int DUST_STATE_1 = 1;//보통
    public static final int DUST_STATE_2 = 2;//영유아 영향
    public static final int DUST_STATE_3 = 3;//나쁨
    public static final int DUST_STATE_4 = 4;//매우 나쁨

    public static int getDustState(int dust) {
        if (dust < 0) {
            dust = 0;
        }
        if (dust > 100) {
            dust = 100;
        }
        int state = DUST_STATE_0;
        if (dust <= 20) {
            state = DUST_STATE_0;
        }
        else if (dust <= 40) {
            state = DUST_STATE_1;
        }
        else if (dust <= 60) {
            state = DUST_STATE_2;
        }
        else if (dust <= 80) {
            state = DUST_STATE_3;
        }
        else if (dust <= 100) {
            state = DUST_STATE_4;
        }
        return state;
    }

    public static int getDustColor(int state) {
        int color = Color.parseColor("#4ed2fb");
        switch (state) {
            case DUST_STATE_0 :
                color = Color.parseColor("#4ed2fb");
                break;
            case DUST_STATE_1 :
                color = Color.parseColor("#5ed36f");
                break;
            case DUST_STATE_2 :
                color = Color.parseColor("#ffb71c");
                break;
            case DUST_STATE_3 :
                color = Color.parseColor("#ff8453");
                break;
            case DUST_STATE_4 :
                color = Color.parseColor("#e91d35");
                break;
        }
        return color;
    }

    public static int getN10DustColor(int dust) {
        int state;
        if (dust <= 30) {
            state = 0xFF0000FF;
        }
        else if (dust <= 80) {
            state = 0xFF00FF00;
        }
        else if (dust <= 150) {
            state = 0xFFFFFF00;
        }
        else {
            state = 0xFFFF0000;
        }
        return state;
    }

    public static int getN25DustColor(int dust) {
        int state;
        if (dust <= 15) {
            state = 0xFF0000FF;
        }
        else if (dust <= 50) {
            state = 0xFF00FF00;
        }
        else if (dust <= 100) {
            state = 0xFFFFFF00;
        }
        else {
            state = 0xFFFF0000;
        }
        return state;
    }

    public static int getDustBG(int state) {
        int resId = R.drawable.bg_index_good;
        switch (state) {
            case DUST_STATE_0 :
                resId = R.drawable.bg_index_good;
                break;
            case DUST_STATE_1 :
                resId = R.drawable.bg_index_soso;
                break;
            case DUST_STATE_2 :
                resId = R.drawable.bg_index_sensitive;
                break;
            case DUST_STATE_3 :
                resId = R.drawable.bg_index_bad;
                break;
            case DUST_STATE_4 :
                resId = R.drawable.bg_index_serious;
                break;
        }
        return resId;
    }

    public static int getDustStringId(int state) {
        int resId = R.string.dust_state_0;
        switch (state) {
            case DUST_STATE_0 :
                resId = R.string.dust_state_0;
                break;
            case DUST_STATE_1 :
                resId = R.string.dust_state_1;
                break;
            case DUST_STATE_2 :
                resId = R.string.dust_state_2;
                break;
            case DUST_STATE_3 :
                resId = R.string.dust_state_3;
                break;
            case DUST_STATE_4 :
                resId = R.string.dust_state_4;
                break;

        }
        return resId;
    }

    public static int getTotalPoint(int pm25) {

        pm25 = Math.min(pm25, 250);
        float Shi;
        float Slo;
        float Chi;
        float Clo;
        if (pm25 <= 10) {
            Shi = 20;   Slo = 0;
            Chi = 10;   Clo = 0;
        }
        else if (pm25 <= 25) {
            Shi = 40;   Slo = 21;
            Chi = 25;   Clo = 11;

        }
        else if (pm25 <= 35) {
            Shi = 60;   Slo = 41;
            Chi = 35;   Clo = 26;
        }
        else if (pm25 <= 75) {
            Shi = 80;   Slo = 61;
            Chi = 75;   Clo = 36;
        }
        else  {
            Shi = 100;   Slo = 81;
            Chi = 250;   Clo = 76;
        }
        float value = ((Shi - Slo) / (Chi - Clo)) * (pm25 - Clo) + Slo;
        LogUtil.LOGE("value : " + value + " - pm25 : " + pm25);
        return (int)value;
    }

    public static int getPM25(String value) {
        //TODO : 수정
        String pm25 = "0";
        if (value == null) {
            return Integer.parseInt(pm25);
        }
        pm25 = value.trim().replace("tp=1|PM25=", "");
        if (TextUtils.isEmpty(pm25)) {
            pm25 = "0";
        }
        return Integer.parseInt(pm25);
    }

    public static String[] getAddAddress(String data){
        String[] address = data.split(" ");
        for (int i = 0 ; i < address.length ; i++)
            LogUtil.LOGE("address["+i+"]: " + address[i]);

        return address;
    }
}
