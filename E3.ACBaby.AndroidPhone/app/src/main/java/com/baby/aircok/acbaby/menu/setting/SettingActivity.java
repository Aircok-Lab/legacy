package com.baby.aircok.acbaby.menu.setting;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.C2Application;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.C2Preference;
import com.baby.aircok.acbaby.common.Config;
import com.baby.aircok.acbaby.common.LoginInfo;
import com.baby.aircok.acbaby.common.Util;
import com.baby.aircok.acbaby.common.widget.CustomDialog;
import com.baby.aircok.acbaby.login.LoginActivity;
import com.baby.aircok.acbaby.login.PasswordChangeActivity;
import com.baby.aircok.acbaby.menu.ChangeBabyInfoActivity;
import com.baby.aircok.acbaby.menu.HealthHistoryActivity;
import com.baby.aircok.acbaby.menu.TermsActivity;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.ACTransaction;

import com.baby.aircok.acbaby.common.LogUtil;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONObject;

/**
 * Created by CHO on 2016. 10. 24..
 */

public class SettingActivity extends BaseActivity implements View.OnClickListener {

    private static final int SETTING_DEVICE = 0;
    private static final int SETTING_VERSION = 1;

    private Button btn_Push;
    private boolean pushSet = false;
    private TextView mDeivceName, mUserEmail, mVersion;
    private ACTransaction tr;
    private JSONObject respone;
    private String kind = "";

    private View[] mViews = new View[4];


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_setting);
        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.menu_title3, -1);

        btn_Push = (Button) findViewById(R.id.btn_pushsetting);
        mUserEmail = (TextView) findViewById(R.id.tv_id);
        mUserEmail.setText(C2Preference.getLoginID(this));

        mDeivceName = (TextView) findViewById(R.id.tv_device_name);
        mDeivceName.setText(C2Preference.getDevice(this));

//        mViews[SETTING_DEVICE] = findViewById(R.id.cell_setting0);
//        mViews[SETTING_VERSION] = findViewById(R.id.cell_setting1);
//        setCell(mViews[SETTING_DEVICE], R.drawable.btn_set_link_selector, R.string.setting_cell0, null);
        mVersion = (TextView) findViewById(R.id.tv_version);
        String version = ((C2Application)getApplication()).getVersionName();
        mVersion.setText(version);
//        setCell(mViews[SETTING_VERSION], R.drawable.btn_set_alert_n, R.string.setting_cell3, version);
        if (LoginInfo.getInstance().push_on) {
            btn_Push.setText("ON");
            btn_Push.setTextColor(getResources().getColor(R.color.switch_on));
            btn_Push.setBackground(getResources().getDrawable(R.drawable.switch_on));
            btn_Push.setPadding((int) Util.getPxToDp(this, 18.3), 0, 0, 0);
            pushSet = true;
        } else {
            btn_Push.setText("OFF");
            btn_Push.setTextColor(getResources().getColor(R.color.switch_off));
            btn_Push.setBackground(getResources().getDrawable(R.drawable.switch_off));
            btn_Push.setPadding(0, 0, (int) Util.getPxToDp(this, 18.3), 0);
            pushSet = false;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        setDeviceName();
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }

