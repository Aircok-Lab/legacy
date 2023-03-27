package com.baby.aircok.acbaby.intro;

import android.content.Intent;
import android.location.Address;
import android.os.Bundle;
import android.view.View;


import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.Util;
import com.baby.aircok.acbaby.common.widget.CXSeekBar;
import com.baby.aircok.acbaby.login.LoginActivity;
import com.baby.aircok.acbaby.login.PasswordChangeActivity;
import com.baby.aircok.acbaby.login.SocialSignUpCompleteActivity;
import com.baby.aircok.acbaby.menu.ChangeBabyInfoActivity;

import com.baby.aircok.acbaby.common.LogUtil;

import java.util.List;

/**
 * Created by CHO on 2016. 10. 18..
 */

public class TestActivity extends BaseActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test);

        CXSeekBar seekbar = (CXSeekBar) findViewById(R.id.seekbar);
        seekbar.setProgress(100);

        List<Address> list = Util.getLocationList(this, "작전동");
        for (Address addr : list) {
            LogUtil.LOGE("addr :" + addr.toString());
        }

        findViewById(R.id.login).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(TestActivity.this, LoginActivity.class));
            }
        });

        findViewById(R.id.change).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(TestActivity.this, ChangeBabyInfoActivity.class));
            }
        });

        findViewById(R.id.change_pw).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(TestActivity.this, PasswordChangeActivity.class));
            }
        });

        findViewById(R.id.dialog).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                CustomDialog mDialog = new CustomDialog(TestActivity.this);
//                mDialog.setIcon(-1);
//                mDialog.setBtn(-2);
//                mDialog.show();
                startActivity(new Intent(TestActivity.this, SocialSignUpCompleteActivity.class));

            }
        });
    }

    /**
     * 외부 Activity Intent를 생성하여 반환한다.<br/>
     * @param param
     * @return Intent
     * @since 1.0.0
     */
    public String getString(String param) {
        return null;
    }
}
