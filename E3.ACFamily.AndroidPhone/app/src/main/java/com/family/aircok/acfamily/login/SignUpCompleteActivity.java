package com.family.aircok.acfamily.login;

import android.os.Bundle;
import android.view.View;

import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;

public class SignUpCompleteActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up_complete);

//        setHeader(R.drawable.btn_nav_back_n_black, -1, R.string.title_sign_up, -1, R.color.title_color_black);

        setNewHeader(R.drawable.btn_nav_back_n_black, -1, R.string.title_sign_up, false, R.color.title_color_black);
    }


    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }
}
