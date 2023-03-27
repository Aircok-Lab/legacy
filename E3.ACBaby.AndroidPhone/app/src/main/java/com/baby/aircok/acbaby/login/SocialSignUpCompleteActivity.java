package com.baby.aircok.acbaby.login;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.C2Preference;
import com.baby.aircok.acbaby.common.Config;
import com.baby.aircok.acbaby.common.LoginInfo;
import com.baby.aircok.acbaby.common.widget.CustomDialog;
import com.baby.aircok.acbaby.main.MainActivity;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.ACTransaction;

import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONObject;

public class SocialSignUpCompleteActivity extends BaseActivity {

    private EditText mBirth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_social_sign_up_complete);

        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.sign_up_complete, -1);

        mBirth = (EditText) findViewById(R.id.input_birth);

        findViewById(R.id.btn_save).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CustomDialog dialog = new CustomDialog(SocialSignUpCompleteActivity.this);
                if (mBirth.getText().toString().length() != 8) {
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_19));
                    dialog.show();
                    return;
                }

                requestBaby(mBirth.getText().toString());
            }
        });

    }

    private void requestBaby(String birth) {
        ACTransaction tr = new ACTransaction(SocialSignUpCompleteActivity.this, "baby");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("email", C2Preference.getLoginID(SocialSignUpCompleteActivity.this));
        tr.setRequest("sex", "");
        tr.setRequest("baby_name", "");
        tr.setRequest("baby_yymm", birth);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void reponseBaby(ACTransaction tr) {
        JSONObject response = tr.getResponse();
        String result = response.optString("result");
        if ("1".equals(result)) {
            Intent i = new Intent(SocialSignUpCompleteActivity.this, MainActivity.class);
            i.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            startActivity(i);
            finish();
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
            if (tr.getCode().equals("baby")){
                reponseBaby(tr);
            }
        }
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }
}
