package com.baby.aircok.acbaby.menu;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;


import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;
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

public class ChangeBabyInfoActivity extends BaseActivity {

    private JSONObject respone;
    private ACTransaction tr;
    private CustomDialog dialog;
    private EditText mUserName, mUserBirth;
    private String mSex = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_baby_info);

        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.baby_info_change_title, -1);

        mUserName = (EditText) findViewById(R.id.userinfo_name);
        mUserBirth = (EditText) findViewById(R.id.userinfo_birth);
        setBabyData();

        findViewById(R.id.btn_boy).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                findViewById(R.id.img_girl).setBackground(getResources().getDrawable(R.drawable.btn_radio_n));
                findViewById(R.id.img_boy).setBackground(getResources().getDrawable(R.drawable.btn_radio_p));
                mSex = "M";
            }
        });

        findViewById(R.id.btn_girl).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                findViewById(R.id.img_girl).setBackground(getResources().getDrawable(R.drawable.btn_radio_p));
                findViewById(R.id.img_boy).setBackground(getResources().getDrawable(R.drawable.btn_radio_n));
                mSex = "F";
            }
        });

        findViewById(R.id.btn_save).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog = new CustomDialog(ChangeBabyInfoActivity.this);
                if ("".equals(mUserName.getText().toString())) {
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_24));
                    dialog.show();
                    return;
                } else if (mUserBirth.getText().toString().length() != 8) {
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_19));
                    dialog.show();
                    return;
                } else if (("".equals(mSex))){
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_23));
                    dialog.show();
                    return;
                }

                tr = new ACTransaction(ChangeBabyInfoActivity.this, "baby");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("user_id", LoginInfo.getInstance().user_id);
                tr.setRequest("email", C2Preference.getLoginID(ChangeBabyInfoActivity.this));
                tr.setRequest("sex", mSex);
                tr.setRequest("baby_name", mUserName.getText().toString());
                tr.setRequest("baby_yymm", mUserBirth.getText().toString());
                C2HTTPProcessor.getInstance().sendToBLServer(tr);
            }
        });
    }

    private void setBabyData() {
        LoginInfo info = LoginInfo.getInstance();
        mUserName.setText(LoginInfo.getInstance().baby_name);
        mUserBirth.setText(LoginInfo.getInstance().baby_yymm);
        String sex = LoginInfo.getInstance().sex;
        if (sex.length() != 0) {
            if ("F".equals(sex)) {
                findViewById(R.id.img_girl).setBackground(getResources().getDrawable(R.drawable.btn_radio_p));
                findViewById(R.id.img_boy).setBackground(getResources().getDrawable(R.drawable.btn_radio_n));
                mSex = "F";
            }
            else {
                findViewById(R.id.img_girl).setBackground(getResources().getDrawable(R.drawable.btn_radio_n));
                findViewById(R.id.img_boy).setBackground(getResources().getDrawable(R.drawable.btn_radio_p));
                mSex = "M";
            }
        }
    }

    private void getResponse(ACTransaction tr) {
        final CustomDialog dialog = new CustomDialog(ChangeBabyInfoActivity.this);
        respone = tr.getResponse();
        if ("1".equals(respone.optString("result"))) {
            LoginInfo.getInstance().baby_name = mUserName.getText().toString();
            LoginInfo.getInstance().baby_yymm = mUserBirth.getText().toString();
            LoginInfo.getInstance().sex = mSex;

            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_25));
            dialog.setOne(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
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
        setBabyData();
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
            getResponse(tr);
        }
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }
}
