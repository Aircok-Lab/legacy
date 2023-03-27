package com.family.aircok.acfamily.menu;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;
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

public class ChangeUserInfoActivity extends BaseActivity {

    private JSONObject respone;
    private ACTransaction tr;
    private CustomDialog dialog;
    private EditText mUserName, mUserBirth;
    private String mSex = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_user_info);

        setNewHeader(R.drawable.btn_nav_back_n, -1, R.string.menu_title6, false, -1);

        mUserName = (EditText) findViewById(R.id.userinfo_name);
        mUserBirth = (EditText) findViewById(R.id.userinfo_birth);
        setBabyData();

        findViewById(R.id.btn_male).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                findViewById(R.id.img_female).setBackground(getResources().getDrawable(R.drawable.btn_radio_n));
                findViewById(R.id.img_male).setBackground(getResources().getDrawable(R.drawable.btn_radio_p));
                mSex = "M";
                LogUtil.LOGE("mSex : " + mSex);
            }
        });

        findViewById(R.id.btn_female).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                findViewById(R.id.img_female).setBackground(getResources().getDrawable(R.drawable.btn_radio_p));
                findViewById(R.id.img_male).setBackground(getResources().getDrawable(R.drawable.btn_radio_n));
                mSex = "F";
                LogUtil.LOGE("mSex : " + mSex);
            }
        });

        findViewById(R.id.btn_save).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog = new CustomDialog(ChangeUserInfoActivity.this);
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

                tr = new ACTransaction(ChangeUserInfoActivity.this, "baby");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("user_id", LoginInfo.getInstance().user_id);
                tr.setRequest("email", C2Preference.getLoginID(ChangeUserInfoActivity.this));
                tr.setRequest("sex", mSex);
                tr.setRequest("baby_name", mUserName.getText().toString());
                tr.setRequest("baby_yymm", mUserBirth.getText().toString());
                C2HTTPProcessor.getInstance().sendToBLServer(tr);

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
            LogUtil.LOGE("ChangeUserInfoActivity tr: " + tr.toString());
            getResponse(tr);
        }
    }

    private void setBabyData() {
        LoginInfo info = LoginInfo.getInstance();

        LogUtil.LOGE("LoginInfo.getInstance().baby_name: "+LoginInfo.getInstance().baby_name);
        LogUtil.LOGE("LoginInfo.getInstance().baby_yymm: "+LoginInfo.getInstance().baby_yymm);

        mUserName.setText(LoginInfo.getInstance().baby_name);
        mUserBirth.setText(LoginInfo.getInstance().baby_yymm);
        String sex = LoginInfo.getInstance().sex;
        if (sex.length() != 0) {
            if ("F".equals(sex)) {
                findViewById(R.id.img_female).setBackground(getResources().getDrawable(R.drawable.btn_radio_p));
                findViewById(R.id.img_male).setBackground(getResources().getDrawable(R.drawable.btn_radio_n));
                mSex = "F";
            }
            else {
                findViewById(R.id.img_female).setBackground(getResources().getDrawable(R.drawable.btn_radio_n));
                findViewById(R.id.img_male).setBackground(getResources().getDrawable(R.drawable.btn_radio_p));
                mSex = "M";
            }
        }
    }

    private void getResponse(ACTransaction tr) {
        final CustomDialog dialog = new CustomDialog(ChangeUserInfoActivity.this);
        respone = tr.getResponse();
        LogUtil.LOGE("ChangeUserInfoActivity getResponse: " + respone.toString());

        if ("1".equals(respone.optString("result"))){
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

    }

}
