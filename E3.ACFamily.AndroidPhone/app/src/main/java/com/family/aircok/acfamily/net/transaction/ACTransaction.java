package com.family.aircok.acfamily.net.transaction;

import com.family.aircok.acfamily.common.LogUtil;

import net.cruxware.android.net.client.NetworkClient;
import net.cruxware.android.net.transaction.HTTPHeader;
import net.cruxware.android.net.transaction.HTTPTransaction;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import static java.lang.Integer.parseInt;

/**
 * Created by ssong on 2017. 6. 2..
 */

public class ACTransaction extends HTTPTransaction {

    protected JSONObject request = new JSONObject();
    protected JSONObject response = new JSONObject();
    public String code = "";

    public ACTransaction() {
        super();
    }
    public ACTransaction(NetworkClient client, String code) {
        super();
        method = "POST";
        networkClient = client;
        this.code = code;
        this.connectionTimeout = 10000;

        setHeader();
    }

    private void setHeader() {

        Map<String, String> headerFields = new HashMap<>();
        headerFields.put("content-type", "application/json");
        headerFields.put("cache-control", "no-cache");
        HTTPHeader header = new HTTPHeader(headerFields);
        setHTTPHeader(header);
    }

    @Override
    public String getConnectionURL() throws Exception {
        return String.format("%s%s", connectionURL , code);
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public void setRequest(String key, Object value) {
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
        String requsetString = request.toString();
        LogUtil.LOGE(String.format("%s(%s)%s", "[SND]", this.code, requsetString));
        return requsetString.getBytes(getCharset());
    }

    @Override
    public void setBytes(byte[] bytes) throws Exception {
        String string = new String(bytes, getCharset());
        try {
            response = new JSONObject(string);
        } catch (Exception e) {
            e.printStackTrace();
        }




        LogUtil.LOGE(String.format("%s(%s)%s", "[RND]", this.code, response.toString(4)));
    }
}
