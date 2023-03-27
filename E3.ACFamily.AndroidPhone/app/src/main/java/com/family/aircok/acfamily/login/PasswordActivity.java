package com.family.aircok.acfamily.login;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.AES256Cipher;
import com.family.aircok.acfamily.common.C2Preference;
import com.family.aircok.acfamily.common.Config;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.LoginInfo;
import com.family.aircok.acfamily.common.widget.CustomDialog;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.ACTransaction;

import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONObject;

public class PasswordActivity extends BaseActivity implements View.OnClickListener{

    private EditText mFindPwEmail, mNowPw, mNewPw, mNewPw2, mInputEmail;
    private JSONObject respone;
    private CustomDialog dialog;
    private String kind = "";
    private String pw = "";
    private boolean isEmail = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_password);

        setNewHeader(R.drawable.btn_nav_back_n, -1, R.string.findpassword, false, -1);

        mInputEmail = (EditText) findViewById(R.id.input_email);

        Intent intent = getIntent();
        isEmail = intent.getBooleanExtra("isEmail", true);
        LogUtil.LOGE("PasswordActivity isEmail: " + isEmail);;

    }

    @Override
    protected void onResume() {
        super.onResume();
        mInputEmail.setText("");
    }

    @Override
    protected void onPause() {
        super.onPause();
        mInputEmail.setText("");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mInputEmail.setText("");
    }

    private void getResponse(ACTransaction tr) {
        dialog = new CustomDialog(this);
        String result = "";
        respone = tr.getResponse();
        if ("check".equals(kind)) {
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
            LogUtil.LOGE("PasswordActivity tr: " + tr.toString());
            getResponse(tr);
        }
    }

    @Override
    public void onClick(View v) {
        ACTransaction tr;
        switch (v.getId()) {
          case R.id.btn_send_email:
                if ("".equals(mInputEmail.getText().toString())) {
                    dialog = new CustomDialog(this);
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_1));
                    dialog.show();
                    return;
                }

                kind = "check";
                tr = new ACTransaction(this, "check");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("email", mInputEmail.getText().toString());
                C2HTTPProcessor.getInstance().sendToBLServer(tr);
                break;

        }
    }
}
