package com.baby.aircok.acbaby.net.transaction;

import com.baby.aircok.acbaby.common.LogUtil;
import net.cruxware.android.net.client.NetworkClient;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by CHO on 2016. 10. 28..
 */

public class DATATransaction extends C2HTTPTransaction {
    public static final String SERVICE_KEY = "2swHUoM3iFAky78x2Ljh%2BZBtTvcoy%2Fe7fxxtAYd8Mwa6Lc85ITizobiNA3zVg78ZIbubA2W3Eu%2FWnGxvGQz22g%3D%3D";
    public DATATransaction() {
        super();
    }

    public DATATransaction(NetworkClient client, String code) {
        super();
        networkClient = client;
        this.code = code;
    }

    @Override
    public void setBytes(byte[] bytes) throws Exception {
        String string = new String(bytes, getCharset());
        JSONObject root = null;
        try {
            root = new JSONObject(string);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        try {
            JSONArray list = root.getJSONArray("list");
        } catch (Exception e) {
            e.printStackTrace();
        }
        response = root;
        LogUtil.LOGE(String.format("%s(%s)%s", "[RND]", this.code, root.toString(4)));
    }
}
