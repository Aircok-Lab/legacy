package com.family.aircok.acfamily.login.sns.facebook;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.login.sns.BaseSNS;

import org.json.JSONObject;

import java.util.Arrays;

/**
 * Created by CHJ on 2017. 6. 27..
 */

public class SNSFacebook extends BaseSNS {

    private CallbackManager mCallbackManager;
    private AccessToken mAccessToken;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FacebookSdk.sdkInitialize(getApplicationContext());

        mCallbackManager = CallbackManager.Factory.create();
        LoginManager.getInstance().logInWithReadPermissions(this, Arrays.asList("public_profile"));
        LoginManager.getInstance().logInWithReadPermissions(this, Arrays.asList("email"));
        LoginManager.getInstance().registerCallback(mCallbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                LogUtil.LOGE("onSuccess");
                mAccessToken = loginResult.getAccessToken();
                userInfo();
            }

            @Override
            public void onCancel() {
                LogUtil.LOGE("onCancel");
                setSNSResult(RESULT_CANCELED, null);
            }

            @Override
            public void onError(FacebookException error) {
                LogUtil.LOGE("onError");
                setSNSResult(RESULT_CANCELED, null);
            }
        });

    }

    @Override
    protected void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void login() {
        super.login();
    }

    @Override
    protected void logout() {
        super.logout();
        LoginManager.getInstance().logOut();
    }

    @Override
    protected void userInfo() {
        super.userInfo();
        GraphRequest request = GraphRequest.newMeRequest(mAccessToken, new GraphRequest.GraphJSONObjectCallback() {
            @Override
            public void onCompleted(JSONObject user, GraphResponse graphResponse) {
                mEmail = user.optString("email");
                if (!TextUtils.isEmpty(mEmail)) {
                    setSNSResult(RESULT_OK, mEmail);
                }
                else {
                    setSNSResult(RESULT_CANCELED, null);
                }
            }
        });

        Bundle parameters = new Bundle();
        parameters.putString("fields", "id,name,email,gender");
        request.setParameters(parameters);
        request.executeAsync();
    }
}
