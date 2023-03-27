package com.family.aircok.acfamily.login.sns.kakao;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.login.sns.BaseSNS;
import com.kakao.auth.AuthType;
import com.kakao.auth.ISessionCallback;
import com.kakao.auth.Session;
import com.kakao.network.ErrorResult;
import com.kakao.usermgmt.UserManagement;
import com.kakao.usermgmt.callback.MeResponseCallback;
import com.kakao.usermgmt.response.model.UserProfile;
import com.kakao.util.exception.KakaoException;


/**
 * Created by CHJ on 2017. 6. 22..
 */

public class SNSKakao extends BaseSNS {

    private Session mSession;
    private SessionCallback mCallback;

    private class SessionCallback implements ISessionCallback {
        @Override
        public void onSessionOpened() {
            LogUtil.LOGE("onSessionOpened");
            userInfo();
        }

        @Override
        public void onSessionOpenFailed(KakaoException exception) {
            LogUtil.LOGE("onSessionOpenFailed");
            setSNSResult(RESULT_CANCELED, null);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mCallback = new SessionCallback();
        mSession = Session.getCurrentSession();
        mSession.addCallback(mCallback);
        boolean isCheck = mSession.checkAndImplicitOpen();
        if (!isCheck) {
            mSession.open(AuthType.KAKAO_LOGIN_ALL, this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mSession.removeCallback(mCallback);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //간편로그인시 호출 ,없으면 간편로그인시 로그인 성공화면으로 넘어가지 않음
        if (Session.getCurrentSession().handleActivityResult(requestCode, resultCode, data)) {
            return;
        }

        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void login() {
        super.login();
    }

    @Override
    protected void logout() {
        super.logout();
    }

    public void userInfo() {
        UserManagement.getInstance().requestMe(new MeResponseCallback() {
            @Override
            public void onFailure(ErrorResult errorResult) {
                LogUtil.LOGE("onFailure");
            }

            @Override
            public void onSessionClosed(ErrorResult errorResult) {
                LogUtil.LOGE("onSessionClosed");
            }

            @Override
            public void onSuccess(UserProfile userProfile) {
                mEmail = userProfile.getEmail();
                if (!TextUtils.isEmpty(mEmail)) {
                    setSNSResult(RESULT_OK, mEmail);
                }
                else {
                    setSNSResult(RESULT_CANCELED, null);
                }
            }

            @Override
            public void onNotSignedUp() {
                LogUtil.LOGE("onNotSignedUp");
            }
        });
    }

}
