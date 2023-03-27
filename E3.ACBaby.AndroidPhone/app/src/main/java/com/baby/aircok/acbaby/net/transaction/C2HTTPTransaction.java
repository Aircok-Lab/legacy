package com.baby.aircok.acbaby.net.transaction;

import com.baby.aircok.acbaby.common.LogUtil;
import net.cruxware.android.net.client.NetworkClient;
import net.cruxware.android.net.transaction.HTTPTransaction;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

/**
 * Created by CHO on 2016. 10. 10..
 */

public class C2HTTPTransaction extends HTTPTransaction {

    public static final String C2_CONNECTION_URL_KMA_POINT = "http://www.kma.go.kr/DFSROOT/POINT/DATA/";
    public static final String C2_CONNECTION_URL_MSRSTNINFOINQIRESVC = "http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/";
    public static final String C2_CONNECTION_URL_GETNEARBYMSRSTNLIST = C2_CONNECTION_URL_MSRSTNINFOINQIRESVC + "getNearbyMsrstnList";
    public static final String C2_CONNECTION_URL_GETMSRSTNLIST = "http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getMsrstnList";
    public static final String C2_CONNECTION_URL_GETMSRSTNACCTORLTMMESUREDNSTY = "http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty";

    protected JSONObject request = new JSONObject();
    protected JSONObject response = new JSONObject();
    public String code = "";

    public C2HTTPTransaction() {
        super();
    }

    public C2HTTPTransaction(NetworkClient client, String code) {
        super();
        networkClient = client;
        this.code = code;
    }

    public void setCode(String code) {
        this.code = code;
    }
    public String getCode() {
        return code;
    }

    public void setValue(String key, Object value) {
        try {
            request.put(key, value);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public JSONObject getResponse() {
        return response;
    }

    @Override
    public byte[] getBytes() throws Exception {
        String requsetString = "";
        if (request != null) {
            Iterator<String> iterator = request.keys();
            while (iterator.hasNext()) {
                String key = iterator.next();
                String value = request.optString(key);

                if ("".equals(requsetString)) {
                    requsetString = String.format("%s=%s", key, value);
                } else {
                    requsetString = String.format("%s&%s=%s", requsetString, key, value);
                }
            }
        }
        LogUtil.LOGE(String.format("%s(%s)%s", "[SND]", this.code, requsetString));
        return requsetString.getBytes(getCharset());
    }

    @Override
    public void setBytes(byte[] bytes) throws Exception {
        String string = new String(bytes, getCharset());
        try {
            JSONArray array = new JSONArray(string);
            response.put("array", array);
        } catch (JSONException e) {
        }
        try {
            response = new JSONObject(string);
        } catch (JSONException e) {
        }
        LogUtil.LOGE(String.format("%s(%s)%s", "[RND]", this.code, response.toString(4)));

        //예외처리

    }
}
