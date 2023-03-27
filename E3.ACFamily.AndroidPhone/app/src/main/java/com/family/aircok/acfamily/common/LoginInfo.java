package com.family.aircok.acfamily.common;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by ssong on 2017. 7. 5..
 */

public class LoginInfo {

    private static LoginInfo mInstance;
    public String user_id;
    public String passwd;
    public int regi_type;
    public String sns_id;
    public String sns_name;
    public String sex;//F/M
    public String baby_yymm;
    public String baby_name;
    public boolean push_on;
    public JSONObject device;
    public JSONObject aircok;
    public JSONObject location;
    public JSONObject favorite1;
    public JSONObject favorite2;


    private LoginInfo() {}

    public static LoginInfo getInstance() {
        if (mInstance == null) {
            mInstance = new LoginInfo();
        }
        return mInstance;
    }

    public void load(JSONObject info) {
        clear();
        try {
            user_id = info.optString("user_id");
            passwd = info.optString("passwd");
            regi_type = info.optInt("regi_type");
            sns_id = info.optString("sns_id");
            sns_name = info.optString("sns_name");
            sex = info.optString("sex");
            baby_yymm = info.optString("baby_yymm");
            baby_name = info.optString("baby_name");

            push_on = false;
            if (info.optString("push_on").length() != 0) {
                String push = info.getString("push_on");
                push_on = "true".equals(push) ? true : false;
            }

            if (info.optJSONObject("device") != null) {
                device = info.getJSONObject("device");
            }

            if (info.optJSONObject("aircok") != null) {
                aircok = info.getJSONObject("aircok");
            }

            if (info.optJSONObject("locaion") != null) {
                location = info.getJSONObject("locaion");
            }

            if (info.optJSONObject("favorite1") != null) {
                favorite1 = info.getJSONObject("favorite1");
            }

            if (info.optJSONObject("favorite2") != null) {
                favorite2 = info.getJSONObject("favorite2");
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void clear() {
        user_id = "";
        passwd = "";
        regi_type = 0;
        sns_id = "";
        sns_name = "";
        sex = "";
        baby_yymm = "";
        baby_name = "";
        push_on = false;
        device = null;
        aircok = null;
        location = null;
        favorite1 = null;
        favorite2 = null;
    }
}
