package com.family.aircok.acfamily.login;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
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

public class ChangePasswordActivity extends BaseActivity {

    private TextView tv_compare;
    private EditText mNowPw, mNewPw, mNewPw2;
    private String pw = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_password);

        setNewHeader(R.drawable.btn_nav_back_n, -1, R.string.change_password, false, -1);

        tv_compare = (TextView) findViewById(R.id.same_password);
        mNowPw = (EditText) findViewById(R.id.input_now_pw);
        mNewPw = (EditText) findViewById(R.id.input_new_pw);
        mNewPw2 = (EditText) findViewById(R.id.input_new_pw2);

        mNewPw2.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if ("".equals(mNewPw.getText().toString()))
                    return;

                if (mNewPw.getText().toString().equals(mNewPw2.getText().toString())){
                    tv_compare.setText(getString(R.string.compare_pw_1));
                } else {
                    tv_compare.setText(getString(R.string.compare_pw_0));
                }
            }
        });

        findViewById(R.id.btn_pw_save).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                requestPasswordChange();
            }
        });
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
            if ("change".equals(tr.getCode())){
                responsePasswordChange(tr);
            }
        }
    }
    private void requestPasswordChange() {
        final CustomDialog dialog;
        String now = mNowPw.getText().toString();
        String change = mNewPw.getText().toString();
        String confirm = mNewPw2.getText().toString();

        if ("".equals(now) || "".equals(change) || "".equals(confirm)) {
            dialog = new CustomDialog(this);
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_10));
            dialog.show();
            return;
        }

        String save = C2Preference.getLoginPW(this);
        now = AES256Cipher.encode(Config.AES256_KEY, now);

        if (!save.equals(now)) {
            dialog = new CustomDialog(this);
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_11));
            dialog.show();
            return;
        }

        if (!mNewPw.getText().toString().equals(mNewPw2.getText().toString())){
            dialog = new CustomDialog(this);
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_12));
            dialog.show();
            return;
        }

        pw = AES256Cipher.encode(Config.AES256_KEY, change);
        ACTransaction tr = new ACTransaction(this, "change");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("email", C2Preference.getLoginID(this));
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("user_passwd", pw);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responsePasswordChange(ACTransaction tr) {
        final CustomDialog dialog = new CustomDialog(this);
        String result = "";
        JSONObject respone = tr.getResponse();

        result = respone.optString("result");
        if ("1".equals(result)){
            C2Preference.setLoginPW(ChangePasswordActivity.this, pw);
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_13));
            dialog.setOne(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    LogUtil.LOGE("C2Preference.getLoginID(this): " + C2Preference.getLoginID(ChangePasswordActivity.this));
                    LogUtil.LOGE("C2Preference.getLoginPW(this): " + C2Preference.getLoginPW(ChangePasswordActivity.this));
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
