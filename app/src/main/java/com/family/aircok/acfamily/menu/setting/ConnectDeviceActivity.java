package com.family.aircok.acfamily.menu.setting;

import android.os.Bundle;

import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;


/**
 * Created by ssong on 2017. 4. 24..
 */

public class ConnectDeviceActivity extends BaseActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_connect_device);

        setNewHeader(R.drawable.btn_nav_back_n, -1, R.string.setting_menu0, false, -1);

        getSupportFragmentManager().beginTransaction().replace(R.id.layout_device_container, new SettingDeviceFragment()).commit();
    }

}
