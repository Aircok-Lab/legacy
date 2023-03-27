package com.family.aircok.acfamily.main;

import android.os.Handler;

import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.C2HTTPTransaction;
import com.family.aircok.acfamily.net.transaction.DATATransaction;

import net.cruxware.android.base.util.JSONUtil;
import net.cruxware.android.net.client.NetworkClient;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Created by ssong on 2017. 5. 16..
 */

public class KMAHelper implements NetworkClient {

    private Handler mHandler = new Handler();
    private OnResponseListener mResponseListener;
    private boolean mSending = false;
    private int mRequestCode;
    private String mX;
    private String mY;

    private JSONArray mStationList;
    private int mStationIndex = 0;
    private String mStation;

    public interface OnResponseListener {
        public void onResponse(int code, boolean isSuccese, JSONObject data);
    }
    public KMAHelper(String tmX, String tmY) {
        mX = tmX;
        mY = tmY;
    }

    public void request(int requestCode, OnResponseListener listener) {
        if (mSending) {
            return;
        }
        mRequestCode = requestCode;
        mResponseListener = listener;
        requestGETNEARBYMSRSTNLIST(mX, mY);
    }

    @Override
    public void onConnected(NetworkProcessor networkProcessor) {}
    @Override
    public void onDisconnected(NetworkProcessor networkProcessor) {}
    @Override
    public void onStarted(NetworkProcessor networkProcessor) {}
    @Override
    public void onEnded(NetworkProcessor networkProcessor) {}
    @Override
    public void onExceptionThrown(NetworkProcessor networkProcessor, TransactionException e) {
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                if (mResponseListener != null) {
                    mResponseListener.onResponse(mRequestCode, false, null);
                }
            }
        });
    }

    @Override
    public void onTransactionReceived(NetworkProcessor networkProcessor, Transaction transaction) {
        if (transaction instanceof C2HTTPTransaction) {
            C2HTTPTransaction tr = (C2HTTPTransaction) transaction;
            if ("GETNEARBYMSRSTNLIST".equals(tr.getCode())) {
                responseGETNEARBYMSRSTNLIST(tr);
            }
            else if ("GETMSRSTNLIST".equals(tr.getCode())) {
                responseGETMSRSTNLIST(tr);
            }
            else if ("GETMSRSTNACCTORLTMMESUREDNSTY".equals(tr.getCode())) {
                responseGETMSRSTNACCTORLTMMESUREDNSTY(tr);
            }
        }
    }

    //근접측정소 목록 조회
    private void requestGETNEARBYMSRSTNLIST(String tmX, String tmY) {
        mSending = true;
        String connectionURL = String.format("%s", C2HTTPTransaction.C2_CONNECTION_URL_GETNEARBYMSRSTNLIST);
        DATATransaction tr = new DATATransaction(this, "GETNEARBYMSRSTNLIST");
        tr.setConnectionURL(connectionURL);
        tr.setValue("tmX", tmX);
        tr.setValue("tmY", tmY);
        tr.setValue("numOfRows", 10);
        tr.setValue("pageNo", 1);
        tr.setValue("_returnType", "json");
        tr.setValue("ServiceKey", DATATransaction.SERVICE_KEY);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseGETNEARBYMSRSTNLIST(C2HTTPTransaction tr) {
        mStationList = tr.getResponse().optJSONArray("list");
        JSONObject object = mStationList.optJSONObject(mStationIndex);
        String stationName = object.optString("stationName");
        mSending = false;
        requestGETMSRSTNLIST(stationName);
    }

    //측정소 정보 조회
    private void requestGETMSRSTNLIST(String stationName) {
        LogUtil.LOGE("mStationList stationName rerere : " + stationName);
        String connectionURL = String.format("%s", C2HTTPTransaction.C2_CONNECTION_URL_GETMSRSTNLIST);
        DATATransaction tr = new DATATransaction(this, "GETMSRSTNLIST");
        tr.setConnectionURL(connectionURL);
        tr.setValue("stationName", stationName);
        tr.setValue("numOfRows", 10);
        tr.setValue("pageNo", 1);
        tr.setValue("_returnType", "json");
        tr.setValue("ServiceKey", DATATransaction.SERVICE_KEY);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseGETMSRSTNLIST(C2HTTPTransaction tr) {
        LogUtil.LOGE("mStationList.length() : " + mStationList.length());
        LogUtil.LOGE("mStationList.length()_ : " + mStationIndex);
        mStationIndex++;
        JSONArray list = tr.getResponse().optJSONArray("list");
        JSONObject object = list.optJSONObject(0);
        String item = object.optString("item");
        if (item.contains("PM2.5")) {
            requestGETMSRSTNACCTORLTMMESUREDNSTY(object.optString("stationName"));
        }
        else {
            JSONObject stationObject = mStationList.optJSONObject(mStationIndex);
            String stationName = stationObject.optString("stationName");

            if (mStationList.length() - 1 <= mStationIndex) {
                requestGETMSRSTNACCTORLTMMESUREDNSTY(stationName);
            }
            else {
                requestGETMSRSTNLIST(stationName);
            }
        }
    }

    //측정소별 실시간 측정정보조회
    private void requestGETMSRSTNACCTORLTMMESUREDNSTY(String stationName) {
        mStation = stationName;
        String connectionURL = String.format("%s", C2HTTPTransaction.C2_CONNECTION_URL_GETMSRSTNACCTORLTMMESUREDNSTY);
        DATATransaction tr = new DATATransaction(this, "GETMSRSTNACCTORLTMMESUREDNSTY");
        tr.setConnectionURL(connectionURL);
        tr.setValue("stationName", stationName);
        tr.setValue("dataTerm", "DAILY");
        tr.setValue("ver", "1.3");
        tr.setValue("numOfRows", 1);
        tr.setValue("pageNo", 1);
        tr.setValue("_returnType", "json");
        tr.setValue("ServiceKey", DATATransaction.SERVICE_KEY);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseGETMSRSTNACCTORLTMMESUREDNSTY(C2HTTPTransaction tr) {
        JSONArray list = tr.getResponse().optJSONArray("list");
        final JSONObject object = list.optJSONObject(0);
        JSONUtil.putSafe(object, "stationName", mStation);

        mHandler.post(new Runnable() {
            @Override
            public void run() {
                if (mResponseListener != null) {
                    mResponseListener.onResponse(mRequestCode, true, object);
                }
            }
        });

    }
}
