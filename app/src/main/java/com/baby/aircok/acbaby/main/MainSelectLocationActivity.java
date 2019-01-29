package com.baby.aircok.acbaby.main;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.widget.CXAdapter;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.C2HTTPTransaction;

import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by CHO on 2016. 10. 29..
 */

public class MainSelectLocationActivity extends BaseActivity {

    public static final String KEY_RESULT_DATA = "result_data";
    public static final String KEY_RESULT_ADDRESS_DATA = "result_address_data";
    private Adapter_ mAdapter;
    private int mStep = 0;
    private C2HTTPTransaction[] mStepTrs = new C2HTTPTransaction[3];
    private JSONObject[] mStepInfos = new JSONObject[3];

    private class Adapter_ extends CXAdapter {
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            if (convertView == null) {
                convertView = View.inflate(parent.getContext(), R.layout.cell_select_location, null);
            }

            if (getItem(position) instanceof JSONObject) {
                JSONObject item = (JSONObject) getItem(position);
                TextView tv_location = (TextView) convertView.findViewById(R.id.tv_location);
                tv_location.setText(item.optString("value"));
            }
            return convertView;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_select_location);
        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.select_location_title, -1);

        ListView listView = (ListView) findViewById(R.id.list_view);
        mAdapter = new Adapter_();
        listView.setAdapter(mAdapter);
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                if (mAdapter.getItem(position) instanceof JSONObject) {
                    JSONObject item = (JSONObject) mAdapter.getItem(position);
                    String code = item.optString("code");
                    if ("0".equals(code)) {
                        setStep(--mStep, mStepInfos[mStep]);
                    }
                    else {
                        setStep(++mStep, item);
                    }
                }
            }
        });

        setStep(0, null);
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }

    private void setStep(int step, JSONObject item) {
        mStep = step;
        clearStep(step);
        if (step == 0) {
//            mStepInfos[0] = item;
            if (mStepTrs[0] == null) {
                requestTop();
            }
            else {
                responseTop(mStepTrs[0]);
            }
        }
        else if (step == 1) {
            mStepInfos[0] = item;
            if (mStepTrs[1] == null) {
                requestMdl(item.optString("code"));
            }
            else {
                responseMdl(mStepTrs[1]);
            }
        }
        else if (step == 2) {
            mStepInfos[1] = item;
            if (mStepTrs[2] == null) {
                requestLeaf(item.optString("code"));
            }
        }
        else {
            mStepInfos[2] = item;
            Intent intent = new Intent();
            intent.putExtra(KEY_RESULT_DATA, item.toString());
            setResult(RESULT_OK, intent);
            finish();
        }
    }

    private void clearStep(int step) {
        switch (step) {
            case 0:
                mStepTrs[1] = null;
                mStepTrs[2] = null;
                mStepInfos[0] = null;
                mStepInfos[1] = null;
                mStepInfos[2] = null;
                break;
            case 1:
                mStepTrs[2] = null;
                mStepInfos[1] = null;
                mStepInfos[2] = null;
                break;
            case 2:
                mStepInfos[2] = null;
                break;
        }
    }

    @Override
    protected void onExceptionThrownOnUiThread(NetworkProcessor networkProcessor, TransactionException e) {
        super.onExceptionThrownOnUiThread(networkProcessor, e);
        progressStop();
    }

    @Override
    protected void onTransactionReceivedOnUiThread(NetworkProcessor networkProcessor, Transaction transaction) {
        super.onTransactionReceivedOnUiThread(networkProcessor, transaction);
        if (transaction instanceof C2HTTPTransaction) {
            C2HTTPTransaction tr = (C2HTTPTransaction) transaction;
            if ("top".equals(tr.getCode())) {
                responseTop(tr);
            }
            else if ("mdl".equals(tr.getCode())) {
                responseMdl(tr);
            }
            else if ("leaf".equals(tr.getCode())) {
                responseLeaf(tr);
            }
        }
    }

    private void requestTop() {
        progressStart();
        String connectionURL = String.format("%s%s", C2HTTPTransaction.C2_CONNECTION_URL_KMA_POINT, "top.json.txt");
        C2HTTPTransaction tr = new C2HTTPTransaction(this, "top");
        tr.setConnectionURL(connectionURL);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseTop(C2HTTPTransaction tr) {
        progressStop();
        mAdapter.datas.removeAllElements();
        mStepTrs[0] = tr;
        JSONArray array = tr.getResponse().optJSONArray("array");
        for (int i = 0 ; i < array.length() ; i++) {
            mAdapter.datas.addElement(array.opt(i));
        }
        mAdapter.notifyDataSetChanged();
    }

    private void requestMdl(String topCode) {
        progressStart();
        String connectionURL = String.format("%s%s", C2HTTPTransaction.C2_CONNECTION_URL_KMA_POINT, String.format("mdl.%s.json.txt", topCode));
        C2HTTPTransaction tr = new C2HTTPTransaction(this, "mdl");
        tr.setConnectionURL(connectionURL);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseMdl(C2HTTPTransaction tr) {
        progressStop();
        mAdapter.datas.removeAllElements();
        mStepTrs[1] = tr;

        try {
            JSONObject item = new JSONObject();
            item.put("code", "0");
            item.put("value", "이전");
            mAdapter.datas.addElement(item);
        } catch (JSONException e) {
            e.printStackTrace();
        }


        JSONArray array = tr.getResponse().optJSONArray("array");
        for (int i = 0 ; i < array.length() ; i++) {
            mAdapter.datas.addElement(array.opt(i));
        }
        mAdapter.notifyDataSetChanged();
    }

    private void requestLeaf(String mdlCode) {
        progressStart();
        String connectionURL = String.format("%s%s", C2HTTPTransaction.C2_CONNECTION_URL_KMA_POINT, String.format("leaf.%s.json.txt", mdlCode));
        C2HTTPTransaction tr = new C2HTTPTransaction(this, "leaf");
        tr.setConnectionURL(connectionURL);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseLeaf(C2HTTPTransaction tr) {
        progressStop();
        mAdapter.datas.removeAllElements();
        mStepTrs[2] = tr;

        try {
            JSONObject item = new JSONObject();
            item.put("code", "0");
            item.put("value", "이전");
            mAdapter.datas.addElement(item);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JSONArray array = tr.getResponse().optJSONArray("array");
        for (int i = 0 ; i < array.length() ; i++) {
            mAdapter.datas.addElement(array.opt(i));
        }
        mAdapter.notifyDataSetChanged();
    }
}
