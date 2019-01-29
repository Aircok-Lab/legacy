package com.baby.aircok.acbaby.intro;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.C2Preference;
import com.baby.aircok.acbaby.common.Config;
import com.baby.aircok.acbaby.common.LoginInfo;
import com.baby.aircok.acbaby.common.Util;
import com.baby.aircok.acbaby.login.LoginActivity;
import com.baby.aircok.acbaby.main.MainActivity;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.ACTransaction;

import com.baby.aircok.acbaby.common.LogUtil;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONObject;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import static com.kakao.util.helper.Utility.getPackageInfo;

/**
 * Created by CHO on 2016. 10. 11..
 */

public class IntroActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_intro);

        initData();
        requestAppVersion();
    }

    private void initData() {
        Config.sAppName = getString(R.string.app_name);
        LoginInfo.getInstance().clear();
    }

    private void loginStep() {
        String email = C2Preference.getLoginID(IntroActivity.this);
        String passwd = C2Preference.getLoginPW(IntroActivity.this);
        String regi_type = C2Preference.getLoginRegiType(IntroActivity.this);
        int regi = -1;
        if (!regi_type.equals("")) {
            regi = Integer.parseInt(regi_type);
        }

        requestLogin(email, passwd, regi);
    }

    public static String getKeyHash(final Context context) {
        PackageInfo packageInfo = getPackageInfo(context, PackageManager.GET_SIGNATURES);
        if (packageInfo == null)
            return null;

        for (Signature signature : packageInfo.signatures) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                String keyHash = Base64.encodeToString(md.digest(), Base64.NO_WRAP);
                LogUtil.LOGE("keyHash : " + keyHash);
                return keyHash;
            } catch (NoSuchAlgorithmException e) {
            }
        }
        return null;
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
            if (tr.getCode().equals("login")){
                reponseLogin(tr);
            }
            if (tr.getCode().equals("version")){
                reponseAppVersion(tr);
            }
        }
    }

    private void requestAppVersion() {
        ACTransaction tr = new ACTransaction(IntroActivity.this, "version");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("aircok_type", "baby");
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void reponseAppVersion(ACTransaction tr) {
        JSONObject respone = tr.getResponse();
        String result = respone.optString("result");
        if ("1".equals(result)) {
            int server_version = Util.convertVersionToInt(respone.optString("android"));
            int client_version = Util.convertVersionToInt(Util.getVersion(this));

            if (server_version > client_version) {
                showAlert(getString(R.string.dialog_title_0), getString(R.string.alert_app_update_message), -1, getString(R.string.common_ok),
                        getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                if (which == 0) {
                                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + getPackageName())));
                                }
                                else {
                                    loginStep();
                                }
                            }
                        });
                return;
            }
        }
        loginStep();
    }

    private void requestLogin(String email, String passwd, int regi_type) {
        ACTransaction tr = new ACTransaction(IntroActivity.this, "login");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("email", email);
        tr.setRequest("passwd", passwd);
        tr.setRequest("regi_type", regi_type);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void reponseLogin(ACTransaction tr) {
        String result = "";
        JSONObject respone = tr.getResponse();

        result = respone.optString("result");
        if ("1".equals(result)){
            LoginInfo.getInstance().load(respone);
            startActivity(new Intent(IntroActivity.this, MainActivity.class));
        } else {
            startActivity(new Intent(IntroActivity.this, LoginActivity.class));
        }
        finish();
    }
}
