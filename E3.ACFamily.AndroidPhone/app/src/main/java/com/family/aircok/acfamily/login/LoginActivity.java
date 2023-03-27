package com.family.aircok.acfamily.login;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.Html;
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
import com.family.aircok.acfamily.common.Util;
import com.family.aircok.acfamily.common.widget.CustomDialog;
import com.family.aircok.acfamily.login.sns.BaseSNS;
import com.family.aircok.acfamily.login.sns.facebook.SNSFacebook;
import com.family.aircok.acfamily.login.sns.google.SNSGoogle;
import com.family.aircok.acfamily.login.sns.kakao.SNSKakao;
import com.family.aircok.acfamily.login.sns.naver.SNSNaver;
import com.family.aircok.acfamily.main.MainActivity;
import com.family.aircok.acfamily.menu.TermsInfoActivity;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.ACTransaction;

import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class LoginActivity extends BaseActivity implements View.OnClickListener{

    private static final int REQUEST_CODE_KAKAO = 2000;
    private static final int REQUEST_CODE_NAVER = 2001;
    private static final int REQUEST_CODE_FACEBOOK = 2002;
    private static final int REQUEST_CODE_GOOGLE = 2003;
    private static final int REQUEST_CODE_TERMS= 2004;

    private TextView loginText, joinText, guideText;
    private JSONObject respone;
    private EditText mInputEmail, mInputPw, mInputPw2, mInputBirth, mInputId, mInputPassword;
    private boolean isCheckPw = false;
    private boolean isChkEmail = false;
    private String kind = "";
    private String mId = "";
    private String mPw = "";
    private int mRegiType = -1;
    private boolean isJoin = false;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        setNewHeader(0, -1, 0, false, -1);

        loginText = (TextView) findViewById(R.id.text_login);
        joinText = (TextView) findViewById(R.id.text_join);
        guideText = (TextView) findViewById(R.id.guide_text3);
        guideText.setText(Html.fromHtml(getResources().getString(R.string.login_guide1)));

        //로그인
        mInputId = (EditText) findViewById(R.id.input_id);
        mInputPassword = (EditText) findViewById(R.id.input_password);
        //회원가입
        mInputEmail = (EditText) findViewById(R.id.input_email);
        mInputPw = (EditText) findViewById(R.id.input_join_password);
        mInputPw2 = (EditText) findViewById(R.id.input_join_confirm_password);
        mInputBirth = (EditText) findViewById(R.id.input_join_birth);

        mInputPw2.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if ("".equals(mInputPw.getText().toString()))
                    return;

                if (mInputPw.getText().toString().equals(mInputPw2.getText().toString())){
                    findViewById(R.id.same_password).setVisibility(View.VISIBLE);
                    isCheckPw = true;
                } else {
                    findViewById(R.id.same_password).setVisibility(View.INVISIBLE);
                    isCheckPw = false;
                }
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        isCheckPw = false;
        mInputId.setText("");
        mInputPassword.setText("");
        mInputEmail.setText("");
        mInputPw.setText("");
        mInputPw2.setText("");
        mInputBirth.setText("");
    }

    @Override
    protected void onPause() {
        super.onPause();
        isCheckPw = false;
        mInputId.setText("");
        mInputPassword.setText("");
        mInputEmail.setText("");
        mInputPw.setText("");
        mInputPw2.setText("");
        mInputBirth.setText("");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        isCheckPw = false;
        mInputId.setText("");
        mInputPassword.setText("");
        mInputEmail.setText("");
        mInputPw.setText("");
        mInputPw2.setText("");
        mInputBirth.setText("");
    }

