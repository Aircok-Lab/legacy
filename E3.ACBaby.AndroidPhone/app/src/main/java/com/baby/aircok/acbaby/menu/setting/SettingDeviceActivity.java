package com.baby.aircok.acbaby.menu.setting;

import android.os.Bundle;
import android.view.View;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;

/**
 * Created by CHO on 2016. 11. 2..
 */

public class SettingDeviceActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_setting_device);
        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.menu_title3_1, -1);

        getSupportFragmentManager().beginTransaction().replace(R.id.layout_device_container, new SettingDeviceFragment()).commit();
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }
}
