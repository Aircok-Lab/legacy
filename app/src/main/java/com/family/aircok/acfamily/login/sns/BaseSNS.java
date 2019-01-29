package com.family.aircok.acfamily.login.sns;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.WindowManager;
import android.widget.ImageView;

import com.family.aircok.acfamily.BaseActivity;

/**
 * Created by CHJ on 2017. 6. 22..
 */

public class BaseSNS extends BaseActivity {

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