//    @Override
//    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//        if (Session.getCurrentSession().handleActivityResult(requestCode, resultCode, data)) {
//            return;
//        }
//
//        super.onActivityResult(requestCode, resultCode, data);
//    }


    private void getResponse(ACTransaction tr){

        final CustomDialog dialog = new CustomDialog(LoginActivity.this);
        String result = "";
        respone = tr.getResponse();
        LogUtil.LOGE("LoginActivity getResponse: " + respone.toString() + " kind: " + kind);

        if ("".equals(kind)) {
            if (tr.getCode().equals("regist")) {
                responseRegist(tr);
            }
            return;
        }

        if ("regist".equals(kind)) {
            result = respone.optString("result");
            LogUtil.LOGE("check regist result: " + result);
            if ("1".equals(result)) {
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_20));
                dialog.setOne(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        findViewById(R.id.login_layout).setVisibility(View.VISIBLE);
                        findViewById(R.id.join_layout).setVisibility(View.GONE);
                        findViewById(R.id.login_arrow).setVisibility(View.VISIBLE);
                        findViewById(R.id.join_arrow).setVisibility(View.INVISIBLE);
                        findViewById(R.id.same_password).setVisibility(View.INVISIBLE);
                        loginText.setTextColor(getResources().getColor(R.color.white));
                        joinText.setTextColor(getResources().getColor(R.color.black333333));
                        isCheckPw = false;
                        mInputId.setText("");
                        mInputPassword.setText("");
                        mInputEmail.setText("");
                        mInputPw.setText("");
                        mInputPw2.setText("");
                        mInputBirth.setText("");
                        dialog.dismiss();
                    }
                });
                dialog.show();
            } else if ("2".equals(result)) {
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_21));
                dialog.show();

            } else {
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_8));
                dialog.show();
            }

        } else if ("email".equals(kind)) {
            result = respone.optString("result");
            LogUtil.LOGE("check email result: " + result);
            if ("0".equals(result)) {
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_6));
                dialog.setOne(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        isChkEmail = true;
                        LogUtil.LOGE("check email isChkEmail: " + isChkEmail);
                        dialog.dismiss();
                    }
                });
                dialog.show();
            } else if ("1".equals(result)) {
                isChkEmail = false;
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_7));
                dialog.show();
            } else {
                isChkEmail = false;
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_8));
                dialog.show();
                LogUtil.LOGE("check email isChkEmail: " + isChkEmail);
            }

        } else if ("login".equals(kind)) {
            result = respone.optString("result");
            LogUtil.LOGE("check login result: " + result);
            if ("0".equals(result)) {
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_30));
                dialog.show();
            } else if ("1".equals(result)) {
                C2Preference.setLoginID(this, mId);
                C2Preference.setLoginPW(this, mPw);
                C2Preference.setLoginRegiType(this, "1");

                LoginInfo.getInstance().load(respone);
                LogUtil.LOGE("C2Preference.getLoginID(this): " + C2Preference.getLoginID(this));
                LogUtil.LOGE("C2Preference.getLoginPW(this): " + C2Preference.getLoginPW(this));
                LogUtil.LOGE("LoginInfo.getUserID(): " + LoginInfo.getInstance().user_id);


                Intent i = new Intent(this, MainActivity.class);
                i.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(i);
                finish();
            } else if ("2".equals(result)) {
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_9));
                dialog.show();
            } else {
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_8));
                dialog.show();
            }
        } else if ("snslogin".equals(kind)){
            result = respone.optString("result");
            LogUtil.LOGE("snslogin result: " + result);
            if ("1".equals(result)) {
                C2Preference.setLoginID(this, mId);
                C2Preference.setLoginPW(this, mPw);
                C2Preference.setLoginRegiType(this, String.valueOf(mRegiType));

                LoginInfo.getInstance().load(respone);
                LogUtil.LOGE("C2Preference.getLoginID(this): " + C2Preference.getLoginID(this));
                LogUtil.LOGE("C2Preference.getLoginPW(this): " + C2Preference.getLoginPW(this));
                LogUtil.LOGE("C2Preference.getLoginRegiType(this): " + C2Preference.getLoginRegiType(this));

                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_27));
                dialog.setOne(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if (isJoin) {
                            Intent i = new Intent(LoginActivity.this, SocialSignUpCompleteActivity.class);
                            i.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                            startActivity(i);
                            finish();
                        }
                        else {
                            Intent i = new Intent(LoginActivity.this, MainActivity.class);
                            i.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                            startActivity(i);
                            finish();
                        }
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
        CustomDialog dialog;
        ACTransaction tr;
        switch (v.getId()) {
            case R.id.login:
                findViewById(R.id.login_layout).setVisibility(View.VISIBLE);
                findViewById(R.id.join_layout).setVisibility(View.GONE);
                findViewById(R.id.login_arrow).setVisibility(View.VISIBLE);
                findViewById(R.id.join_arrow).setVisibility(View.INVISIBLE);
                loginText.setTextColor(getResources().getColor(R.color.white));
                joinText.setTextColor(getResources().getColor(R.color.black333333));
                break;
            case R.id.join:
                Intent i = new Intent(this, TermsInfoActivity.class);
                i.putExtra("Sign_Up", "sign");
                startActivityForResult(i, REQUEST_CODE_TERMS);

                findViewById(R.id.login_layout).setVisibility(View.GONE);
                findViewById(R.id.join_layout).setVisibility(View.VISIBLE);
                findViewById(R.id.login_arrow).setVisibility(View.INVISIBLE);
                findViewById(R.id.join_arrow).setVisibility(View.VISIBLE);
                loginText.setTextColor(getResources().getColor(R.color.black333333));
                joinText.setTextColor(getResources().getColor(R.color.white));
                break;
            case R.id.btn_login:
                //로그인
                dialog = new CustomDialog(LoginActivity.this);
                if ("".equals(mInputId.getText().toString())) {
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_3));
                    dialog.show();
                    return;
                } else if (!mInputId.getText().toString().contains("@")){
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_16));
                    dialog.show();
                    return;
                } else if ("".equals(mInputPassword.getText().toString())) {
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_0));
                    dialog.show();
                    return;
                }
                mId = mInputId.getText().toString();
                mPw = AES256Cipher.encode(Config.AES256_KEY, mInputPassword.getText().toString());
                mRegiType = 1;
                tr = new ACTransaction(LoginActivity.this, "login");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("email", mId);
                tr.setRequest("passwd", mPw);
                tr.setRequest("regi_type", mRegiType);
                C2HTTPProcessor.getInstance().sendToBLServer(tr);
                kind = "login";
                break;
            case R.id.findpassword:
                //비밀번호찾기
                startActivity(new Intent(LoginActivity.this, PasswordActivity.class));
                break;
            case R.id.btn_dodublecheck:
                //이메일 중복 확인
                dialog = new CustomDialog(LoginActivity.this);
                if ("".equals(mInputEmail.getText().toString())){
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_1));
                    dialog.show();
                    return;
                } else if (!mInputEmail.getText().toString().contains("@")){
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_16));
                    dialog.show();
                    return;
                } else if (mInputEmail.getText().toString().startsWith(" ")){
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_30));
                    dialog.show();
                    return;
                } else if (mInputEmail.getText().toString().endsWith(" ")){
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_30));
                    dialog.show();
                    return;
                }

                tr = new ACTransaction(LoginActivity.this, "email");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("email", mInputEmail.getText().toString());
                C2HTTPProcessor.getInstance().sendToBLServer(tr);
                kind = "email";
                break;
            case R.id.btn_join:
                //가입하기
                dialog = new CustomDialog(LoginActivity.this);
                if ("".equals(mInputBirth.getText().toString())) {
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_2));
                    dialog.show();
                    return;
                } else if (mInputBirth.getText().toString().length() != 8) {
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_19));
                    dialog.show();
                    return;
                } else if ("".equals(mInputPw.getText().toString()) || "".equals(mInputPw2.getText().toString())){
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_0));
                    dialog.show();
                    isCheckPw = false;
                    return;
                } else if (!isCheckPw) {
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_4));
                    dialog.show();
                    return;
                } else if (!isChkEmail) {
                    dialog.setTitle(getString(R.string.dialog_title_0));
                    dialog.setIcon(-1);
                    dialog.setBtn(-1);
                    dialog.setMsg(getString(R.string.dialog_msg_5));
                    dialog.show();
                    return;
                }

                tr = new ACTransaction(LoginActivity.this, "regist");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("email", mInputEmail.getText().toString());
                tr.setRequest("passwd", AES256Cipher.encode(Config.AES256_KEY, mInputPw.getText().toString()));
                tr.setRequest("regi_type", 1);
                tr.setRequest("sns_id", "");
                tr.setRequest("sns_name", "");
                tr.setRequest("sex", "");
                tr.setRequest("baby_yymm", mInputBirth.getText().toString());
                tr.setRequest("baby_name", "");
                tr.setRequest("push_on", "");
                tr.setRequest("device_id", Util.getAndroidID(this));
                tr.setRequest("hw_model", Util.getPhoneName());
                tr.setRequest("os_version", Util.getAndroidVersion());
                tr.setRequest("app_version", Util.getVersion(LoginActivity.this));

                JSONObject location = new JSONObject();
                JSONArray coordinate = new JSONArray();
                try {
                    coordinate.put(0);
                    coordinate.put(0);
                    location.put("address", "");
                    location.put("coordinate", coordinate);
                    location.put("country", "");
                    location.put("locality", "");
                    location.put("sublocality_lv1", "");
                    location.put("sublocality_lv2", "");
                    location.put("political", "");
                } catch (JSONException e){
                    e.printStackTrace();
                }

                tr.setRequest("location", location);
                C2HTTPProcessor.getInstance().sendToBLServer(tr);
                kind = "regist";

                break;
            case R.id.join_kakao:
            case R.id.join_kakao2:
                startSNSActivity(SNSKakao.class);
                break;
            case R.id.join_naver:
            case R.id.join_naver2:
                startSNSActivity(SNSNaver.class);
                break;
            case R.id.join_facebook:
            case R.id.join_facebook2:
                startSNSActivity(SNSFacebook.class);
                break;
            case R.id.join_google:
            case R.id.join_google2:
                startSNSActivity(SNSGoogle.class);
                break;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {
            if (requestCode == REQUEST_CODE_TERMS)
                return;

            mId = data.getStringExtra(BaseSNS.KEY_RESULT);
            if (requestCode == REQUEST_CODE_KAKAO) {
                mRegiType = 3;
            }
            else if (requestCode == REQUEST_CODE_NAVER) {
                mRegiType  = 4;
            }
            else if (requestCode == REQUEST_CODE_FACEBOOK) {
                mRegiType  = 2;
            }
            else if (requestCode == REQUEST_CODE_GOOGLE) {
                mRegiType  = 5;
            }
            mPw = "";
            requestRegist(mId, mRegiType, "");
        }
        else if (resultCode == RESULT_CANCELED) {
            if (requestCode == REQUEST_CODE_TERMS) {
                findViewById(R.id.login_layout).setVisibility(View.VISIBLE);
                findViewById(R.id.join_layout).setVisibility(View.GONE);
                findViewById(R.id.login_arrow).setVisibility(View.VISIBLE);
                findViewById(R.id.join_arrow).setVisibility(View.INVISIBLE);
                loginText.setTextColor(getResources().getColor(R.color.white));
                joinText.setTextColor(getResources().getColor(R.color.black333333));
            } else {
                CustomDialog dialog = new CustomDialog(LoginActivity.this);
                dialog.setTitle(getString(R.string.dialog_title_0));
                dialog.setIcon(-1);
                dialog.setBtn(-1);
                dialog.setMsg(getString(R.string.dialog_msg_28));
                dialog.show();
            }
        }
    }

    private void startSNSActivity(Class clazz) {
        int requestCode = 0;
        if (clazz == SNSKakao.class) {
            requestCode = REQUEST_CODE_KAKAO;
        }
        else if (clazz == SNSNaver.class) {
            requestCode = REQUEST_CODE_NAVER;
        }
        else if (clazz == SNSFacebook.class) {
            requestCode = REQUEST_CODE_FACEBOOK;
        }
        else if (clazz == SNSGoogle.class) {
            requestCode = REQUEST_CODE_GOOGLE;
        }

        if (requestCode != 0) {
            Intent intent = new Intent(this, clazz);
            startActivityForResult(intent, requestCode);
        }
    }

    private void requestRegist(String sns_id, int regi_type, String sns_name) {
        ACTransaction tr = new ACTransaction(LoginActivity.this, "regist");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("email", sns_id);
        tr.setRequest("passwd", "");
        tr.setRequest("regi_type", regi_type);
        tr.setRequest("sns_id", sns_id);
        tr.setRequest("sns_name", sns_name);
        tr.setRequest("sex", "");
        tr.setRequest("baby_yymm", "");
        tr.setRequest("baby_name", "");
        tr.setRequest("push_on", "");
        tr.setRequest("device_id", Util.getAndroidID(this));
        tr.setRequest("hw_model", Util.getPhoneName());
        tr.setRequest("os_version", Util.getAndroidVersion());
        tr.setRequest("app_version", Util.getVersion(LoginActivity.this));

        JSONObject location = new JSONObject();
        JSONArray coordinate = new JSONArray();
        try {
            coordinate.put(0);
            coordinate.put(0);
            location.put("address", "");
            location.put("coordinate", coordinate);
            location.put("country", "");
            location.put("locality", "");
            location.put("sublocality_lv1", "");
            location.put("sublocality_lv2", "");
            location.put("political", "");
        } catch (JSONException e){
            e.printStackTrace();
        }

        tr.setRequest("location", location);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
        kind = "";
    }

    private void responseRegist(ACTransaction tr) {
        isJoin = false;
        final CustomDialog dialog = new CustomDialog(LoginActivity.this);
        JSONObject response = tr.getResponse();
        String result = respone.optString("result");
        LogUtil.LOGE("check regist result: " + result);
        if ("1".equals(result)) {
            isJoin = true;
            requestLogin(mId, "", mRegiType);
        } else if ("2".equals(result)) {
            if (mRegiType == response.optInt("regi_type")) {
                requestLogin(mId, "", mRegiType);
                return;
            }

            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_21));
            dialog.show();
        } else {
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_8));
            dialog.show();
        }
    }

    private void requestLogin(String email, String passwd, int regi_type) {
        ACTransaction tr = new ACTransaction(LoginActivity.this, "login");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("email", email);
        tr.setRequest("passwd", passwd);
        tr.setRequest("regi_type", regi_type);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
        kind = "snslogin";
    }
}
