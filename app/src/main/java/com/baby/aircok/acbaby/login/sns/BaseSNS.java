package com.baby.aircok.acbaby.login.sns;

import android.content.Intent;
import android.os.Bundle;

import com.baby.aircok.acbaby.BaseActivity;

/**
 * Created by ssong on 2017. 6. 30..
 */

public class BaseSNS  extends BaseActivity {

    public static final String KEY_RESULT = "result";
    protected String mEmail;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        ImageView view = new ImageView(this);
//        view.setBackgroundColor(Color.TRANSPARENT);
//        setContentView(view);
//        getWindow().setbac

    }

    protected void login() {}
    protected void logout() {}
    protected void userInfo() {}

    protected void setSNSResult(int resultCode, String result){
        Intent intent = new Intent();
        if (result != null) {
            intent.putExtra(KEY_RESULT, result);
        }
        setResult(resultCode, intent);
        finish();
    }
}