//    private void setCell(View view, int image, int title, String version) {
//        if (view == null) {
//            return;
//        }
//        if (image != -1) {
//            ImageView iv_icon = (ImageView) view.findViewById(R.id.iv_icon);
//            iv_icon.setImageResource(image);
//        }
//        if (title != -1) {
//            TextView tv_name = (TextView) view.findViewById(R.id.tv_name);
//            tv_name.setText(title);
//        }
//
//        TextView tv_version = (TextView) view.findViewById(R.id.tv_version);
//        tv_version.setVisibility(View.INVISIBLE);
//        if (version != null) {
//            tv_version.setText(version);
//            tv_version.setVisibility(View.VISIBLE);
//        }
//    }

    private void setDeviceName() {
        mUserEmail = (TextView) findViewById(R.id.tv_id);
        mUserEmail.setText(C2Preference.getLoginID(this));

        mDeivceName = (TextView) findViewById(R.id.tv_device_name);
        mDeivceName.setText(C2Preference.getDevice(this));

        mVersion = (TextView) findViewById(R.id.tv_version);
        String version = ((C2Application)getApplication()).getVersionName();
        mVersion.setText(version);

        if (LoginInfo.getInstance().push_on) {
            btn_Push.setText("ON");
            btn_Push.setTextColor(getResources().getColor(R.color.switch_on));
            btn_Push.setBackground(getResources().getDrawable(R.drawable.switch_on));
            btn_Push.setPadding((int) Util.getPxToDp(this, 18.3), 0, 0, 0);
            pushSet = true;
        } else {
            btn_Push.setText("OFF");
            btn_Push.setTextColor(getResources().getColor(R.color.switch_off));
            btn_Push.setBackground(getResources().getDrawable(R.drawable.switch_off));
            btn_Push.setPadding(0, 0, (int) Util.getPxToDp(this, 18.3), 0);
            pushSet = false;
        }
    }

    private void getResponse(ACTransaction tr) {
        final CustomDialog dialog = new CustomDialog(SettingActivity.this);
        String result = "";
        respone = tr.getResponse();
        if ("".equals(kind))
            return;

        if ("logout".equals(kind)){
            result = respone.optString("result");
            if ("1".equals(result)){
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setMsg(getString(R.string.dialog_msg_18));
                dialog.setOne(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        C2Preference.setLoginID(SettingActivity.this, "");
                        C2Preference.setLoginPW(SettingActivity.this, "");
                        C2Preference.setLoginRegiType(SettingActivity.this, "");
                        C2Preference.setDevice(SettingActivity.this, "");
                        LoginInfo.getInstance().clear();

                        if (("".equals(C2Preference.getLoginID(SettingActivity.this))) && ("".equals(C2Preference.getLoginPW(SettingActivity.this)))) {
                            Intent i = new Intent(SettingActivity.this, LoginActivity.class);
                            i.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                            i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                            startActivity(i);
                            finish();
                            dialog.dismiss();
                        }
                    }
                });
                dialog.setBtn(-1);
                dialog.show();
            }
        }

        if ("push".equals(kind)) {
            result = respone.optString("result");
            if ("1".equals(result)){
                if (pushSet) {
                    LoginInfo.getInstance().push_on = true;
                    btn_Push.setText("ON");
                    btn_Push.setTextColor(getResources().getColor(R.color.switch_on));
                    btn_Push.setBackground(getResources().getDrawable(R.drawable.switch_on));
                    btn_Push.setPadding((int) Util.getPxToDp(this, 18.3), 0, 0, 0);
                } else {
                    LoginInfo.getInstance().push_on = false;
                    btn_Push.setText("OFF");
                    btn_Push.setTextColor(getResources().getColor(R.color.switch_off));
                    btn_Push.setBackground(getResources().getDrawable(R.drawable.switch_off));
                    btn_Push.setPadding(0, 0, (int) Util.getPxToDp(this, 18.3), 0);
                }
            } else {
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setMsg(getString(R.string.dialog_msg_26));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
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
            getResponse(tr);
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_connect:
                startActivity(new Intent(SettingActivity.this, SettingDeviceActivity.class));
                break;

            case R.id.btn_pushsetting:
                String isPush = "";
                if (!pushSet) {
                    isPush = "true";
                    pushSet = true;
                } else {
                    isPush = "false";
                    pushSet = false;
                }
                tr = new ACTransaction(SettingActivity.this, "push");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("user_id", LoginInfo.getInstance().user_id);
                tr.setRequest("email", C2Preference.getLoginID(SettingActivity.this));
                tr.setRequest("push_on", isPush);
                C2HTTPProcessor.getInstance().sendToBLServer(tr);
                kind = "push";
                break;
            case R.id.btn_change_pw:
                String regiType = C2Preference.getLoginRegiType(SettingActivity.this);
                if (!"1".equals(regiType)) {
                    final CustomDialog dialog = new CustomDialog(SettingActivity.this);
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_30));
                    dialog.setBtn(-1);
                    dialog.setOk(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            dialog.dismiss();
                        }
                    });
                    dialog.show();
                    return;
                }

                startActivity(new Intent(SettingActivity.this, PasswordChangeActivity.class));
                break;

            case R.id.btn_baby_info:
                startActivity(new Intent(SettingActivity.this, ChangeBabyInfoActivity.class));
                break;

            case R.id.btn_logout:
                final CustomDialog mDialog = new CustomDialog(SettingActivity.this);
                mDialog.setTitle(getString(R.string.dialog_title_0));
                mDialog.setIcon(-1);
                mDialog.setMsg(getString(R.string.dialog_msg_17));
                mDialog.setBtn(0);
                mDialog.setOk(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        tr = new ACTransaction(SettingActivity.this, "logout");
                        tr.setConnectionURL(Config.SERVER_URL);
                        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
                        tr.setRequest("email", C2Preference.getLoginID(SettingActivity.this));
                        C2HTTPProcessor.getInstance().sendToBLServer(tr);
                        kind = "logout";
                        mDialog.dismiss();
                    }
                });
                mDialog.show();
                break;

            case R.id.btn_terms:
                startActivity(new Intent(SettingActivity.this, TermsActivity.class));
                break;

            case R.id.btn_health_history:
                startActivity(new Intent(SettingActivity.this, HealthHistoryActivity.class));
                break;
        }
    }
}
