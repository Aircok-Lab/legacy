package com.baby.aircok.acbaby.login;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.AES256Cipher;
import com.baby.aircok.acbaby.common.C2Preference;
import com.baby.aircok.acbaby.common.Config;
import com.baby.aircok.acbaby.common.LoginInfo;
import com.baby.aircok.acbaby.common.widget.CustomDialog;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.ACTransaction;

import com.baby.aircok.acbaby.common.LogUtil;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONObject;

import static com.baby.aircok.acbaby.R.id.dialog;

public class PasswordChangeActivity extends BaseActivity {

    private EditText mInputNowPw, mInputChagePw, mInputConfirmPw;
    private boolean isCheckPw = false;
    private JSONObject respone;
    String pw = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_password_change);

        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.password_change_title, -1);

        mInputNowPw = (EditText) findViewById(R.id.input_now_password);
        mInputChagePw = (EditText) findViewById(R.id.input_change_password);
        mInputConfirmPw = (EditText) findViewById(R.id.input_change_confirm_password);

        mInputConfirmPw.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if ("".equals(mInputChagePw.getText().toString()))
                    return;

                if (mInputChagePw.getText().toString().equals(mInputConfirmPw.getText().toString())){
                    findViewById(R.id.same_password).setVisibility(View.VISIBLE);
                    isCheckPw = true;
                } else {
                    findViewById(R.id.same_password).setVisibility(View.INVISIBLE);
                    isCheckPw = false;
                }
            }
        });

        findViewById(R.id.btn_save).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CustomDialog dialog;
                String now = mInputNowPw.getText().toString();
                String change = mInputChagePw.getText().toString();
                String confirm = mInputConfirmPw.getText().toString();

                if ("".equals(now) || "".equals(change) || "".equals(confirm)) {
                    dialog = new CustomDialog(PasswordChangeActivity.this);
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_10));
                    dialog.show();
                    return;
                }

                String save = C2Preference.getLoginPW(PasswordChangeActivity.this);
                now = AES256Cipher.encode(Config.AES256_KEY, now);
                if (!now.equals(save)) {
                    dialog = new CustomDialog(PasswordChangeActivity.this);
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_11));
                    dialog.show();
                    return;
                }

                if (!mInputChagePw.getText().toString().equals(mInputConfirmPw.getText().toString())){
                    dialog = new CustomDialog(PasswordChangeActivity.this);
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_12));
                    dialog.show();
                    return;
                }

                pw = AES256Cipher.encode(Config.AES256_KEY, mInputChagePw.getText().toString());
                ACTransaction tr = new ACTransaction(PasswordChangeActivity.this, "change");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("user_id", LoginInfo.getInstance().user_id);
                tr.setRequest("email", C2Preference.getLoginID(PasswordChangeActivity.this));
                tr.setRequest("user_passwd", pw);
                C2HTTPProcessor.getInstance().sendToBLServer(tr);
            }
        });
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }

    @Override
    protected void onResume() {
        super.onResume();
        mInputNowPw.setText("");
        mInputChagePw.setText("");
        mInputConfirmPw.setText("");
    }

    @Override
    protected void onPause() {
        super.onPause();
        mInputNowPw.setText("");
        mInputChagePw.setText("");
        mInputConfirmPw.setText("");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mInputNowPw.setText("");
        mInputChagePw.setText("");
        mInputConfirmPw.setText("");
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

    private void getResponse(ACTransaction tr) {
        final CustomDialog dialog = new CustomDialog(this);
        String result = "";
        respone = tr.getResponse();

        result = respone.optString("result");
        if ("1".equals(result)) {
            C2Preference.setLoginPW(PasswordChangeActivity.this, pw);
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_13));
            dialog.setOne(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    LogUtil.LOGE("C2Preference.getLoginID(this): " + C2Preference.getLoginID(PasswordChangeActivity.this));
                    LogUtil.LOGE("C2Preference.getLoginPW(this): " + C2Preference.getLoginPW(PasswordChangeActivity.this));
                    dialog.dismiss();
                    finish();
                }
            });
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
