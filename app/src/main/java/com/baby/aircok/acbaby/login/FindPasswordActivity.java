package com.baby.aircok.acbaby.login;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.Config;
import com.baby.aircok.acbaby.common.widget.CustomDialog;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.ACTransaction;

import com.baby.aircok.acbaby.common.LogUtil;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONObject;

public class FindPasswordActivity extends BaseActivity {

    private EditText mEmail;
    private JSONObject respone;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_find_password);

        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.find_password_title, -1);

        mEmail = (EditText) findViewById(R.id.input_email);

        findViewById(R.id.btn_send_email).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if ("".equals(mEmail.getText().toString())) {
                    CustomDialog dialog = new CustomDialog(FindPasswordActivity.this);
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_1));
                    dialog.show();
                    return;
                }

                ACTransaction tr = new ACTransaction(FindPasswordActivity.this, "check");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("email", mEmail.getText().toString());
                C2HTTPProcessor.getInstance().sendToBLServer(tr);

            }
        });
    }

    private void getResponse(ACTransaction tr) {
        CustomDialog dialog = new CustomDialog(this);
        String result = "";
        respone = tr.getResponse();

        result = respone.optString("result");
        if ("0".equals(result)) {
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_14));
            dialog.show();
        } else if ("1".equals(result)) {
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_15));
            dialog.show();
        } else {
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_8));
            dialog.show();
        }

    }

    @Override
    protected void onExceptionThrownOnUiThread(NetworkProcessor networkProcessor, TransactionException e) {
        super.onExceptionThrownOnUiThread(networkProcessor, e);
    }

    @Override
    protected void onTransactionReceivedOnUiThread(NetworkProcessor networkProcessor, Transaction transaction) {
        super.onTransactionReceivedOnUiThread(networkProcessor, transaction);
        if (transaction instanceof ACTransaction) {
            ACTransaction tr = (ACTransaction) transaction;
            LogUtil.LOGE("FindPasswordActivity tr: " + tr.toString());
            getResponse(tr);
        }
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }
}
