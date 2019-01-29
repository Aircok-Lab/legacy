package com.baby.aircok.acbaby.login.sns.naver;

import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;

import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.login.sns.BaseSNS;
import com.nhn.android.naverlogin.OAuthLogin;
import com.nhn.android.naverlogin.OAuthLoginHandler;

import com.baby.aircok.acbaby.common.LogUtil;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by ssong on 2017. 7. 3..
 */

public class SNSNaver extends BaseSNS {

    private static OAuthLogin mOAuthLoginInstance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        String client_id = getString(R.string.naver_oauth_client_id);
        String client_secret = getString(R.string.naver_oauth_client_secret);
        String client_name = getString(R.string.naver_oauth_client_name);
        mOAuthLoginInstance = OAuthLogin.getInstance();
        mOAuthLoginInstance.init(this, client_id, client_secret, client_name);

        OAuthLoginHandler OAuthLoginHandler = new OAuthLoginHandler() {
            @Override
            public void run(boolean success) {
                LogUtil.LOGE("OAuthLoginHandler success : " + success);
                if (success) {
                    userInfo();
                } else {
                    String errorCode 	= mOAuthLoginInstance.getLastErrorCode(SNSNaver.this).getCode();
                    String errorDesc 	= mOAuthLoginInstance.getLastErrorDesc(SNSNaver.this);
                    LogUtil.LOGE(String.format("errorCode : %s, errorDesc : %s", errorCode, errorDesc));
                    setSNSResult(RESULT_CANCELED, null);
                }
            }
        };

        mOAuthLoginInstance.startOauthLoginActivity(this, OAuthLoginHandler);

    }

    @Override
    public void login() {
        super.login();
    }

    @Override
    protected void logout() {
        super.logout();
    }

    @Override
    public void userInfo() {
        super.userInfo();
        RequestApiTask task = new RequestApiTask();
        task.execute(null, null, null);
    }

    private class RequestApiTask extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {

            String url = "https://openapi.naver.com/v1/nid/me";
            String at = mOAuthLoginInstance.getAccessToken(SNSNaver.this);
            return mOAuthLoginInstance.requestApi(SNSNaver.this, at, url);
        }

        protected void onPostExecute(String content) {
            LogUtil.LOGE("onPostExecute content : " + content);
            try {
                JSONObject result = new JSONObject(content);
                String resultcode = result.optString("resultcode");
                if ( "00".endsWith(resultcode) ) {
                    //성공
                    JSONObject response = result.optJSONObject("response");
                    mEmail = response.optString("email");
                }
            } catch (JSONException e) {
                e.printStackTrace();
                setSNSResult(RESULT_CANCELED, null);
            }

            if (!TextUtils.isEmpty(mEmail)) {
                setSNSResult(RESULT_OK, mEmail);
            }
            else {
                setSNSResult(RESULT_CANCELED, null);
            }
        }
    }
}
