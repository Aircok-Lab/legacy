package com.family.aircok.acfamily.menu.setting;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.family.aircok.acfamily.ACFApplication;
import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.C2Preference;
import com.family.aircok.acfamily.common.Config;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.LoginInfo;
import com.family.aircok.acfamily.common.Util;
import com.family.aircok.acfamily.common.widget.CustomDialog;
import com.family.aircok.acfamily.common.widget.SettingDeviceDialog;
import com.family.aircok.acfamily.login.ChangePasswordActivity;
import com.family.aircok.acfamily.login.LoginActivity;
import com.family.aircok.acfamily.login.PasswordActivity;
import com.family.aircok.acfamily.main.MainActivity;
import com.family.aircok.acfamily.menu.ChangeUserInfoActivity;
import com.family.aircok.acfamily.menu.TermsInfoActivity;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.ACTransaction;

import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Created by ssong on 2017. 4. 24..
 */

public class SettingActivity extends BaseActivity implements View.OnClickListener, SettingDeviceDialog.Delegate {

    private TextView mDeivceName, mUserEmail, mVersion;
    private Button btn_Push, btn_contin;
    private boolean pushSet = false;
    private boolean continSet = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_setting);
        setNewHeader(R.drawable.btn_nav_back_n, -1, R.string.menu_title4, false, -1);

        setDeviceName();
        btn_Push = (Button) findViewById(R.id.btn_pushsetting);
        btn_contin = (Button) findViewById(R.id.btn_continsetting);

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


        LogUtil.LOGE("Util.getVersion(this): " + Util.getVersion(this));
        LogUtil.LOGE("SettingActivity C2Preference.getDevice(this): " + C2Preference.getDevice(this));
    }

    private void setDeviceName() {
        mUserEmail = (TextView) findViewById(R.id.email);
        mUserEmail.setText(C2Preference.getLoginID(this));

        mDeivceName = (TextView) findViewById(R.id.deivce_name);
        mDeivceName.setText(C2Preference.getDevice(this));

        String version = ((ACFApplication)getApplication()).getVersionName();
        mVersion = (TextView) findViewById(R.id.aircok_version);
        mVersion.setText(version);
    }

    @Override
    protected void onResume() {
        super.onResume();
        setDeviceName();
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    private void responsePush (ACTransaction tr) {
        JSONObject respone = tr.getResponse();
        String result = "";
        result = respone.optString("result");
        if ("1".equals(result)){
            if (pushSet) {
                LoginInfo.getInstance().push_on = true;
                btn_Push.setText("ON");
                btn_Push.setTextColor(getResources().getColor(R.color.switch_on));
                btn_Push.setBackground(getResources().getDrawable(R.drawable.switch_on));
                btn_Push.setPadding((int) Util.getPxToDp(this, 18.3),0,0,0);
            } else {
                LoginInfo.getInstance().push_on = false;
                btn_Push.setText("OFF");
                btn_Push.setTextColor(getResources().getColor(R.color.switch_off));
                btn_Push.setBackground(getResources().getDrawable(R.drawable.switch_off));
                btn_Push.setPadding(0,0, (int) Util.getPxToDp(this, 18.3), 0);
            }
        } else {
            final CustomDialog dialog = new CustomDialog(SettingActivity.this);
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setMsg(getString(R.string.dialog_msg_26));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.show();
        }
    }

    private void responseLogout (ACTransaction tr) {
        JSONObject respone = tr.getResponse();
        String result = "";
        result = respone.optString("result");
        LogUtil.LOGE("SettingActivity kind logout result: " + result);
        if ("1".equals(result)){
            final CustomDialog dialog = new CustomDialog(SettingActivity.this);
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(R.drawable.icon_logout);
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

    private void responseAircok(ACTransaction tr) {
        JSONObject respone = tr.getResponse();
        String result = "";
        result = respone.optString("result");
        progressStop();
        if ("1".equals(result)){
            setDeviceName();
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
            if (tr.getCode().equals("logout")){
                responseLogout(tr);
            }
            if (tr.getCode().equals("push")){
                responsePush(tr);
            }
            if (tr.getCode().equals("aircok")){
                responseAircok(tr);
            }
        }
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }

    public void showSettingDeviceDialog() {
        SettingDeviceDialog dialog = new SettingDeviceDialog(this);
        dialog.setDelegate(this);
        dialog.show();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_connect:
                LogUtil.LOGE("setting connect");
                showSettingDeviceDialog();
                //startActivity(new Intent(SettingActivity.this, ConnectDeviceActivity.class));
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
                ACTransaction tr = new ACTransaction(SettingActivity.this, "push");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("user_id", LoginInfo.getInstance().user_id);
                tr.setRequest("email", C2Preference.getLoginID(SettingActivity.this));
                tr.setRequest("push_on", isPush);
                C2HTTPProcessor.getInstance().sendToBLServer(tr);
                break;

            case R.id.btn_continsetting:
                if (!continSet) {
                    btn_contin.setText("ON");
                    btn_contin.setTextColor(getResources().getColor(R.color.switch_on));
                    btn_contin.setBackground(getResources().getDrawable(R.drawable.switch_on));
                    btn_contin.setPadding((int) Util.getPxToDp(this, 18.3),0,0,0);
                    continSet = true;
                } else {
                    btn_contin.setText("OFF");
                    btn_contin.setTextColor(getResources().getColor(R.color.switch_off));
                    btn_contin.setBackground(getResources().getDrawable(R.drawable.switch_off));
                    btn_contin.setPadding(0,0, (int) Util.getPxToDp(this, 18.3), 0);
                    continSet = false;
                }
                break;

            case R.id.setting_change_pw:
                Intent intent = new Intent(SettingActivity.this, ChangePasswordActivity.class);
                startActivity(intent);
                break;

            case R.id.setting_logout:
                final CustomDialog mDialog = new CustomDialog(SettingActivity.this);
                mDialog.setTitle(getString(R.string.dialog_title_0));
                mDialog.setIcon(R.drawable.icon_logout);
                mDialog.setMsg(getString(R.string.dialog_msg_17));
                mDialog.setBtn(0);
                mDialog.setOk(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        ACTransaction tr = new ACTransaction(SettingActivity.this, "logout");
                        tr.setConnectionURL(Config.SERVER_URL);
                        tr.setRequest("email", C2Preference.getLoginID(SettingActivity.this));
                        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
                        C2HTTPProcessor.getInstance().sendToBLServer(tr);
                        mDialog.dismiss();
                    }
                });
                mDialog.show();
                break;

            case R.id.setting_terms_info:
                startActivity(new Intent(SettingActivity.this, TermsInfoActivity.class));
                break;

            case R.id.setting_change_userinfo:
                startActivity(new Intent(SettingActivity.this, ChangeUserInfoActivity.class));
                break;
        }
    }

    public void onSelectedDevice(String deviceID, String deviceFID) {
        progressStart();
        ACTransaction tr = new ACTransaction(this, "aircok");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("email", C2Preference.getLoginID(this));
        tr.setRequest("aircok_id", deviceID);
        tr.setRequest("aircok_fid", deviceFID);
        tr.setRequest("aircok_type", "family");
        JSONObject location = new JSONObject();
        try {
            JSONArray coordinate = new JSONArray();
            coordinate.put(Util.getLatitude());
            coordinate.put(Util.getLongitude());
            String address = Util.getAddress(this, Util.getLatitude(), Util.getLongitude());
            location.put("address", address);
            location.put("coordinate", coordinate);
            location.put("country", "대한민국");

            String[] data = address.split(" ");
            for (int i = 0 ; i < data.length; i++){
                LogUtil.LOGE("address split: " + data[i]);
                if (null != data[i]) {
                    if (i == 0)
                        location.put("locality", data[0]);
                    if (i == 1)
                        location.put("sublocality_lv1", data[1]);
                    if (i == 2)
                        location.put("sublocality_lv2", data[2]);
                    if (i == 3)
                        location.put("political", data[3]);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        tr.setRequest("location", location);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }
}
