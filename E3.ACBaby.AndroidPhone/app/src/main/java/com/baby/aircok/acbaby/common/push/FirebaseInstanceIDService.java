package com.baby.aircok.acbaby.common.push;

import com.baby.aircok.acbaby.common.C2Preference;
import com.baby.aircok.acbaby.common.LogUtil;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;


/**
 * Created by ssong on 2017. 8. 4..
 */

public class FirebaseInstanceIDService extends FirebaseInstanceIdService {

    // [START refresh_token]
    @Override
    public void onTokenRefresh() {
        // Get updated InstanceID token.
        String token = FirebaseInstanceId.getInstance().getToken();
        LogUtil.LOGE("Refreshed token: " + token);

        if (token != null) {
            if (!token.equals(C2Preference.getDevice(this))){
                C2Preference.setPushToken(this, token);
            }
        }
        // 생성등록된 토큰을 개인 앱서버에 보내 저장해 두었다가 추가 뭔가를 하고 싶으면 할 수 있도록 한다.
    }

}
